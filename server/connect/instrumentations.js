const fs = require('fs')
const {ApiEndpoints} = require('../../shared/connect/ApiEndpoint.js')

module.exports = function(app){
  app.post('/feature_visits', async (req, res) => {
    res.sendStatus(200)
  })
  app.get(ApiEndpoints.AGREEMENT, async (req, res) => {
    res.send("")
  })
  app.get('/offers/*', async (req, res) => {
    res.send("")
  })
  app.get(ApiEndpoints.USER_FEATURES, async (req, res) => {
    res.send(require('./stubs/user_features.js'))
  })
  app.get(ApiEndpoints.TRANSACTION_RULES, async (req, res) => {
    res.send(require('./stubs/transaction_rules.js'))
  })
  app.get('/raja/data', async (req, res) => {
    res.send(require('./stubs/data_master.js'))
  })
  app.get('/raja/extend_session', async (req, res) => {
    res.sendStatus(200)
  })
}