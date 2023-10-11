const http = require('../../infra/http');
const config = require('../../config');

export class AnalyticsClient{
  token
  constructor(token){
    this.token = token;
  }
  analytics(type, data){
    const ret = this.post(`${config.AnalyticsServiceEndpoint}${config.ServiceName}/${type}`, data)
    return ret
  }

  async post(path, data) {
    const phrase =  buildSophtronAuthCode('get', path, config.SophtronClientId, config.SophtronClientSecret)
    const ret = await http.post(config.AnalyticsServiceEndpoint + path, data, {Authorization: phrase, IntegrationKey: this.token});
    return ret;
  }
}