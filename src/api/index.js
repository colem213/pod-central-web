import AWS from 'aws-sdk'
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import aws4 from 'aws4'

let awsRegion = process.env.AWS_REGION

AWS.config.region = awsRegion

let userPoolId = process.env.AWS_COGNITO_USER_POOL_ID
let awsDynDbEndpoint = `https://dynamodb.${awsRegion}.amazonaws.com`
let channelTbl = process.env.AWS_DYNDB_CHANNEL_TABLE
let itemTbl = process.env.AWS_DYNDB_ITEM_TABLE
let subTbl = process.env.AWS_DYNDB_SUBSCRIPTION_TABLE
let apiHost = process.env.AWS_API_HOST
let apiStage = process.env.AWS_API_STAGE || ''
let apiScheme = process.env.NODE_ENV === 'production' || apiHost.indexOf('localhost') === -1
  ? 'https' : 'http'

let endpoint = process.env.NODE_ENV === 'production'
  ? awsDynDbEndpoint : process.env.AWS_DYNDB_URL || awsDynDbEndpoint
let identityPoolId = process.env.AWS_COGNITO_IDENTITY_POOL_ID

let dynDb

let userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: process.env.AWS_COGNITO_CLIENT_ID
})

let findCredentials = function() {
  return findSession().then(session => {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: {
        [`cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`]: session.getIdToken().getJwtToken()
      }
    })
    dynDb = new AWS.DynamoDB.DocumentClient({endpoint})
    return AWS.config.credentials.getPromise().then(() => AWS.config.credentials)
  })
}

let findSession = function() {
  let cognitoUser = userPool.getCurrentUser()
  return cognitoUser === null ? Promise.reject()
    : new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) reject(err)
        else {
          resolve(session)
        }
      })
    })
}

let api = {}

api.getAllChannels = function() {
  return findCredentials().then(({identityId}) => {
    return dynDb.query({
      TableName: subTbl,
      KeyConditionExpression: '#userId = :id',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':id': identityId
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
      .then(data => data.Responses[channelTbl])
  })
}

api.getChannel = function(channelId) {
  return findCredentials().then(() => {
    return dynDb.get({
      TableName: channelTbl,
      Key: {
        id: channelId
      }
    }).promise()
  }).then(({Item}) => Item)
}

api.getItemsByChannel = function({channelId, sortAsc, lastKey}) {
  return findCredentials().then(() => {
    let params = {
      TableName: itemTbl,
      IndexName: 'ChannelIndex',
      KeyConditionExpression: '#chId = :id',
      ExpressionAttributeNames: {
        '#chId': 'channelId'
      },
      ExpressionAttributeValues: {
        ':id': channelId
      },
      Select: 'ALL_ATTRIBUTES',
      ScanIndexForward: sortAsc,
      Limit: 10
    }
    if (lastKey) {
      params.ExclusiveStartKey = lastKey
    }
    return dynDb.query(params).promise()
      .then(data => {
        let results = {
          channelId,
          items: data.Items
        }
        if (data.LastEvaluatedKey) {
          results.lastKey = data.LastEvaluatedKey
        }
        return results
      })
  })
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
            auth.state = { isAnon: false, user: { username, email_verified: false } }
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

api.subscribe = function(feedUrl) {
  return findCredentials().then(({accessKeyId, secretAccessKey, sessionToken}) => {
    let body = {feedUrl}
    let opts = {
      service: 'execute-api',
      host: apiHost,
      url: `${apiScheme}://${apiHost}/${apiStage}/rss/subscribe`,
      path: `/${apiStage}/rss/subscribe`,
      data: JSON.stringify(body),
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json'
      }
    }
    let signedRequest = aws4.sign(opts, {
      secretAccessKey,
      accessKeyId,
      sessionToken
    })
    delete signedRequest.headers['Host']
    delete signedRequest.headers['Content-Length']

    return axios(signedRequest).then(({data}) => data)
  })
}

export default api
