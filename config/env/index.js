import AWS from 'aws-sdk'
import os, {EOL} from 'os'
import fs from 'fs'
import * as env from './env-vars'
import yaml from 'js-yaml'
import CFN_SCHEMA from 'js-yaml-schema-cfn'

AWS.config.region = 'us-east-2'

fs.appendFile('./.env', `AWS_API_HOST=http://localhost:9090${EOL}`, () => {})
fs.appendFile('./.env', `AWS_API_STAGE=local${EOL}`, () => {})

let tmpl = yaml.safeLoad(fs.readFileSync('./template.yml', {encoding: 'utf-8'}), {
  schema: CFN_SCHEMA
})

let tables = Object.keys(tmpl.Resources).map(key => {
  return { Name: key, ...tmpl.Resources[key] }
}).filter(res => res.Type === 'AWS::DynamoDB::Table')

let dynDb = new AWS.DynamoDB({endpoint: 'http://localhost:10500'})
tables.forEach(tbl => {
  let params = {
    TableName: tbl.Name.replace('Table', ''),
    ...tbl.Properties
  }
  dynDb.createTable(params, function(err, data) {
    if (err) console.error(err, err.stack)
    else {
      fs.appendFile('./.env', `AWS_DYNDB_${params.TableName.toUpperCase()}_TABLE=${params.TableName}${EOL}`, () => {})
    }
  })
})

function traverse(obj) {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (obj[key].hasOwnProperty('Condition')) {
        delete obj[key]
      } else {
        traverse(obj[key])
      }
    })
  }
}
traverse(tmpl)

let tmplStr = yaml.safeDump(tmpl, {
  schema: CFN_SCHEMA
})

let cf = new AWS.CloudFormation()

let ChangeSetName = os.hostname()
let params = {
  StackName: os.hostname(),
  ChangeSetName,
  Capabilities: ['CAPABILITY_IAM'],
  ChangeSetType: 'CREATE',
  Parameters: [
    {
      ParameterKey: 'DomainName',
      ParameterValue: 'local.podcentral.io'
    },
    {
      ParameterKey: 'RssFeedStage',
      ParameterValue: 'local'
    }
  ],
  TemplateBody: tmplStr
}

let createChangeSet = new Promise((resolve, reject) => {
  console.log(`Starting to create change set: ${params.StackName}`)
  cf.createChangeSet(params, function(err, {StackId}) {
    if (err) reject(err)
    else resolve(StackId)
  })
})

let createChangeSetComplete = createChangeSet.then((StackId) => {
  console.log('Waiting for change set...')
  return new Promise((resolve, reject) => {
    cf.waitFor('changeSetCreateComplete', {StackName: StackId, ChangeSetName}, function(err, data) {
      if (err) reject(err)
      else resolve(StackId)
    })
  })
})

let executeChangeSet = createChangeSetComplete.then(StackId => {
  console.log('Executing change set...')
  return new Promise((resolve, reject) => {
    cf.executeChangeSet({StackName: StackId, ChangeSetName}, function(err, data) {
      if (err) reject(err)
      else resolve(StackId)
    })
  })
})

let completeStack = executeChangeSet.then(StackId => {
  console.log('Waiting for stack to complete...')
  return new Promise((resolve, reject) => {
    cf.waitFor('stackCreateComplete', {StackName: StackId}, function(err, {Stacks}) {
      console.log('Stack is complete')
      if (err) reject(err)
      else resolve(Stacks.find(stack => stack.StackId === StackId).Outputs)
    })
  })
})

completeStack.then(output => {
  let contents = output.map(out => {
    let key
    switch (out.OutputKey) {
      case 'userPoolId':
        key = env.AWS_COGNITO_USER_POOL_ID
        break
      case 'clientId':
        key = env.AWS_COGNITO_CLIENT_ID
        break
      case 'identityPoolId':
        key = env.AWS_COGNITO_IDENTITY_POOL_ID
        break
    }
    return `${key}=${out.OutputValue}`
  }).join(EOL)
  fs.appendFile('./.env', `${contents + EOL}`, () => {})
})
