import AWS from 'aws-sdk'

let config = {region: process.env.AWS_REGION, endpoint: process.env.DYNDB_URL}

if (process.env.NODE_ENV !== 'production') {
  config.accessKeyId = 'key'
  config.secretAccessKey = 'secret'
}

let dynDb = new AWS.DynamoDB.DocumentClient(config)

let db = {}

db.getAllFeeds = function() {
  return new Promise((resolve, reject) => {
    dynDb.scan({TableName: 'Channel'}, function(err, data) {
      if (err) reject(err)
      else resolve(data['Items'])
    })
  })
}

export default db
