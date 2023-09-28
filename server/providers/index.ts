import { MxApi } from './mx';
import { SophtronApi } from './sophtron';
import { AkoyaApi } from './akoya';
import { FinicityApi } from './finicity';
import * as config from '../config';
import * as logger from '../infra/logger';
import {
  Challenge,
  ChallengeType,
  Credential,
  Connection,
  ConnectionStatus,
  Context,
  Institution,
  ProviderApiClient,
  VcType,
  CreateConnectionRequest,
  UpdateConnectionRequest,
} from '../../shared/contract';
import { AnalyticsClient } from '../serviceClients/analyticsClient';
import { SearchClient } from '../serviceClients/searchClient';
import { AuthClient } from '../serviceClients/authClient';
import { StorageClient } from'../serviceClients/storageClient';
import { decodeAuthToken } from '../utils';

const searchApi = new SearchClient();

function getApiClient(provider: string, config: any): ProviderApiClient {
  //console.log(config)
  switch (provider) {
    case 'mx':
      return new MxApi(config, false);
    case 'mx_int':
      return new MxApi(config, true);
    case 'sophtron':
      return new SophtronApi(config);
    case 'akoya':
      return new AkoyaApi(config, false);
    case 'akoya_sandbox':
      return new AkoyaApi(config, true);
    case 'finicity':
      return new FinicityApi(config, false);
    case 'finicity_sandbox':
      return new FinicityApi(config, true);
    default:
      //throw new Error(`Unsupported provider ${provider}`);
      return null;
  }
}

export async function instrumentation(context: Context, input: any){
  const {user_id} = input;
  context.user_id = user_id;
  if (!user_id || user_id === 'undefined' || user_id === 'test') {
    if(config.Demo){
      logger.info(`Using demo userId`)
      context.user_id = 'Universal_widget_demo_user';
    }else{
      logger.info(`Missing userId`)
      return false;
    }
  }
  if(input.current_member_guid && input.current_provider){
    context.provider = input.current_provider;
  }
  if(input.auth){
    context.auth = decodeAuthToken(input.auth);
  }
  context.job_type = input.job_type || 'agg';
  context.single_account_select = input.single_account_select;
  return true
}

export class ProviderApiBase{
  context: Context
  serviceClient: ProviderApiClient
  analyticsClient: AnalyticsClient;
  constructor(req: any){
    this.context = req.context;
  }

  async init(){
    if(this.context.auth?.token){
      const {iv, token} = this.context.auth;
      const storageClient = new StorageClient(token);
      this.analyticsClient = new AnalyticsClient(token);
      if(iv){
        try{
          const authApi = new AuthClient(token);
          let conf = await authApi.getSecretExchange(iv)
          conf.sophtron.token = token;
          conf.token = token;
          this.serviceClient = getApiClient(this.context?.provider, {
            ...conf,
            storageClient
          });
          return true;
        }catch(err){
          logger.error('Error parsing auth token', err)
        }
      }
    }
    // else if(config.Demo){
    //   logger.info('Loading default credentials for demo')
    //   this.serviceClient = getApiClient(this.context?.provider, Config);
    //   return true;
    // }
    logger.warning('invalid auth token');
    return false;
  }

  institutions() {
    return searchApi.institutions();
  }

  async search(query: string) {
    this.context.provider = null;
    let q = query as any;
    if(q.search_name){
      query = q.search_name;
    }
    if (query?.length >= 3) {
      let list = await searchApi.institutions(query);
      return list?.institutions?.sort((a:any,b:any) => a.name.length - b.name.length);
    }
    return []
  }

  async resolveInstitution(id: string): Promise<Institution>{
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
    await this.init()
    this.context.institution_id = ret.id
    this.context.resolved_user_id = null;
    return ret;
  }

  async getInstitution(guid: string): Promise<any> {
    let resolved = await this.resolveInstitution(guid)
    let inst = await this.serviceClient.GetInstitutionById(resolved.id)
    if(inst){
      inst.name = resolved.name || inst.name;
      inst.url = resolved?.url || inst.url?.trim();
      inst.logo_url = resolved?.logo_url || inst.logo_url?.trim();
    }
    return inst;
  }
  
  getInstitutionCredentials(guid: string): Promise<Credential[]> {
    this.context.current_job_id = null;
    // let id = await this.resolveInstitution(guid)
    return this.serviceClient.ListInstitutionCredentials(guid)
  }

  getConnection(connection_id: string): Promise<Connection> {
    return this.serviceClient.GetConnectionById(connection_id, this.getUserId());
  }
  
  getConnectionStatus(connection_id: string): Promise<Connection> {
    return this.serviceClient.GetConnectionStatus(connection_id, this.context.current_job_id, this.context.single_account_select, this.getUserId());
  }
  
  async createConnection(connection: CreateConnectionRequest): Promise<Connection> {
    // console.log(this.context)
    this.context.current_job_id = null;
    let ret = await this.serviceClient.CreateConnection(connection, this.getUserId());
    this.context.current_job_id = ret.cur_job_id;
    return ret;
  }

  async updateConnection(connection: UpdateConnectionRequest): Promise<Connection> {
    let ret = await this.serviceClient.UpdateConnection(connection, this.getUserId());
    this.context.current_job_id = ret.cur_job_id;
    return ret;
  }

  answerChallenge(connection_id: string, challenges: Array<Challenge>) {
    return this.serviceClient.AnswerChallenge(
      {
        id: connection_id || this.context.connection_id,
        challenges,
      },
      this.context.current_job_id,
      this.getUserId()
    );
  }

  async getOauthWindowUri(memberGuid: string){
    let ret = await this.getConnection(memberGuid);
    return ret?.oauth_window_uri;
  }

  async getOauthState(connection_id: string){
    let connection = await this.getConnectionStatus(connection_id)
    let ret = {
      guid: connection_id,
      inbound_member_guid: connection_id,
      outbound_member_guid: connection_id,
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

  async deleteConnection(connection_id: string): Promise<void> {
    await this.serviceClient.DeleteConnection(connection_id, this.getUserId())
  }

  async getConnectionCredentials(memberGuid: string): Promise<Credential[]> {
    this.context.current_job_id = null;
    return this.serviceClient.ListConnectionCredentials(memberGuid, this.getUserId());
  }

  ResolveUserId(id: string){
    return this.serviceClient?.ResolveUserId(id);
  }

  getUserId(): string{
    return this.context.resolved_user_id;
  }

  static async handleOauthResponse(provider: string, rawParams: any, rawQueries: any, body: any){
    switch(provider){
      case 'akoya':
      case 'akoya_sandbox':
        await AkoyaApi.HandleOauthResponse({...rawQueries, ...rawParams})
        break;
      case 'finicity':
      case 'finicity_sandbox':
        await FinicityApi.HandleOauthResponse({...rawQueries, ...rawParams, ...body})
        break;
      case 'mx':
      case 'mx_int':
        await MxApi.HandleOauthResponse({...rawQueries, ...rawParams, ...body})
        break;
      default: 
        return {
          provider,
          rawParams,
          rawQueries
        }
    }
    return 'ok';
  }

  analytics(path: string, content: any){
    this.analyticsClient?.analytics(path.replaceAll('/', ''), content);
  }
}