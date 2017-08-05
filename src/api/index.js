import AWS from 'aws-sdk'
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js'
import jwtDecode from 'jwt-decode'

let channelTbl = process.env.AWS_DYNDB_CHANNEL_TABLE
let itemTbl = process.env.AWS_DYNDB_ITEM_TABLE
let subTbl = process.env.AWS_DYNDB_SUBSCRIPTION_TABLE
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

let findSession = function() {
  let cognitoUser = userPool.getCurrentUser()
  return cognitoUser === null ? Promise.reject()
    : new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) reject(err)
        else resolve(session)
      })
    })
}

let findUser = function() {
  return findSession().then(session => {
    return {...jwtDecode(session.getIdToken().getJwtToken())}
  })
}

let api = {}

api.getAllChannels = function() {
  return findUser().then(user => {
    return dynDb.query({
      TableName: subTbl,
      KeyConditionExpression: '#userId = :id',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':id': user.sub
      }
    }).promise()
  }).then(({ Items }) => {
    if (Items.length === 0) return Items
    let params = {
      RequestItems: {
        [channelTbl]: {
          Keys: Items.map(sub => { return { id: sub.channelId } })
        }
      }
    }
    return dynDb.batchGet(params).promise()
  }).then(data => data.Responses[channelTbl])
}

api.getItemsByChannel = function(id) {
  return dynDb.query({
    TableName: itemTbl,
    IndexName: 'ChannelIndex',
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
    let {password, ...attrs} = user
    let attrList = Object.keys(attrs)
          .map(key => { return {Name: key, Value: attrs[key]} })
          .map(attr => new CognitoUserAttribute(attr))
    userPool.signUp(user.email.replace('@', '_'), password, attrList, null,
      function(err, data) {
        if (err) {
          switch (err.code) {
            case 'UsernameExistsException':
              err.message = `${err.message}. Try signing in to confirm your email.`
              break
          }
          reject(err)
        } else {
          resolve({
            user: {
              username: data.user.getUsername(),
              email_verified: data.userConfirmed
            },
            isAnon: false
          })
        }
      })
  })
}

api.signIn = function({username, password}) {
  let authDetails = new AuthenticationDetails({ Password: password })
  let cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(session) {
        resolve({
          isAnon: false,
          isAuth: session.isValid(),
          user: {
            ...jwtDecode(session.getIdToken().getJwtToken())
          }
        })
      },
      onFailure: function({code, message}) {
        let auth = { message }
        switch (code) {
          case 'UserNotConfirmedException':
            auth.state = { user: { username, email_verified: false } }
            break
        }
        reject(auth)
      }
    })
  })
}

api.signOut = function() {
  try {
    userPool.getCurrentUser().signOut()
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}

api.confirmCode = function(form) {
  if (!form.username) return Promise.reject(new Error('Must sign up first'))
  let cognitoUser = new CognitoUser({
    Username: form.username,
    Pool: userPool
  })
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(form.code,
      true, // @param {bool} forceAliasCreation Allow migrating from an existing email / phone number. https://github.com/aws/amazon-cognito-identity-js/blob/36ea6c46002fab2cb84fa3b5496d477699ac2ae9/src/CognitoUser.js#L457
      function(err) {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

api.resendConfirmCode = function(username) {
  if (!username) return Promise.reject(new Error('Must sign up first'))
  let cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })
  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode(function(err, data) {
      if (err) reject(err)
      else resolve()
    })
  })
}

api.getCurrentUser = function() {
  return findSession().then(session => {
    return {
      isAnon: false,
      isAuth: session.isValid(),
      user: {
        ...jwtDecode(session.getIdToken().getJwtToken())
      }
    }
  }).catch(() => {
    return {}
  })
}

export default api
