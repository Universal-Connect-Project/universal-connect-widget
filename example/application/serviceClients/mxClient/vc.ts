
import { Configuration } from "./configuration.ts";
import axios from 'axios';
const logger = require('../../infra/logger');

function request(url:string, method: 'get'|'post'|'put'|'delete', data:any, clientId:string, secret:string){
  const authHeader = 'Basic ' + Buffer.from(clientId + ':' + secret).toString('base64');

  return axios({
    method,
    url,
    data,
    headers: {
      Accept: 'application/vnd.mx.api.v1beta+json',
      'content-type': 'application/json',
      Authorization: authHeader
    }
  }).catch(err => {
    logger.error(`mx vc client http response status ${err.response?.status} from ${url}`, err.response?.data||err);
    return err.response?.data
  })
  .then(res => {
    logger.debug(`mx vc client http response status ${res.status} from ${url}`)
    return res.data?.verifiableCredential || res.data || ''
  })
}

export class MxVcClient {
  configuration: Configuration;
  constructor(conf: Configuration){
    this.configuration = conf;
  }

  getVC(path: string){
    return this._get(`vc/${path}`).then(res => res)
  }
  // getUsers(){
  //   return this.get(`users/`).then(res => res)
  // }
  _get(url: string){
    return request(`${this.configuration.basePath}/${url}`, 'get', null, this.configuration.username!, this.configuration.password!);
  }
}
