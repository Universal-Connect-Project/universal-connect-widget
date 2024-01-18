import type {
  Connection,
  CreateConnectionRequest,
  Credential,
  Institution,
  Institutions,
  ProviderApiClient,
  UpdateConnectionRequest,
  VcType,
} from '../../shared/contract';
import {
  Challenge,
  ChallengeType,
  ConnectionStatus,
} from '../../shared/contract';
import * as logger from '../infra/logger';
import type { InstitutionResponse, CredentialResponse } from '../serviceClients/mxClient';
import {
  Configuration,
  CredentialRequest,
  CredentialsResponseBody,
  MxPlatformApiFactory,
  MemberResponseBody,
} from '../serviceClients/mxClient';
import * as config from '../config'
import { StorageClient } from'../serviceClients/storageClient';

function fromMxInstitution(ins: InstitutionResponse, provider: string): Institution {
  return {
    id: ins.code!,
    logo_url: ins.medium_logo_url || ins.small_logo_url!,
    name: ins.name!,
    oauth: ins.supports_oauth!,
    url: ins.url!,
    provider,
  };
}

function mapCredentials(mxCreds : CredentialsResponseBody) : Credential[]{
  return mxCreds.credentials?.map(item => ({
    id: item.guid!,
    label: item.field_name!,
    field_type: item.field_type!,
    field_name: item.field_name!,
  })) || [];
}

function fromMxMember(mxRes: MemberResponseBody, provider: string): Connection{
  let member = mxRes.member;
  return {
    id: member.guid!,
    cur_job_id: member.guid!,
    //institution_code: entityId, // TODO
    institution_code: member.institution_code, // TODO
    is_oauth: member.is_oauth,
    oauth_window_uri: member.oauth_window_uri,
    provider,
  };
}

export class MxApi implements ProviderApiClient {
  apiClient: ReturnType<typeof MxPlatformApiFactory> ;
  mxConfig: any;
  provider: string;
  token: string;
  db: StorageClient;

  constructor(config: any, int: boolean){
    const {mxInt, mxProd, token} = config;
    this.token = token;
    this.db = new StorageClient(token);
    this.provider = int ? 'mx_int': 'mx';
    this.mxConfig = int ? mxInt: mxProd;
    this.apiClient = MxPlatformApiFactory(new Configuration({
      ...this.mxConfig,
      baseOptions: {
        headers: {
          Accept: 'application/vnd.mx.api.v1+json',
        },
      },
    }));
  }
  async GetInstitutionById(id: string): Promise<Institution> {
    const res = await this.apiClient.readInstitution(id);
    const ins = res.data.institution!;
    return fromMxInstitution(ins, this.provider);
  }

  async ListInstitutionCredentials(
    institutionId: string
  ): Promise<Array<Credential>> {
    // console.log(this.mxConfig)
    const res = await this.apiClient.listInstitutionCredentials(institutionId);
    return mapCredentials(res.data);
  }

  async ListConnections(userId: string): Promise<Connection[]> {
    const res = await this.apiClient.listMembers(userId);
    return res.data.members.map( (m) => fromMxInstitution(m, this.provider))
  }

  async ListConnectionCredentials(memberId: string, userId: string): Promise<Credential[]> {
    const res = await this.apiClient.listMemberCredentials(memberId, userId);
    return mapCredentials(res.data);
  }

  async CreateConnection(
    request: CreateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    const entityId = request.institution_id;
    const existings = await this.apiClient.listMembers(userId);
    const existing = existings.data.members.find(m => m.institution_code === entityId)
    if(existing){
      logger.info(`Found existing member for institution ${entityId}, deleting`)
      await this.apiClient.deleteMember(existing.guid, userId)
      // return this.UpdateConnectionInternal({
      //   id: existing.guid,
      //   ...request,
      // }, userId)
    }
    // let res = await this.apiClient.listInstitutionCredentials(entityId);
    // console.log(request)
    const memberRes = await this.apiClient.createMember(userId, {
      referral_source: 'APP', //request.is_oauth ? 'APP' : '',
      client_redirect_url: request.is_oauth ? `${config.HostUrl}/oauth/${this.provider}/redirect_from?token=${this.token}` : null,
      member: {
        skip_aggregation: request.skip_aggregation || request.initial_job_type === 'verify' || request.initial_job_type === 'identify',
        is_oauth: request.is_oauth,
        credentials: request.credentials?.map(
          (c) => <CredentialRequest>{
              guid: c.id,
              value: c.value,
            }
        ),
        institution_code: entityId,
      },
    } as any);
    //console.log(memberRes)
    const member = memberRes.data.member!;
    // console.log(member)
    if (request.initial_job_type === 'verify') {
      await this.apiClient.verifyMember(member.id, userId);
    } else if (request.initial_job_type === 'identify') {
      await this.apiClient.identifyMember(member.id, userId);
    }
    return fromMxMember(memberRes.data, this.provider);
  }

  async DeleteConnection(id: string, userId: string): Promise<void> {
    await this.apiClient.deleteManagedMember(id, userId);
  }

  async UpdateConnection(
    request: UpdateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    const ret = await this.UpdateConnectionInternal(request, userId);
    if (request.job_type === 'verify') {
      await this.apiClient.verifyMember(request.id, userId);
    } else if (request.job_type === 'identify') {
      await this.apiClient.identifyMember(request.id, userId);
    }else{
      await this.apiClient.aggregateMember(request.id, userId);
    }
    return ret;
  }

  async UpdateConnectionInternal(
    request: UpdateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    const ret = await this.apiClient.updateMember(request.id!, userId, {
      member: {
        credentials: request.credentials?.map(
          (c) =>
            <CredentialRequest>{
              guid: c.id,
              value: c.value,
            }
        ) || [],
      },
    }) ;
    return fromMxMember(ret.data, this.provider);
  }

  async GetConnectionById(
    connectionId: string,
    userId: string
  ): Promise<Connection> {
    const res = await this.apiClient.readMember(connectionId, userId);
    const member = res.data.member!;
    return {
      id: member.guid!,
      institution_code: member.institution_code,
      is_oauth: member.is_oauth,
      oauth_window_uri: member.oauth_window_uri,
      provider: this.provider,
      user_id: userId
    };
  }

  async GetConnectionStatus(
    memberId: string,
    jobId: string,
    single_account_select: boolean,
    userId: string
  ): Promise<Connection> {
    const res = await this.apiClient.readMemberStatus(memberId, userId);
    const member = res.data.member!;
    let status = member.connection_status!;
    const oauthStatus = await this.db.get(member.guid);
    if(oauthStatus?.error){
      status = ConnectionStatus[ConnectionStatus.REJECTED];
    }
    return {
      provider: this.provider,
      id: member.guid!,
      cur_job_id: member.guid!,
      user_id: userId,
      // is_oauth: member.is_oauth,
      // oauth_window_uri: member.oauth_window_uri,
      // status: member.connection_status,
      // error_reason: oauthStatus?.error_reason,
      status:
        ConnectionStatus[
          status! as keyof typeof ConnectionStatus
        ],
      challenges: (member.challenges || []).map((item, idx) => {
        const c: Challenge = {
          id: item.guid || `${idx}`,
          type: ChallengeType.QUESTION,
          question: item.label,
        };
        switch (item.type) {
          case 'TEXT':
            c.type = ChallengeType.QUESTION;
            c.data = [{ key: `${idx}`, value: item.label }];
            break;
          case 'OPTIONS':
            c.type = ChallengeType.OPTIONS;
            c.question = item.label;
            c.data = (item.options || []).map((o) => ({
              key: o.label || o.value!,
              value: o.value,
            }));
            break;
          case 'TOKEN':
            c.type = ChallengeType.TOKEN;
            c.data = item.label;
            break;
          case 'IMAGE_DATA':
            c.type = ChallengeType.IMAGE;
            c.data = item.image_data;
            break;
          case 'IMAGE_OPTIONS':
            // console.log(c)
            c.type = ChallengeType.IMAGE_OPTIONS;
            c.data = (item.image_options || []).map((io) => ({
              key: io.label || io.value!,
              value: io.data_uri || io.value,
            }));
            break;
          default:
            break; // todo?
        }
        return c;
      }),
    };
  }

  async AnswerChallenge(
    request: UpdateConnectionRequest,
    jobId: string,
    userId: string
  ): Promise<boolean> {
    console.log(request)
    const res = await this.apiClient.resumeAggregation(request.id!, userId, {
      member: {
        challenges: request.challenges!.map((item, idx) => ({
          guid: item.id || `${idx}`,
          value: <string>item.response,
        })),
      },
    });
    return !!res;
  }

  async ResolveUserId(user_id: string){
    logger.debug('Resolving UserId: ' + user_id);
    let res = await this.apiClient.listUsers(1, 10, user_id);
    const mxUser = res.data?.users?.find(u => u.id === user_id)
    if(mxUser){
      logger.trace(`Found existing mx user ${mxUser.guid}`)
      return mxUser.guid
    }
    logger.trace(`Creating mx user ${user_id}`)
    let ret = await this.apiClient.createUser({
      user: {id: user_id,}
    })
    if(ret?.data?.user){
      return ret.data.user.guid
    }
    logger.trace(`Failed creating mx user, using user_id: ${user_id}`)
    return user_id;
  }

  static async HandleOauthResponse(request: any): Promise<Connection> {
    const { member_guid, status, error_reason, token } = request;
    if(status === 'error'){
      const db = new StorageClient(token);
      await db.set(member_guid, {
        error: true,
        error_reason
      })
    }
    return {
      id: member_guid,
      status: status === 'error' ? ConnectionStatus.REJECTED : status === 'success' ? ConnectionStatus.CONNECTED : ConnectionStatus.PENDING 
    };
  }
}
