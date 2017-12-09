import AWS from 'aws-sdk'
import os from 'os'
import fs from 'fs'
import env from './env-vars'
import yaml from 'js-yaml'
import CFN_SCHEMA from 'js-yaml-schema-cfn'
import minimist from 'minimist'

AWS.config.region = 'us-east-2'

let args = minimist(process.argv.slice(2), {boolean: 'live'})

let cf = new AWS.CloudFormation()
let StackName = os.hostname()
if (args.env) {
  env(args['stack-name'], args.live)
} else if (args.down) {
  new Promise((resolve, reject) => {
    cf.deleteStack({StackName}, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  }).then(() => {
    cf.waitFor('stackDeleteComplete', function(err, data) {
      if (err) console.error(err)
      else console.log('Delete stack complete...')
    })
  })
} else {
  let tmpl = yaml.safeLoad(fs.readFileSync('./template.yml', {encoding: 'utf-8'}), {
    schema: CFN_SCHEMA
  })

  if (!args.live) {
    let tables = Object.keys(tmpl.Resources).map(key => {
      return { Name: key, ...tmpl.Resources[key] }
    }).filter(res => res.Type === 'AWS::DynamoDB::Table')

    let dynDb = new AWS.DynamoDB({endpoint: 'http://localhost:10500'})
    tables.forEach(tbl => {
      let params = {
        TableName: tbl.Name.replace('Table', ''),
        ...tbl.Properties
      }
      let createTable = () => { dynDb.createTable(params) }
      new Promise((resolve, reject) => {
        dynDb.describeTable(params, function(err, data) {
          if (err) reject(err)
          else resolve(data)
        })
      }).then(() => {
        new Promise((resolve, reject) => {
          dynDb.deleteTable(params, function(err, data) {
            if (err) reject(err)
            else resolve(data)
          })
        }).then(() => createTable())
      }).catch(() => createTable())
    })

    delete tmpl.Resources.RssFeedApiPolicy
    delete tmpl.Resources.RssFeedApi
    delete tmpl.Outputs.feedApiHost
  }

  let tmplStr = yaml.safeDump(tmpl, {
    schema: CFN_SCHEMA
  })

  let ChangeSetName = StackName
  let params = {
    StackName: ChangeSetName,
    ChangeSetName,
    Capabilities: ['CAPABILITY_IAM'],
    ChangeSetType: 'UPDATE',
    Parameters: [
      {
        ParameterKey: 'RssFeedStage',
        ParameterValue: ChangeSetName
      }
    ],
    TemplateBody: tmplStr
  }

  let findStack = new Promise((resolve, reject) => {
    cf.describeStacks({StackName}, function(err, data) {
      if (err) reject(err)
      else resolve()
    })
  }).catch(() => { params.ChangeSetType = 'CREATE' })

  let createChangeSet = findStack.then(() => {
    return new Promise((resolve, reject) => {
      console.log(`Starting to create change set: ${params.StackName}`)
      cf.createChangeSet(params, function(err, data) {
        if (err) reject(err)
        else resolve(data.StackId)
      })
    })
  })

  let createChangeSetComplete = createChangeSet.then(StackId => {
    console.log('Waiting for change set...')
    return new Promise((resolve, reject) => {
      cf.waitFor('changeSetCreateComplete', {StackName, ChangeSetName}, function(err, data) {
        if (err) reject(err)
        else resolve(StackId)
      })
    })
  })

  let executeChangeSet = createChangeSetComplete.then(StackId => {
    console.log('Executing change set...')
    return new Promise((resolve, reject) => {
      cf.executeChangeSet({StackName, ChangeSetName}, function(err, data) {
        if (err) reject(err)
        else resolve(StackId)
      })
    })
  })

  let completeStack = executeChangeSet.then(StackId => {
    console.log('Waiting for stack to complete...')
    return new Promise((resolve, reject) => {
      let complete = params.ChangeSetType === 'CREATE' ? 'stackCreateComplete' : 'stackUpdateComplete'
      cf.waitFor(complete, {StackName}, function(err, {Stacks}) {
        console.log('Stack is complete')
        if (err) reject(err)
        else resolve(StackId)
      })
    })
  })

  completeStack.then(() => {
    env(StackName, args.live)
  })
}
