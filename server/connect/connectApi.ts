import {Credential, Member, MemberResponse} from '../../shared/connect/contract'
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
import * as config from '../config';
import * as logger from '../infra/logger';
import { MxApi, SophtronApi } from '../serviceClients/providers';
const SearchClient = require('../serviceClients/searchClient');

const mxClient = new MxApi(false);
const mxIntClient = new MxApi(true);
const sophtronClient = new SophtronApi();
const searchApi = new SearchClient();

function getApiClient(context?: Context | undefined): ProviderApiClient {
  switch (context?.provider) {
    case 'mx':
      return mxClient;
    case 'mx_int':
      return mxIntClient;
    case 'sophtron':
      return sophtronClient;
    default:
      return config.DefaultProvider === 'sophtron' ? sophtronClient : mxClient;
  }
}

function mapInstitution(ins: Institution){
  return ({
    guid: ins.id,
    name: ins.name,
    url: ins.url?.trim(),
    logo_url: ins.logo_url?.trim(),
    instructional_data: {},
    credentials: [] as any[],
    supports_oauth: ins.name.indexOf('Oauth') >= 0,
    providers: ins.providers
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
    guid: connection.reference_id || connection.id, 
    connection_status: connection.status,
    most_recent_job_guid: connection.status === ConnectionStatus.CONNECTED ? null : connection.cur_job_id,
    is_oauth: connection.is_oauth,
    oauth_window_uri: connection.oauth_window_uri,
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
                label: d.value,
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

export class ConnectApi{
  // req: any
  context: Context
  constructor(req: any){
    this.context = req.context
  }
  async resolveInstitution(id: string): Promise<string>{
    // if(id === 'mxbank' || id === 'mx_bank_oauth'){
    //   this.context.provider = 'mx-int';
    //   this.context.institution_id = id
    //   return id;
    // }
    if (!this.context.provider || (this.context.institution_uid && this.context.institution_uid != id && this.context.institution_id != id)) {
      let resolved = await searchApi.resolve(id);
      if(resolved){
        logger.debug(`resolved institution ${id} to provider ${resolved.provider} ${resolved.target_id}`);
        this.context.provider = resolved.provider;
        this.context.institution_uid = id;
        id = resolved.target_id;
      }
    }
    if (!this.context.provider) {
      this.context.provider = config.DefaultProvider;
    }
    this.context.institution_id = id
    return id;
  }
  async addMember(memberData: Member): Promise<MemberResponse> {
    let client = getApiClient(this.context);
    let connection = await client.CreateConnection({
      institution_id: memberData.institution_guid,
      is_oauth: memberData.is_oauth,
      skip_aggregation: memberData.skip_aggregation && memberData.is_oauth,
      initial_job_type: 'agg',
      credentials: memberData.credentials?.map(c => ({
        id: c.guid,
        value: c.value
      }))
    }, this.context.user_id);
    return {member: mapConnection(connection)}
  }
  async updateMember(member: Member): Promise<MemberResponse> {
    let client = getApiClient(this.context);
    // console.log(member.credentials);
    if(member.credentials?.length > 0){
      await client.AnswerChallenge({
        id: member.guid,
        challenges: member.credentials.map(c => {
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
      }, this.context.user_id)
      return {member};
    }else{
      let connection = await client.UpdateConnection({
        id: member.guid,
        credentials: member.credentials.map(c => ({
          id: c.guid,
          value: c.value
        }))
      }, this.context.user_id)
      return {member};
    }
  }
  async loadMembers(): Promise<Member[]> {
    return []
  }
  async loadMemberByGuid(memberGuid: string): Promise<MemberResponse> {
    let client = getApiClient(this.context);
    // let connection = await client.GetConnectionById(memberGuid)
    let mfa = await client.GetConnectionStatus(memberGuid, this.context.user_id)
    return {member: mapConnection(mfa)};
  }
  async getOauthWindowUri(memberGuid: string){
    let ret = await this.loadMemberByGuid(memberGuid);
    return ret?.member?.oauth_window_uri;
  }
  async getOauthState(memberGuid: string){
    let client = getApiClient(this.context);
    let connection = await client.GetConnectionStatus(memberGuid, this.context.user_id)
    let ret = {
      inbound_member_guid: memberGuid,
      outbound_member_guid: memberGuid,
      guid: memberGuid,
      auth_status: connection.status === ConnectionStatus.PENDING ? 1 : ConnectionStatus.CONNECTED ? 2 : 3,
    } as any
    if(ret.auth_status === 3){
      ret.error_reason = connection.status
    }
    return {oauth_state: ret};
  }
  async getOauthStates(memberGuid: string){
    let state = await this.getOauthState(memberGuid);
    return {
      oauth_states: [
        state.oauth_state
      ]
    }
  }
  getMemberCredentials(memberGuid: string): Promise<Credential[]> {
    let client = getApiClient(this.context);
    throw new Error('Method not implemented.');
  }
  async deleteMember(member: Member): Promise<void> {
    let client = getApiClient(this.context);
    await client.DeleteConnection(member.guid, this.context.user_id)
  }
  async getInstitutionCredentials(guid: string): Promise<any> {
    // let id = await this.resolveInstitution(guid)
    let client = getApiClient(this.context);
    let crs = await client.ListInstitutionCredentials(guid)
    return {credentials: crs.map(c => ({
      ...c,
      guid: c.id,
      field_type: c.field_type === 'PASSWORD' ? 1 : 3,
    }))}
  }
  async loadInstitutions(query: string): Promise<any> {
    if (query?.length >= 3) {
      let list = await searchApi.institutions(query);
      return list?.institutions?.map(mapInstitution).sort((a:any,b:any) => a.name.length - b.name.length);
    }
    return []
  }
  async loadInstitutionByGuid(guid: string): Promise<any> {
    let id = await this.resolveInstitution(guid)
    // console.log(this.context);
    // console.log(id);
    let client = getApiClient(this.context);
    let inst = await client.GetInstitutionById(id)
    //let crs = await client.ListInstitutionCredentials(id)
    return {institution: mapInstitution(inst)};
  }
  // loadInstitutionByCode(code: string): Promise<Institution> {
  //   let client = getApiClient({provider: config.DefaultProvider});
  //   throw new Error('Method not implemented.');
  // }
  async loadPopularInstitutions(query: string) {
    let ret = await searchApi.institutions();
    return ret.institutions.map(mapInstitution)
  }
  async loadDiscoveredInstitutions(): Promise<Institution[]> {
    return []
  }

}

