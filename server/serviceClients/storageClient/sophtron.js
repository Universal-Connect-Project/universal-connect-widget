const http = require('../../infra/http');
const config = require('../../config');
const {buildSophtronAuthCode} = require('../../utils')

module.exports = {
  async set(key, data) {
    const path = `${config.SearchEndpoint}cache/${key}`;
    const authHeader = buildSophtronAuthCode('post', path, config.SophtronApiUserId, config.SophtronApiUserSecret);
    const ret = await http.post(path, data, {Authorization: authHeader, ContextUserId: 'test'});
    return ret;
  },

  async get(key) {
    const path = `${config.SearchEndpoint}cache/${key}`;
    const authHeader = buildSophtronAuthCode('get', path, config.SophtronApiUserId, config.SophtronApiUserSecret);
    const ret = await http.get(path, {Authorization: authHeader, ContextUserId: 'test'});
    return ret;
  }
}