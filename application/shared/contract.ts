export interface AuthRequest {
  provider: string;
  token: string;
  iv: string;
  key: string
}

export interface Context {
  institution_id?: string;
  institution_uid?: string;
  connection_id?: string;
  current_job_id?: string;
  user_id?: string;
  resolved_user_id?: string;
  provider?: string;
  job_type?: string;
  partner?: string;
  single_account_select?: boolean;
  auth?: AuthRequest;
  oauth_referral_source?: string;
  updated?: boolean;
}

export interface KeyValuePair {
  key: string;
  value?: string | null;
}

export interface Credential {
  id: string;
  label?: string;
  value?: string;
  field_type?: string;
  field_name?: string;
}
export enum ConnectionStatus {
  CREATED,
  PREVENTED,
  DENIED,
  CHALLENGED,
  REJECTED,
  LOCKED,
  CONNECTED,
  IMPEDED,
  RECONNECTED,
  DEGRADED,
  DISCONNECTED,
  DISCONTINUE,
  CLOSED,
  DELAYED,
  FAILED,
  UPDATED,
  DISABLED,
  IMPORTED,
  RESUMED,
  EXPIRED,
  IMPAIRED,
  PENDING,
}
export enum ChallengeType {
  QUESTION,
  OPTIONS,
  IMAGE,
  IMAGE_OPTIONS,
  TOKEN,
}

export enum VcType {
  IDENTITY,
  ACCOUNTS,
  TRANSACTIONS,
}

export interface Challenge {
  id: string;
  external_id?: string;
  question?: string | null;
  data?: string | Array<KeyValuePair>;
  type: ChallengeType;
  response?: string | Array<number>;
}

export interface Institution {
  id: string | null;
  name: string;
  url: string;
  logo_url: string | null;
  provider?: string | null;
  oauth?: boolean | false;
  code?: string | null;
  instructional_text?: string | null;
  small_logo_url?: string | null;
  providers?: Object | {};
}

export interface Institutions {
  institutions: Array<Institution>;
  pagination?: Pagination;
}

export interface CreateConnectionRequest {
  id?: string;
  initial_job_type?: string;
  background_aggregation_is_disabled?: boolean;
  credentials: Array<Credential>;
  institution_id: string;
  is_oauth?: boolean;
  skip_aggregation?: boolean;
  metadata?: string;
}

export interface Connection {
  id: string | null;
  cur_job_id?: string | null;
  last_refresh_utc?: string | null;
  last_refreshed_utc?: string | null;
  last_updated_utc?: string | null;
  background_aggregation_is_disabled?: boolean;
  status?: ConnectionStatus | null;
  institution_code?: string | null;
  is_being_aggregated?: boolean | null;
  is_oauth?: boolean | null;
  name?: string | null;
  provider?: string | null;
  user_id?: string | null;
  challenges?: Array<Challenge>;
  has_accounts?: boolean | null;
  has_transactions?: boolean | null;
  is_authenticated?: boolean | null;
  vc?: string | null;
  oauth_window_uri?: string | null;
}
export interface UpdateConnectionRequest {
  id: string | undefined;
  job_type?: string;
  credentials?: Array<Credential>;
  challenges?: Array<Challenge>;
}
export interface Connections {
  members?: Array<Connection>;
  pagination?: Pagination;
}

export interface Pagination {
  current_page?: number;
  per_page?: number;
  total_entries?: number;
  total_pages?: number;
}

export enum EventEnum {
  INIT,
  INSTITUTION_LIST,
  SELECT_INSTITUTION,
  LOGIN,
  CHALLENGED,
  SUCCEEDED,
  FAILED,
  ERROR,
}

export interface ProviderApiClient {
  ResolveUserId(id: string): Promise<string>;
  GetInstitutionById(id: string): Promise<Institution>;
  ListInstitutionCredentials(institutionId: string): Promise<Array<Credential>>;
  ListConnectionCredentials(connectionId: string, userId: string): Promise<Array<Credential>>;
  ListConnections( userId: string): Promise<Array<Connection>>;
  CreateConnection(
    connection: CreateConnectionRequest,
    userId?: string
  ): Promise<Connection | undefined>;
  DeleteConnection(connectionId: string, userId?: string): Promise<void>;
  AnswerChallenge(
    request: UpdateConnectionRequest,
    jobId: string,
    userId?: string
  ): Promise<boolean>;
  UpdateConnection(
    UpdateConnectionRequest: UpdateConnectionRequest,
    userId?: string
  ): Promise<Connection>;
  GetConnectionById(
    connectionId: string,
    userId?: string
  ): Promise<Connection | undefined>;
  GetConnectionStatus(
    connectionId: string,
    jobId: string,
    single_account_select?: boolean,
    userId?: string
  ): Promise<Connection | undefined>;
}
