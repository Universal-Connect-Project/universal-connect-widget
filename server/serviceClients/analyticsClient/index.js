const http = require('../../infra/http');
const config = require('../../config');
const { buildSophtronAuthCode } = require('../../utils')

module.exports = class AnalyticsClient{
  analytics(type, data){
    const ret = this.post(`${config.AnalyticsServiceEndpoint}${config.ServiceName}/${type}`, data)
    return ret
  }

  async post(path, data) {
    const authHeader = buildSophtronAuthCode('post', path, config.SophtronApiUserId, config.SophtronApiUserSecret);
    const ret = await http.post(config.AnalyticsServiceEndpoint + path, data, {Authorization: authHeader});
    return ret;
  }
}