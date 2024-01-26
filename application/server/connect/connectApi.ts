import {Credential, Member, MemberResponse} from 'interfaces/contract'
import {
  Challenge,
  ChallengeType,
  Connection,
  ConnectionStatus,
  Context,
  Institution,
  ProviderApiClient,
  VcType,
} from '../../shared/contract';
import * as logger from '../infra/logger';

import { ProviderApiBase } from '../providers';

function mapInstitution(ins: Institution){
  return ({
    guid: ins.id,
    code: ins.id,
    name: ins.name,
    url: ins.url,
    logo_url: ins.logo_url,
    instructional_data: {},
    credentials: [] as any[],
    supports_oauth: ins.oauth || ins.name?.indexOf('Oauth') >= 0,
    providers: ins.providers,
    provider: ins.provider
    // credentials: credentials?.map((c: any) => ({
    //   guid: c.id,
    //   ...c
    // }))
  });
}

function mapConnection(connection: Connection): Member{
  return {
    //...connection, 
    institution_guid: connection.institution_code, 
    guid: connection.id, 
    connection_status: connection.status || ConnectionStatus.CREATED, //?
    most_recent_job_guid: connection.status === ConnectionStatus.CONNECTED ? null : connection.cur_job_id,
    is_oauth: connection.is_oauth,
    oauth_window_uri: connection.oauth_window_uri,
    provider: connection.provider,
    is_being_aggregated: connection.is_being_aggregated,
    user_guid: connection.user_id,
    mfa: {
      credentials: connection.challenges?.map(c => {
          let ret = {
            guid: c.id,
            credential_guid: c.id,
            label: c.question,
            type: c.type,
            options: [] as any[]
          } as any;
          switch(c.type){
            case ChallengeType.QUESTION:
              ret.type = 0;
              ret.label = (c.data as any[])?.[0].value || c.question;
              break;
            case ChallengeType.TOKEN:
              ret.type = 2; // ?
              ret.label = `${c.question}: ${c.data}`
              break;
            case ChallengeType.IMAGE:
              ret.type = 13;
              ret.meta_data = (c.data as string).startsWith('data:image') ? c.data : ('data:image/png;base64, ' + c.data);
              break;
            case ChallengeType.OPTIONS:
              ret.type = 2;
              ret.options = (c.data as any[]).map(d => ({
                guid: d.key,
                label: d.key,
                value: d.value,
                credential_guid: c.id
              }));
              break;
            case ChallengeType.IMAGE_OPTIONS:
              ret.type = 14;
              ret.options = (c.data as any[]).map(d => ({
                guid: d.key,
                label: d.key,
                data_uri: d.value,
                credential_guid: c.id
              }));
              break;
          }
          return ret;
        }
      )
    }
  } as any
}

export class ConnectApi extends ProviderApiBase{
  constructor(req: any){
    super(req)
  }

  async addMember(memberData: Member): Promise<MemberResponse> {
    let connection = await this.createConnection({
      institution_id: memberData.institution_guid,
      is_oauth: memberData.is_oauth,
      skip_aggregation: memberData.skip_aggregation && memberData.is_oauth,
      initial_job_type: this.context.job_type || 'agg',
      credentials: memberData.credentials?.map(c => ({
        id: c.guid,
        value: c.value
      }))
    });
    return {member: mapConnection(connection)}
  }

  async updateMember(member: Member): Promise<MemberResponse> {
    // console.log(member);
    // console.log(member.mfa);
    if(this.context.current_job_id && member.credentials?.length > 0){
      await this.answerChallenge(
        member.guid,
        member.credentials.map(c => {
          let ret = {
            id: c.guid,
            type: c.type,
            response: c.value
          };
          let challenge = member.mfa.credentials.find(m => m.guid === c.guid) // widget posts everything back
          // console.log(challenge)
          // console.log(ret)
          switch(challenge.type){
            case 0:
              ret.type = ChallengeType.QUESTION
              break;
            case 13:
              ret.type = ChallengeType.IMAGE
              break;
            case 2:
              ret.type = c.value ? ChallengeType.OPTIONS : ChallengeType.TOKEN
              if(c.value){
                ret.response = challenge.options.find((o:any) => o.guid === c.value)?.value
                if(!ret.response){
                  logger.error('Unexpected challege option: ${c.value}', challenge)
                }
              }
              break;
          }
          return ret;
        })
      )
      return {member};
    }else{
      let connection = await this.updateConnection({
        job_type: this.context.job_type,
        id: member.guid,
        credentials: member.credentials.map(c => ({
          id: c.guid,
          value: c.value
        }))
      })
      return {member: mapConnection(connection)};
    }
  }
  async loadMembers(): Promise<Member[]> {
    if(this.context.connection_id){
      let focusedMember = await this.getConnection(this.context.connection_id);
      return [mapConnection(focusedMember)];
    }
    return []
  }
  async loadMemberByGuid(memberGuid: string): Promise<MemberResponse> {
    let mfa = await this.getConnectionStatus(memberGuid);
    if(!mfa?.institution_code){
      let connection = await this.getConnection(memberGuid);
      return {member: mapConnection({...mfa, ...connection})};
    }
    return {member: mapConnection({...mfa})};
  }
  async getOauthWindowUri(memberGuid: string){
    let ret = await this.loadMemberByGuid(memberGuid);
    return ret?.member?.oauth_window_uri;
  }

  async deleteMember(member: Member): Promise<void> {
    await this.deleteConnection(member.guid)
  }

  async getMemberCredentials(memberGuid: string): Promise<any> {
    const crs = await this.getConnectionCredentials(memberGuid);
    return {credentials: crs.map(c => ({
      ...c,
      guid: c.id,
      field_type: c.field_type === 'PASSWORD' ? 1 : 3,
    }))};
  }

  async getInstitutionCredentials(guid: string): Promise<any> {
    let crs = await super.getInstitutionCredentials(guid);
    return {credentials: crs.map(c => ({
      ...c,
      guid: c.id,
      field_type: c.field_type === 'PASSWORD' ? 1 : 3,
    }))}
  }

  async loadInstitutions(query: string): Promise<any> {
    const ret = await this.search(query);
    return ret.map(mapInstitution);
  }

  async loadInstitutionByGuid(guid: string): Promise<any> {
    let inst = await this.getInstitution(guid)
    return {institution: mapInstitution(inst)};
  }

  // loadInstitutionByCode(code: string): Promise<Institution> {
  //   let client = getApiClient({provider: config.DefaultProvider});
  //   throw new Error('Method not implemented.');
  // }

  async loadPopularInstitutions(query: string) {
    this.context.updated = true;
    this.context.provider = null;
    let ret = await this.institutions();
    return ret.institutions.map(mapInstitution)
  }

  async loadDiscoveredInstitutions(): Promise<Institution[]> {
    return []
  }
}