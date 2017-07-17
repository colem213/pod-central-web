import AWS from 'aws-sdk'

let channelTbl = process.env.CHANNEL_TABLE
let itemTbl = process.env.ITEM_TABLE
let config = {region: process.env.AWS_REGION, endpoint: process.env.DYNDB_URL}

if (process.env.NODE_ENV !== 'production') {
  config.accessKeyId = 'key'
  config.secretAccessKey = 'secret'
}

let dynDb = new AWS.DynamoDB.DocumentClient(config)

let api = {}

api.getAllChannels = function() {
  return dynDb.scan({TableName: channelTbl}).promise()
    .then(data => data.Items)
    .catch(err => console.error(err))
}

api.getItemsByChannel = function(id) {
  return dynDb.query({
    TableName: itemTbl,
    IndexName: 'itemsByChannel',
    KeyConditionExpression: '#chId = :id',
    ExpressionAttributeNames: {
      '#chId': 'channelId'
    },
    ExpressionAttributeValues: {
      ':id': id
    },
    Select: 'ALL_ATTRIBUTES',
    Limit: 10
  }).promise()
    .then(data => data.Items)
    .catch(err => console.error(err))
}

export default api
