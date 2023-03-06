const service = require('./serviceClients/services.ts');
module.exports = {
  async context(req, res) {
    res.context = req.body;
    res.context.job_type = res.context.job_type || 'agg';
    if (res.context.connection_id) {
      const conn = await service.getConnection(res.context.connection_id);
      if (conn) {
        res.context.institution_id = conn.institution_code;
      }
    }
    res.send(req.body);
    return {};
  },
  async search(req, res) {
    const { query } = req.body;
    if (query && query.length >= 3) {
      const data = await service.search(query, req.context);
      res.send(data);
    } else {
      res.send([]);
    }
  },
  async selectInstitution(req, res) {
    const data = await service.selectInstitution(req.body, req.context);
    res.send(data);
  },
  async institutions(req, res) {
    const data = await service.institutions(req.context);
    res.send(data);
  },
  async login(req, res) {
    const data = await service.login(
      req.body.institution_id,
      req.body.connection_id,
      req.body.credentials,
      req.context
    );
    if (data) {
      res.context.connection_id = data.cur_job_id;
      res.context.institution_id =
        res.context.institution_id || data.institution_id;
      res.send(data);
    } else {
      res.send({ error: 'Failed creating job' });
    }
  },
  async mfa(req, res) {
    const data = await service.mfa(req.body.job_id, req.context);
    res.send(data);
  },
  async answerChallenge(req, res) {
    const data = await service.answerChallenge(
      req.body.challenges,
      req.context
    );
    res.send(data || {});
  },
};
