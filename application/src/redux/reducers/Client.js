import _merge from 'lodash/merge'
import _get from 'lodash/get'

import { createReducer } from '../../utils/Reducer'
import { ActionTypes as AppActionTypes } from '../actions/App'
import { ActionTypes as ClientActionTypes } from '../actions/Client'
import { AGG_MODE, REFERRAL_SOURCES } from '../../connect/const/Connect'

const {
  CLIENT_COMMUNICATION_PROFILE_LOADED,
  CLIENT_PROFILE_LOADED,
  CLIENT_LOADED,
  INITIALIZED_CLIENT_CONFIG,
} = ClientActionTypes

const { LOAD_MASTER_DATA_SUCCESS } = AppActionTypes

// Client Profile Reducer
const clientProfileLoaded = (state, action) => action.payload

const clientProfileMasterDataLoaded = (state, action) =>
  action.payload.client_profile ? { ...state, ...action.payload.client_profile } : state

export const clientProfile = createReducer(
  {},
  {
    [CLIENT_PROFILE_LOADED]: clientProfileLoaded,
    [LOAD_MASTER_DATA_SUCCESS]: clientProfileMasterDataLoaded,
  },
)

// Client Communication Profile Reducer
const clientCommunicationProfileLoaded = (state, action) => action.payload

const clientCommunicationMasterDataLoaded = (state, action) =>
  action.payload.client_communication_profile
    ? { ...state, ...action.payload.client_communication_profile }
    : state

export const clientCommunicationProfile = createReducer(
  {},
  {
    [CLIENT_COMMUNICATION_PROFILE_LOADED]: clientCommunicationProfileLoaded,
    [LOAD_MASTER_DATA_SUCCESS]: clientCommunicationMasterDataLoaded,
  },
)

// Initialize Config Reducer
export const defaultClientConfig = {
  is_mobile_webview: false,
  target_origin_referrer: null,
  ui_message_protocol: 'post_message',
  ui_message_version: 1,
  ui_message_webview_url_scheme: 'mx',
  color_scheme: 'light',
  connect: {
    mode: AGG_MODE,
    current_institution_code: null,
    current_institution_guid: null,
    current_member_guid: null,
    current_microdeposit_guid: null,
    disable_background_agg: null,
    disable_institution_search: false,
    include_identity: null,
    include_transactions: null,
    oauth_referral_source: REFERRAL_SOURCES.BROWSER,
    update_credentials: false,
    wait_for_full_aggregation: false,
  },
}

/**
 * Initialize the client configuration
 */
const initializeConfig = (state, action) => {
  // `is_mobile_webview`, 'target_origin_referrer', and ui message configs are tricky config options with
  // a lot of past baggage. They can come from the top level object, but also
  // under a `master` and `connect` key, so we have to check all 3 to really
  // determine what their values are
  const masterConfig = _get(action, 'payload.master', {})
  const connectConfig = _get(action, 'payload.connect', {})
  const isMobileWebView = _get(action, 'payload.is_mobile_webview', false)

  const is_mobile_webview =
    isMobileWebView || connectConfig.is_mobile_webview || masterConfig.is_mobile_webview

  const ui_message_version = parseInt(
    connectConfig.ui_message_version ||
      masterConfig.ui_message_version ||
      defaultClientConfig.ui_message_version,
    10,
  )

  const ui_message_protocol =
    connectConfig.ui_message_protocol ||
    masterConfig.ui_message_protocol ||
    defaultClientConfig.ui_message_protocol

  const ui_message_webview_url_scheme =
    connectConfig.ui_message_webview_url_scheme ||
    masterConfig.ui_message_webview_url_scheme ||
    defaultClientConfig.ui_message_webview_url_scheme

  const target_origin_referrer =
    connectConfig.target_origin_referrer ||
    masterConfig.target_origin_referrer ||
    defaultClientConfig.target_origin_referrer

  const color_scheme =
    connectConfig.color_scheme || masterConfig.color_scheme || defaultClientConfig.color_scheme

  // if we are in a mobile webview, we are going to normalize that at the top
  // level of the config and remove them from under the master and connect keys
  // to isolate the obscurity in one place (here)
  delete connectConfig.is_mobile_webview
  delete masterConfig.is_mobile_webview

  delete connectConfig.ui_message_version
  delete masterConfig.ui_message_version

  delete connectConfig.ui_message_protocol
  delete masterConfig.ui_message_protocol

  delete connectConfig.ui_message_webview_url_scheme
  delete masterConfig.ui_message_webview_url_scheme

  delete connectConfig.color_scheme
  delete masterConfig.color_scheme

  delete connectConfig.target_origin_referrer
  delete masterConfig.target_origin_referrer

  return _merge(
    {},
    state,
    {
      is_mobile_webview,
      target_origin_referrer,
      ui_message_version,
      ui_message_protocol,
      ui_message_webview_url_scheme,
      color_scheme,
    },
    action.payload,
  )
}

export const initializedClientConfig = createReducer(defaultClientConfig, {
  [INITIALIZED_CLIENT_CONFIG]: initializeConfig,
})

// Client reducer
const clientLoaded = (state, action) => action.payload

const clientMasterDataLoaded = (state, action) =>
  action.payload.client ? { ...state, ...action.payload.client } : state

export const client = createReducer(
  {},
  {
    [CLIENT_LOADED]: clientLoaded,
    [LOAD_MASTER_DATA_SUCCESS]: clientMasterDataLoaded,
  },
)
