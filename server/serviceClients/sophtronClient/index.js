const config = require('../../config');
const http = require('../http');

function post(path, data) {
  const authHeader = http.buildAuthCode('post', path);
  return http.post(config.SophtronApiServiceEndpoint + path, data, {
    Authorization: authHeader,
  });
}

module.exports = {
  name: 'sophtronClient',
  async getUserIntegrationKey() {
    const ret = await post('/User/GetUserIntegrationKey', {
      Id: config.SophtronApiUserId,
    });
    return ret;
  },
  getUserInstitutionById(id) {
    return post('/UserInstitution/GetUserInstitutionByID', {
      UserInstitutionID: id,
    });
  },
  getUserInstitutionsByUser(id) {
    return post('/UserInstitution/GetUserInstitutionsByUser', { UserID: id });
  },
  deleteUserInstitution(id) {
    return post('/UserInstitution/DeleteUserInstitution', {
      UserInstitutionID: id,
    });
  },
  getUserInstitutionAccounts(userInstitutionID) {
    return post('/UserInstitution/GetUserInstitutionAccounts', {
      UserInstitutionID: userInstitutionID,
    });
  },
  getInstitutionById(id) {
    const data = { InstitutionID: id };
    return post('/Institution/GetInstitutionByID', data);
  },
  getInstitutionByRoutingNumber(number) {
    return post('/Institution/GetInstitutionByRoutingNumber', {
      RoutingNumber: number,
    });
  },
  async getInstitutionsByName(name) {
    // console.log(name);
    if ((name || '').length > 0) {
      const data = await post('/Institution/GetInstitutionByName', {
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
  },
  getJob(id) {
    return post('/Job/GetJobByID', { JobID: id });
  },
  async jobSecurityAnswer(jobId, answer) {
    const ret = await post('/Job/UpdateJobSecurityAnswer', {
      JobID: jobId,
      SecurityAnswer: JSON.stringify(answer),
    });
    return ret === 0 ? {} : { error: 'SecurityAnswer failed' };
  },
  async jobTokenInput(jobId, tokenChoice, tokenInput, verifyPhoneFlag) {
    const ret = await post('/Job/UpdateJobTokenInput', {
      JobID: jobId,
      TokenChoice: tokenChoice,
      TokenInput: tokenInput,
      VerifyPhoneFlag: verifyPhoneFlag,
    });
    return ret === 0 ? {} : { error: 'TokenInput failed' };
  },
  async jobCaptchaInput(jobId, input) {
    const ret = await post('/Job/UpdateJobCaptcha', {
      JobID: jobId,
      CaptchaInput: input,
    });
    return ret === 0 ? {} : { error: 'Captcha failed' };
  },
  CreateUserInstitutionWithRefresh(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithRefresh';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: config.SophtronApiUserId,
    };
    return post(url, data);
  },
  CreateUserInstitutionWithProfileInfo(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithProfileInfo';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: config.SophtronApiUserId,
    };
    return post(url, data);
  },
  CreateUserInstitutionWithFullHistory(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWithFullHistory';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: config.SophtronApiUserId,
    };
    return post(url, data);
  },
  CreateUserInstitutionWithFullAccountNumbers(
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
    return post(url, data);
  },
  CreateUserInstitutionWOJob(username, password, institutionId) {
    const url = '/UserInstitution/CreateUserInstitutionWOJob';
    return post(url, {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
    });
  },
  UpdateUserInstitution(username, password, userInstitutionID) {
    const url = '/UserInstitution/UpdateUserInstitution';
    return post(url, {
      UserName: username,
      Password: password,
      UserInstitutionID: userInstitutionID,
    });
  },
  GetUserInstitutionProfileInfor(userInstitutionID) {
    const url = '/UserInstitution/GetUserInstitutionProfileInfor';
    return post(url, { UserInstitutionID: userInstitutionID }).then((data) => {
      data.UserInstitutionID = userInstitutionID;
      return data;
    });
  },
  RefreshUserInstitution(userInstitutionID) {
    const url = '/UserInstitution/RefreshUserInstitution';
    return post(url, { UserInstitutionID: userInstitutionID }).then((data) => {
      data.UserInstitutionID = userInstitutionID;
      return data;
    });
  },
  ping() {
    return http.get(
      `${config.SophtronApiServiceEndpoint}/UserInstitution/Ping`
    );
  },
};
