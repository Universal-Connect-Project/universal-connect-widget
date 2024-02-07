/* eslint-disable no-unused-vars */
// TODO: REMOVE no-unused-vars

/**
 * ConnectAPIService adds an abstraction layer between how our code asks for
 * remote data and the concrete implementation.
 *
 * For example, we don't have to rely on FireflyAPI if we want to move to
 * another API source instead in the future. It also leaves the option of
 * using axios or any other http library up the implementation
 */
export class ConnectAPIService {
  constructor(dataSource) {
    this.dataSource = dataSource
  }
  /**
   *
   * @param {*} memberData
   * @param {Object} connectConfig - configs for MXconnect
   * @param {string} connectConfig.client_redirect_url
   * @param {boolean} connectConfig.include_transactions
   * @param {string} connectConfig.mode
   * @param {string} connectConfig.oauth_referral_source
   * @param {boolean|null} connectConfig.disable_background_agg
   * @param {Object} appConfig - configs for the app
   * @param {boolean} appConfig.is_mobile_webview
   * @param {string} appConfig.ui_message_webview_url_scheme
   * @param {boolean} isHuman
   */
  addMember(memberData, connectConfig = {}, appConfig = {}, isHuman = false) {
    return this.dataSource.addMember(memberData, connectConfig, appConfig, isHuman)
  }
  updateMember(member, connectConfig = {}, isHuman = false) {}
  loadMembers() {}
  loadMemberByGuid(memberGuid) {}
  deleteMember(member) {} // TODO - we could change this to be a guid only if we want

  submitConnectFeedBack(feedBack) {}
  createSupportTicket(ticket) {}

  loadInstitutions(query) {}
  loadInstitutionByGuid(guid) {}
  loadInstitutionByCode(code) {}
  loadPopularInstitutions(query) {}
  loadDiscoveredInstitutions() {}

  createAccount(account) {}
  loadAccounts() {}

  createMicrodeposit(microdeposit) {}
  loadMicrodepositByGuid(microdepositGuid) {}
  /**
   * Update Microdeposit - This only works with PREINITIATED MicroDeposits. Once you update a PREINITIATED
   * MicroDeposit, it will automatically start the process and switch to REQUESTED.
   * @param  updatedData - Include fields: `account_name`, `account_number`, `account_type`, `email`,
   * first_name`, `last_name`, and `routing_number`. Cannot update `deposit_amount_1` or `deposit_amount_2`.
   */
  updateMicrodeposit(microdepositGuid, updatedData) {}
  refreshMicrodepositStatus(microdepositGuid) {}
  verifyMicrodeposit(microdepositGuid, amountData) {}
  verifyRoutingNumber(routingNumber) {}

  loadJob(jobGuid) {}
  runJob(jobType, memberGuid, connectConfig = {}, isHuman = false) {}

  getInstitutionCredentials(institutionGuid) {}
  getMemberCredentials(memberGuid) {}

  getOAuthWindowURI(memberGuid, config) {}
}
