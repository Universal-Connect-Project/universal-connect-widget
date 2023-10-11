const fs = require('fs')
const {ApiEndpoints} = require('../../shared/connect/ApiEndpoint.js')

module.exports = function(app){
  app.get('/jobs/:guid', async (req, res) => {
    res.sendFile(__dirname + '/stubs/job.json')
  })
  app.post(ApiEndpoints.MEMBERS, async (req, res) => {
    res.sendFile(__dirname + '/stubs/member.json')
  })
  app.put(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    res.sendFile(__dirname + '/stubs/member.json')
  })
  app.get(ApiEndpoints.MEMBERS, async (req, res) => {
    res.sendFile(__dirname + '/stubs/members.json')
  })
  app.get(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    res.sendFile(__dirname + '/stubs/member.json')
  })
  app.delete(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    res.sendFile(__dirname + '/stubs/member.json')
  })
  app.get(`${ApiEndpoints.MEMBERS}/:member_guid/credentials`, async (req, res) => {
    let ret = await connectService.getMemberCredentials(req.params.member_guid)
    res.send(ret)
  })
  app.get(`${ApiEndpoints.INSTITUTIONS}/:institution_guid/credentials`, async (req, res) => {
    res.sendFile(__dirname + '/stubs/credentials.json')
  })
  // app.get(ApiEndpoints.INSTITUTIONS, async (req, res) => {
  //   res.sendFile(__dirname + '/stubs/institutions.json')
  // })
  // app.get(`${ApiEndpoints.INSTITUTIONS}/favorite`, async (req, res) => {
  //   res.sendFile(__dirname + '/stubs/favorite.json')
  // })
  // app.get(`${ApiEndpoints.INSTITUTIONS}/discovered`, async (req, res) => {
  //   res.sendFile(__dirname + '/stubs/discovered.json')
  // })
  // app.get(`${ApiEndpoints.INSTITUTIONS}/:institution_guid`, async (req, res) => {
  //   res.sendFile(__dirname + '/stubs/institution.json')
  // })
}