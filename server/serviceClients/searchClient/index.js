const http = require('../http');
const config = require('../../config');
const logger = require('../../infra/logger');

module.exports = class SophtronClient{

  institutions(name){
    return http.wget(`${config.SophtronSearchEndpoint}institutions?query=${encodeURIComponent(name || '')}&partner=${config.OrgName}`)
  }

  resolve(id){
    return http.wget(`${config.SophtronSearchEndpoint}institution/resolve?id=${id}&partner=${config.OrgName}`)
  }
}