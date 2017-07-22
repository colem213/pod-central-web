var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  AWS_DYNDB_URL: '"http://localhost:10500"',
  AWS_DYNDB_CHANNEL_TABLE: '"Channel"',
  AWS_DYNDB_ITEM_TABLE: '"Item"',
  AWS_REGION: '"us-east-2"',
})
