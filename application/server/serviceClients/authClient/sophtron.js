const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http');
const {buildSophtronAuthCode, decrypt} = require('../../utils');

export class AuthClient {
  token;
  constructor(token){
    this.token = token;
  }

  async getSecretExchange(iv){
    const encrypted = await this.get(`/v2/secretexchange?key=${this.token}`);
    const arr = encrypted.split('#');
    const secret = arr.length === 2 ? arr[0] : config.SophtronClientSecret;

    const uuid = Buffer.from(secret, 'base64').toString('utf-8')
    const key = Buffer.from(uuid.replaceAll('-', '')).toString('hex');
    const configStr = decrypt(arr.length === 2 ? arr[1] : encrypted, key, iv);
    return JSON.parse(configStr);
  }

  async get(path) {
    const phrase =  buildSophtronAuthCode('get', path, config.SophtronClientId, config.SophtronClientSecret)
    const ret = await http.get(config.AuthServiceEndpoint + path, {Authorization: phrase, IntegrationKey: this.token});
    return ret;
  }

};

