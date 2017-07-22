import AWS from 'aws-sdk'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'

let channelTbl = process.env.AWS_DYNDB_CHANNEL_TABLE
let itemTbl = process.env.AWS_DYNDB_ITEM_TABLE
let config = { region: process.env.AWS_REGION, endpoint: process.env.AWS_DYNDB_URL }

if (process.env.NODE_ENV !== 'production') {
  config.accessKeyId = 'key'
  config.secretAccessKey = 'secret'
}

let dynDb = new AWS.DynamoDB.DocumentClient(config)

let userPool = new CognitoUserPool({
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.AWS_COGNITO_CLIENT_ID
})

let api = {}

api.getAllChannels = function() {
  return dynDb.scan({ TableName: channelTbl }).promise()
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
    ScanIndexForward: true,
    Limit: 10
  }).promise()
    .then(data => data.Items)
    .catch(err => console.error(err))
}

api.signUp = function(user) {
  return new Promise((resolve, reject) => {
    userPool.signUp(user.email, user.password, null, null,
      function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve({
            user: {
              username: data.user.getUsername()
            },
            mustConfirm: !data.userConfirmed,
            isAnonymous: false
          })
        }
      })
  })
}

api.signIn = function(user) {
  let authDetails = new AuthenticationDetails({ Password: user.password })
  let cognitoUser = new CognitoUser({
    Username: user.email,
    Pool: userPool
  })
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(session) {
        this.getCurrentUser().then(cognitoUser => {
          resolve({
            user: {
              username: cognitoUser.getUsername()
            },
            mustConfirm: false,
            isAnonymous: false,
            isAuthenticated: true
          })
        })
      },
      onFailure: function(err) {
        reject(err)
      }
    })
  })
}

api.confirmCode = function(code) {
  let cognitoUser = userPool.getCurrentUser()
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code,
      true, // @param {bool} forceAliasCreation Allow migrating from an existing email / phone number. https://github.com/aws/amazon-cognito-identity-js/blob/36ea6c46002fab2cb84fa3b5496d477699ac2ae9/src/CognitoUser.js#L457
      function(err) {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

api.getCurrentUser = function() {
  let cognitoUser = userPool.getCurrentUser()
  return new Promise((resolve, reject) => {
    if (cognitoUser !== null) {
      resolve({
        user: {
          username: cognitoUser.getUsername()
        }
      })
    }
  })
}

export default api
