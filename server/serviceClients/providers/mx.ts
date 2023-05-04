import type {
  Connection,
  CreateConnectionRequest,
  Credential,
  Institution,
  Institutions,
  ProviderApiClient,
  UpdateConnectionRequest,
  VcType,
} from '../../../shared/contract';
import {
  Challenge,
  ChallengeType,
  ConnectionStatus,
} from '../../../shared/contract';
import * as logger from '../../infra/logger';
import type { InstitutionResponse, CredentialResponse } from '../mxClient';
import {
  Configuration,
  CredentialRequest,
  CredentialsResponseBody,
  MxPlatformApiFactory,
  MemberResponseBody,
} from '../mxClient';
import { mxProd, mxInt } from './configuration';
import * as config from '../../config'

function fromMxInstitution(ins: InstitutionResponse, provider: string): Institution {
  return {
    id: ins.code!,
    logo_url: ins.medium_logo_url || ins.small_logo_url!,
    name: ins.name!,
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
  constructor(int: boolean){
    this.provider = int ? 'mx_int': this.provider;
    this.mxConfig = int ? mxInt: mxProd;
    this.apiClient = MxPlatformApiFactory(new Configuration(this.mxConfig));
  }
  async GetInstitutionById(id: string): Promise<Institution> {
    // console.log(this.mxConfig)
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
    userId = await this.resolveUserId(userId)
    const res = await this.apiClient.listMembers(userId);
    return res.data.members.map( (m) => fromMxInstitution(m, this.provider))
  }

  async ListConnectionCredentials(memberId: string, userId: string): Promise<Credential[]> {
    userId = await this.resolveUserId(userId)
    const res = await this.apiClient.listMemberCredentials(memberId, userId);
    return mapCredentials(res.data);
  }

  async CreateConnection(
    request: CreateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    // console.log(request);
    // console.log(userId)
    // console.log(this.mxConfig)
    userId = await this.resolveUserId(userId);
    const entityId = request.institution_id;
    const existings = await this.apiClient.listMembers(userId);
    const existing = existings.data.members.find(m => m.institution_code === entityId)
    if(existing){
      logger.info(`Found existing member for institution ${entityId}, reusing`)
      return this.UpdateConnectionInternal({
        id: existing.guid,
        ...request,
      }, userId)
    }
    // let res = await this.apiClient.listInstitutionCredentials(entityId);
    // console.log(request)
    const memberRes = await this.apiClient.createMember(userId, {
      referral_source: 'APP', //request.is_oauth ? 'APP' : '',
      client_redirect_url: request.is_oauth ? `${config.HostUrl}/oauth/${this.provider}/redirect_from` : null,
      member: {
        skip_aggregation: request.skip_aggregation || request.initial_job_type !== 'agg',
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
    userId = await this.resolveUserId(userId);
    await this.apiClient.deleteManagedMember(id, userId);
  }

  async UpdateConnection(
    request: UpdateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    // console.log("UpdateConnection")
    userId = await this.resolveUserId(userId);
    const ret = await this.UpdateConnectionInternal(request, userId);
    return ret;
  }

  async UpdateConnectionInternal(
    request: UpdateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    const ret = await this.apiClient.updateMember(request.id!, userId, {
      member: {
        credentials: request.credentials.map(
          (c) =>
            <CredentialRequest>{
              guid: c.id,
              value: c.value,
            }
        ),
      },
    });
    return fromMxMember(ret.data, this.provider);
  }

  async GetConnectionById(
    connectionId: string,
    userId: string
  ): Promise<Connection> {
    userId = await this.resolveUserId(userId);
    const res = await this.apiClient.readMember(connectionId, userId);
    const member = res.data.member!;
    return {
      id: member.guid!,
      institution_code: member.institution_code,
      provider: this.provider
    };
  }

  async GetConnectionStatus(
    memberId: string,
    jobId: string,
    userId: string
  ): Promise<Connection> {
    userId = await this.resolveUserId(userId);
    const res = await this.apiClient.readMemberStatus(memberId, userId);
    const member = res.data.member!;
    // console.log(member);
    return {
      provider: this.provider,
      id: member.guid!,
      cur_job_id: member.guid!,
      status:
        ConnectionStatus[
          member.connection_status! as keyof typeof ConnectionStatus
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
    userId = await this.resolveUserId(userId);
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

  /* eslint-disable unused-imports/no-unused-vars */
  async GetVc(
    connection_id: string,
    vc_type: VcType,
    userId?: string
  ): Promise<object> {
    userId = await this.resolveUserId(userId);
    throw new Error('Method not implemented.');
  }

  async resolveUserId(user_id: string){
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

}
