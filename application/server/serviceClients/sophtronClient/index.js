const logger = require('../../infra/logger');
const http = require('../../infra/http')
const SophtronBaseClient = require('./base');

module.exports = class SophtronClient extends SophtronBaseClient{
  constructor(apiConfig){
    super(apiConfig);
  }

  async getUserIntegrationKey() {
    const data = {Id: this.apiConfig.clientId}
    const ret = await this.post('/User/GetUserIntegrationKey', data);
    return ret;
  }

  getUserInstitutionById(id) {
    return this.post('/UserInstitution/GetUserInstitutionByID', {
      UserInstitutionID: id,
    });
  }

  // getUserInstitutionsByUser(id) {
  //   return this.post('/UserInstitution/GetUserInstitutionsByUser', { UserID: id });
  // }
  deleteUserInstitution(id) {
    return this.post('/UserInstitution/DeleteUserInstitution', {
      UserInstitutionID: id,
    });
  }

  getUserInstitutionAccounts(userInstitutionID) {
    return this.post('/UserInstitution/GetUserInstitutionAccounts', {
      UserInstitutionID: userInstitutionID,
    });
  }

  getInstitutionById(id) {
    const data = { InstitutionID: id };
    return this.post('/Institution/GetInstitutionByID', data);
  }

  getInstitutionByRoutingNumber(number) {
    return this.post('/Institution/GetInstitutionByRoutingNumber', {
      RoutingNumber: number,
    });
  }

  async getInstitutionsByName(name) {
    // console.log(name);
    if ((name || '').length > 0) {
      const data = await this.post('/Institution/GetInstitutionByName', {
        InstitutionName: name,
        Extensive: true,
        InstitutionType: 'All',
      });
      if (data?.length > 0) {
        return data
          .sort((a, b) => a.InstitutionName.length - b.InstitutionName.length)
          .slice(0, 9);
      }
      return data;
    }
    return [];
  }

  getJob(id) {
    return this.post('/Job/GetJobInformationByID', { JobID: id });
  }

  async jobSecurityAnswer(jobId, answer) {
    const ret = await this.post('/Job/UpdateJobSecurityAnswer', {
      JobID: jobId,
      SecurityAnswer: JSON.stringify(answer),
    });
    return ret === 0 ? {} : { error: 'SecurityAnswer failed' };
  }

  async jobTokenInput(jobId, tokenChoice, tokenInput, verifyPhoneFlag) {
    const ret = await this.post('/Job/UpdateJobTokenInput', {
      JobID: jobId,
      TokenChoice: tokenChoice,
      TokenInput: tokenInput,
      VerifyPhoneFlag: verifyPhoneFlag,
    });
    return ret === 0 ? {} : { error: 'TokenInput failed' };
  }

  async jobCaptchaInput(jobId, input) {
    const ret = await this.post('/Job/UpdateJobCaptchaInput', {
      JobID: jobId,
      CaptchaInput: input,
    });
    return ret === 0 ? {} : { error: 'Captcha failed' };
  }

  createUserInstitutionWithRefresh(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithRefresh';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithProfileInfo(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithProfileInfo';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithAllPlusProfile(username, password, institutionId){
    var url = '/UserInstitution/CreateUserInstitutionWithAllPlusProfile';
    var data = {
        UserName: username,
        Password: password,
        InstitutionID: institutionId,
        UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithFullHistory(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithFullHistory';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithFullAccountNumbers(
    username,
    password,
    institutionId
  ) {
    const url = '/UserInstitution/CreateUserInstitutionWithFullAccountNumbers';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWOJob(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWOJob';
    return this.post(url, {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
    });
  }

  updateUserInstitution(username, password, userInstitutionID) {
    const url = '/UserInstitution/UpdateUserInstitution';
    return this.post(url, {
      UserName: username,
      Password: password,
      UserInstitutionID: userInstitutionID,
    });
  }

  getUserInstitutionProfileInfor(userInstitutionID) {
    const url = '/UserInstitution/GetUserInstitutionProfileInfor';
    return this.post(url, { UserInstitutionID: userInstitutionID }).then((data) => {
      data.UserInstitutionID = userInstitutionID;
      return data;
    });
  }

  refreshUserInstitution(userInstitutionID) {
    const url = '/UserInstitution/RefreshUserInstitution';
    return this.post(url, { UserInstitutionID: userInstitutionID }).then((data) => {
      data.UserInstitutionID = userInstitutionID;
      return data;
    });
  }

  getFullAccountNumberWithinJob(accountId, jobId){
    const url = '/UserInstitutionAccount/GetFullAccountNumberWithinJob';
    return this.post(url, { AccountID: accountId, JobID: jobId });
  }

  ping = () => {
    return http.get(
      `${this.apiConfig.endpoint}/UserInstitution/Ping`
    );
  }

};
