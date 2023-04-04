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
import type { InstitutionResponse } from '../mxClient';
import {
  Configuration,
  CredentialRequest,
  MxPlatformApiFactory,
} from '../mxClient';
import { mx as mxConfig } from './configuration';

function fromMxInstitution(ins: InstitutionResponse): Institution {
  return {
    id: ins.code!,
    logo_url: ins.medium_logo_url || ins.small_logo_url!,
    name: ins.name!,
    url: ins.url!,
    provider: 'mx',
  };
}

export class MxApi implements ProviderApiClient {
  
  apiClient = MxPlatformApiFactory(new Configuration(mxConfig));

  async GetInstitutionById(id: string): Promise<Institution> {
    const res = await this.apiClient.readInstitution(id);
    const ins = res.data.institution!;
    return fromMxInstitution(ins);
  }

  async ListInstitutionCredentials(
    institutionId: string
  ): Promise<Array<Credential>> {
    const res = await this.apiClient.listInstitutionCredentials(institutionId);
    // console.log('ListInstitutionCredentials')
    // console.log(res.data.credentials);
    return res.data.credentials!.map((item) => ({
      id: item.guid!,
      label: item.field_name!,
      field_type: item.field_type!,
      field_name: item.field_name!,
    }));
  }

  async CreateConnection(
    request: CreateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    // console.log(request);
    // console.log(userId)
    // console.log(mxConfig.demoMemberId)
    if ((request.institution_id === 'mxbank' || request.institution_id === 'mx_bank_oauth') && userId === mxConfig.demoUserId) {
      const existing = await this.apiClient.listMembers(userId);
      logger.info(`Deleting demo members: ${existing.data.members.length}`);
      await Promise.all(
        existing.data.members.map((m) =>
          this.apiClient.deleteMember(m.guid, userId)
        )
      );
    }
    const entityId = request.institution_id;
    // let res = await this.apiClient.listInstitutionCredentials(entityId);
    // console.log(request)
    const memberRes = await this.apiClient.createMember(userId, {
      member: {
        skip_aggregation: request.skip_aggregation || request.initial_job_type !== 'agg',
        is_oauth: request.is_oauth,
        credentials: request.credentials?.map(
          (c) =>
            <CredentialRequest>{
              guid: c.id,
              value: c.value,
            }
        ),
        institution_code: entityId,
      },
    });
    // console.log(ret.data)
    const member = memberRes.data.member!;
    // console.log(member)
    if (request.initial_job_type === 'verify') {
      await this.apiClient.verifyMember(member.id, userId);
    } else if (request.initial_job_type === 'identify') {
      await this.apiClient.identifyMember(member.id, userId);
    }
    return {
      id: member.guid!,
      cur_job_id: member.guid!,
      institution_code: entityId, // TODO
      is_oauth: member.is_oauth,
      oauth_window_uri: member.oauth_window_uri,
    };
  }

  async DeleteConnection(id: string, userId: string): Promise<void> {
    await this.apiClient.deleteManagedMember(id, userId);
  }

  async UpdateConnection(
    request: UpdateConnectionRequest,
    userId: string
  ): Promise<Connection> {
    // console.log("UpdateConnection")
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
    const member = ret.data.member!;
    return {
      id: member.id!,
      cur_job_id: member.guid!,
      // institution_code: entityId, //TODO
    };
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
    };
  }

  async GetConnectionStatus(
    memberId: string,
    userId: string
  ): Promise<Connection> {
    const res = await this.apiClient.readMemberStatus(memberId, userId);
    const member = res.data.member!;
    return {
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
            console.log(c)
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
    userId: string
  ): Promise<boolean> {
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
  GetVc(
    connection_id: string,
    vc_type: VcType,
    userId?: string
  ): Promise<object> {
    throw new Error('Method not implemented.');
  }
}
