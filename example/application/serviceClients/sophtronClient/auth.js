const config = require('../../config');
const http = require('../../infra/http')
const {buildSophtronAuthCode} = require('../../utils')

class AuthClient {
  secretExchange(payload){
    return this.post(`/v2/secretexchange`, {Payload: payload})
  }

  async post(path, data) {
    const phrase =  buildSophtronAuthCode('post', path, config.SophtronApiUserId, config.SophtronApiUserSecret)
    const ret = await http.post(config.SophtronAuthServiceEndpoint + path, data, {Authorization: phrase});
    return ret;
  }
};

module.exports = {
  AuthClient
}
