
const {ConnectApi} = require('./connectApi');
const {instrumentation} = require('../providers');
const { contextHandler } = require('../infra/context.ts');
const {ApiEndpoints} = require('../../shared/connect/ApiEndpoint.js')
const stubs = require('./instrumentations.js');
const config = require('../config');
const logger = require('../infra/logger');

module.exports = function(app){
  stubs(app)
  app.use(contextHandler);
  app.use(async (req, res, next) => {
    if (req.path === '/' || req.path.startsWith('/example') || req.path.startsWith('/static')) return next();
    req.connectService = new ConnectApi(req);
    if(await req.connectService.init()){
      if(!req.context.resolved_user_id){
        req.context.resolved_user_id = await req.connectService.ResolveUserId(req.context.user_id);
      }
    }
    next()
  })

  app.post('/analytics*', async (req, res) => {
    if(config.AnalyticsServiceEndpoint){
      const ret = await req.connectService.analytics(req.path, req.body)
      res.send(ret)
    }else{
      res.send(require('./stubs/analytics_sessions.js'))
    }
  })

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
    if(await instrumentation(req.context, req.body.instrumentation)){
      res.sendStatus(200);
      return
    }
    res.sendStatus(400);
  })

  app.post('/members/:member_guid/unthrottled_aggregate', async (req, res) => {
    res.send({"member":{"job_guid":"JOB-179e7c31-53d6-4cfb-b95d-6b2686d1b817","status":8}}) // RECONNECTED?
    return;
    // let ret = await req.connectService.updateMember(req.body);
    // res.send(ret)
  })

  app.all('/webhook/:provider/*', async function (req, res) {
    // logger.info(`echo`, {
    //   method: req.method,
    //   headers: req.headers,
    //   path: req.path,
    //   queries: req.queries,
    //   body: req.body
    // })

    const { provider } = req.params
    req.connectService = new ConnectApi({context:{provider}})
    logger.info(`received web hook at: ${req.path}`, req.query)
    const ret = await req.connectService.handleOauthResponse(provider, req.params, req.query, req.body)
    res.send(ret);
  })

  // oauth/redirect_from?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request.&state=1526452cd3dbfa71e9b13bf12f95c40d
  app.get('/oauth/:provider/redirect_from/',  async (req, res) => {
    //For mx, successful oauth request will get the member updated hence will not need this to receive responses
    //however, when error happens and received by this, mx only returned memberId but not user_id hence errors can't be resonsiled to member through this for now

    //For banks and akoya, this endpoint is used to receive all oauth responses 
    // const { error, error_description, state } = req.query;
    const { member_guid, status,error_reason } = req.query;
    const { provider } = req.params
    req.connectService = new ConnectApi({context:{provider}})
    const ret = await req.connectService.handleOauthResponse(provider, req.params, req.query)
    const metadata = {member_guid, error_reason};
    const app_url = `mx://${encodeURIComponent('oauthComplete/success')}?metadata=${encodeURIComponent(metadata)}`
    // console.log(req.params);
    // console.log(req.query)
    //res.type('.html');
    res.redirect(app_url);
    return;
    
    const queries = {
      app_url,
      redirect: 'true',
      error_reason,
      member_guid
    };

    const oauthParams =  new RegExp(Object.keys(queries).map(r => `\\$${r}`).join('|'), 'g');
    function mapOauthParams(queries, res, html){
      res.send(html.replaceAll(oauthParams, q => encodeURIComponent(queries[q.substring(1)] || '')));
    }

    if(config.ResourcePrefix !== 'local'){
        const resourcePath = `${config.ResourcePrefix}${config.ResourceVersion}/oauth/success.html`;
        http.wget(resourcePath).then(html => mapOauthParams(queries, res, html))
    }else{
      const fs = require('fs');
      app.get('/', (req, res) => {
        fs.readFile(
          path.join(__dirname, '../', 'build', 'oauth/success.html'), 
          'utf8', 
          (err, html) => mapOauthParams(queries, res, html)
        );
      });
    }
  })
}