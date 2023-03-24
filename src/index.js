 // LOAD FIRST!
import './config/init'

import React from 'react'
import _get from 'lodash/get'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import theme from './constants/Style'
import AppWrapper from './components/app/AppWrapper'
import { ConnectedTokenProvider } from './context/ConnectedTokenProvider.js'

import { GlobalErrorBoundary } from './components/app/GlobalErrorBoundary'

import WidgetDimensionObserver from './components/app/WidgetDimensionObserver'
import localizationDispatcher, { LocaleSources } from './redux/actions/Localization'
import { ActionTypes as ClientActionTypes } from './redux/actions/Client'
import { ActionTypes as WidgetProfileActionTypes } from './redux/actions/WidgetProfile'
import { ActionTypes as ThemeActionTypes } from './redux/actions/Theme'
import PostMessage, { sendPostMessage } from './utils/PostMessage'
import Store from './redux/Store'
import { registerAxiosInterceptors } from './config/axios'
import { updateTitleWithWidget } from './utils/Widget'
import * as Connect from './widgets/desktop/Connect'

registerAxiosInterceptors(Store.dispatch)

window.app = {}
window.app.config = {
  "client_guid": "****",
  "default_selected_widget_type_in_master": 0,
  "display_account_actions_in_connection_details": true,
  "display_account_number_in_accounts": false,
  "display_add_manual_transaction_in_transactions": true,
  "display_all_accounts_sidebar_in_accounts": true,
  "display_available_balance_in_accounts": false,
  "display_delete_option_in_connect": true,
  "display_disclosure_in_connect": false,
  "display_email_edit_field_in_settings": true,
  "display_full_external_account_number": true,
  "display_mobile_devices_in_settings": false,
  "display_notification_settings_in_settings": false,
  "display_only_external_accounts_in_accounts": false,
  "display_password_options_in_settings": true,
  "display_sms_edit_field_in_settings": true,
  "display_terms_and_conditions": false,
  "display_user_profile_in_settings": false,
  "display_user_transaction_rules_in_settings": true,
  "enable_add_account_in_zero_state": true,
  "enable_aggregation_prompts": true,
  "enable_circular_institution_logos": false,
  "enable_goals_redesign": false,
  "enable_high_contrast_budget_bubbles": false,
  "enable_ie_11_deprecation": false,
  "enable_manual_accounts": true,
  "enable_mark_account_closed_for_held_accounts": true,
  "enable_mark_account_duplicate_for_held_accounts": true,
  "enable_renaming_home_accounts": true,
  "enable_springboard_in_mini_net_worth": false,
  "enable_springboard_in_mini_spending": false,
  "enable_support_requests": true,
  "keepalive_url":null,
  "session_timeout":null,
  "session_timeout_url":null,
  "show_accounts_widget_in_master": true,
  "show_budgets_widget_in_master": true,
  "show_cash_flow_widget_in_master": true,
  "show_connections_widget_in_master": true,
  "show_debts_widget_in_master": true,
  "show_finstrong_widget_in_master": true,
  "show_full_experience_link_in_pulse_mini_widget": false,
  "show_goals_widget_in_master": true,
  "show_help_widget_in_master": true,
  "show_investments_widget_in_master": true,
  "show_net_worth_widget_in_master": true,
  "show_notifications_widget_in_master": true,
  "show_settings_widget_in_master": true,
  "show_spending_plan_widget_in_master": true,
  "show_spending_widget_in_master": true,
  "show_transactions_widget_in_master": true,
  "show_trends_widget_in_master": true,
  "use_iav_when_shared_routing_number_in_connect": false,
  "widgets_display_name": null,
  "websocket": {
    "url": ""
  }
}

Store.dispatch({
  type: WidgetProfileActionTypes.WIDGET_PROFILE_LOADED,
  payload: window.app.config
})


function oneTimeCallback(e) {
  // Allow clients to send in a configuration hash before the specific
  // widget has started loading.
  const { type, data } = PostMessage.parse(e.data)

  if (type === 'clientConfig') {
    const ui_message_version =
      _get(data, 'ui_message_version') ||
      _get(data, 'connect.ui_message_version') ||
      _get(data, 'master.ui_message_version', 1)

    const language = _get(data, 'language') || _get(data, 'connect.language')

    if (ui_message_version === 4) {
      // new version 4 of post messages
      sendPostMessage('config/initialized')
    } else {
      // old version of post messages
      PostMessage.send('config:initialized')
    }

    Store.dispatch({ type: ClientActionTypes.INITIALIZED_CLIENT_CONFIG, payload: data })

    if (data.theme) {
      Store.dispatch({ type: ThemeActionTypes.CONFIG_THEME_LOADED, payload: data.theme })
    }

    if (language) {
      localizationDispatcher(Store.dispatch).loadLocaleData(LocaleSources.WIDGET_LOADER, language)
    }

    window.removeEventListener('message', oneTimeCallback)
  }
}

const languageFromFirefly = document.querySelector('html').getAttribute('lang')

localizationDispatcher(Store.dispatch).loadLocaleData(LocaleSources.FIREFLY, languageFromFirefly)

// Check the window for configuration from SAML
// Atrium always sets this by default
if (window.app.clientConfig) {
  Store.dispatch({
    type: ClientActionTypes.INITIALIZED_CLIENT_CONFIG,
    payload: window.app.clientConfig,
  })

  if (window.app.clientConfig.theme) {
    Store.dispatch({
      type: ThemeActionTypes.CONFIG_THEME_LOADED,
      payload: window.app.clientConfig.theme,
    })
  }
}

//Set up event listener for every client until we can figure out who is using the js loader and who isn't
window.addEventListener('message', oneTimeCallback)
// The parent only tries sending this message down for the first 5 seconds.
// Remove itself if we never receive it.
setTimeout(() => {
  window.removeEventListener('message', oneTimeCallback)
}, 5000)

const widgetConfig = window.app.options || {}

/**
 * Accessibility Fix
 *
 * Update the title element generated by Firefly to match
 * the name of the widget loaded but only if this is not
 * the master widget.
 *
 * If this is the master widget, then
 * let the master widget update the title based upon the
 * current widget being shown in the master widget.
 */
if (widgetConfig.type !== 'master') {
  updateTitleWithWidget(widgetConfig.type)
}


ReactDOM.render(
  <Provider store={Store}>
    <ConnectedTokenProvider>
      <GlobalErrorBoundary>
        <WidgetDimensionObserver
          heightOffset={widgetConfig.type === 'master' ? theme.MasterTopBarHeight : 0}
        >
          <AppWrapper>
            <Connect />
          </AppWrapper>
        </WidgetDimensionObserver>
      </GlobalErrorBoundary>
    </ConnectedTokenProvider>
  </Provider>,
  document.getElementById('root'),
)

