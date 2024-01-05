const config = require('../../config');
const http = require('../../infra/http')

class AuthClient {
  secretExchange(payload){
    return this.post(`/secretexchange`, {Payload: payload})
  }

  async post(path, data) {
    const phrase = 'basic ' + Buffer.from(`${config.UcpClientId}:${config.UcpClientSecret}`).toString('base64');
    const ret = await http.post(config.AuthServiceEndpoint + path, data, {Authorization: phrase});
    return ret;
  }
};

module.exports = {
  AuthClient
}
