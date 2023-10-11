import {
  Challenge,
  Connection,
  ConnectionStatus,
  Context,
  Institution,
  ProviderApiClient,
  Credential,
  VcType,
} from '../../shared/contract';
import * as config from '../config';
import * as logger from '../infra/logger';
import { MxApi, SophtronApi } from '../providers';

const SearchClient = require('./searchClient');
const searchApi = new SearchClient();

function getApiClient(context: Context): ProviderApiClient {
  switch (context?.provider) {
    case 'mx':
      return new MxApi(false);
    case 'sophtron':
    default:
      return new SophtronApi(context.token);
  }
}

export async function search(query: string, _: Context) {
  const list = await searchApi.institutions(query);
  return list;
}
export function getConnection(
  connection_id: string,
  context: Context
): Promise<Connection> {
  const client = getApiClient(context);
  return client.GetConnectionById(connection_id);
}
export function getInstitution(guid: string, context: Context): Promise<Institution>{
  const client = getApiClient(context);
  return client.GetInstitutionById(guid);
}
export function getInstitutionCredentials(guid: string, context: Context): Promise<Credential[]>{
  const client = getApiClient(context);
  return client.ListInstitutionCredentials(guid);
}

export async function login(
  institution_id: string,
  connection_id: string | null,
  credentials: Array<Credential>,
  context: Context
) {
  // console.log(context);
  // console.log(institution_id);
  // console.log(connection_id);
  const client = getApiClient(context);
  institution_id = context.institution_id || institution_id;
  connection_id = context.connection_id || connection_id;
  if (connection_id) {
    const res = await client.UpdateConnection(
      {
        id: connection_id,
        credentials,
      },
      context.user_id
    );
    return res;
  }
  if (institution_id) {
    const res = await client.CreateConnection(
      {
        institution_id,
        credentials,
        initial_job_type: context.job_type,
      },
      context.user_id
    );
    if (res) {
      return res;
    }
    logger.error(
      `failed creating connection with instituionId : ${institution_id}`
    );
    return {
      error: `failed creating connection with instituionId : ${institution_id}`,
    };
  }
  return { error: 'Unable to find instituion, invalid parameters provided' };
}
export async function mfa(job_id: string, context: Context) {
  const client = getApiClient(context);
  const res = await client.GetConnectionStatus(job_id, context.user_id);
  if (!res) {
    logger.warning(`Mfa failed to find connection with Id: ${job_id}`);
    return { error: 'Failed to find job' };
  }
  res.provider = context.provider;
  if (res.status === ConnectionStatus.CONNECTED) {
    logger.debug('mfa finishing, checking vc', context)
    if (
      context.job_type?.startsWith('vc_') &&
      context.user_id.startsWith('did:')
    ) {
      // notify vc service about a connection that belongs to the user_id
      let vcType = VcType.IDENTITY;
      switch (context.job_type) {
        case 'vc_accounts':
        case 'vc_account':
          vcType = VcType.ACCOUNTS;
          break;
        case 'vc_transactions':
        case 'vc_transaction':
          vcType = VcType.TRANSACTIONS;
          break;
        default:
          break;
      }
      for (let i = 0; i < 3; i++) {
        try {
          /* eslint-disable no-await-in-loop */
          const vc = await this.getVC(res.id, vcType, context);
          // res.vc = Buffer.from(JSON.stringify(vc)).toString('base64');
          // /* eslint-disable no-await-in-loop */
          // return res;
        } catch (err) {
          logger.error('Failed to retrieve VC', err);
        }
        logger.error('Retrying vc retrieval');
        await new Promise((resolve, _) => {
          setTimeout(resolve, 500);
        });
      }
    }
  }
  return res;
}
export async function answerChallenge(
  challenges: Array<Challenge>,
  context: Context
) {
  const client = getApiClient(context);
  return client.AnswerChallenge(
    {
      id: context.connection_id,
      challenges,
    },
    context.user_id
  );
}
export function getVC(connection_id: string, type: VcType, context: Context) {
  const client = getApiClient(context);
  return client.GetVc(connection_id, type, context?.user_id);
}
