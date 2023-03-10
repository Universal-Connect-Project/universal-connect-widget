import {Credential, IConnectAPI, Member} from '../../shared/connect/contract'
import {
  Challenge,
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

const mxClient = new MxApi();
const sophtronClient = new SophtronApi();

function getApiClient(context?: Context | undefined): ProviderApiClient {
  switch (context?.provider) {
    case 'mx':
      return mxClient;
    case 'sophtron':
      return sophtronClient;
    default:
      return sophtronClient;
  }
}

function mapConnection(connection: Connection): Member{
  return {
    ...connection, 
    institution_guid: connection.institution_code, 
    guid: connection.id, 
    aggregation_status: connection.status,
    mfa: {
      credentials: connection.challenges?.map(c => ({
        guid: c.id,
        label: c.question,
        type: c.type
      }))
    }
  }
}

function mapInstitutionProvider(ins: Institution){
  let conf = config.ProviderMapping.find((i: any) => i.name === ins.name)
  if(conf){
    ins.provider = conf.provider
    ins.id = conf.id
  }
  return ins;
}

export class ConnectApi implements IConnectAPI{
  context: Context
  constructor(context: Context){
    this.context = context
  }

  async addMember(memberData: Member): Promise<{ member: Member; }> {
    let client = getApiClient(this.context);
    let connection = await client.CreateConnection({
      institution_id: memberData.institution_guid,
      credentials: memberData.credentials.map(c => ({
        id: c.guid,
        value: c.value
      }))
    });
    return {member: mapConnection(connection)}
  }
  async updateMember(member: Member): Promise<Member> {
    let client = getApiClient(this.context);
    if(member.mfa?.credentials?.length > 0){
      await client.AnswerChallenge({
        id: member.guid,
        challenges: member.mfa.credentials.map(c => ({
          id: c.guid,
          type: c.type,
          response: c.value
        }))
      })
    }else{
      let connection = await client.UpdateConnection({
        id: member.guid,
        credentials: member.credentials.map(c => ({
          id: c.guid,
          value: c.value
        }))
      })
      return mapConnection(connection);
    }
  }
  loadMembers(): Promise<Member[]> {
    let client = getApiClient(this.context);
    throw new Error('Method not implemented.');
  }
  async loadMemberByGuid(memberGuid: string): Promise<Member> {
    let client = getApiClient(this.context);
    //let connection = await client.GetConnectionById(memberGuid)
    let connection = await client.GetConnectionStatus(memberGuid)
    return mapConnection(connection);
  }
  async deleteMember(member: Member): Promise<void> {
    let client = getApiClient(this.context);
    await client.DeleteConnection(member.guid)
  }
  async getInstitutionCredentials(institution: Institution): Promise<Credential[]> {
    // loading credentials means the institution is selected. at this stage, use config to find the prefered provider.
    institution = mapInstitutionProvider(institution);
    let client = getApiClient({provider: this.context.provider = institution.provider});
    if(!institution.id){
      // in case if the config map is missing provider specific id, use name search to find it.
      // TODO: build a universal search service to provider proper id mappings and use it here.
      institution = (await client.SearchInstitutions(institution.name)).institutions?.[0]
      if(!institution){
        logger.error(`Unable to find institution by provider: ${institution.provider}, name: ${institution.name}`)
        return
      }
    }
    this.context.institution_id = institution.id
    let crs = await client.ListInstitutionCredentials(institution.id)
    return crs.map(c => ({
      guid: c.id,
      ...c
    }))
  }
  getMemberCredentials(memberGuid: string): Promise<Credential[]> {
    let client = getApiClient(this.context);
    throw new Error('Method not implemented.');
  }
  async loadInstitutions(query: string): Promise<Institution[]> {
    let client = getApiClient({provider: config.DefaultProvider});
    let list = await client.SearchInstitutions(query);
    return list.institutions;
  }
  async loadInstitutionByGuid(guid: string): Promise<Institution> {
    let client = getApiClient(this.context);
    let inst = await client.GetInstitutionById(guid)
    return inst
  }
  loadInstitutionByCode(code: string): Promise<Institution> {
    let client = getApiClient({provider: config.DefaultProvider});
    throw new Error('Method not implemented.');
  }
  async loadPopularInstitutions(query: string): Promise<Institution[]> {
    let client = getApiClient({provider: config.DefaultProvider});
    let list = await client.ListFavorateInstitutions()
    return list;
  }
  loadDiscoveredInstitutions(): Promise<Institution[]> {
    let client = getApiClient({provider: config.DefaultProvider});
    throw new Error('Method not implemented.');
  }

}