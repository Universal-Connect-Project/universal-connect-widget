const http = require('../../infra/http');
const config = require('../../config');
const {buildSophtronAuthCode} = require('../../utils')

export class StorageClient {
  token;
  constructor(token){
    this.token = token;
  }

  async set(key, data) {
    const path = `${config.StorageEndpoint}cache/${key}`;
    const authHeader = buildSophtronAuthCode('post', path, config.SophtronClientId, config.SophtronClientSecret);
    const ret = await http.post(path, data, {Authorization: authHeader, IntegrationKey: this.token});
    return ret;
  }

  async get(key) {
    const path = `${config.StorageEndpoint}cache/${key}`;
    const authHeader = buildSophtronAuthCode('get', path, config.SophtronClientId, config.SophtronClientSecret);
    const ret = await http.get(path, {Authorization: authHeader, IntegrationKey: this.token});
    return ret;
  }
}