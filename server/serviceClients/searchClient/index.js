const http = require('../http');
const config = require('../../config');
const {buildSophtronAuthCode} = require('../utils')

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

  async get(path, data) {
    const authHeader = buildSophtronAuthCode('get', path);
    const ret = await http.get(config.SophtronApiServiceEndpoint + path, data, {Authorization: authHeader});
    return ret;
  }
}