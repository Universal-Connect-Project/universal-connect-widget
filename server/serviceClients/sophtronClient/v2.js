const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http')
const {buildSophtronAuthCode} = require('../../utils')

module.exports = class SophtronClient{
  apiConfig;
  constructor(apiConfig){
    this.apiConfig = apiConfig
  }

  getCustomer(customerId){
    return this.get(`/v2/customers/${customerId}`)
  }

  async getCustomerByUniqueName(unique_name){
    const arr = await this.get(`/v2/customers?uniqueID=${unique_name}`)
    return arr?.[0];
  }

  createCustomer(unique_name){
    return this.post(`/v2/customers`,{
      UniqueID: unique_name,
      Source: `Universal_Widget_${config.HostUrl}`,
      Name: 'UniversalWidget_Customer'
    })
  }

  getMember(customerId, memberId){
    return this.get(`/v2/customers/${customerId}/members/${memberId}`)
  }

  createMember(customerId, job_type, username, password, institution_id){
    return this.post(`/v2/customers/${customerId}/members/${job_type}`, {
      UserName: username,
      Password: password,
      InstitutionID: institution_id
    })
  }

  updateMember(customerId, memberId, job_type, username, password){
    return this.put(`/v2/customers/${customerId}/members/${memberId}/${job_type}`, {
      UserName: username,
      Password: password
    })
  }

  refreshMember(customerId, memberId, job_type){
    return this.post(`/v2/customers/${customerId}/members/${memberId}/${job_type}`)
  }

  deleteMember(customerId, memberId){
    return this.del(`/v2/customers/${customerId}/members/${memberId}`)
  }

  async post(path, data) {
    const authHeader = buildSophtronAuthCode('post', path, this.apiConfig.clientId, this.apiConfig.secret);
    const ret = await http.post(this.apiConfig.endpoint + path, data, {Authorization: authHeader});
    return ret;
  }
  async get(path) {
    const authHeader = buildSophtronAuthCode('get', path, this.apiConfig.clientId, this.apiConfig.secret);
    const ret = await http.get(this.apiConfig.endpoint + path, {Authorization: authHeader});
    return ret;
  }
  async put(path, data) {
    const authHeader = buildSophtronAuthCode('put', path, this.apiConfig.clientId, this.apiConfig.secret);
    const ret = await http.put(this.apiConfig.endpoint + path, data, {Authorization: authHeader});
    return ret;
  }
  async del(path) {
    const authHeader = buildSophtronAuthCode('delete', path, this.apiConfig.clientId, this.apiConfig.secret);
    const ret = await http.del(this.apiConfig.endpoint + path, {Authorization: authHeader});
    return ret;
  }
};
