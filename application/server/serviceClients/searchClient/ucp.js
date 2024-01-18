const http = require('../../infra/http');
const config = require('../../config');

export class SearchClient{
  token;
  partnerName;
  
  constructor(token, partnerName){
    this.token = token;
    this.partnerName = partnerName;
  }

  async institutions(name, providers){
    providers = providers || []
    let url = `${config.SearchEndpoint}institutions?query=${encodeURIComponent(name || '')}&partner=${this.partnerName}&providers=${providers.join(';')}`;
    //return this.get(url)
    return http.get(url, {Auhorization: `token ${this.token}`})
  }

  resolve(id){
    //return this.get(`${config.SophtronSearchEndpoint}institution/resolve?id=${id}&partner=${config.OrgName}`)
    return http.get(`${config.SearchEndpoint}institution/resolve?id=${id}&partner=${this.partnerName}`, {Auhorization: `token ${this.token}`})
  }
}