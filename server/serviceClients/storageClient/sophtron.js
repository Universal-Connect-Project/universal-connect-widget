const http = require('../http');
const config = require('../../config');
const {buildSophtronAuthCode} = require('../utils')

module.exports = {
  async set(key, data) {
    const path = `${config.SophtronSearchEndpoint}cache/${key}`;
    const authHeader = buildSophtronAuthCode('post', path);
    const ret = await http.post(path, data, {Authorization: authHeader, ContextUserId: 'test'});
    return ret;
  },

  async get(key) {
    const path = `${config.SophtronSearchEndpoint}cache/${key}`;
    const authHeader = buildSophtronAuthCode('get', path);
    const ret = await http.get(path, {Authorization: authHeader, ContextUserId: 'test'});
    return ret;
  }
}