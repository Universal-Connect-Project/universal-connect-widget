const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http')
const {buildSophtronAuthCode} = require('../../utils')

module.exports = class SophtronBaseClient{
  apiConfig;
  constructor(apiConfig){
    this.apiConfig = apiConfig;
  }

  getAuthHeaders(method, path){
    // if(this.apiConfig.integrationKey){
    //   if(!forcePhrase){
    //     return {IntegrationKey: this.apiConfig.integrationKey}
    //   }
    //   return {
    //     Authorization: buildSophtronAuthCode(method, path, config.SophtronApiUserId, config.SophtronApiUserSecret)
    //   };
    // }
    return {
      Authorization: buildSophtronAuthCode(method, path, this.apiConfig.clientId, this.apiConfig.secret)
    }; 
  }

  async post(path, data) {
    const authHeader = this.getAuthHeaders('post', path);
    const ret = await http.post(this.apiConfig.endpoint + path, data, authHeader);
    return ret;
  }
  async get(path) {
    const authHeader = this.getAuthHeaders('get', path);
    const ret = await http.get(this.apiConfig.endpoint + path, authHeader);
    return ret;
  }
  async put(path, data) {
    const authHeader = this.getAuthHeaders('put', path);
    const ret = await http.put(this.apiConfig.endpoint + path, data, authHeader);
    return ret;
  }
  async del(path) {
    const authHeader = this.getAuthHeaders('delete', path);
    const ret = await http.del(this.apiConfig.endpoint + path, authHeader);
    return ret;
  }
};
