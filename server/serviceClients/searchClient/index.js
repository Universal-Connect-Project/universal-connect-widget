const http = require('../http');
const config = require('../../config');

module.exports = class SophtronClient{
  async institutions(name){
    let url = `${config.SophtronSearchEndpoint}institutions?query=${encodeURIComponent(name || '')}&partner=${config.OrgName}`;
    //return this.get(url)
    return http.wget(url)
  }

  resolve(id){
    //return this.get(`${config.SophtronSearchEndpoint}institution/resolve?id=${id}&partner=${config.OrgName}`)
    return http.wget(`${config.SophtronSearchEndpoint}institution/resolve?id=${id}&partner=${config.OrgName}`)
  }
}