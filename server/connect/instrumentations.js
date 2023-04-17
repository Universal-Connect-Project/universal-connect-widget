const fs = require('fs')
const {ApiEndpoints} = require('../../shared/connect/ApiEndpoint.js')

module.exports = function(app){
  app.post(ApiEndpoints.ANALYTICS_SESSION, async (req, res) => {
    res.sendFile(__dirname + '/stubs/analytics_sessions.json')
  })
  app.put('/analytics_sessions/*', async (req, res) => {
    res.sendStatus(200)
  })
  app.post('/analytics_events', async (req, res) => {
    res.sendStatus(200)
  })
  app.post('/analytics_pageviews', async (req, res) => {
    res.sendStatus(200)
  })
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
    res.sendFile(__dirname + '/stubs/user_features.json')
  })
  app.get(ApiEndpoints.TRANSACTION_RULES, async (req, res) => {
    res.sendFile(__dirname + '/stubs/transaction_rules.json')
  })
  app.get('/raja/data', async (req, res) => {
    res.sendFile(__dirname + '/stubs/data_master.json')
  })
  app.get('/raja/extend_session', async (req, res) => {
    res.sendStatus(200)
  })
}