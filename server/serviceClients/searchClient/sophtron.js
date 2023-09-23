const http = require('../../infra/http');
const config = require('../../config');

export class SearchClient{
  
  async institutions(name){
    let url = `${config.SearchEndpoint}institutions?query=${encodeURIComponent(name || '')}&partner=${config.OrgName}`;
    //return this.get(url)
    return http.wget(url)
  }

  resolve(id){
    //return this.get(`${config.SophtronSearchEndpoint}institution/resolve?id=${id}&partner=${config.OrgName}`)
    return http.wget(`${config.SearchEndpoint}institution/resolve?id=${id}&partner=${config.OrgName}`)
  }
}