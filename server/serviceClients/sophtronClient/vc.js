const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http');
const SophtronBaseClient = require('./base');

module.exports = class SophtronVcClient extends SophtronBaseClient{
  constructor(apiConfig){
    super(apiConfig);
  }

  async getVc(path, userId) {
    
      const headers = { IntegrationKey: this.apiConfig.token };
      if (userId) {
        headers.DidAuth = userId;
      }
      const ret = await http.get(`${this.apiConfig.vcEndpoint}vc/${path}`, headers)
      return ret;
  }

};
