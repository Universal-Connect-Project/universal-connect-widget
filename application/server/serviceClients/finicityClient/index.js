const config = require('../../config');
const logger = require('../../infra/logger');
const axios = require('axios')

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

  getAuthToken(){
    return axios.post(this.apiConfig.basePath + '/aggregation/v2/partners/authentication', {
      'partnerId': this.apiConfig.partnerId,
      'partnerSecret': this.apiConfig.secret
    }, {
      headers: {
        'Finicity-App-Key': this.apiConfig.appKey,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data).catch(err => {
      logger.error(`Error at finicityClient.getAuthToken`,  err?.response?.data)
    })
  }

  getInstitutions(){
    return this.get('institution/v2/institutions');
  }

  getInstitution(institutionId){
    return this.get(`institution/v2/institutions/${institutionId}`)
  }

  getCustomers(){
    return this.get('aggregation/v1/customers')
  }

  getCustomer(unique_name){
    return this.get(`aggregation/v1/customers?username=${unique_name}`)
      .then(ret => ret.customers?.[0])
  }

  getCustomerAccounts(customerId){
    return this.get(`aggregation/v1/customers/${customerId}/accounts`)
  }

  getCustomerAccountsByInstitutionLoginId(customerId, institutionLoginId){
    return this.get(`aggregation/v1/customers/${customerId}/institutionLogins/${institutionLoginId}/accounts`)
      .then(res => res.accounts)
  }

  getAccountOwnerDetail(customerId, accountId){
    return this.get(`aggregation/v3/customers/${customerId}/accounts/${accountId}/owner`)
      .then(res => res.holders?.[0])
  }

  getAccountAchDetail(customerId, accountId){
    // {
    //   "routingNumber": "123456789",
    //   "realAccountNumber": 2345678901
    // }
    return this.get(`aggregation/v1/customers/${customerId}/accounts/${accountId}/details`)
  }

  getTransactions(customerId, accountId, fromDate, toDate){
    return this.get(`aggregation/v4/customers/${customerId}/accounts/${accountId}/transactions`, 
      {
        fromDate: Date.parse(fromDate) / 1000, 
        toDate: Date.parse(toDate) / 1000,
        limit: 2
      }
    )
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

  generateConnectFixUrl(institutionLoginId, customerId, request_id){
    return this.post('connect/v2/generate/fix',{
      language: 'en-US',
      partnerId: this.apiConfig.partnerId,
      customerId: customerId,
      institutionLoginId,
      redirectUri: `${config.HostUrl}/oauth/${this.apiConfig.provider}/redirect_from?connection_id=${request_id}`,
      webhook: `${config.WebhookHostUrl}/webhook/${this.apiConfig.provider}/?connection_id=${request_id}`,
      webhookContentType: 'application/json',
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
  
  post(path, body){
    return this.request('post', path, null, body)
  }
  get(path, params){
    return this.request('get', path, params)
  }
  del(path, params){
    return this.request('delete', path, params)
  }
  async request(method, url, params, data){
    if(!this.axios){
      const token = await this.getAuthToken();
      const headers = makeFinicityAuthHeaders(this.apiConfig, token);
      this.axios = axios.create({
        baseURL: this.apiConfig.basePath,
        headers
      })
    }
    let ret = await this.axios.request({
        url,
        method,
        params,
        data
      })
      .then(res => res.data)
      .catch(err => {
        let newErr = new Error(`Error at finicityClient.${method} ${url}`,  err?.response?.data)
        throw newErr
      })
    return ret;
  }
};

