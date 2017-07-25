import AWS from 'aws-sdk'
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js'

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

function getCurrentUser() {
  let cognitoUser = userPool.getCurrentUser()
  let findUser = new Promise((resolve, reject) => {
    if (cognitoUser) resolve(cognitoUser)
    else reject(new Error('User is not available'))
  })

  return findUser.then(cognitoUser => {
    return new Promise((resolve, reject) => {
      cognitoUser.getSession(function(err, session) {
        if (err) reject(err)
        else resolve(cognitoUser)
      })
    })
  })
}

function getUserAttributes(user) {
  let findUser = user ? Promise.resolve(user) : getCurrentUser()
  return findUser.then(cognitoUser => {
    return new Promise((resolve, reject) => {
      cognitoUser.getUserAttributes(function(err, attrs) {
        if (err) reject(err)
        else {
          resolve({
            cognitoUser,
            ...attrs.reduce((acc, attr) => {
              acc[attr.Name] = attr.Value
              return acc
            }, {})
          })
        }
      })
    })
  })
}

function getStateFromUser(user) {
  let findUserAttrs = getUserAttributes(user)
  return findUserAttrs.then(({cognitoUser, ...attrs}) => {
    return {
      user: {
        username: cognitoUser.getUsername(),
        email: attrs.email
      },
      isConfirmed: !!attrs.email_verified,
      isAuth: cognitoUser.getSignInUserSession() != null && cognitoUser.getSignInUserSession().isValid(),
      isAnon: false
    }
  }).catch(() => {
    return Promise.resolve({
      user: {
        username: null
      },
      isConfirmed: null,
      isAnon: true,
      isAuth: false
    })
  })
}

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
    let emailAttr = {
      Name: 'email',
      Value: user.email
    }
    let attrList = []
    attrList.push(new CognitoUserAttribute(emailAttr))
    userPool.signUp(user.username, user.password, attrList, null,
      function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve({
            user: {
              username: data.user.getUsername()
            },
            isConfirmed: data.userConfirmed,
            isAnon: false
          })
        }
      })
  })
}

api.signIn = function(user) {
  let authDetails = new AuthenticationDetails({ Password: user.password })
  let cognitoUser = new CognitoUser({
    Username: user.username,
    Pool: userPool
  })
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(session) {
        resolve(getStateFromUser())
      },
      onFailure: function(err) {
        let auth = { message: err.message }
        switch (err.code) {
          case 'UserNotConfirmedException':
            auth.state = { user: { username: user.username }, isConfirmed: false }
            break
        }
        reject(auth)
      }
    })
  })
}

api.confirmCode = function(form) {
  let cognitoUser = new CognitoUser({
    Username: form.username,
    Pool: userPool
  })
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(form.code,
      true, // @param {bool} forceAliasCreation Allow migrating from an existing email / phone number. https://github.com/aws/amazon-cognito-identity-js/blob/36ea6c46002fab2cb84fa3b5496d477699ac2ae9/src/CognitoUser.js#L457
      function(err) {
        if (err) reject(err)
        else resolve(true)
      }
    )
  })
}

api.resendConfirmCode = function(username) {
  let cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })
  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode(function(err, data) {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

api.getCurrentUser = function() {
  return getStateFromUser()
}

export default api
