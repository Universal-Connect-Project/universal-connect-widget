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
import { MxApi, SophtronApi } from './providers';

const mxClient = new MxApi();
const sophtronClient = new SophtronApi();

function getApiClient(context: Context): ProviderApiClient {
  switch (context?.provider) {
    case 'mx':
      return mxClient;
    case 'sophtron':
      return sophtronClient;
    default:
      return sophtronClient;
  }
}

function mapProvider(inst: Institution) {
  const mapping: any = (config.ProviderMapping as any)[inst.name];
  if (mapping) {
    inst.provider = mapping.provider;
    inst.id = mapping.id;
  } else {
    inst.provider = 'sophtron';
  }
  return inst;
}

// async function getAccounts(userInstitutionID: string, context: Context){
//     let client = getApiClient(context);

//     var ret = await client.getUserInstitutionAccounts(userInstitutionID, context.user_id);
//     if((ret||[]).length > 0){
//         ret = ret.map(item => ({
//             AccountID: item.AccountID,
//             AccountName: item.AccountName,
//             AccountNumber: item.AccountNumber,
//             AccountType: item.AccountType,
//             //FullAccountNumber: item.FullAccountNumber,
//             //RoutingNumber: item.RoutingNumber,
//             SubType: item.SubType
//         }));
//         return ret;
//     }
// }
export async function search(query: string, _: Context) {
  const client = sophtronClient; // getApiClient(context);
  const list = await client.SearchInstitutions(query);
  list.institutions = list.institutions.map(mapProvider);
  return list;
}
export function getConnection(
  connection_id: string,
  context: Context
): Promise<Connection> {
  const client = getApiClient(context);
  return client.GetConnectionById(connection_id);
}
export async function institutions(context: Context) {
  // const client = getApiClient(context);
  const retBanks: Institution[] | null = config.DemoBanks;
  context.connection_id = null;
  // if ((context.institution_id || '').length > 0 && context.provider) {
  //   const ret = await client.GetInstitutionById(context.institution_id!);
  //   if (ret && ret.id) {
  //     retBanks = [mapProvider(ret)];
  //   } else {
  //     delete context.institution_id;
  //   }
  // }
  // if (!retBanks) {
  //   retBanks = await client.ListFavorateInstitutions();
  // }
  context.user_id = context.user_id || config.MxDemoUserId;
  return { institutions: retBanks };
}
export async function selectInstitution(
  institution: Institution,
  context: Context
) {
  logger.debug(`Selecting institution ${institution.id}`);
  if (institution.provider) {
    context.provider = institution.provider;
  }
  if (!context.provider) {
    context.provider = 'sophtron';
  }
  const client = getApiClient(context);
  if (institution.id) {
    const credentials = await client.ListInstitutionCredentials(institution.id);
    if (!institution.url) {
      institution = await client.GetInstitutionById(institution.id);
    }
    return { institution, credentials };
  }
  return { error: 'invalid institution selected' };
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
          res.vc = Buffer.from(JSON.stringify(vc)).toString('base64');
          /* eslint-disable no-await-in-loop */
          return res;
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
