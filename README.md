# Pod Central Web

> A Vue.js project

## Environment Variables

NODE_ENV=development
AWS_DYNDB_URL=http://localhost:10500
AWS_DYNDB_CHANNEL_TABLE=Channel
AWS_DYNDB_ITEM_TABLE=Item
AWS_REGION=us-east-2
AWS_COGNITO_USER_POOL_ID
AWS_COGNITO_CLIENT_ID

## Build Setup

``` bash
# install dependencies
yarn install

# Create AWS resources and generate .env file
yarn run dev:up

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report

# run unit tests
yarn run unit

# run e2e tests
yarn run e2e

# run all tests
yarn test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
