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

import * as config from '../../config';
import * as logger from '../../infra/logger';
import * as http from '../http';

const SophtronClient = require('../sophtronClient');

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

export class SophtronApi implements ProviderApiClient {
  token: string;

  apiClient: any;

  httpClient = http;

  constructor(token?: string) {
    this.token = token;
    this.apiClient = new SophtronClient(token);
  }

  async clearConnection(vc: any, id: string) {
    if (config.Demo && vc.issuer) {
      // a valid vc should have an issuer field. this means we have a successful response,
      // once a VC is sccessfully returned to user, we clear the connection for data safty
      this.apiClient.deleteUserInstitution(id);
    }
  }

  async GetInstitutionById(id: string): Promise<Institution> {
    // if (!uuid.test(id)) {
    //   const name = id;
    //   const res = await this.apiClient.getInstitutionsByName(name);
    //   return fromSophtronInstitution(res?.[0]);
    // }
    const ins = await this.apiClient.getInstitutionById(id);
    return fromSophtronInstitution(ins);
  }

  async ListInstitutionCredentials(id: string): Promise<Array<Credential>> {
    let ins;
    if (!uuid.test(id)) {
      const name = id;
      const res = await this.apiClient.getInstitutionsByName(name);
      ins = res?.[0];
    } else {
      ins = await this.apiClient.getInstitutionById(id);
    }
    return [
      {
        id: 'username',
        label: ins?.InstitutionDetail?.LoginFormUserName || 'User name',
        field_type: 'LOGIN',
        field_name: 'LOGIN'
      },
      {
        id: 'password',
        label: ins?.InstitutionDetail?.LoginFormPassword || 'Password',
        field_type: 'PASSWORD',
        field_name: 'PASSWORD'
      },
    ];
  }

  async ListConnectionCredentials(connectionId: string, userId: string): Promise<Credential[]> {
    const uins = await this.apiClient.getUserInstitutionById(connectionId);
    if(uins){
      return this.ListInstitutionCredentials(uins.InstitutionID);
    }
    return [];
  }

  ListConnections(userId: string): Promise<Connection[]> {
    return Promise.resolve([]);
  }

  async CreateConnection(
    request: CreateConnectionRequest
  ): Promise<Connection | undefined> {
    const username = request.credentials.find(
      (item) => item.id === 'username'
    )!.value;
    const password = request.credentials.find(
      (item) => item.id === 'password'
    )!.value;
    let entityId = request.institution_id;
    if (!uuid.test(entityId)) {
      const name = entityId;
      const res = await this.apiClient.getInstitutionsByName(name);
      if (res?.[0]) {
        entityId = res[0].InstitutionID;
        logger.info(`Loaded institution id ${entityId} by name ${name}`);
      } else {
        return undefined;
      }
    }
    let ret: { JobID: string; UserInstitutionID: string } | null = null;
    switch (request.initial_job_type?.toLowerCase()) {
      case 'agg':
      case 'aggregation':
      case 'aggregate':
      case 'add':
      case 'utils':
      case 'util':
      case 'demo':
      case 'vc_transactions':
      case 'vc_transaction':
        ret = await this.apiClient.createUserInstitutionWithRefresh(
          username,
          password,
          entityId
        );
        break;
      case 'fullhistory':
        ret = await this.apiClient.createUserInstitutionWithFullHistory(
          username,
          password,
          entityId
        );
        break;
      case 'auth':
      case 'bankauth':
      case 'verify':
      case 'vc_account':
      case 'vc_accounts':
        ret = await this.apiClient.createUserInstitutionWithFullAccountNumbers(
          username,
          password,
          entityId
        );
        break;
      case 'identify':
      case 'vc_identity':
        ret = await this.apiClient.createUserInstitutionWithProfileInfo(
          username,
          password,
          entityId
        );
        break;
      default:
        // TODO create without job?
        logger.error(`Invalid job type ${request.initial_job_type}`);
        break;
    }
    if (ret) {
      return {
        id: ret.UserInstitutionID,
        cur_job_id: ret.JobID,
        institution_code: entityId, // TODO
        status: ConnectionStatus.CREATED,
        provider: 'sophtron'
      };
    }
    return undefined;
  }

  async DeleteConnection(id: string): Promise<void> {
    return this.apiClient.deleteUserInstitution(id);
  }

  async UpdateConnection(
    request: UpdateConnectionRequest
  ): Promise<Connection> {
    const username = request.credentials!.find(
      (item) => item.id === 'username'
    )!.value;
    const password = request.credentials!.find(
      (item) => item.id === 'password'
    )!.value;
    await this.apiClient.updateUserInstitution(username, password, request.id);
    // todo: retrieve institutionId
    const ret = await this.apiClient.refreshUserInstitution(request.id);
    return {
      id: ret.UserInstitutionID,
      cur_job_id: ret.JobID,
      institution_code: request.id, // TODO
      provider: 'sophtron'
    };
  }

  async GetConnectionById(connectionId: string): Promise<Connection> {
    const uins = await this.apiClient.getUserInstitutionById(connectionId);
    return {
      id: uins.UserInstitutionID,
      institution_code: uins.InstitutionID,
      provider: 'sophtron'
    };
  }

  async GetConnectionStatus(userInstitutionID: string, jobId: string): Promise<Connection> {
    const job = await this.apiClient.getJob(jobId);
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
        // case 'AccountsReady':
        status = ConnectionStatus.CONNECTED;
        break;
      case 'failed':
        status = ConnectionStatus.FAILED;
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
        await this.apiClient.jobTokenInput(jobId, null, null, true);
        break;
      case ChallengeType.IMAGE:
      case ChallengeType.IMAGE_OPTIONS:
        await this.apiClient.jobCaptchaInput(jobId, c.response);
        break;
      case ChallengeType.QUESTION:
        if (c.question === 'ota' || c.id === 'TokenSentFlag') {
          await this.apiClient.jobTokenInput(
            jobId,
            null,
            c.response,
            null
          );
        } else {
          await this.apiClient.jobSecurityAnswer(jobId, [c.response]);
        }
        break;
      case ChallengeType.OPTIONS:
        await this.apiClient.jobTokenInput(jobId, c.response, null, null);
        break;
      default:
        logger.error('Wrong challenge answer received', c)
        return false;
    }
    return true;
  }

  async GetVc(
    connection_id: string,
    type: VcType,
    userId?: string
  ): Promise<object> {
    const key = (await this.apiClient.getUserIntegrationKey()).IntegrationKey;
    //const key = this.token || await this.apiClient.getUserIntegrationKey().IntegrationKey;
    let path = '';
    let body = null as any;
    switch (type) {
      case VcType.IDENTITY:
        path = 'identity';
        body = {
          masks: {
            identity: ['name'],
          },
        };
        break;
      case VcType.ACCOUNTS:
        path = 'accounts';
        break;
      case VcType.TRANSACTIONS:
        path = 'transactions';
        break;
      default:
        break;
    }
    if (path) {
      const headers = { IntegrationKey: key } as any;
      if (userId) {
        headers.DidAuth = userId;
      }
      const ret = await http
        .post(
          `${config.SophtronVCServiceEndpoint}vc/${path}/${connection_id}`,
          body,
          headers
        )
        .then((vc: any) => {
          // for data security purpose when doing demo, remove the connection once vc is returned to client.
          this.clearConnection(vc, connection_id);
          return vc;
        });
      return ret;
    }
    return null;
  }
}
