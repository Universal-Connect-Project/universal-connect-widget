const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http');
const version = 'v2';
const CryptoJS = require("crypto-js");

function makeAkoyaAuthHeaders(apiConfig){
  let words = CryptoJS.enc.Utf8.parse(`${apiConfig.clientId}:${apiConfig.secret}`);
  return {
    Authorization: `Basic ${ CryptoJS.enc.Base64.stringify(words)}`,
    'content-type': 'application/x-www-form-urlencoded', 
    accept: 'application/json'
  }
}

function makeAkoyaBearerHeaders(token){
  return {
    Authorization: `Bearer ${token}`,
    accept: 'application/json'
  }
}

export default class AkoyaClient{
  constructor(apiConfig){
    this.apiConfig = apiConfig
    this.client_redirect_url = `${config.HostUrl}/oauth/${this.apiConfig.provider}/redirect_from`;
    this.authParams = {
      client_id: apiConfig.clientId,
      client_secret: apiConfig.secret
    }
  }
  getOauthUrl(institution_id, client_redirect_url, state){
    return `https://${this.apiConfig.basePath}/auth?connector=${institution_id}&client_id=${this.apiConfig.clientId}&redirect_uri=${client_redirect_url}&state=${state}&response_type=code&scope=openid email profile offline_access`
  }

  getIdToken(authCode){
    let body = {grant_type: 'authorization_code', code: authCode, redirect_uri: this.client_redirect_url};
    // let body = `grant_type=authorization_code&code=${authCode}`; //&redirect_uri=${this.client_redirect_url}
    return this.post('token', body)
  }
  refreshToken(existingRefreshToken){
    return this.post('token', {grant_type: 'refresh_token', refresh_token: existingRefreshToken, client_id: this.apiConfig.clientId, client_secret: this.apiConfig.secret})
  }

  getAccountInfo(institution_id, accountIds, token){
    return this.get(`accounts-info/${version}/${institution_id}`, token)
      .then(res => res.accounts)
  }
  getBalances(institution_id, token){
    return this.get(`balances/${version}/${institution_id}`, token)
  }
  getInvestments(institution_id, token){
    return this.get(`accounts/${version}/${institution_id}`, token)
  }
  getPayments(institution_id, accountId, token){
    return this.get(`payments/${version}/${institution_id}/${accountId}/payment-networks`, token)
  }
  getTransactions(institution_id, accountId, token){
    return this.get(`transactions/${version}/${institution_id}/${accountId}?offset=0&limit=50`, token)
  }
  getCustomerInfo(institution_id, token){
    return this.get(`customers/${version}/${institution_id}/current`, token)
  }

  post(path, body){
    let headers = makeAkoyaAuthHeaders(this.apiConfig);
    return http.post(`https://${this.apiConfig.basePath}/${path}`, body, headers)
  }
  get(path, token){
    let headers = makeAkoyaBearerHeaders(token);
    return http.get(`https://${this.apiConfig.productPath}/${path}`, headers)
  }
};

