import _get from 'lodash/get'
import _orderBy from 'lodash/orderBy'
import _reduce from 'lodash/reduce'
import _sortBy from 'lodash/sortBy'
import _isArray from 'lodash/isArray'
import axios from 'axios'
import Honeybadger from 'honeybadger-js'
import moment from 'moment'
import getUnixTime from 'date-fns/getUnixTime'
import addMonths from 'date-fns/addMonths'
import endOfMonth from 'date-fns/endOfMonth'
import isPast from 'date-fns/isPast'
import startOfMonth from 'date-fns/startOfMonth'
import startOfToday from 'date-fns/startOfToday'
import subMonths from 'date-fns/subMonths'

import { ApiEndpoints } from '../constants/ApiEndpoint'
import { PhoneActions } from '../constants/Settings'
import * as AccountUtils from './Account'
import { formatDailyAccountBalances } from './CashFlow'

import { REFERRAL_SOURCES, VERIFY_MODE } from '../connect/const/Connect'
import { JOB_TYPES } from '../connect/consts'

const validateStatus = status => {
  return status >= 200 && status < 300
}

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'MD-Session-Token': _get(window, ['app', 'options', 'session_token']),
    // The 'Inter-x' headers are just for security to fingerprint requests.
    'x-inter-ua': navigator.userAgent,
    'x-inter-av': navigator.appVersion,
    'x-inter-platform': navigator.platform,
    'x-inter-pg': getNavigatorPluginNames(navigator.plugins),
    'x-inter-mt': getNavigatorMimeTypeNames(navigator.mimeTypes),
  },
  validateStatus,
})

const FireflyAPI = {
  /**
   * Register an axios interceptor
   * https://github.com/axios/axios#interceptors
   * @param {String} interceptorType - "request" or "response"
   * @param {Function} successCallback
   * @param {Function} errorCallback
   */
  registerAxiosInterceptor(interceptorType, successCallback, errorCallback) {
    axiosInstance.interceptors[interceptorType].use(successCallback, errorCallback)
  },

  loadMaster() {
    return axiosInstance
      .get(ApiEndpoints.APPDATA)
      .then(response => response.data)
      .catch(error => error)
  },

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
    const referralSource =
      appConfig.is_mobile_webview === true
        ? REFERRAL_SOURCES.APP
        : connectConfig.oauth_referral_source ?? REFERRAL_SOURCES.BROWSER

    /* When creating new members in Verify Mode, Background Aggregation is DISABLED by default.
       When creating new members in other modes, Background Aggregation is ENABLED.

       If desired, Clients can pass a boolean value for 'disable_background_agg' to connect's config
       which will allow new members to be created with that value for 'background_aggregation_is_disabled'

       See the addMember tests for more info: src/utils/__tests__/FireflyAPI-test.js
    */
    const background_aggregation_is_disabled = Boolean(
      connectConfig.disable_background_agg ?? connectConfig.mode === VERIFY_MODE,
    )

    return axiosInstance
      .post(
        ApiEndpoints.MEMBERS,
        {
          ...memberData,
          background_aggregation_is_disabled,
          client_redirect_url: connectConfig.client_redirect_url ?? null,
          include_transactions: connectConfig.include_transactions ?? null,
          referral_source: referralSource,
          skip_aggregation: true,
          ui_message_webview_url_scheme: appConfig.ui_message_webview_url_scheme ?? 'mx',
        },
        {
          headers: {
            'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
          },
        },
      )
      .then(response => response.data)
  },

  updateMember(member, connectConfig = {}, isHuman = false) {
    const includeTransactions = connectConfig.include_transactions ?? null
    const headers = {
      'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
    }

    return axiosInstance
      .put(
        `${ApiEndpoints.MEMBERS}/${member.guid}`,
        {
          ...member,
          include_transactions: includeTransactions,
          skip_aggregation: true,
        },
        { headers },
      )
      .then(response => response.data.member)
  },

  deleteMember(member) {
    return axiosInstance
      .delete(`${ApiEndpoints.MEMBERS}/${member.guid}`)
      .then(response => response.data)
  },

  getMemberCredentials(memberGuid) {
    return axiosInstance
      .get(`${ApiEndpoints.MEMBERS}/${memberGuid}/credentials`)
      .then(response => response.data.credentials)
  },

  getOAuthWindowURI(memberGuid, config) {
    /**
     * referral source defaults to BROWSER but can be set to APP, either by
     * `is_mobile_webview`, or by `oauth_referral_source`.
     *
     * The reason we expose `oauth_referral_source` is for integrations that
     * wrap our widget in an iframe with a webapp that is wrapped in a webview.
     *
     * Example integrations:
     * Web app -> Iframe -> Connect
     * Native app -> webview -> Connect
     * Native app -> webview -> web app -> iframe -> Connect
     *
     * This way, clients that are wrapping us in an iframe but loading their app
     * in a webview can keep `is_mobile_webview` as `false` and still get
     * redirected back to their native app by setting the referral source
     * explicity by setting referral_source to APP.
     */
    const referralSource =
      config?.is_mobile_webview === true
        ? REFERRAL_SOURCES.APP
        : config?.connect?.oauth_referral_source ?? REFERRAL_SOURCES.BROWSER

    const scheme = config?.ui_message_webview_url_scheme ?? 'mx'
    const clientRedirectConfig = config?.connect?.client_redirect_url
    const client_redirect_querystring = clientRedirectConfig
      ? `&client_redirect_url=${clientRedirectConfig}`
      : ''

    return axiosInstance
      .get(
        `${ApiEndpoints.MEMBERS}/${memberGuid}/oauth_window_uri?referral_source=${referralSource}&ui_message_webview_url_scheme=${scheme}&skip_aggregation=true${client_redirect_querystring}`,
      )
      .then(response => response.data)
  },

  loadOAuthStates(queryObject) {
    const query = FireflyAPI.buildQueryString(queryObject)

    return axiosInstance
      .get(`${ApiEndpoints.OAUTH_STATES}${query}`)
      .then(resp => resp.data.oauth_states)
  },

  loadOAuthState(guid) {
    return axiosInstance
      .get(`${ApiEndpoints.OAUTH_STATES}/${guid}`)
      .then(resp => resp.data.oauth_state)
  },

  aggregate(memberGuid, config = {}, isHuman = false) {
    const headers = {
      'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
    }

    return axiosInstance
      .post(
        `${ApiEndpoints.MEMBERS}/${memberGuid}/unthrottled_aggregate`,
        { include_transactions: config?.include_transactions ?? null },
        { headers },
      )
      .then(response => response.data)
  },

  identify(memberGuid, config = {}, isHuman = false) {
    const headers = {
      'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
    }

    return axiosInstance
      .post(
        `${ApiEndpoints.MEMBERS}/${memberGuid}/identify`,
        { include_transactions: config?.include_transactions ?? null },
        { headers },
      )
      .then(response => response.data)
  },

  verify(memberGuid, config = {}, isHuman = false) {
    const headers = {
      'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
    }

    return axiosInstance
      .post(
        `${ApiEndpoints.MEMBERS}/${memberGuid}/verify`,
        { include_transactions: config?.include_transactions ?? null },
        { headers },
      )
      .then(response => response.data)
  },

  reward(memberGuid, config = {}, isHuman = false) {
    const headers = {
      'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
    }

    return axiosInstance
      .post(
        `${ApiEndpoints.MEMBERS}/${memberGuid}/fetch_rewards`,
        { include_transactions: config?.include_transactions ?? null },
        { headers },
      )
      .then(response => response.data)
  },

  tax(memberGuid, config = {}, isHuman = false) {
    const headers = {
      'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
    }

    return axiosInstance
      .post(
        `${ApiEndpoints.MEMBERS}/${memberGuid}/tax`,
        { include_transactions: config?.include_transactions ?? null },
        { headers },
      )
      .then(response => response.data)
  },

  runJob(jobType, memberGuid, connectConfig = {}, isHuman = false) {
    let jobCall = FireflyAPI.aggregate

    if (jobType === JOB_TYPES.VERIFICATION) {
      jobCall = FireflyAPI.verify
    } else if (jobType === JOB_TYPES.REWARD) {
      jobCall = FireflyAPI.reward
    } else if (jobType === JOB_TYPES.TAX) {
      jobCall = FireflyAPI.tax
    } else if (jobType === JOB_TYPES.IDENTIFICATION) {
      jobCall = FireflyAPI.identify
    }

    return jobCall(memberGuid, connectConfig, isHuman)
  },

  logout() {
    return axiosInstance
      .get(ApiEndpoints.LOGOUT)
      .then(response => response.data)
      .catch(error => error)
  },

  createSupportTicket(ticket) {
    return axiosInstance
      .post(ApiEndpoints.SUPPORT_TICKETS, ticket)
      .then(response => response.data)
      .catch(error => error)
  },

  submitConnectFeedBack(feedBack) {
    return axiosInstance
      .post(ApiEndpoints.CONNECT_FEED_BACK, feedBack)
      .then(response => response.data)
      .catch(error => error)
  },

  instrumentation(configOptions) {
    return axiosInstance
      .post(ApiEndpoints.INSTRUMENTATION, configOptions)
      .then(response => response && response.data)
  },

  // Budgets
  deleteBudget(budget) {
    return axiosInstance
      .delete(ApiEndpoints.BUDGETS + '/' + budget.guid)
      .then(response => response.data)
      .catch(error => error)
  },

  deleteBudgets(budgets) {
    const requests = budgets.map(budget => {
      return axiosInstance.delete(ApiEndpoints.BUDGETS + '/' + budget.guid)
    })

    return axios
      .all(requests)
      .then(responses => responses.map(response => response.data))
      .catch(error => error)
  },

  generateBudgets() {
    return axiosInstance
      .post(ApiEndpoints.BUDGETS + '/generate')
      .then(response => response.data)
      .catch(error => error)
  },

  loadBudgets() {
    return axiosInstance
      .get(ApiEndpoints.BUDGETS)
      .then(response => response.data)
      .catch(error => error)
  },

  //USER FEATURES
  loadUserFeatures() {
    return axiosInstance
      .get(ApiEndpoints.USER_FEATURES)
      .then(response => response.data)
      .catch(error => error)
  },

  addUserFeature(userFeature) {
    const payload = { feature_guid: userFeature.guid, is_enabled: true }

    return axiosInstance.post(ApiEndpoints.USER_FEATURES, payload).then(response => response.data)
  },

  saveBudget(budget) {
    const method = budget.guid ? 'put' : 'post'
    const endpoint = budget.guid ? ApiEndpoints.BUDGETS + '/' + budget.guid : ApiEndpoints.BUDGETS

    return axiosInstance[method](endpoint, budget)
      .then(response => response.data)
      .catch(error => error)
  },

  saveBudgets(budgets) {
    const requests = budgets.map(budget => {
      const url = !budget.guid ? ApiEndpoints.BUDGETS : ApiEndpoints.BUDGETS + '/' + budget.guid
      const method = !budget.guid ? 'post' : 'put'

      return axiosInstance[method](url, budget)
    })

    return axios
      .all(requests)
      .then(responses => {
        const payload = {
          budgets: responses.map(response => response.data.budget),
        }

        return payload
      })
      .catch(error => error)
  },

  checkForCampaignBanner(bullseye, userGuid) {
    const url = `${bullseye}/banner/${userGuid}/account_widget_banner`

    // Need to use a different axios instance because this endpoint
    // does not need the md-session-token.
    return axios
      .create({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        validateStatus,
      })
      .get(url)
      .then(response => response.data)
      .catch(error => error)
  },

  dismissOffer(offerGuid) {
    return axiosInstance
      .put(ApiEndpoints.OFFERS + '/' + offerGuid, { has_been_dismissed: true })
      .then(response => response.data.offer)
      .catch(error => error)
  },

  loadAccounts() {
    const requests = [
      axiosInstance.get(ApiEndpoints.MEMBERS),
      axiosInstance.get(ApiEndpoints.ACCOUNTS),
    ]

    return axios
      .all(requests)
      .then(
        axios.spread((membersResponse, accountsResponse) => {
          const payload = {
            accounts: accountsResponse.data.accounts,
            members: membersResponse.data.members,
          }

          return payload
        }),
      )
      .catch(error => error)
  },

  loadAccountsByMember(currentMemberGuid) {
    return axiosInstance
      .get(
        `${ApiEndpoints.ACCOUNTS}/${FireflyAPI.buildQueryString({ member_id: currentMemberGuid })}`,
      )
      .then(response => response.data.accounts)
      .catch(error => error)
  },

  loadCategories() {
    return axiosInstance.get(ApiEndpoints.CATEGORIES).then(response => {
      const categories = _get(response, ['data', 'categories'], [])

      if ((response.status === 304 && !categories) || categories.length === 0) {
        Honeybadger.notify(response, '304 Response from server missing data or categories object')
        return []
      }

      if (!categories || categories.length === 0) {
        Honeybadger.notify(response, 'Response from server missing data or categories object')
        return []
      }

      return categories
    })
  },

  loadCategoryTotals(startDate, endDate, serverAction = response => response) {
    return axiosInstance
      .get(ApiEndpoints.CATEGORY_TOTALS + '/from/' + startDate + '/to/' + endDate)
      .then(response => serverAction(response.data.date_range_category_totals))
      .catch(error => error)
  },

  loadCategoryTotalsByAccount(startDate, endDate, accountGuids) {
    const accountGuidList = { account_guid: accountGuids }

    return axiosInstance
      .post(ApiEndpoints.CATEGORY_TOTALS + '/from/' + startDate + '/to/' + endDate, accountGuidList)
      .then(response => response.data.date_range_category_totals)
  },

  loadMonthlyCategoryTotals(
    startDate = moment()
      .subtract(1, 'year')
      .startOf('month')
      .unix(),
    endDate = moment()
      .startOf('month')
      .unix(),
  ) {
    return axiosInstance
      .get(`${ApiEndpoints.MONTHLY_CATEGORY_TOTALS}/from/${startDate}/to/${endDate}`)
      .then(response => response.data)
      .catch(error => error)
  },

  loadMonthlyCategoryTotalsByAccount(
    startDate = moment()
      .subtract(1, 'year')
      .startOf('month')
      .unix(),
    endDate = moment()
      .startOf('month')
      .unix(),
    accountGuids,
  ) {
    /**
     * We have to provide nil for the account_guid param
     * if no accountGuids are provided. The end point in
     * Firefly checks for the presence of the account_guid
     * param and if it is missing then it returns monthly
     * category totals for all accounts. Providing nil
     * ensures we get category totals of zero as expected.
     */
    const accountGuidList = { account_guid: accountGuids }

    return axiosInstance
      .post(
        `${ApiEndpoints.MONTHLY_CATEGORY_TOTALS}/from/${startDate}/to/${endDate}`,
        accountGuidList,
      )
      .then(response => response.data)
      .catch(error => error)
  },

  loadMonthlyAccountBalances(guid) {
    return axiosInstance
      .get(ApiEndpoints.ACCOUNTS + '/' + guid + ApiEndpoints.MONTHLY_ACCOUNT_BALANCES)
      .then(response => {
        return response.data.monthly_account_balances
      })
      .catch(error => error)
  },

  loadHoldings() {
    return axiosInstance
      .get(ApiEndpoints.HOLDINGS)
      .then(response => response.data)
      .catch(error => error)
  },

  loadJob(jobGuid) {
    return axiosInstance.get(ApiEndpoints.JOBS + '/' + jobGuid).then(response => response.data.job)
  },

  loadInstitutions(query) {
    const url =
      typeof query === 'undefined'
        ? `${ApiEndpoints.INSTITUTIONS}`
        : `${ApiEndpoints.INSTITUTIONS}${FireflyAPI.buildQueryString(query)}`

    return axiosInstance.get(url).then(response => response.data)
  },

  loadInstitutionByGuid(guid) {
    return axiosInstance.get(ApiEndpoints.INSTITUTIONS + '/' + guid).then(response => ({
      ...response.data.institution,
      // Remove extra level of nesting
      credentials: response.data.institution.credentials.map(credential => credential.credential),
    }))
  },

  loadInstitutionByCode(code) {
    // Code is provided to clients using the Atrium API
    const headers = {
      Accept: 'application/vnd.moneydesktop.v2+json',
      'Content-Type': 'application/json',
      'MD-Session-Token': window.app.options.session_token,
    }

    return axiosInstance
      .get(ApiEndpoints.INSTITUTIONS + '/' + code, { headers })
      .then(response => ({
        ...response.data.institution,
        // Remove extra level of nesting
        credentials: response.data.institution.credentials.map(credential => credential.credential),
      }))
  },

  loadPopularInstitutions(query) {
    const url =
      typeof query === 'undefined'
        ? `${ApiEndpoints.INSTITUTIONS}/favorite`
        : `${ApiEndpoints.INSTITUTIONS}/favorite${FireflyAPI.buildQueryString(query)}`

    return axiosInstance.get(url).then(response => {
      return response.data
    })
  },

  loadDiscoveredInstitutions() {
    const url = `${ApiEndpoints.INSTITUTIONS}/discovered`

    return axiosInstance.get(url).then(response => response.data)
  },

  getInstitutionCredentials(institutionGuid) {
    return axiosInstance
      .get(`${ApiEndpoints.INSTITUTIONS}/${institutionGuid}/credentials`)
      .then(response => response.data.credentials)
  },

  loadMembers() {
    return axiosInstance.get(ApiEndpoints.MEMBERS).then(response => response.data.members)
  },

  loadMemberByGuid(memberGuid) {
    return axiosInstance.get(`${ApiEndpoints.MEMBERS}/${memberGuid}`).then(resp => {
      return resp.data.member
    })
  },

  // Microdeposit Endpoints
  refreshMicrodepositStatus(microdepositGuid) {
    return axiosInstance
      .get(`${ApiEndpoints.MICRODEPOSITS}/${microdepositGuid}/status`)
      .then(resp => resp.data)
  },

  loadMicrodepositByGuid(microdepositGuid) {
    return axiosInstance
      .get(`${ApiEndpoints.MICRODEPOSITS}/${microdepositGuid}`)
      .then(resp => resp.data.micro_deposit)
  },

  createMicrodeposit(microdeposit) {
    return axiosInstance.post(`${ApiEndpoints.MICRODEPOSITS}`, microdeposit).then(resp => resp.data)
  },

  /**
   * Update Microdeposit - This only works with PREINITIATED MicroDeposits. Once you update a PREINITIATED
   * MicroDeposit, it will automatically start the process and switch to REQUESTED.
   * @param  updatedData - Include fields: `account_name`, `account_number`, `account_type`, `email`,
   * first_name`, `last_name`, and `routing_number`. Cannot update `deposit_amount_1` or `deposit_amount_2`.
   */
  updateMicrodeposit(microdepositGuid, updatedData) {
    return axiosInstance
      .put(`${ApiEndpoints.MICRODEPOSITS}/${microdepositGuid}`, updatedData)
      .then(resp => resp.data)
  },

  /**
   * Verify Microdeposit Amounts
   * @param  amountData - Include fields: `deposit_amount_1` and `deposit_amount_2`.
   */
  verifyMicrodeposit(microdepositGuid, amountData) {
    return axiosInstance
      .put(`${ApiEndpoints.MICRODEPOSITS}/${microdepositGuid}/verify`, amountData)
      .then(resp => resp.data)
  },

  verifyRoutingNumber(routingNumber) {
    return axiosInstance
      .get(`${ApiEndpoints.BLOCKED_ROUTING_NUMBERS}/${routingNumber}`)
      .then(resp => resp.data)
  },

  // Device Endpoints
  loadDevices() {
    return axiosInstance
      .get(ApiEndpoints.DEVICES)
      .then(response => response.data)
      .catch(error => error)
  },

  saveDevice(device) {
    return axiosInstance
      .put(ApiEndpoints.DEVICES + '/' + device.guid, device)
      .then(response => response.data)
      .catch(error => error)
  },

  deleteDevice(device) {
    return axiosInstance
      .delete(ApiEndpoints.DEVICES + '/' + device.guid)
      .then(() => device)
      .catch(error => error)
  },

  generateMobileToken() {
    return axiosInstance
      .get(ApiEndpoints.USER + '/mobile_token')
      .then(response => response.data)
      .catch(error => error)
  },

  loadNotificationProfiles() {
    return axiosInstance
      .get(ApiEndpoints.NOTIFICATION_PROFILES)
      .then(response => response.data.notification_profiles)
      .catch(error => error)
  },

  editNotificationProfile(profile) {
    return axiosInstance
      .put(ApiEndpoints.NOTIFICATION_PROFILES + '/' + profile.guid, profile)
      .then(response => response.data.notification_profile)
      .catch(error => error)
  },

  updateUserCommunicationProfile(userCommunicationProfile) {
    return axiosInstance
      .put(ApiEndpoints.USER_COMMUNICATION_PROFILE, userCommunicationProfile)
      .then(response => response)
  },

  loadOffer(offerType) {
    return axiosInstance
      .get(`${ApiEndpoints.OFFERS}/pick/${offerType}`)
      .then(response => {
        // With the rabl changes in Firefly, it changed the response strucutre
        // from returning an array of offers to an object with an offers root.
        // Putting up a MR to change that in Firefly and this will make it so
        // both will work. Once it is up, I will come back and clean this up.
        const offer = response.data.offers ? response.data.offers : response.data.offer

        return new Promise((resolve, reject) => {
          if (!offer || (offer && !offer.image_url)) {
            // If there is no offer or no image to load, just return the offer (or null)
            resolve(offer)
          } else {
            // If there is an offer, try to load the image from the url
            const image = new Image()

            image.onload = () => {
              // On success, return the offer with the image as an attribute
              resolve({ ...offer, image })
            }

            image.onerror = () => {
              // If the image can't be loaded, return an error
              reject('Image not found')
            }

            image.src = offer.image_url
          }
        })
      })
      .catch(error => error)
  },

  loadTaggings() {
    return axiosInstance
      .get(ApiEndpoints.TAGGINGS)
      .then(response => FireflyAPI.removeItemWrapper(response.data, 'tagging'))
      .catch(error => error)
  },

  loadTags() {
    return axiosInstance
      .get(ApiEndpoints.TAGS)
      .then(response => FireflyAPI.removeItemWrapper(response.data, 'tag'))
      .catch(error => error)
  },

  loadTransactionsByAccount(accountGuid, startDateTimestamp, endDateTimestamp) {
    return axiosInstance
      .get(
        ApiEndpoints.TRANSACTIONS +
          '/by_date/' +
          startDateTimestamp +
          '/' +
          endDateTimestamp +
          '?account_guids=' +
          accountGuid,
      )
      .then(response => {
        const transactions = FireflyAPI.removeItemWrapper(response.data, 'transaction')

        return Promise.resolve(transactions)
      })
      .catch(error => error)
  },

  loadTransactionsByCategoryGuids(
    guids,
    startDate,
    endDate,
    accounts,
    categories,
    serverAction = response => response,
  ) {
    const guidParam = guids.join('+')

    return axiosInstance
      .get(
        ApiEndpoints.TRANSACTIONS +
          '/by_date/' +
          startDate +
          '/' +
          endDate +
          '/by_category_guids/' +
          guidParam,
      )
      .then(response => {
        const transactions = FireflyAPI.removeItemWrapper(response.data, 'transaction')

        return serverAction(transactions, accounts, categories)
      })
      .catch(error => error)
  },

  loadTransactionsPagesByDateRange(startDate, endDate) {
    return axiosInstance
      .get(`${ApiEndpoints.TRANSACTIONS}/paginate?from_date=${startDate}&to_date=${endDate}`)
      .then(data => data)
  },

  loadTransactionsPage(page) {
    return axiosInstance.get(
      `${ApiEndpoints.TRANSACTIONS}/?from_date=${page.startDate}&to_date=${page.endDate}&page=${page.page}`,
    )
  },

  loadTransactionsByParentCategoryGuids(parentGuids, startDate, endDate) {
    const guidParam = parentGuids.join('+')

    return axiosInstance
      .get(
        `${ApiEndpoints.TRANSACTIONS}/by_top_level_category_guids/${guidParam}/by_date/${startDate}/${endDate}`,
      )
      .then(response => FireflyAPI.removeItemWrapper(response.data, 'transaction'))
      .catch(error => error)
  },

  loadTransactionsByDateRange(startDateTimestamp, endDateTimestamp) {
    return axiosInstance
      .get(ApiEndpoints.TRANSACTIONS + '/by_date/' + startDateTimestamp + '/' + endDateTimestamp)
      .then(response => {
        const transactions = FireflyAPI.removeItemWrapper(response.data, 'transaction')

        return transactions
      })
      .catch(error => error)
  },

  loadTransactionRules() {
    return axiosInstance
      .get(ApiEndpoints.TRANSACTION_RULES)
      .then(response => response.data.transaction_rules)
  },

  createTransactionRule(rule) {
    return axiosInstance.post(ApiEndpoints.TRANSACTION_RULES, rule).then(response => response.data)
  },

  deleteTransactionRule(ruleGuid) {
    return axiosInstance
      .delete(`${ApiEndpoints.TRANSACTION_RULES}/${ruleGuid}`)
      .then(response => response.data)
  },

  saveTransactionRule(payload) {
    return axiosInstance
      .put(`${ApiEndpoints.TRANSACTION_RULES}/${payload.transaction_rule.guid}`, payload)
      .then(response => response.data)
  },

  createManualTransaction(transaction, serverAction = response => response) {
    return axiosInstance
      .post(ApiEndpoints.TRANSACTIONS, transaction)
      .then(response => {
        return serverAction(response.data.transaction)
      })
      .catch(error => error)
  },

  updateTransaction(
    transaction,
    accounts = [],
    categories = [],
    serverAction = response => response,
  ) {
    const endpoint = transaction.guid
      ? ApiEndpoints.TRANSACTIONS + '/' + transaction.guid
      : ApiEndpoints.TRANSACTIONS
    const method = transaction.guid ? 'put' : 'post'

    return axiosInstance[method](endpoint, transaction)
      .then(response => {
        return serverAction(response.data.transaction, accounts, categories)
      })
      .catch(error => error)
  },

  deleteTransaction(guid, serverAction = response => response) {
    return axiosInstance
      .delete(ApiEndpoints.TRANSACTIONS + '/' + guid)
      .then(() => {
        serverAction(guid)
      })
      .catch(() => {
        return
      })
  },

  createTransactionSplit(parent, children, serverAction = response => response) {
    const requests = [
      axiosInstance.put(ApiEndpoints.TRANSACTIONS + '/' + parent.guid, parent),
      ...children.map(child => {
        return axiosInstance.post(ApiEndpoints.TRANSACTIONS, child)
      }),
    ]

    return axios
      .all(requests)
      .then(responses => {
        const transactions = responses.reduce((accumulator, response) => {
          return [...accumulator, response.data.transaction]
        }, [])

        return serverAction({ parent: transactions[0], children: transactions.slice(1) })
      })
      .catch(error => error)
  },

  deleteTransactionSplit(parentGuid, serverAction = response => response) {
    return axiosInstance
      .delete(`${ApiEndpoints.TRANSACTIONS}/${parentGuid}/unsplit`)
      .then(responses => {
        const updatedParent = responses[0].data.transaction

        return serverAction({ updatedParent })
      })
      .catch(error => error)
  },

  loadSubscriptionsByDateRange(startDateTimestamp, endDateTimestamp) {
    return axiosInstance
      .get(`${ApiEndpoints.SUBSCRIPTIONS}/by_date/${startDateTimestamp}/${endDateTimestamp}`)
      .then(response => FireflyAPI.removeItemWrapper(response.data, 'transaction'))
  },

  createTagging(tagging) {
    return axiosInstance
      .post(ApiEndpoints.TAGGINGS, tagging)
      .then(response => {
        return response.data.tagging
      })
      .catch(error => error)
  },

  deleteTagging(tagging) {
    return axiosInstance
      .delete(ApiEndpoints.TAGGINGS + '/' + tagging.guid)
      .then(() => {
        return tagging
      })
      .catch(error => error)
  },

  createTag(tag) {
    return axiosInstance
      .post(ApiEndpoints.TAGS, tag)
      .then(response => {
        return response.data.tag
      })
      .catch(error => error)
  },

  updateTag(tag) {
    return axiosInstance
      .put(ApiEndpoints.TAGS + '/' + tag.guid, tag)
      .then(response => {
        return response.data.tag
      })
      .catch(error => error)
  },

  deleteTag(tag) {
    return axiosInstance
      .delete(ApiEndpoints.TAGS + '/' + tag.guid)
      .then(() => {
        return tag
      })
      .catch(error => error)
  },

  mergeAccounts(accountGuids) {
    return axiosInstance
      .put(ApiEndpoints.ACCOUNTS + '/merge', { accounts: accountGuids })
      .catch(error => error)
  },

  createAccount(account) {
    return axiosInstance.post(ApiEndpoints.ACCOUNTS, account).then(response => {
      return response.data.account
    })
  },

  saveAccount(account) {
    return axiosInstance
      .put(ApiEndpoints.ACCOUNTS + '/' + account.guid, account)
      .then(response => {
        return response.data.account
      })
      .catch(error => error)
  },

  saveAccounts(accounts) {
    const requests = accounts.map(account =>
      axiosInstance.put(ApiEndpoints.ACCOUNTS + '/' + account.guid, account),
    )

    return axios.all(requests).catch(error => error)
  },

  deleteAccount(account) {
    return axiosInstance.delete(ApiEndpoints.ACCOUNTS + '/' + account.guid).catch(error => error)
  },

  saveHolding(holding) {
    return axiosInstance
      .put(ApiEndpoints.HOLDINGS + '/' + holding.guid, holding)
      .then(response => response.data)
      .catch(error => error)
  },

  saveCategory(category, serverAction = response => response) {
    return axiosInstance
      .post(ApiEndpoints.CATEGORIES, category)
      .then(response => {
        serverAction(response.data.category)
        return response.data.category
      })
      .catch(error => error)
  },

  deleteCategory(category, serverAction = response => response) {
    return axiosInstance
      .delete(ApiEndpoints.CATEGORIES + '/' + category.guid)
      .then(() => {
        serverAction(category)
      })
      .catch(error => error)
  },

  updateCategory(category, serverAction = response => response) {
    return axiosInstance
      .put(ApiEndpoints.CATEGORIES + '/' + category.guid, category)
      .then(response => {
        serverAction(response.data.category)
        return response.data.category
      })
      .catch(error => error)
  },

  // ANALYTICS
  createAnalyticsSession(options) {
    return axiosInstance
      .post(ApiEndpoints.ANALYTICS_SESSION, options)
      .then(response => response.data)
      .catch(error => error)
  },

  closeAnalyticsSession(session) {
    if (session && session.analytics_session && session.analytics_session.guid) {
      return axiosInstance
        .put(ApiEndpoints.ANALYTICS_SESSION + '/' + session.analytics_session.guid, session)
        .then(response => response.data)
        .catch(error => error)
    } else {
      return Promise.resolve(null)
    }
  },

  closeFeatureVisit(featureVisitData) {
    if (featureVisitData.feature_visit && featureVisitData.feature_visit.guid) {
      return axiosInstance
        .put(
          ApiEndpoints.FEATURE_VISITS + '/' + featureVisitData.feature_visit.guid,
          featureVisitData,
        )
        .then(response => response.data)
        .catch(error => error)
    } else {
      return Promise.resolve(null)
    }
  },

  createNewFeatureVisit(featureVisitData) {
    return axiosInstance
      .post(ApiEndpoints.FEATURE_VISITS, featureVisitData)
      .then(response => response.data)
  },

  sendAnalyticsEvent(event) {
    return axiosInstance
      .post(ApiEndpoints.ANALYTICS_EVENTS, { analytics_event: event })
      .then(response => response.data)
  },

  sendAnalyticsPageview(analytics_pageview) {
    return axiosInstance
      .post(ApiEndpoints.ANALYTICS_PAGEVIEW, { analytics_pageview })
      .then(response => response.data)
      .catch(error => error)
  },
  // END ANALYTICS

  // SESSION
  extendSession() {
    return axiosInstance
      .get(ApiEndpoints.ROOT + '/extend_session')
      .then(response => response.data)
      .catch(error => error)
  },
  // END SESSION
  updateUser(user) {
    return axiosInstance
      .put(ApiEndpoints.USER, user)
      .then(response => response && response.data.user)
  },

  updateUserProfile(userProfile) {
    const url = `${ApiEndpoints.USER_PROFILES}/${userProfile.guid}`

    return axiosInstance
      .put(url, userProfile)
      .then(response => response.data)
      .catch(error => error)
  },

  updatePassword(args) {
    return axiosInstance
      .put(ApiEndpoints.USER + '/change_password', args)
      .then(response => response.data)
  },

  sendEmailVerification() {
    return axiosInstance.post(ApiEndpoints.EMAIL_VERIFICATIONS)
  },

  sendPhoneVerification() {
    return axiosInstance.post(ApiEndpoints.PHONE_VERIFICATIONS + '/deliver')
  },

  syncAccounts() {
    return axiosInstance.get(ApiEndpoints.SYNC_ACCOUNTS)
  },

  verifyPhoneToken(token) {
    return axiosInstance
      .post(ApiEndpoints.PHONE_VERIFICATIONS + '/verify', { sms_verification_token: token })
      .then(response => {
        if (response && response.data.verified) {
          return PhoneActions.enterVerificationTokenValid
        } else {
          return PhoneActions.enterVerificationTokenInvalid
        }
      })
  },

  loadAgreement() {
    return axiosInstance
      .get(ApiEndpoints.AGREEMENT)
      .then(response => response.data.agreement)
      .catch(error => error)
  },

  // GOALS
  createGoal(goal) {
    return axiosInstance
      .post(ApiEndpoints.GOALS, goal)
      .then(response => response.data)
      .catch(error => error)
  },

  updateGoal(goal) {
    return axiosInstance
      .put(ApiEndpoints.GOALS + '/' + goal.guid, goal)
      .then(response => response.data)
  },

  deleteGoal(goal) {
    return axiosInstance
      .delete(ApiEndpoints.GOALS + '/' + goal.guid)
      .then(response => response.data)
      .catch(error => error)
  },

  loadGoals() {
    return axiosInstance
      .get(ApiEndpoints.GOALS)
      .then(response => response.data)
      .catch(error => error)
  },

  loadMonthlyCashFlowProfile() {
    return axiosInstance.get(ApiEndpoints.MONTHLY_CASH_FLOW_PROFILE).then(response => response.data)
  },

  updateMonthlyCashFlowProfile(monthlyCashFlow) {
    return axiosInstance
      .put(ApiEndpoints.MONTHLY_CASH_FLOW_PROFILE, monthlyCashFlow)
      .then(response => response.data)
  },

  repositionGoals(goals) {
    return axiosInstance
      .post(ApiEndpoints.GOALS + '/reposition', { goals })
      .then(response => response.data)
      .catch(error => error)
  },
  // END GOALS

  // RETIREMENT GOALS
  createRetirementGoal(retirement_goal) {
    return axiosInstance
      .post(ApiEndpoints.RETIREMENT_GOALS, { retirement_goal })
      .then(response => response.data)
      .catch(error => error)
  },

  updateRetirementGoal(retirement_goal) {
    return axiosInstance
      .put(ApiEndpoints.RETIREMENT_GOALS + '/' + retirement_goal.guid, {
        retirement_goal,
      })
      .then(response => response.data)
      .catch(error => error)
  },

  deleteRetirementGoal(goal) {
    return axiosInstance
      .delete(ApiEndpoints.RETIREMENT_GOALS + '/' + goal.guid)
      .then(response => response.data)
      .catch(error => error)
  },

  loadRetirementGoals() {
    return axiosInstance
      .get(ApiEndpoints.RETIREMENT_GOALS)
      .then(response => response.data)
      .catch(error => error)
  },

  loadRetirementGoalAccounts() {
    return axiosInstance
      .get(ApiEndpoints.RETIREMENT_GOAL_ACCOUNTS)
      .then(response => response.data)
      .catch(error => error)
  },

  createRetirementGoalAccount(retirement_goal_account) {
    return axiosInstance
      .post(ApiEndpoints.RETIREMENT_GOAL_ACCOUNTS, {
        retirement_goal_account,
      })
      .then(response => response.data)
      .catch(error => error)
  },

  deleteRetirementGoalAccount(retirement_goal_account) {
    return axiosInstance
      .delete(ApiEndpoints.RETIREMENT_GOAL_ACCOUNTS + '/' + retirement_goal_account.guid)
      .then(response => response.data)
      .catch(error => error)
  },

  // END RETIREMENT GOALS

  // CASH FLOW REQUESTS
  createCashflowEvent(event) {
    return axiosInstance.post(ApiEndpoints.CASHFLOW_EVENTS, event).then(response => response.data)
  },

  createCashflowSequence(sequence) {
    return axiosInstance
      .post(ApiEndpoints.CASHFLOW_SEQUENCES, sequence)
      .then(response => {
        return response && response.data.cashflow_sequence
      })
      .catch(error => error)
  },

  saveCashflowSequence(sequence) {
    // Get the original sequence - The function argument has potentially been modified.
    const sequenceUrl = ApiEndpoints.CASHFLOW_SEQUENCES + '/' + sequence.guid

    return axiosInstance
      .get(sequenceUrl)
      .then(response => {
        const originalSequence = response.data.cashflow_sequence

        // Get all of the sequence's events
        const eventsUrl =
          ApiEndpoints.CASHFLOW_EVENTS + '?cashflow_sequence_guid=' + originalSequence.guid

        return axiosInstance
          .get(eventsUrl)
          .then(response => {
            // If the sequence has existing events then we set the end date for the original sequence
            // and create a new sequence.
            if (response.data.cashflow_events.length) {
              const sequenceEvents = _orderBy(response.data.cashflow_events, 'occurred_on', 'desc')
              const mostRecentEvent = sequenceEvents[0]
              const endDate = moment
                .unix(mostRecentEvent.occurred_on)
                .add(1, 'day')
                .startOf('day')
                .unix()

              // Update original sequence end date
              originalSequence.end_date = endDate

              const updateSequenceUrl =
                ApiEndpoints.CASHFLOW_SEQUENCES + '/' + originalSequence.guid

              axiosInstance.put(updateSequenceUrl, originalSequence)

              // Create a new sequence based upon the supplied form data
              sequence.guid = null

              const createSequenceUrl = ApiEndpoints.CASHFLOW_SEQUENCES

              return axiosInstance
                .post(createSequenceUrl, sequence)
                .then(response => response.data)
                .catch(error => error)
              //Else we just update the existing sequence
            } else {
              const requestUrl = ApiEndpoints.CASHFLOW_SEQUENCES + '/' + sequence.guid

              return axiosInstance
                .put(requestUrl, sequence)
                .then(response => response.data)
                .catch(error => error)
            }
          })
          .catch(error => error)
      })
      .catch(error => error)
  },

  deleteCashflowEvent(cashflowEventGuid) {
    const requestUrl = ApiEndpoints.CASHFLOW_EVENTS + '/' + cashflowEventGuid

    return axiosInstance
      .delete(requestUrl)
      .then(response => response.data)
      .catch(error => error)
  },

  deleteCashflowSequence(cashflowSequenceGuid) {
    return axiosInstance
      .delete(ApiEndpoints.CASHFLOW_SEQUENCES + '/' + cashflowSequenceGuid)
      .then(response => response.data)
      .catch(error => error)
  },

  endCashflowSequence(cashflowSequence) {
    cashflowSequence.end_date = moment()
      .startOf('day')
      .unix()

    return axiosInstance
      .put(ApiEndpoints.CASHFLOW_SEQUENCES + '/' + cashflowSequence.guid, cashflowSequence)
      .then(response => response.data)
      .catch(error => error)
  },

  updateCashflowEvent(event) {
    return axiosInstance
      .put(ApiEndpoints.CASHFLOW_EVENTS + '/' + event.guid, event)
      .then(response => response.data)
  },

  updateCashflowSequence(sequence) {
    return axiosInstance
      .put(ApiEndpoints.CASHFLOW_SEQUENCES + '/' + sequence.guid, sequence)
      .then(response => response.data)
      .catch(error => error)
  },

  loadCashFlowEvents() {
    // load cashflow events from the beginning of last month to now
    const now = new Date()

    return axiosInstance
      .get(
        `${ApiEndpoints.CASHFLOW_EVENTS}/from/${getUnixTime(
          startOfMonth(subMonths(now, 1)),
        )}/to/${getUnixTime(now)}`,
      )
      .then(response => response.data.cashflow_events)
      .catch(error => error)
  },

  loadCashFlowProjectedEvents() {
    // load cashflow projected events from the beginning of last month to the end
    // of twelve months from now. Projected Events in the past are used to reconcile
    // which cashFlow events are marked as paid.
    const now = new Date()

    return axiosInstance
      .get(
        `${ApiEndpoints.CASHFLOW_SEQUENCES}/projected_events/from/${getUnixTime(
          startOfMonth(subMonths(now, 1)),
        )}/to/${getUnixTime(endOfMonth(addMonths(now, 12)))}`,
      )
      .then(response => response.data.cashflow_events)
      .catch(error => error)
  },

  loadCashFlowSequences() {
    return axiosInstance
      .get(ApiEndpoints.CASHFLOW_SEQUENCES)
      .then(response => response.data.cashflow_sequences)
      .catch(error => error)
  },

  loadCashFlowDailyAccountBalances(accounts) {
    // load daily account balances from the beginning of last month up to today
    const accountBalanceRequests = accounts.map(account => {
      return axiosInstance.get(
        ApiEndpoints.ACCOUNTS +
          '/' +
          account.guid +
          '/daily_account_balances' +
          '/from/' +
          getUnixTime(startOfMonth(subMonths(new Date(), 1))) +
          '/to/' +
          getUnixTime(new Date()),
      )
    })

    return Promise.all(accountBalanceRequests)
      .then(responses => {
        const dailyAccountBalances = responses.reduce((balances, response) => {
          return balances.concat(response.data.daily_account_balances)
        }, [])

        return formatDailyAccountBalances(dailyAccountBalances)
      })
      .catch(error => error)
  },

  loadCashFlowWidgetDataForDateRange(accounts, dateRange) {
    const { selectedStartDate, selectedEndDate } = dateRange

    // if the beginning of the selected date range is in the future we want to
    // set the start date of the request to "startOfToday" so we can sum the cashflow events
    // between "startOfToday" and the start of the selected date range to adjust account
    // balances as predicted into the future.

    const startDate = isPast(selectedStartDate) ? selectedStartDate : getUnixTime(startOfToday())

    const requests = [
      axiosInstance.get(`${ApiEndpoints.CASHFLOW_EVENTS}/from/${startDate}/to/${selectedEndDate}`),
      axiosInstance.get(
        `${ApiEndpoints.CASHFLOW_SEQUENCES}/projected_events/from/${startDate}/to/${selectedEndDate}`,
      ),
      axiosInstance.get(ApiEndpoints.CASHFLOW_SEQUENCES),
    ]

    return axios.all(requests).then(
      axios.spread((eventsResponse, projectedEventsResponse, sequencesResponse) => {
        const accountBalanceRequests = accounts.map(account => {
          return axiosInstance.get(
            ApiEndpoints.ACCOUNTS +
              '/' +
              account.guid +
              '/daily_account_balances' +
              '/from/' +
              startDate +
              '/to/' +
              selectedEndDate,
          )
        })

        return axios.all(accountBalanceRequests).then(responses => {
          const dailyAccountBalances = responses.reduce((balances, response) => {
            return balances.concat(response.data.daily_account_balances)
          }, [])

          return {
            actualEvents: eventsResponse.data.cashflow_events,
            historicalAccountBalances: dailyAccountBalances,
            projectedEvents: projectedEventsResponse.data.cashflow_events,
            sequences: sequencesResponse.data.cashflow_sequences,
          }
        })
      }),
    )
  },

  loadTransactionsNearestCashflowEvent(event) {
    const date = event.expected_date || event.occurred_on

    return axiosInstance
      .get(
        ApiEndpoints.CASHFLOW_SEQUENCES +
          '/' +
          event.cashflow_sequence_guid +
          '/nearest_transactions/' +
          date,
      )
      .then(response => {
        return FireflyAPI.removeItemWrapper(response.data, 'transaction')
      })
      .catch(error => error)
  },

  loadSuggestedTransactions(accounts) {
    const requests = accounts.map(account => {
      return axiosInstance.get(
        ApiEndpoints.ACCOUNTS + '/' + account.guid + '/transactions/recurring',
      )
    })

    return axios
      .all(requests)
      .then(responses => {
        const transactions = responses.reduce((accumulator, response) => {
          return accumulator.concat(FireflyAPI.removeItemWrapper(response.data, 'transaction'))
        }, [])

        return _orderBy(transactions, 'date', 'desc')
      })
      .catch(error => error)
  },
  // END CASH FLOW

  // NET WORTH
  loadNetWorthData(isNetWorthExperimentRunning) {
    let accounts
    let members

    const requests = [
      axiosInstance.get(ApiEndpoints.ACCOUNTS),
      axiosInstance.get(ApiEndpoints.MEMBERS),
    ]

    return Promise.all(requests)
      .then(([accountsResponse, membersResponse]) => {
        members = membersResponse.data.members
        accounts = AccountUtils.filterAccounts(
          membersResponse.data.members,
          accountsResponse.data.accounts,
        )
      })
      .then(() => {
        const accountBalanceRequests = accounts.map(account => {
          if (isNetWorthExperimentRunning) {
            return axiosInstance.get(
              ApiEndpoints.ACCOUNTS + '/' + account.guid + '/historical_account_balances',
            )
          } else {
            return axiosInstance.get(
              ApiEndpoints.ACCOUNTS + '/' + account.guid + '/monthly_account_balances',
            )
          }
        })

        return Promise.all(accountBalanceRequests)
      })
      .then(responses => {
        const flattenBalances = (balances, balance) => [
          ...balances,
          ...(isNetWorthExperimentRunning
            ? balance.data.historical_account_balances
            : balance.data.monthly_account_balances),
        ]

        return {
          accounts,
          members,
          monthlyAccountBalances: _sortBy(
            responses.reduce(flattenBalances, []),
            balance => balance.year_month,
          ),
        }
      })
      .catch(error => error)
  },
  // END NET WORTH

  loadNotifications() {
    return axiosInstance
      .get(ApiEndpoints.NOTIFICATIONS)
      .then(response => FireflyAPI.removeItemWrapper(response.data.notifications, 'notification'))
  },

  saveNotification(notification) {
    return axiosInstance
      .put(`${ApiEndpoints.NOTIFICATIONS}/${notification.guid}`, notification)
      .then(response => response.data.notification)
      .catch(error => error)
  },

  markAllNotificationsAsRead() {
    return axiosInstance
      .put(ApiEndpoints.MARK_ALL_NOTIFICATIONS_AS_READ)
      .then(response => response.data)
      .catch(error => error)
  },

  calculateHealthScore() {
    return axiosInstance
      .post(`${ApiEndpoints.HEALTH_SCORES}/calculate`)
      .then(response => response.data.health_score)
  },
  fetchPeerScore(birthYear) {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/average/${birthYear}`)
      .then(response => response.data.average_health_score)
  },
  fetchAverageHealthScores() {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/monthly_averages`)
      .then(response => response.data)
  },
  fetchHealthScore() {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/latest`)
      .then(response => response.data.health_score)
  },
  fetchDebtSpendTransactions() {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/transactions/debt_spend`)
      .then(response => response.data)
  },
  fetchStandardSpendTransactions() {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/transactions/standard_spend`)
      .then(response => response.data)
  },
  fetchSpendingFeeTransactions() {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/transactions/spending_fee`)
      .then(response => response.data)
  },
  fetchIncomeTransactions() {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/transactions/income`)
      .then(response => response.data)
  },
  fetchMonthlyHealthScoreSummaries() {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/monthly_summaries`)
      .then(response => response.data)
  },
  fetchHealthScoreChangeReports(startDate, endDate) {
    return axiosInstance
      .get(`${ApiEndpoints.HEALTH_SCORES}/change_report/from/${startDate}/to/${endDate}`)
      .then(response => response.data)
  },
  // END FINSTRONG

  fetchScheduledPayments() {
    return axiosInstance
      .get(`${ApiEndpoints.SCHEDULED_PAYMENTS}`)
      .then(response => response.data.scheduled_payments)
  },
  // END SCHEDULED PAYMENTS

  addAccountToSpendingPlan(guid, accountGuid) {
    return axiosInstance
      .post(`${ApiEndpoints.SPENDING_PLANS}/${guid}/spending_plan_accounts`, {
        account_guid: accountGuid,
      })
      .then(response => response.data)
  },
  addPlannedExpenseToSpendingPlan(guid, iterationNumber, categoryGuid, amount, oneTime) {
    return axiosInstance
      .post(`${ApiEndpoints.SPENDING_PLANS}/${guid}/iterations/${iterationNumber}/planned_items`, {
        amount_planned: amount,
        category_guid: categoryGuid,
        is_one_time: oneTime,
      })
      .then(response => response.data)
  },
  addRecurringExpenseToSpendingPlan(guid, iterationNumber, scheduledPaymentGuid) {
    return axiosInstance
      .post(
        `${ApiEndpoints.SPENDING_PLANS}/${guid}/iterations/${iterationNumber}/recurring_items`,
        { scheduled_payment_guid: scheduledPaymentGuid },
      )
      .then(response => response.data)
  },
  addSpendingPlan(iterationInterval) {
    return axiosInstance
      .post(`${ApiEndpoints.SPENDING_PLANS}`, { iteration_interval: iterationInterval })
      .then(response => response.data)
  },
  fetchSpendingPlans() {
    return axiosInstance
      .get(`${ApiEndpoints.SPENDING_PLANS}`)
      .then(response => response.data.map(spendingPlan => spendingPlan.spending_plan))
  },
  fetchSpendingPlan(guid) {
    return axiosInstance
      .get(`${ApiEndpoints.SPENDING_PLANS}/${guid}`)
      .then(response => response.data.spending_plan)
  },
  fetchSpendingPlanIteration(guid, iterationNumber) {
    return axiosInstance
      .get(`${ApiEndpoints.SPENDING_PLANS}/${guid}/iterations/${iterationNumber}`)
      .then(response => response.data.spending_plan_iteration)
  },
  fetchSpendingPlanTransactions(guids) {
    return axiosInstance
      .post(`${ApiEndpoints.TRANSACTIONS}/by_guids`, { guids: guids.join('+') })
      .then(response => response.data.map(data => data.transaction))
  },
  removeAccountFromSpendingPlan(guid, spAccountGuid) {
    return axiosInstance.delete(
      `${ApiEndpoints.SPENDING_PLANS}/${guid}/spending_plan_accounts/${spAccountGuid}`,
    )
  },
  removePlannedExpenseFromSpendingPlan(guid, iterationNumber, plannedExpenseGuid) {
    return axiosInstance
      .delete(
        `${ApiEndpoints.SPENDING_PLANS}/${guid}/iterations/${iterationNumber}/planned_items/${plannedExpenseGuid}`,
      )
      .then(response => response.data)
  },
  removeRecurringExpenseFromSpendingPlan(guid, iterationNumber, recurringItemGuid) {
    return axiosInstance
      .delete(
        `${ApiEndpoints.SPENDING_PLANS}/${guid}/iterations/${iterationNumber}/recurring_items/${recurringItemGuid}`,
      )
      .then(response => response.data)
  },
  updatePlannedExpenseInSpendingPlan(guid, iterationNumber, plannedExpenseGuid, amount) {
    return axiosInstance
      .put(
        `${ApiEndpoints.SPENDING_PLANS}/${guid}/iterations/${iterationNumber}/planned_items/${plannedExpenseGuid}`,
        { amount_planned: amount },
      )
      .then(response => response.data)
  },
  // END SPENDING PLAN

  // Helpers
  removeItemWrapper(items, key) {
    return items.map(item => {
      return item[key]
    })
  },

  /**
   * Build a query string from an object. This doesn't handle query values that
   * are objects. Just primatives, and arrays of primatives.
   *
   * See tests for examples
   */
  buildQueryString(queryObj) {
    return _reduce(
      queryObj,
      (queryStr, value, queryName) => {
        const queryParam = FireflyAPI.buildQueryParameter(queryName, value)

        return queryStr === '' ? `?${queryParam}` : `${queryStr}&${queryParam}`
      },
      '',
    )
  },

  /**
   * Build a single query paramter from a key and a value. Value cannot be an
   * object, it must be a primative or an array of primatives
   *
   * See tests for examples
   */
  buildQueryParameter(key, value) {
    return _isArray(value)
      ? value.map(val => `${key}[]=${encodeURIComponent(val)}`).join('&')
      : `${key}=${encodeURIComponent(value)}`
  },

  getHumanInteractionGuid(isHuman) {
    const token = _get(window, ['app', 'options', 'session_token'], '')

    return window.btoa(token.slice(0, 10)) + (isHuman ? '1' : '0')
  },
}

/**
 * Look at the navigator global and try to get a comma separated list of
 * plugins. Thsi is just an effor to fingerprint requests for security.
 *
 * NOTE: plugins is a PluginArray, not an Array see:
 * https://developer.mozilla.org/en-US/docs/Web/API/PluginArray
 */
export function getNavigatorPluginNames(plugins) {
  if (!plugins) return ''

  const pluginNames = []

  for (let i = 0; i < plugins.length; i++) {
    pluginNames.push(plugins[i].name)
  }

  return pluginNames.sort().join(',')
}

/**
 * Look at the navigator global and try to get a comma separated list of mime
 * type names for the headers. This is just an effort to finger print requests
 * This isn't required from a server view point.
 *
 * NOTE: mimeTypes is a MimeTypeArray, not an Array, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/MimeTypeArray
 */
export function getNavigatorMimeTypeNames(mimeTypes) {
  if (!mimeTypes) return ''

  const mimeTypeNames = []

  for (let i = 0; i < mimeTypes.length; i++) {
    mimeTypeNames.push(mimeTypes[i].type)
  }

  return mimeTypeNames.sort().join(',')
}
// const apiBridge = require('../../shared/connect/fireflyApiBridge')
let bridge = require('../../shared/connect/fireflyApiBridge');
if(!_get(window, ['app', 'options', 'server'])){
  console.log('Connection through bff server, not using bridge, ')
  bridge = {}
}else{
  console.log('Using firefly api bridge, ')
}
export default {
  ...FireflyAPI,
  ...bridge,
}
