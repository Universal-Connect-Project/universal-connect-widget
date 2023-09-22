const config = require('../../config');
const logger = require('../../infra/logger');
const http = require('../../infra/http');
const SophtronBaseClient = require('./base');

module.exports = class SophtronV2Client extends SophtronBaseClient{
  constructor(apiConfig){
    super(apiConfig);
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

  getJobInfo(jobId){
    return this.get(`/v2/job/${jobId}`);
  }
};
