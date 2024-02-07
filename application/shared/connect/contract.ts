import { Institution, VcType } from '../contract'

export interface MFACredential{
  field_name: string
  field_type: number 
  label: string
}

export interface Credential {
  guid: string //
  value?: string
  nullify?: null
  institution_guid?: string //INS-asdf
  label?: string //What city were you born in?
  field_name?: string //null
  opt?: string //null
  type?: number // 0
  display_order?: any //null
  external_id?: string // UNIQUE_ID_FOR_THIS_CHALLENGE-6a8d4e0395
  data_source_guid?: string // null
  field_type?: number // 0
  optional?: any //null
  editable?: any // null
  mfa?: boolean // true
  optional_mfa?: any // null
  aggregator_guid?: string // AGG-asdf
  question_field_type?: any //null
  answer_field_type?: any // null
  escaped?: any // null
  value_identifier?: any // null
  value_mask?: any //null
  size?: any // null
  max_length?: any //null
  created_at?: string // 2023-03-02T22:08:47.000+00:00
  updated_at?: string // 2023-03-02T22:08:47.000+00:00
  legacy_question_field_type?: any // null
  response_field_type?: any // null
  sequence?: any // null
  meta_data?: any // null
  display_name?: string // null
  status_code?: number // 200
  job_guid?: string // JOB-asdf
  options?: any //Array // []
}

export interface Member {
  //aggregation_status: number //
  institution_guid: string //INS-asdf
  institution_name?: string //
  institution_url?: string //https://gringotts.qa.internal.mx/
  instructional_data?: object
  // {
  //   title?: Please do all these things <a href=\https://google.com\ id=\instructional_text\>My Test Link</a>
  //   description?: Please do all these things <a href=\https://google.com\ id=\instructional_text\>My Test Link</a>
  //   steps?: [
  //     First the most important thing that you need to do is this thing that is right here in the link <a href=\https://google.com\ id=\instructional_text\>My Test Link</a>
  //     The second most important thing is to do all the things <a href=\https://google.com\ id=\instructional_text\>My Test Link</a>
  //     And you really should be doing this thing :) Thank you!!! <a href=\https://google.com\ id=\instructional_text\>My Test Link</a>
  //   ]
  // }
  is_manual?: boolean //
  last_job_guid?: string //JOB-asdf
  last_job_status?: string //
  last_update_time?: string //

  most_recent_job_guid?: string //JOB-asdf
  needs_updated_credentials?: boolean
  revision?: number //13
  verification_is_enabled?: boolean
  tax_statement_is_enabled?: boolean
  aggregated_at?: string | null;
  background_aggregation_is_disabled?: boolean;
  connection_status?: string | null | number; //
  guid: string | null; //
  id?: string | null;
  institution_code?: string | null;
  is_being_aggregated?: boolean | null; //
  is_managed_by_user?: boolean | null; //
  is_oauth?: boolean | null; //
  metadata?: string | null; //
  name?: string | null; //
  oauth_window_uri?: string | null; //
  successfully_aggregated_at?: string | null; //
  user_guid?: string | null; //
  user_id?: string | null;
  mfa?: {
    credentials: Array<Credential>
  }
  process_status?: {
    credentials: Array<Credential>
  }
  skip_aggregation?: boolean | null;
  credentials?: Credential[]
}
export interface MemberResponse{
  member: Member;
}
// export interface CredentialRequest {
//   guid?: string;
//   value?: string;
// }

// export interface MemberResumeRequest {
//   challenges?: Array<CredentialRequest>;
// }

// export interface MemberStatus {
//   aggregated_at?: string | null;
//   challenges?: Array<Challenge>;
//   connection_status?: string | null;
//   guid?: string | null;
//   has_processed_accounts?: boolean | null;
//   has_processed_transactions?: boolean | null;
//   is_authenticated?: boolean | null;
//   is_being_aggregated?: boolean | null;
//   successfully_aggregated_at?: string | null;
// }

// export interface MemberUpdateRequest {
//   background_aggregation_is_disabled?: boolean;
//   credentials?: Array<CredentialRequest>;
//   id?: string;
//   metadata?: string;
//   skip_aggregation?: boolean;
// }

// export interface Challenge {
//   field_name?: string | null;
//   guid?: string | null;
//   image_data?: string | null;
//   image_options?: Array<ImageOption>;
//   label?: string | null;
//   options?: Array<Option>;
//   type?: string | null;
// }

// export interface ImageOption {
//   data_uri?: string | null;
//   label?: string | null;
//   value?: string | null;
// }
// export interface Option {
//   label?: string | null;
//   value?: string | null;
// }
// export interface Institution {
//   code?: string | null;
//   instructional_text?: string | null;
//   medium_logo_url?: string | null;
//   name?: string | null;
//   small_logo_url?: string | null;
//   supports_account_identification?: boolean | null;
//   supports_account_statement?: boolean | null;
//   supports_account_verification?: boolean | null;
//   supports_oauth?: boolean | null;
//   supports_transaction_history?: boolean | null;
//   url?: string | null;
// }

// export interface MemberData {
//   guid: string
//   institution_guid: string 
//   credentials: Credential[]
// }

export interface IConnectAPI {
  addMember(memberData: Member): Promise<{member: Member}>
  updateMember(member: Member): Promise<Member>
  loadMembers(): Promise<Member[]>
  loadMemberByGuid(memberGuid: string): Promise<Member>
  deleteMember(member: Member): Promise<void>

  // this one is different from the FireflyAPI because it needs the institution provider and name information 
  getInstitutionCredentials(institution: Institution): Promise<Credential[]>
  
  getMemberCredentials(memberGuid: string): Promise<Credential[]>

  // submitConnectFeedBack(feedBack)
  // createSupportTicket(ticket)

  loadInstitutions(query: string): Promise<Institution[]>
  loadInstitutionByGuid(guid: string): Promise<Institution>
  loadInstitutionByCode(code: string): Promise<Institution>
  loadPopularInstitutions(query: string): Promise<Institution[]>
  loadDiscoveredInstitutions(): Promise<Institution[]>

  // createAccount(account)
  // loadAccounts()

  // createMicrodeposit(microdeposit)
  // loadMicrodepositByGuid(microdepositGuid)
  // updateMicrodeposit(microdepositGuid updatedData)
  // refreshMicrodepositStatus(microdepositGuid)
  // verifyMicrodeposit(microdepositGuid amountData)
  // verifyRoutingNumber(routingNumber)

  // loadJob(jobGuid)
  // runJob(jobType memberGuid connectConfig = isHuman = false)

  // getOAuthWindowURI(memberGuid config)
}
