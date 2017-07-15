var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DYNDB_URL: '"http://localhost:10500"',
  CHANNEL_TABLE: '"Channel"',
  AWS_REGION: '"us-east-2"',
})
