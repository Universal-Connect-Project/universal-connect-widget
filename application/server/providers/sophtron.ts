import {
  Challenge,
  ChallengeType,
  Connection,
  ConnectionStatus,
  CreateConnectionRequest,
  Credential,
  Institution,
  Institutions,
  ProviderApiClient,
  UpdateConnectionRequest,
  VcType,
} from '@/../../shared/contract';

import * as config from '../config';
import * as logger from '../infra/logger';
import * as http from '../infra/http';

const SophtronClient = require('../serviceClients/sophtronClient/v2');
const SophtronVcClient = require('../serviceClients/sophtronClient/vc');
const SophtronClientV1 = require('../serviceClients/sophtronClient');

const uuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function fromSophtronInstitution(ins: any): Institution | undefined {
  if (!ins) {
    return undefined;
  }
  return {
    id: ins.InstitutionID,
    logo_url: ins.Logo,
    name: ins.InstitutionName,
    url: ins.URL,
    provider: 'sophtron',
  };
}

function mapJobType(input: string){
  switch (input) {
    case 'agg':
    case 'aggregation':
    case 'aggregate':
    case 'add':
    case 'utils':
    case 'util':
    case 'demo':
    case 'vc_transactions':
    case 'vc_transaction':
      return 'aggregate';
    case 'all':
    case 'everything':
    case 'aggregate_all':
    case 'aggregate_everything':
    case 'agg_all':
    case 'agg_everything':
      return 'aggregate_identity_verification';
    case 'fullhistory':
    case 'aggregate_extendedhistory':
      return 'aggregate_extendedhistory';
    case 'auth':
    case 'bankauth':
    case 'verify':
    case 'verification':
    case 'vc_account':
    case 'vc_accounts':
      return 'verification';
    case 'identify':
    case 'vc_identity':
      return 'aggregate_identity';
    default:
      // TODO create without job?
      logger.error(`Invalid job type ${input}`);
      break;
  }
}

export class SophtronApi implements ProviderApiClient {
  apiClient: any;
  apiClientV1: any;
  vcClient: any;

  httpClient = http;

  constructor(config: any) {
    let {sophtron} = config;
    this.apiClient = new SophtronClient(sophtron);
    this.apiClientV1 = new SophtronClientV1(sophtron);
    this.vcClient = new SophtronVcClient(sophtron);
  }

  async clearConnection(vc: any, id: string, userID: string) {
    if (config.Demo && vc.issuer) {
      // a valid vc should have an issuer field. this means we have a successful response,
      // once a VC is sccessfully returned to user, we clear the connection for data safty
      this.apiClient.deleteMember(userID, id);
    }
  }

  async GetInstitutionById(id: string): Promise<Institution> {
    // if (!uuid.test(id)) {
    //   const name = id;
    //   const res = await this.apiClient.getInstitutionsByName(name);
    //   return fromSophtronInstitution(res?.[0]);
    // }
    const ins = await this.apiClientV1.getInstitutionById(id);
    return fromSophtronInstitution(ins);
  }

  async ListInstitutionCredentials(id: string): Promise<Array<Credential>> {
    const ins = await this.apiClientV1.getInstitutionById(id);
    let ret = [
      {
        id: 'username',
        label: ins?.InstitutionDetail?.LoginFormUserName || 'User name',
        field_type: 'LOGIN',
        field_name: 'LOGIN'
      }
    ];
    if(ins?.InstitutionDetail?.LoginFormPassword !== 'None'){
      ret.push({
          id: 'password',
          label: ins?.InstitutionDetail?.LoginFormPassword || 'Password',
          field_type: 'PASSWORD',
          field_name: 'PASSWORD'
        })
    }
    return ret;
  }

  async ListConnectionCredentials(connectionId: string, userId: string): Promise<Credential[]> {
    const uins = await this.apiClient.getMember(userId, connectionId);
    if(uins){
      return this.ListInstitutionCredentials(uins.InstitutionID);
    }
    return [];
  }

  ListConnections(userId: string): Promise<Connection[]> {
    return Promise.resolve([]);
  }

  async CreateConnection(
    request: CreateConnectionRequest,
    userId: string
  ): Promise<Connection | undefined> {
    let job_type = mapJobType(request.initial_job_type?.toLowerCase())
    if(!job_type){
      return
    }
    const username = request.credentials.find(
      (item) => item.id === 'username'
    )!.value;
    const passwordField = request.credentials.find(
      (item) => item.id === 'password'
    )
    // if password field wasn't available, it should be a 'none' type
    const password = passwordField? passwordField.value : 'None';
    const ret = await this.apiClient.createMember(userId, job_type, username, password, request.institution_id);
    if (ret) {
      return {
        id: ret.MemberID,
        cur_job_id: ret.JobID,
        institution_code: request.institution_id, // TODO
        status: ConnectionStatus.CREATED,
        provider: 'sophtron'
      };
    }
    return undefined;
  }

  async DeleteConnection(id: string, userId: string): Promise<void> {
    return this.apiClient.deleteMember(userId, id);
  }

  async UpdateConnection(
    request: UpdateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    let job_type = mapJobType('agg') //TODO
    if(!job_type){
      return
    }
    const username = request.credentials!.find(
      (item) => item.id === 'username'
    )!.value;
    const password = request.credentials!.find(
      (item) => item.id === 'password'
    )!.value;
    const ret = await this.apiClient.updateMember(userId, request.id, job_type, username, password);
    return {
      id: ret.MemberID,
      cur_job_id: ret.JobID,
      institution_code: 'institution_code', // TODO
      provider: 'sophtron'
    };
  }

  async GetConnectionById(connectionId: string, userId: string): Promise<Connection> {
    const m = await this.apiClient.getMember(userId, connectionId);
    return {
      id: m.MemberID,
      institution_code: m.InstitutionID,
      provider: 'sophtron',
      user_id: userId,
    };
  }

  async GetConnectionStatus(memberId: string, jobId: string, single_account_select: boolean, userId: string): Promise<Connection> {
    if(!jobId){
      let ret = await this.GetConnectionById(memberId, userId);
      return ret;
    }
    const job = await this.apiClient.getJobInfo(jobId);
    const challenge: Challenge = {
      id: '',
      type: ChallengeType.QUESTION,
    };
    let status = ConnectionStatus.CHALLENGED;
    let jobStatus = job.LastStatus;
    if (job.SuccessFlag === true) {
      jobStatus = 'success';
    } else if (job.SuccessFlag === false) {
      jobStatus = 'failed';
    }
    switch (jobStatus) {
      case 'success':
        // case 'Completed':
        status = ConnectionStatus.CONNECTED;
        break;
      case 'failed':
        status = ConnectionStatus.FAILED;
        break;
      case 'AccountsReady':
        let jobType = job.JobType.toLowerCase();
        if(single_account_select 
            && (!job.AccountID || job.AccountID === '00000000-0000-0000-0000-000000000000')
            && (jobType === 'authallaccounts' || jobType === 'refreshauthall')
            ){
          let accounts = await this.apiClientV1.getUserInstitutionAccounts(memberId);
          challenge.id = 'single_account_select';
          challenge.external_id = 'single_account_select';
          challenge.type = ChallengeType.OPTIONS;
          challenge.question = 'Please select an account to proceed:';
          challenge.data = accounts.map(
            (a:any) => ({ key: `${a.AccountName} ${a.AccountNumber}`, value: a.AccountID })
          );
        }else{
          status = ConnectionStatus.CREATED;
        }
        break;
      default:
        if (job.SecurityQuestion) {
          challenge.id = 'SecurityQuestion';
          challenge.type = ChallengeType.QUESTION;
          challenge.data = JSON.parse(job.SecurityQuestion).map(
            (q: string, i: number) => ({ key: q, value: q })
          );
        } else if (job.TokenMethod) {
          challenge.id = 'TokenMethod';
          challenge.type = ChallengeType.OPTIONS;
          challenge.question =
            'Please select a channal to receive your secure code';
          challenge.data = JSON.parse(job.TokenMethod).map(
            (q: string, i: number) => ({ key: q, value: q })
          );
        } else if (job.TokenSentFlag === true) {
          challenge.id = 'TokenSentFlag';
          challenge.type = ChallengeType.QUESTION;
          challenge.question = 'ota';
          challenge.data = [
            {
              key: 'ota',
              value: `Please Enter the ${job.TokenInputName || 'OTA code'}`,
            },
          ];
        } else if (job.TokenRead) {
          challenge.id = 'TokenRead';
          challenge.type = ChallengeType.TOKEN;
          challenge.question =
            'Please approve from you secure device with following token';
          challenge.data = job.TokenRead;
        } else if (job.CaptchaImage) {
          challenge.id = 'CaptchaImage';
          challenge.type = ChallengeType.IMAGE;
          challenge.question = 'Please enter the Captcha code';
          challenge.data = job.CaptchaImage;
          // TODO: select captcha, currently it's combined into one image and treated as a normal Captcha Image
          // challenge.type = ChallengeType.IMAGE_OPTION
          // challenge.label = ''
        } else {
          status = ConnectionStatus.CREATED;
        }
        break;
    }
    return {
      id: job.UserInstitutionID,
      user_id: userId,
      cur_job_id: job.JobID,
      status,
      challenges: challenge?.id ? [challenge] : undefined,
      provider: 'sophtron'
    };
  }

  async AnswerChallenge(request: UpdateConnectionRequest, jobId: string): Promise<boolean> {
    const c = request.challenges![0]!;
    switch (c.type) {
      case ChallengeType.TOKEN:
        await this.apiClientV1.jobTokenInput(jobId, null, null, true);
        break;
      case ChallengeType.IMAGE:
      case ChallengeType.IMAGE_OPTIONS:
        await this.apiClientV1.jobCaptchaInput(jobId, c.response);
        break;
      case ChallengeType.QUESTION:
        if (c.question === 'ota' || c.id === 'TokenSentFlag') {
          await this.apiClientV1.jobTokenInput(
            jobId,
            null,
            c.response,
            null
          );
        } else {
          await this.apiClientV1.jobSecurityAnswer(jobId, [c.response]);
        }
        break;
      case ChallengeType.OPTIONS:
        if(c.id === 'single_account_select'){
          await this.apiClientV1.getFullAccountNumberWithinJob(c.response, jobId);
        }else{
          await this.apiClientV1.jobTokenInput(jobId, c.response, null, null);
        }
        break;
      default:
        logger.error('Wrong challenge answer received', c)
        return false;
    }
    return true;
  }
  
  async ResolveUserId(user_id: string){
    logger.debug('Resolving UserId: ' + user_id);
    const sophtronUser = await this.apiClient.getCustomerByUniqueName(user_id);
    if(sophtronUser){
      logger.trace(`Found existing sophtron customer ${sophtronUser.CustomerID}`)
      return sophtronUser.CustomerID
    }
    logger.trace(`Creating sophtron user ${user_id}`)
    let ret = await this.apiClient.createCustomer(user_id)
    if(ret){
      return ret.CustomerID
    }
    logger.trace(`Failed creating sophtron user, using user_id: ${user_id}`)
    return user_id;
  }
}
