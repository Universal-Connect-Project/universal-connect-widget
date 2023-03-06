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
import * as client from '../sophtronClient';

const uuid =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

async function clearConnection(vc: any, id: string) {
  if (config.Demo && vc.issuer) {
    // a valid vc should have an issuer field. this means we have a successful response,
    // once a VC is sccessfully returned to user, we clear the connection for data safty
    client.deleteUserInstitution(id);
  }
}

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
  apiClient = client;

  httpClient = http;

  ListFavorateInstitutions(): Promise<Institution[]> {
    return Promise.resolve([
      {
        id: '40a24f71-16e4-411c-b6e4-05b55577b66e',
        name: 'Ally Bank',
        url: 'https://www.ally.com',
        logo_url: 'https://sophtron.com/images/banklogos/ally%20bank.png',
        provider: 'sophtron',
      },
      {
        id: '3e9fbc88-be07-4478-9a4c-9d3061d5d6d4',
        name: 'Bank of America',
        url: 'https://connect.bnymellon.com/ConnectLogin/login/LoginPage.jsp',
        logo_url:
          'https://logos-list.s3-us-west-2.amazonaws.com/bank_of_america_logo.png',
        provider: 'sophtron',
      },
      {
        id: '227d9de3-7c18-4781-97a0-ce2ecefb1b7a',
        name: 'Barclays',
        url: 'https://www.securebanking.barclaysus.com/',
        logo_url: 'https://sophtron.com/images/banklogos/barclays.png',
        provider: 'sophtron',
      },
      {
        id: '7da0e182-a2f3-41f1-84e2-4b6f5b8112e5',
        name: 'BB&T',
        url: 'https://www.bbt.com/online-access/online-banking/default.page',
        logo_url: 'https://sophtron.com/images/banklogos/bbt.png',
        provider: 'sophtron',
      },
      {
        id: '0d8a29dd-4c28-4364-a493-b508f0a84758',
        name: 'Capital One',
        url: 'https://www.capitalone.com/',
        logo_url: 'https://sophtron.com/images/banklogos/capital%20one.png',
        provider: 'sophtron',
      },
      {
        id: '3d7671e4-36be-4266-971e-b50d33001382',
        name: 'Charles Schwab',
        url: 'https://client.schwab.com/Login/SignOn/CustomerCenterLogin.aspx',
        logo_url: 'https://sophtron.com/images/banklogos/charles%20schwab.png',
        provider: 'sophtron',
      },
      {
        id: '4b2eca34-a729-438f-844c-ba8ce51047f9',
        name: 'Citibank',
        url: 'https://online.citi.com/US/login.do',
        logo_url: 'https://sophtron.com/images/banklogos/citibank.png ',
        provider: 'sophtron',
      },
      {
        id: 'd06b4cb4-d11f-47cf-92bd-6d0fe52760b1',
        name: 'USAA',
        url: 'https://www.usaa.com/inet/ent_logon/Logon',
        logo_url: 'https://sophtron.com/images/banklogos/usaa.png',
        provider: 'sophtron',
      },
      {
        id: '71ec5788-adf0-43a4-b1dd-8d5958a0d13c',
        name: 'Fifth Third Bank',
        url: 'http://www.53.com/content/fifth-third/en/login.html',
        logo_url:
          'https://logos-list.s3-us-west-2.amazonaws.com/fifth_third_bank_logo.png',
        provider: 'sophtron',
      },
      {
        id: 'd03878fe-5b40-4b4d-95fc-c48d92105888',
        name: 'GoldMan Sachs',
        url: 'https://www.goldman.com/',
        logo_url: 'https://sophtron.com/images/banklogos/goldman%20sachs.png',
        provider: 'sophtron',
      },
      {
        id: 'c155dab2-9133-4df3-a28e-b862af43bb38',
        name: 'HSBC Bank',
        url: 'https://www.services.online-banking.us.hsbc.com/',
        logo_url: 'https://sophtron.com/images/banklogos/hsbc%20bank.png',
        provider: 'sophtron',
      },
      {
        id: 'b2a957e5-7bf2-47c0-bd63-ce96736cdacd',
        name: 'Chase Bank',
        url: 'https://www.chase.com/',
        logo_url: 'https://sophtron.com/images/banklogos/chase.png',
        provider: 'sophtron',
      },
      {
        id: 'abd4059c-adf1-4f16-b493-37767f6cf233',
        name: 'Morgan Stanley',
        url: 'https://www.morganstanleyclientserv.com/',
        logo_url: 'https://sophtron.com/images/banklogos/morgan%20stanley.png',
        provider: 'sophtron',
      },
      {
        id: '13793b9f-2ebf-4f31-815e-7dfe38e906c4',
        name: 'PNC Bank',
        url: 'https://www.pnc.com/en/personal-banking/banking/online-and-mobile-banking.html',
        logo_url:
          'https://logos-list.s3-us-west-2.amazonaws.com/pnc_bank_logo.png',
        provider: 'sophtron',
      },
      {
        id: '86e1f8a0-5963-4125-9999-ccbe44d5940e',
        name: 'State Street',
        url: 'https://www.statestreetbank.com/online-banking',
        logo_url: 'https://sophtron.com/images/banklogos/state%20street.png',
        provider: 'sophtron',
      },
      {
        id: '8275fc09-149b-4849-8a31-51ef9ba8eb6d',
        name: 'SunTrust',
        url: 'https://onlinebanking.suntrust.com/',
        logo_url:
          'https://logos-list.s3-us-west-2.amazonaws.com/suntrust_logo.png',
        provider: 'sophtron',
      },
      {
        id: 'b8cb06e4-4f42-42b7-ba5a-623a5d1afe0f',
        name: 'TD Bank',
        url: 'https://onlinebanking.tdbank.com',
        logo_url:
          'https://logos-list.s3-us-west-2.amazonaws.com/td_bank_logo.png',
        provider: 'sophtron',
      },
      {
        id: '9aee59a1-59c9-4e5e-88f6-a00aa19f1612',
        name: 'US Bank',
        url: 'https://www.usbank.com/index.html',
        logo_url:
          'https://logos-list.s3-us-west-2.amazonaws.com/us_bank_logo.png',
        provider: 'sophtron',
      },
      {
        id: 'e3d4c866-1c48-44c3-9cc5-5e9c7db43ef0',
        name: 'Wells Fargo',
        url: 'https://connect.secure.wellsfargo.com/auth/login/present?origin=tpb',
        logo_url: 'https://sophtron.com/images/banklogos/wells%20fargo.png',
        provider: 'sophtron',
      },
    ]);
  }

  async GetInstitutionById(id: string): Promise<Institution> {
    if (!uuid.test(id)) {
      const name = id;
      const res = await this.apiClient.getInstitutionsByName(name);
      return fromSophtronInstitution(res?.[0]);
    }
    const ins = await this.apiClient.getInstitutionById(id);
    return fromSophtronInstitution(ins);
  }

  async SearchInstitutions(name: string): Promise<Institutions> {
    const ret = await this.httpClient.wget(
      `${config.SophtronAutoSuggestEndpoint}?term=${encodeURIComponent(name)}`
    );
    // console.log(ret);
    return {
      institutions: (ret || []).slice(0, 9).map((ins: any) => ({
        id: ins.label,
        logo_url: ins.img,
        name: ins.label,
        url: ins.url,
        provider: 'sophtron',
      })),
    };
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
      },
      {
        id: 'password',
        label: ins?.InstitutionDetail?.LoginFormPassword || 'Password',
      },
    ];
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
    switch ((request.initial_job_type || '').toLowerCase()) {
      case 'agg':
      case 'aggregation':
      case 'aggregate':
      case 'add':
      case 'utils':
      case 'util':
      case 'demo':
      case 'vc_transactions':
      case 'vc_transaction':
        ret = await this.apiClient.CreateUserInstitutionWithRefresh(
          username,
          password,
          entityId
        );
        break;
      case 'fullhistory':
        ret = await this.apiClient.CreateUserInstitutionWithFullHistory (
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
        ret = await this.apiClient.CreateUserInstitutionWithFullAccountNumbers(
          username,
          password,
          entityId
        );
        break;
      case 'identify':
      case 'vc_identity':
        ret = await this.apiClient.CreateUserInstitutionWithProfileInfo(
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
    await this.apiClient.UpdateUserInstitution(username, password, request.id);
    // todo: retrieve institutionId
    const ret = await this.apiClient.RefreshUserInstitution(request.id);
    return {
      id: ret.UserInstitutionID,
      cur_job_id: ret.JobID,
      institution_code: request.id, // TODO
    };
  }

  async GetConnectionById(connectionId: string): Promise<Connection> {
    const uins = await this.apiClient.getUserInstitutionById(connectionId);
    return {
      id: uins.UserInstitutionID,
      institution_code: uins.InstitutionID,
    };
  }

  async GetConnectionStatus(refrenceId: string): Promise<Connection> {
    const job = await this.apiClient.getJob(refrenceId);
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
    // console.log(job);
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
          challenge.type = ChallengeType.QUESTION;
          challenge.data = JSON.parse(job.SecurityQuestion).map(
            (q: string, i: number) => ({ key: `${i}`, value: q })
          );
        } else if (job.TokenMethod) {
          challenge.type = ChallengeType.OPTIONS;
          challenge.question =
            'Please select a channal to receive your secure code';
          challenge.data = JSON.parse(job.TokenMethod).map(
            (q: string, i: number) => ({ key: `${i}`, value: q })
          );
        } else if (job.TokenSentFlag === true) {
          challenge.type = ChallengeType.QUESTION;
          challenge.question = 'ota';
          challenge.data = [
            {
              key: '0',
              value: `Please Enter the ${job.TokenInputName || 'OTA code'}`,
            },
          ];
        } else if (job.TokenRead) {
          challenge.type = ChallengeType.TOKEN;
          challenge.question =
            'Please approve from you secure device with following token';
          challenge.data = job.TokenRead;
        } else if (job.CaptchaImage) {
          challenge.type = ChallengeType.IMAGE;
          challenge.question = 'Please enter the Captcha code';
          challenge.data = job.CaptchaImage;
          // TODO: select captcha
          // challenge.type = ChallengeType.IMAGE_OPTION
          // challenge.label = ''
        } else {
          status = ConnectionStatus.PENDING;
        }
        break;
    }
    return {
      id: job.UserInstitutionID,
      cur_job_id: job.JobID,
      status,
      challenges: challenge ? [challenge] : undefined,
    };
  }

  async AnswerChallenge(request: UpdateConnectionRequest): Promise<boolean> {
    const c = request.challenges![0]!;
    // console.log(c);
    switch (c.type) {
      case ChallengeType.TOKEN:
        await this.apiClient.jobTokenInput(request.id, null, null, true);
        break;
      case ChallengeType.IMAGE:
      case ChallengeType.IMAGE_OPTIONS:
        await this.apiClient.jobCaptchaInput(request.id, c.response);
        break;
      case ChallengeType.QUESTION:
        if (c.question === 'ota') {
          await this.apiClient.jobTokenInput(
            request.id,
            null,
            c.response,
            null
          );
        } else {
          await this.apiClient.jobSecurityAnswer(request.id, [c.response]);
        }
        break;
      case ChallengeType.OPTIONS:
        await this.apiClient.jobTokenInput(request.id, c.response, null, null);
        break;
      default:
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
          clearConnection(vc, connection_id);
          return vc;
        });
      return ret;
    }
    return null;
  }
}
