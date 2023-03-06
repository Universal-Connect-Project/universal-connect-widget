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

export class ConnectApi implements IConnectAPI{
  
  async addMember(memberData: Member): Promise<{ member: Member; }> {
    let client = getApiClient();
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
    let client = getApiClient();
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
    let client = getApiClient();
    throw new Error('Method not implemented.');
  }
  async loadMemberByGuid(memberGuid: string): Promise<Member> {
    let client = getApiClient();
    //let connection = await client.GetConnectionById(memberGuid)
    let connection = await client.GetConnectionStatus(memberGuid)
    return mapConnection(connection);
  }
  async deleteMember(member: Member): Promise<void> {
    let client = getApiClient();
    await client.DeleteConnection(member.guid)
  }
  async getInstitutionCredentials(institutionGuid: string): Promise<Credential[]> {
    let client = getApiClient();
    let crs = await client.ListInstitutionCredentials(institutionGuid)
    return crs.map(c => ({
      guid: c.id,
      ...c
    }))
  }
  getMemberCredentials(memberGuid: string): Promise<Credential[]> {
    let client = getApiClient();
    throw new Error('Method not implemented.');
  }
  async loadInstitutions(query: string): Promise<Institution[]> {
    let client = getApiClient();
    let list = await client.SearchInstitutions(query);
    return list.institutions;
  }
  async loadInstitutionByGuid(guid: string): Promise<Institution> {
    let client = getApiClient();
    let inst = await client.GetInstitutionById(guid)
    return inst
  }
  loadInstitutionByCode(code: string): Promise<Institution> {
    let client = getApiClient();
    throw new Error('Method not implemented.');
  }
  loadPopularInstitutions(query: string): Promise<Institution[]> {
    let client = getApiClient();
    return client.ListFavorateInstitutions()
  }
  loadDiscoveredInstitutions(): Promise<Institution[]> {
    let client = getApiClient();
    throw new Error('Method not implemented.');
  }

}

export const connectService = new ConnectApi();