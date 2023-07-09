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

import * as logger from '../../infra/logger';


export class DefaultApi implements ProviderApiClient {
  constructor() {
  }

  async GetInstitutionById(id: string): Promise<Institution> {
    throw new Error('Invalid operation in default api client')
  }

  async ListInstitutionCredentials(id: string): Promise<Array<Credential>> {
    throw new Error('Invalid operation in default api client')
  }

  async ListConnectionCredentials(connectionId: string, userId: string): Promise<Credential[]> {
    throw new Error('Invalid operation in default api client')
  }

  ListConnections(userId: string): Promise<Connection[]> {
    throw new Error('Invalid operation in default api client')
  }

  async CreateConnection(
    request: CreateConnectionRequest,
    user_id: string
  ): Promise<Connection | undefined> {
    throw new Error('Invalid operation in default api client')
  }

  DeleteConnection(id: string): Promise<void> {
    throw new Error('Invalid operation in default api client')
  }

  async UpdateConnection(
    request: UpdateConnectionRequest
  ): Promise<Connection> {
    throw new Error('Invalid operation in default api client')
  }

  GetConnectionById(connectionId: string): Promise<Connection> {
    throw new Error('Invalid operation in default api client')
  }

  async GetConnectionStatus(connectionId: string, jobId: string): Promise<Connection> {
    throw new Error('Invalid operation in default api client')
  }

  async AnswerChallenge(request: UpdateConnectionRequest, jobId: string): Promise<boolean> {
    throw new Error('Invalid operation in default api client')
  }

  async ResolveUserId(user_id: string){
    return null as any;
  }

  async GetVc(
    connection_id: string,
    type: VcType,
    userId?: string
  ): Promise<object> {
    throw new Error('Invalid operation in default api client')
  }
}