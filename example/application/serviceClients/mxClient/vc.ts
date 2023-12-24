<<<<<<< HEAD

import { Configuration } from "./configuration";
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
=======
const config = require("../../config");
const logger = require("../../infra/logger");
const http = require("../../infra/http");
const MxBaseClient = require("./base.ts");
const MXClient = require("./index.js");

const CryptoJS = require("crypto-js");

module.exports = class MxVcClient extends MxBaseClient {
  constructor(apiConfig) {
    super(apiConfig);
  }

  async getVC(path) {
    // console.log("apiConfig", this.apiConfig);
    const encodedAuth = CryptoJS.enc.Utf8.parse(
      `${this.apiConfig.username}:${this.apiConfig.password}`,
    );
    const authHeader = "Basic " + CryptoJS.enc.Base64.stringify(encodedAuth);

    const headers = {
      Accept: "application/vnd.mx.api.v1beta+json",
      Authorization: authHeader,
    };
    const vcResponse = await http.get(
      `${this.apiConfig.vcEndpoint}vc/${path}`,
      headers,
    );
    return vcResponse?.verifiableCredential || vcResponse;
  }
};
>>>>>>> eb99e41059840fe6f1e14b674f768b06b9de95c9
