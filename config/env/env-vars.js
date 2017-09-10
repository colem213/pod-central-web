import os, {EOL} from 'os'
import fs from 'fs'
import AWS from 'aws-sdk'
import decamelize from 'decamelize'

export default function(StackName = os.hostname(), isLive) {
  let cf = new AWS.CloudFormation()

  let envVars = {
    AWS_FEED_API_HOST: 'localhost:9090',
    AWS_FEED_API_STAGE: os.hostname()
  }

  if (!isLive) {
    envVars['AWS_DYNDB_URL'] = 'http://localhost:10500'
  }

  cf.describeStacks({StackName}, function(err, data) {
    if (err) {
      console.error(err)
    } else {
      let outputs = data.Stacks[0].Outputs
      outputs.forEach(out => {
        envVars[`AWS_${decamelize(out.OutputKey).toUpperCase()}`] = out.OutputValue
      })

      fs.writeFileSync('./.env', Object.keys(envVars).map(key => `${key}=${envVars[key]}`).join(EOL))
    }
  })
}
