
const {ConnectApi} = require('./connectApi')
const fs = require('fs')
const { contextHandler } = require('../infra/context.ts');
const {ApiEndpoints} = require('../../shared/connect/ApiEndpoint.js')
const instrumentation = require('./instrumentations.js');
const { get } = require('../serviceClients/http/mock');

module.exports = function(app){
  instrumentation(app)
  app.use(contextHandler);
  app.use((req, res, next) => {
    req.connectService = new ConnectApi(req)
    next()
  })
  // stubs(app)

  app.post(ApiEndpoints.MEMBERS, async (req, res) => {
    // res.send(require('./stubs/member.js'))
    // return;
    let ret = await req.connectService.addMember(req.body);
    res.send(ret)
  })
  app.put(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    // res.send(require('./stubs/member.js'))
    // return;
    let ret = await req.connectService.updateMember(req.body);
    res.send(ret)
  })
  app.get(`${ApiEndpoints.MEMBERS}/:member_guid/`, async (req, res) => {
    // res.send(require('./stubs/member.js'))
    // return;
    let ret = await req.connectService.loadMemberByGuid(req.params.member_guid);
    res.send(ret);
    // res.sendFile(__dirname + '/stubs/member.json')
  })
  app.get(`${ApiEndpoints.MEMBERS}/:member_guid/credentials`, async (req, res) => {
    // res.send(require('./stubs/member_credentials.js'))
    // return;
    let ret = await req.connectService.getMemberCredentials(req.params.member_guid)
    res.send(ret)
  })
  app.get(`${ApiEndpoints.MEMBERS}/:member_guid/oauth_window_uri`, async (req, res) => {
    let ret = await req.connectService.getOauthWindowUri(req.params.member_guid);
    res.send(ret);
    // res.sendFile(__dirname + '/stubs/member.json')
  })
  app.delete(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    res.sendFile(__dirname + '/stubs/member.json')
    // let ret = await req.connectService.deleteMember(req.params.member_guid)
    // res.send(ret)
  })
  app.get(`${ApiEndpoints.INSTITUTIONS}/:institution_guid/credentials`, async (req, res) => {
    let credentials = await req.connectService.getInstitutionCredentials(req.params.institution_guid);
    res.send(credentials)
  })
  app.get(`${ApiEndpoints.INSTITUTIONS}/favorite`, async (req, res) => {
    let ret = await req.connectService.loadPopularInstitutions();
    res.send(ret);
    // res.send([{
    //     name: 'MX Bank',
    //     guid: 'mxbank',
    //     url: 'https://www.mx.com',
    //     logo_url: 'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-1572a04c-912b-59bf-5841-332c7dfafaef_100x100.png'
    //   },
    //   {
    //     supports_oauth: true,
    //     name: 'MX Bank (OAuth)',
    //     guid: 'mx_bank_oauth',
    //     url: 'www.mx.com',
    //     logo_url: 'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-1572a04c-912b-59bf-5841-332c7dfafaef_100x100.png'
    //   }
    // ])
  })
  app.get(`${ApiEndpoints.INSTITUTIONS}/discovered`, async (req, res) => {
    let ret = await req.connectService.loadDiscoveredInstitutions();
    res.send(ret)
  })
  app.get(`${ApiEndpoints.INSTITUTIONS}/:institution_guid`, async (req, res) => {
    let ret = await req.connectService.loadInstitutionByGuid(req.params.institution_guid)
    res.send(ret)
  })
  app.get(ApiEndpoints.INSTITUTIONS, async (req, res) => {
    let ret = await req.connectService.loadInstitutions(req.query.search_name);
    res.send(ret);
  })
  app.get('/jobs/:guid', async (req, res) => {
    // this doesn't seem to affect anything as long as there is a response
    res.send({
      job: {
        guid: req.params.guid,
        job_type: 0, // must
      }
    })
  })
  app.get('/oauth_states', async (req, res) => {
    let ret = await req.connectService.getOauthStates(req.query.outbound_member_guid)
    res.send(ret)
  })
  app.get('/oauth_states/:guid', async (req, res) => {
    let ret = await req.connectService.getOauthState(req.params.guid)
    res.send(ret)
  })
  app.get(ApiEndpoints.MEMBERS, async (req, res) => {
    let ret = await req.connectService.loadMembers()
    res.send({
      members: ret
    })
  })

  app.post(ApiEndpoints.INSTRUMENTATION, async (req, res) => {
    if(await req.connectService.instrumentation(req.body)){
      res.sendStatus(200);
      return
    }
    res.sendStatus(400);
  })
  // oauth/redirect_from?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request.&state=1526452cd3dbfa71e9b13bf12f95c40d
  app.get('/oauth/:provider/redirect_from',  async (req, res) => {
    // const { error, error_description, state } = req.query;
    const { member_guid, status,error_reason } = req.query;
    const { provider } = req.params
    // console.log(req.params);
    // console.log(req.query)
    res.sendStatus(200);
  })
  app.post('/members/:member_guid/unthrottled_aggregate', async (req, res) => {
    res.send({"member":{"job_guid":"JOB-179e7c31-53d6-4cfb-b95d-6b2686d1b817","status":8}}) // RECONNECTED?
    return;
    // let ret = await req.connectService.updateMember(req.body);
    // res.send(ret)
  })
}