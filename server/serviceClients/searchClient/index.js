const http = require('../http');
const config = require('../../config');

module.exports = class SophtronClient{

  async institutions(name){
    let url = `${config.SophtronSearchEndpoint}institutions?query=${encodeURIComponent(name || '')}&partner=${config.OrgName}`;
    return http.wget(url)
  }

  resolve(id){
    return http.wget(`${config.SophtronSearchEndpoint}institution/resolve?id=${id}&partner=${config.OrgName}`)
  }
}