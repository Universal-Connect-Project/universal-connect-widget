const crypto = require('crypto');
const http = require('../http');
const config = require('../../config');
const logger = require('../../infra/logger');

function buildAuthCode(httpMethod, url) {
  const authPath = url.substring(url.lastIndexOf('/')).toLowerCase();
  const integrationKey = Buffer.from(config.SophtronApiUserSecret, 'base64');
  const plainKey = `${httpMethod.toUpperCase()}\n${authPath}`;
  const b64Sig = crypto
    .createHmac('sha256', integrationKey)
    .update(plainKey)
    .digest('base64');
  const authString = `FIApiAUTH:${config.SophtronApiUserId}:${b64Sig}:${authPath}`;
  return authString;
}

module.exports = class SophtronClient{
  constructor(integrationKey){
    this.integrationKey = integrationKey
  }

  async getUserIntegrationKey() {
    if(this.integrationKey){
      return this.integrationKey;
    }
    const data = {Id: config.SophtronApiUserId}
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
    return this.post('/Job/GetJobByID', { JobID: id });
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
    const ret = await this.post('/Job/UpdateJobCaptcha', {
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
      UserID: config.SophtronApiUserId,
    };
    return this.post(url, data, function(phrase){
      data.UserID = phrase.split(':')[1];
    });
  }

  createUserInstitutionWithProfileInfo(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithProfileInfo';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: config.SophtronApiUserId,
    };
    return this.post(url, data, function(phrase){
      data.UserID = phrase.split(':')[1];
    });
  }

  createUserInstitutionWithFullHistory(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithFullHistory';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: config.SophtronApiUserId,
    };
    return this.post(url, data, function(phrase){
      data.UserID = phrase.split(':')[1];
    });
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
      UserID: config.SophtronApiUserId,
    };
    return this.post(url, data, function(phrase){
      data.UserID = phrase.split(':')[1];
    });
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

  ping = () => {
    return http.get(
      `${config.SophtronApiServiceEndpoint}/UserInstitution/Ping`
    );
  }

  async post(path, data, onPhrase) {
    if(!this.integrationKey){
      const authHeader = buildAuthCode('post', path);
      const ret = await http.post(config.SophtronApiServiceEndpoint + path, data, {
        Authorization: authHeader,
      });
      return ret;
    }
    console.log(buildAuthCode('get', path))
    console.log(this.integrationKey)
    const phrase = await http.get(`${config.SophtronAuthResolverEndpoint}v1/phrase?path=${encodeURIComponent(path)}&method=${'post'}`, {
      IntegrationKey: this.integrationKey,
      // Authorization: buildAuthCode('get', path),
    });

    if(phrase){
      logger.trace(`posting to API, got phrase for path: ${  path}`);
      if(onPhrase){
        onPhrase(phrase);
      }
      const ret = await http.post(config.SophtronApiServiceEndpoint + path, data, {Authorization: phrase});
      return ret;
    }
    const msg = `Failed to get auth phrase with integratin key: ${this.integrationKey}, path: ${path}`;
    logger.error(msg);
    return {}
  }
};
