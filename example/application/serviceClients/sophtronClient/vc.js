const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http');
const SophtronBaseClient = require('./base');
const {buildSophtronAuthCode} = require('../../utils')
const ProviderCredentials = require('../../configuration.js')
const SophtronClient = require('./index.js');

const sophtronClient = new SophtronClient(ProviderCredentials.sophtron);

module.exports = class SophtronVcClient extends SophtronBaseClient{
  constructor(apiConfig){
    super(apiConfig);
  }

  async getVC(path) {
    const res = await sophtronClient.getUserIntegrationKey();
    const headers = { 
      IntegrationKey: res.IntegrationKey,
      Authorization: buildSophtronAuthCode('get', path, this.apiConfig.clientId, this.apiConfig.secret)
    };
    const ret = await http.get(`${this.apiConfig.vcEndpoint}vc/${path}`, headers)
    return ret;
  }
};
