
const {VcsService} = require('./vcsService');
const {instrumentation} = require('../providers');
const { contextHandler } = require('../infra/context.ts');
const logger = require('../infra/logger');

module.exports = function(app){
  app.use(contextHandler);
  app.post('/api/context', async (req, res) => {
    // res.context = req.body;
    // res.context.job_type = res.context.job_type || 'agg';
    // if (res.context.connection_id) {
    //   const conn = await req.vcsService.getConnection(res.context.connection_id);
    //   if (conn) {
    //     res.context.institution_id = conn.institution_code;
    //   }
    // }
    await instrumentation(req.context, req.body)
    res.send(req.body);
    return {};
  }),
  app.use(async (req, res, next) => {
    if(req.path.startsWith('/api') && req.path !== '/api/context' )
    {
      req.vcsService = new VcsService(req);
      if(await req.vcsService.init()){
        if(!req.context.resolved_user_id){
          req.context.resolved_user_id = await req.vcsService.ResolveUserId(req.context.user_id);
        }
      }
    }
    next()
  });
  app.post('/api/search', async (req, res) => {
    const { query } = req.body;
    if (query && query.length >= 3) {
      const data = await req.vcsService.search(query);
      res.send({institutions: data });
    } else {
      res.send({institutions: [] });
    }
  });
  app.post('/api/selectInstitution', async (req, res) => {
    const data = await req.vcsService.selectInstitution(req.body);
    res.send(data);
  });
  app.post('/api/institutions', async (req, res) => {
    const data = await req.vcsService.institutions();
    res.send(data);
  });
  app.post('/api/login', async (req, res) => {
    const data = await req.vcsService.login(
      req.body.institution_id,
      req.body.connection_id,
      req.body.credentials
    );
    if (data) {
      // res.context.connection_id = data.cur_job_id;
      // res.context.institution_id =
      // res.context.institution_id || data.institution_id;
      res.send(data);
    } else {
      res.send({ error: 'Failed creating job' });
    }
  });
  app.post('/api/mfa', async (req, res) => {
    const data = await req.vcsService.mfa(req.body.job_id);
    res.send(data);
  });
  app.post('/api/answerChallenge', async (req, res) => {
    const data = await req.vcsService.answerChallenge(
      req.body.id,
      req.body.challenges
    );
    res.send(data || {});
  });
}