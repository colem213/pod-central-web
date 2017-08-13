import AWS from 'aws-sdk'
import os, {EOL} from 'os'
import fs from 'fs'
import * as env from './env-vars'

AWS.config.region = 'us-east-2'

let cf = new AWS.CloudFormation()

let params = {
  StackName: os.hostname(),
  TemplateBody: fs.readFileSync('./app-infra.yaml', {encoding: 'utf-8'})
}

let createStack = new Promise((resolve, reject) => {
  console.log(`Starting to create stack: ${params.StackName}`)
  cf.createStack(params, function(err, {StackId}) {
    if (err) reject(err)
    else resolve(StackId)
  })
})

let completeStack = createStack.then(StackId => {
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
    }
    return `${key}=${out.OutputValue}`
  }).join(EOL)
  fs.writeFile('./.env', contents, () => {})
})
