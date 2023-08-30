const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http')
const { buildSophtronAuthCode } = require('../../utils')

module.exports = class AuthClient{
  constructor(){
  }

  getSecretExchange(key){
    return this.get(`/v2/secretexchange?key=${key}`)
  }

  secretExchange(payload){
    return this.post(`/v2/secretexchange`, {Payload: payload})
  }

  async post(path, data) {
    const authHeader = buildSophtronAuthCode('post', path, config.SophtronApiUserId, config.SophtronApiUserSecret);
    const ret = await http.post(config.SophtronAuthServiceEndpoint + path, data, {Authorization: authHeader});
    return ret;
  }
  
  async get(path) {
    const authHeader = buildSophtronAuthCode('get', path, config.SophtronApiUserId, config.SophtronApiUserSecret);
    const ret = await http.get(config.SophtronAuthServiceEndpoint + path, {Authorization: authHeader});
    return ret;
  }
};
