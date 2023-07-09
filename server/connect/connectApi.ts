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
import { MxApi, SophtronApi, AkoyaApi, FinicityApi, DefaultApi } from '../serviceClients/providers';
const SearchClient = require('../serviceClients/searchClient');

const defaultClient = new DefaultApi();
const mxClient = new MxApi(false);
const mxIntClient = new MxApi(true);
const akoyaClient = new AkoyaApi(false);
const akoyaSandboxClient = new AkoyaApi(true);
const finicityClient = new FinicityApi(false);
const finicitySandboxClient = new FinicityApi(true);
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
    case 'akoya':
      return akoyaClient;
    case 'akoya_sandbox':
      return akoyaSandboxClient;
    case 'finicity':
      return finicityClient;
    case 'finicity_sandbox':
      return finicitySandboxClient;
    default:
      return defaultClient;
  }
}

function mapInstitution(ins: Institution, searchResult: any){
  // console.log(searchResult)
  // console.log(ins)
  const name = ins.name || searchResult.name;
  return ({
    guid: ins.id,
    name,
    url: searchResult?.url || ins.url?.trim(),
    logo_url: searchResult?.logo_url || ins.logo_url?.trim(),
    instructional_data: {},
    credentials: [] as any[],
    supports_oauth: ins.oauth || name?.indexOf('Oauth') >= 0,
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

export class ConnectApi{
  // req: any
  context: Context
  constructor(req: any){
    this.context = req.context
  }
  async resolveInstitution(id: string): Promise<any>{
    let ret = {
      id,
    } as any
    if (!this.context.provider || (this.context.institution_uid && this.context.institution_uid != id && this.context.institution_id != id)) {
      let resolved = await searchApi.resolve(id);
      if(resolved){
        logger.debug(`resolved institution ${id} to provider ${resolved.provider} ${resolved.target_id}`);
        this.context.provider = resolved.provider;
        this.context.institution_uid = id;
        ret.id = resolved.target_id;
        ret.url = resolved.url;
        ret.name = resolved.name;
        ret.logo_url = resolved.logo_url;
      }
    }
    if (!this.context.provider) {
      this.context.provider = config.DefaultProvider;
    }
    this.context.institution_id = ret.id
    return ret;
  }
  async addMember(memberData: Member): Promise<MemberResponse> {
    // console.log(this.context)
    let client = getApiClient(this.context);
    this.context.current_job_id = null;
    let connection = await client.CreateConnection({
      institution_id: memberData.institution_guid,
      is_oauth: memberData.is_oauth,
      skip_aggregation: memberData.skip_aggregation && memberData.is_oauth,
      initial_job_type: this.context.job_type || 'agg',
      credentials: memberData.credentials?.map(c => ({
        id: c.guid,
        value: c.value
      }))
    }, this.getUserId());
    this.context.current_job_id = connection.cur_job_id;
    return {member: mapConnection(connection)}
  }
  async updateMember(member: Member): Promise<MemberResponse> {
    let client = getApiClient(this.context);
    // console.log(member);
    if(this.context.current_job_id && member.credentials?.length > 0){
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
      }, this.context.current_job_id, this.getUserId())
      return {member};
    }else{
      let connection = await client.UpdateConnection({
        id: member.guid,
        credentials: member.credentials.map(c => ({
          id: c.guid,
          value: c.value
        }))
      }, this.getUserId())
      this.context.current_job_id = connection.cur_job_id;
      return {member};
    }
  }
  async loadMembers(): Promise<Member[]> {
    // let client = getApiClient(this.context);
    // const ret = await client.ListConnections(this.getUserId());
    // return ret.map(mapConnection)
    return []
  }
  async loadMemberByGuid(memberGuid: string): Promise<MemberResponse> {
    let client = getApiClient(this.context);
    // console.log(this.context)
    let mfa = await client.GetConnectionStatus(memberGuid, this.context.current_job_id, this.getUserId());
    if(!mfa?.institution_code){
      let connection = await client.GetConnectionById(memberGuid, this.getUserId());
      return {member: mapConnection({...mfa, ...connection})};
    }
    return {member: mapConnection({...mfa})};
  }
  async getOauthWindowUri(memberGuid: string){
    let ret = await this.loadMemberByGuid(memberGuid);
    return ret?.member?.oauth_window_uri;
  }
  async getOauthState(memberGuid: string){
    let client = getApiClient(this.context);
    let connection = await client.GetConnectionStatus(memberGuid, this.context.current_job_id, this.getUserId())
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
  async deleteMember(member: Member): Promise<void> {
    let client = getApiClient(this.context);
    await client.DeleteConnection(member.guid, this.getUserId())
  }
  async getMemberCredentials(memberGuid: string): Promise<any> {
    this.context.current_job_id = null;
    let client = getApiClient(this.context);
    const crs = await client.ListConnectionCredentials(memberGuid, this.getUserId());
    return {credentials: crs.map(c => ({
      ...c,
      guid: c.id,
      field_type: c.field_type === 'PASSWORD' ? 1 : 3,
    }))};
  }
  async getInstitutionCredentials(guid: string): Promise<any> {
    this.context.current_job_id = null;
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
    this.context.provider = null;
    // console.log(query)
    let q = query as any;
    if(q.search_name){
      query = q.search_name;
    }
    if (query?.length >= 3) {
      let list = await searchApi.institutions(query);
      // console.log(list)
      return list?.institutions?.map(mapInstitution).sort((a:any,b:any) => a.name.length - b.name.length);
    }
    return []
  }
  async loadInstitutionByGuid(guid: string): Promise<any> {
    let resolved = await this.resolveInstitution(guid)
    // console.log(this.context);
    // console.log(id);
    let client = getApiClient(this.context);
      let inst = await client.GetInstitutionById(resolved.id)
      return {institution: mapInstitution(inst, resolved)};
    //let crs = await client.ListInstitutionCredentials(id)
  }
  // loadInstitutionByCode(code: string): Promise<Institution> {
  //   let client = getApiClient({provider: config.DefaultProvider});
  //   throw new Error('Method not implemented.');
  // }
  async loadPopularInstitutions(query: string) {
    this.context.provider = null;
    let ret = await searchApi.institutions();
    return ret.institutions.map(mapInstitution)
  }
  async loadDiscoveredInstitutions(): Promise<Institution[]> {
    return []
  }
  async instrumentation(input: any){
    if(input.instrumentation.current_member_guid && input.instrumentation.current_provider){
      this.context.provider = input.instrumentation.current_provider;
    }
    this.context.job_type = input.instrumentation.job_type;
    this.context.user_id = input.instrumentation.user_id;
    if (!this.context.user_id) {
      if(config.Demo){
        logger.info(`Using demo userId`)
        this.context.user_id = 'Universal_widget_demo_user';
        return true
      }
      logger.info(`Missing demo userId`)
      return false;
    }
    return true
  }

  async handleOauthResponse(provider: string, rawParams: any, rawQueries: any, body: any){
    switch(provider){
      case 'akoya':
      case 'akoya_sandbox':
        let akoyaClient = getApiClient({provider});
        akoyaClient.UpdateConnection({...rawQueries, ...rawParams})
        break;
      case 'finicity':
      case 'finicity_sandbox':
        let finicityClient = getApiClient({provider});
        finicityClient.UpdateConnection({...rawQueries, ...rawParams, ...body})
        break;
      default: 
        return {
          provider,
          rawParams,
          rawQueries
        }
    }
    return 'ok';
    // switch(status){
    //   case 'success':
    //     break;
    //   case 'error':
    //     let client = getApiClient({provider});
    //     logger.info(`deleting connection on oauth error: ${connectionId}: ${reason}`);
    //     client.DeleteConnection(connectionId, 'user_id') // this is not going to work as there is not user_id passed on
    //     break;
    // }
  }
  ResolveUserId(id: string){
    let client = getApiClient(this.context);
    return client.ResolveUserId(id);
  }
  getUserId(): string{
    return this.context.resolved_user_id || this.getUserId();
  }
}

