const config = require('../../config');
const logger = require('../../infra/logger');
const db = require('../storageClient');
const CryptoJS = require("crypto-js");
const {  v4: uuidv4, } = require('uuid');
const http = require('../http');
import {
  ConnectionStatus,
} from '@/../../shared/contract';

const version = 'v2';

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

  async createConnection(institution_id){
    const request_id = uuidv4();
    const obj = {
      id: request_id,
      is_oauth: true,
      credentials: [],
      institution_code: institution_id,
      oauth_window_uri: this.getOauthUrl(institution_id, this.client_redirect_url, request_id),
      provider: this.apiConfig.provider,
      status: ConnectionStatus.PENDING
    }
    await db.set(request_id, obj);
    return obj;
  }
  async updateConnection(oauthResponse){
    const {state: connection_id, code } = oauthResponse;
    logger.info(`Received akoya oauth redirect response ${connection_id}`)
    let connection = await db.get(connection_id)
    if(!connection){
      return {}
    }
    if(code){
      connection.status = ConnectionStatus.CONNECTED
      connection.guid = connection_id
      connection.id = code
    }
    await db.set(connection_id, connection)
    return connection;
  }
  deleteConnection(id){
    db.set(id, null);
  }
  getConnection(id){
    return db.get(id);
  }

  getIdToken(authCode){
    let body = {grant_type: 'authorization_code', code: authCode, redirect_uri: this.client_redirect_url};
    // let body = `grant_type=authorization_code&code=${authCode}`; //&redirect_uri=${this.client_redirect_url}
    return this.post('token', body)
  }
  refreshToken(existingRefreshToken){
    return this.post('token', {grant_type: 'refresh_token', refresh_token: existingRefreshToken, client_id: this.apiConfig.clientId, client_secret: this.apiConfig.secret})
  }

  getAccountInfo(institution_id, token){
    return this.get(`accounts-info/${version}/${institution_id}`, token)
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
  getCustomers(institution_id, token){
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

