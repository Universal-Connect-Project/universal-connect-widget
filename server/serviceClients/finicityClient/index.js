const config = require('../../config');
const logger = require('../../infra/logger');
const db = require('../storageClient');
const CryptoJS = require('crypto-js');
const {  v4: uuidv4, } = require('uuid');
const axios = require('axios')
const http = require('../http');
import {
  ConnectionStatus,
} from '@/../../shared/contract';

function makeFinicityAuthHeaders(apiConfig, tokenRes){
  return {
    'Finicity-App-Key': apiConfig.appKey,
    'Finicity-App-Token': tokenRes.token,
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
}

export default class FinicityClient{
  constructor(apiConfig){
    this.apiConfig = apiConfig
  }

  getInstitutions(){
    return this.get('institution/v2/institutions');
  }

  getInstitution(institutionId){
    return this.get(`institution/v2/institutions/${institutionId}`)
  }

  getAuthToken(){
    return axios.post(this.apiConfig.basePath + '/aggregation/v2/partners/authentication', {
      'partnerId': this.apiConfig.partnerId,
      'partnerSecret': this.apiConfig.secret
    }, {
      headers: {
        'Finicity-App-Key': this.apiConfig.appKey,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data)
  }

  getCustomers(){
    return this.get('aggregation/v1/customers')
  }

  getCustomer(unique_name){
    return this.get(`aggregation/v1/customers?username=${unique_name}`)
      .then(ret => ret.customers?.[0])
  }

  generateConnectLiteUrl(institutionId, customerId, request_id){
    return this.post('connect/v2/generate/lite',{
      language: 'en-US',
      partnerId: this.apiConfig.partnerId,
      customerId: customerId,
      institutionId,
      redirectUri: `${config.HostUrl}/oauth/${this.apiConfig.provider}/redirect_from?connection_id=${request_id}`,
      webhook: `${config.WebhookHostUrl}/webhook/${this.apiConfig.provider}/?connection_id=${request_id}`,
      webhookContentType: 'application/json',
      // 'singleUseUrl': true,
      // 'experience': 'default',
    }).then(ret => ret.link)
  }

  createCustomer(unique_name){
    return this.post(`aggregation/v2/customers/${this.apiConfig.provider === 'finicity_sandbox' ? 'testing': 'active'}`, {
      username: unique_name,
      firstName: 'John',
      lastName: 'Smith',
      // applicationId: '123456789',
      phone: '1-801-984-4200',
      email: 'myname@mycompany.com'
    })
  }

  async post(path, body){
    const token = await this.getAuthToken();
    const headers = makeFinicityAuthHeaders(this.apiConfig, token);
    const ret = await axios.post(`${this.apiConfig.basePath}/${path}`, body, {headers}).then(res => res.data)
    .catch(err => {
      logger.error(`Error at finicityClient.post ${path}`,  err?.response?.data)
    })
    return ret;
  }
  async get(path){
    const token = await this.getAuthToken();
    const headers = makeFinicityAuthHeaders(this.apiConfig, token);
    const ret = await axios.get(`${this.apiConfig.basePath}/${path}`, {headers})
      .then(res => res.data)
      .catch(err => {
        logger.error(`Error at finicityClient.get ${path}`,  err?.response?.data)
      })
    return ret;
  }
};

