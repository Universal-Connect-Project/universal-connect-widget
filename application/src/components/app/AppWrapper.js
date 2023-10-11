import Bowser from 'bowser'
import { fromEvent, merge } from 'rxjs'
import { take } from 'rxjs/operators'
import Honeybadger from 'honeybadger-js'
import { createSelector } from 'reselect'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ThemeProvider } from 'mx-react-components'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import { initializeAnalyticsSession, sendAnalyticsEvent } from '../../redux/actions/Analytics'
import { loadTransactionRules } from '../../redux/actions/TransactionRules'
import { dispatcher as appDispatcher } from '../../redux/actions/App'
import { loadExperiments } from '../../redux/actions/Experiments'
import { loadUserFeatures } from '../../redux/actions/UserFeatures'
import { sendPostMessage } from '../../redux/actions/PostMessage'

import BrokawClient from '../../clients/BrokawClient'
import { APP_ROOT_ID, Session } from '../../constants/App'
import { EventCategories, EventLabels, EventActions } from '../../constants/analytics/App'

import TimeoutWarningModal from './TimeoutWarningModal'
import ToastOffer from '../shared/toasts/ToastOffer'
import TooSmallModal from './TooSmallModal'
import IEDeprecationModal from './IEDeprecationModal'
import { LoadSpinner } from './LoadSpinner'
import TransactionRecategorizeModal from '../shared/transactions/TransactionRecategorizeModal'

import TimedOutModal from './TimedOutModal'
import TermsAndConditions from '../TermsAndConditions'

import { getPendingRule } from '../../redux/selectors/TransactionRules'
import { getSessionIsTimedOut } from '../../redux/selectors/app'
import { getCurrentSession, getFeatureVisit } from '../../redux/selectors/Analytics'
import { getLocale, getMessages } from '../../redux/selectors/Localization'
import { getTrueWidth } from '../../redux/selectors/Browser'
import { getTheme } from '../../redux/selectors/Theme'

import { closeFeatureVisitFactory, closeAnalyticsSessionFactory } from '../../utils/Analytics'

import FireflyAPI from '../../utils/FireflyAPI'
import PostMessage from '../../utils/PostMessage'
import TimeoutHelper from '../../utils/TimeoutHelper'
import { buildClientSessionTimeoutURL } from '../../utils/Client'

import { isIE } from '../../utils/Browser'

export class AppWrapper extends React.Component {
  static propTypes = {
    clientConfig: PropTypes.object.isRequired,
    closeAnalyticsSession: PropTypes.func,
    closeFeatureVisit: PropTypes.func,
    componentFocusStack: PropTypes.array.isRequired,
    handleHumanEvent: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool,
    initializeAnalyticsSession: PropTypes.func.isRequired,
    loadExperiments: PropTypes.func.isRequired,
    loadMasterData: PropTypes.func.isRequired,
    loadTransactionRules: PropTypes.func.isRequired,
    loadUserFeatures: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    markSessionTimedOut: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    pendingRule: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func,
    sendPostMessage: PropTypes.func.isRequired,
    sessionIsTimedOut: PropTypes.bool,
    subscribeBrokawClientToUser: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    user: PropTypes.object,
    userProfile: PropTypes.object.isRequired,
    widgetProfile: PropTypes.object.isRequired,
    width: PropTypes.number,
  }

  static defaultProps = {
    user: {},
  }

  state = {
    showIEDeprecationModal: true,
    showTimeoutWarning: false,
    widgetType: '',
  }

  componentDidMount() {
    const widgetConfig = window.app.options || {}

    window.BrokawClient = BrokawClient

    const browser = Bowser.getParser(window.navigator.userAgent)

    this.props.initializeAnalyticsSession({
      product_name: widgetConfig.product_name || 'Individual Widget',
      product_version: '1.0.0',
      browser_name: browser.getBrowserName() || 'Unknown',
      browser_version: browser.getBrowserVersion() || '0.0.0',
      is_first_visit: false,
    })

    Honeybadger.setContext({
      widget: widgetConfig.type, // may be overridden in the Master widget
      in_master: widgetConfig.type === 'master',
      user_guid: this.props.user.guid,
    })

    this._logWidgetConfig(widgetConfig)
    this.props.loadMasterData()
    this.props.loadExperiments(window.app.experiments)
    this.props.loadUserFeatures()
    this.props.loadTransactionRules()

    this.setState({
      widgetType: _get(window, 'app.options.type'),
    })

    window.addEventListener('message', this._handleInboundPostMessage)

    const now = Date.now()

    this.lastSessionExtension = now
    this.lastPing = now
    this.lastClick = now

    if (this.props.clientConfig.ui_message_version === 4) {
      this.props.sendPostMessage('load')
    } else {
      PostMessage.send('load')
    }

    const watchedEvents = [
      fromEvent(document, 'keyup'),
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'swipe'),
      fromEvent(document, 'touchstart'),
      fromEvent(document, 'touchmove'),
      fromEvent(document, 'touchend'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'gesture'),
      fromEvent(document, 'gyroscope'),
      fromEvent(document, 'devicemotion'),
      fromEvent(document, 'deviceorientation'),
      fromEvent(document, 'MozOrientation'),
    ]

    this.watchedEventsSub$ = merge(...watchedEvents)
      .pipe(take(1))
      .subscribe(() => this.props.handleHumanEvent())
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.guid && this.props.user.guid !== prevProps.user.guid) {
      Honeybadger.setContext({
        // This will let HoneyBadger group errors by users.
        user_id: this.props.user.guid,
      })

      this.props.subscribeBrokawClientToUser(this.props.user.guid)
    }

    // If the master data is done loading, setup the timeout and keepalives
    if (prevProps.initialDataLoading && !this.props.initialDataLoading) {
      this._setupTimeout()
      this._setupKeepAlive()
    }

    if (
      this.props.componentFocusStack.length &&
      !prevProps.componentFocusStack.length &&
      !this.props.sessionIsTimedOut
    ) {
      if (this.props.clientConfig.ui_message_version === 4) {
        this.props.sendPostMessage('focusTrap', {
          trapped: true,
        })
      } else {
        PostMessage.send('focusTrap', {
          trapped: true,
        })
      }
    } else if (!this.props.componentFocusStack.length && prevProps.componentFocusStack.length) {
      if (this.props.clientConfig.ui_message_version === 4) {
        this.props.sendPostMessage('focusTrap', {
          trapped: false,
        })
      } else {
        PostMessage.send('focusTrap', {
          trapped: false,
        })
      }
    }

    // If the session is timedout and there is a redirect session url, redirect
    if (!prevProps.sessionIsTimedOut && this.props.sessionIsTimedOut) {
      this._windowRedirect()
    }
  }

  componentWillUnmount() {
    this._removeKeepAliveListeners()
    window.removeEventListener('message', this._handleInboundPostMessage)
    clearInterval(this.keepAliveInterval)
    this.watchedEventsSub$.unsubscribe()
    BrokawClient.unsubscribe()
  }

  _addKeepAliveListeners = () => {
    window.addEventListener('click', this._keepAliveClickCallback)
    window.addEventListener('touchstart', this._keepAliveClickCallback)
  }

  _removeKeepAliveListeners = () => {
    window.removeEventListener('click', this._keepAliveClickCallback)
    window.removeEventListener('touchstart', this._keepAliveClickCallback)
  }

  _sendPing = () => {
    const now = Date.now()
    const { ping_id } = window.app.options
    const { keepalive_url } = this.props.widgetProfile
    const pingUrl = keepalive_url ? `${keepalive_url}?_=${now}&ping_id=${ping_id || ''}` : null

    if (this.lastPing <= now - Session.PostMessagePingInterval) {
      if (this.props.clientConfig.ui_message_version === 4) {
        this.props.sendPostMessage('ping')
      } else {
        PostMessage.send('ping', false)
      }
      this._extendRemoteSession(pingUrl)
      this.lastPing = Date.now()
    }
  }

  _extendRemoteSession = pingUrl => {
    // The URL has a timestamp so each invocation will change the img src value
    // and React will do the right thing.
    if (pingUrl) this.setState({ pingUrl })
  }

  _keepAlive = () => {
    this._extendSession()
    this._sendPing()
  }

  _keepAliveClickCallback = () => {
    this.lastClick = Date.now()
  }

  _setupKeepAlive = () => {
    // If there has been click or touch event in the last 30/60 seconds, notify
    // the parent window via postMessage and extend our own session. All the times
    // references in the following code are MILLISECONDS
    this._addKeepAliveListeners()

    this.keepAliveInterval = setInterval(() => {
      const now = Date.now()

      // Check Clicks
      if (this.lastClick > now - Session.PostMessagePingInterval) {
        this._sendPing()
      }

      // 500 ms short to account for the interval processing.
      if (
        this.lastSessionExtension < now - Session.ExtendSessionInterval &&
        this.lastClick > now - Session.ExtendSessionInterval
      ) {
        this.timer.restart()
      }
    }, Session.PostMessagePingInterval)
  }

  _setupTimeout = () => {
    const timerOptions = {
      restartCallback: () => this._keepAlive(),
      timeoutCallback: () => this._initiateTimeout(),
      warningCallback: () => this._showTimeoutWarning(),
    }
    const widgetProfileTimeout = this.props.widgetProfile.session_timeout || 0

    // Only set the timer if the client has one. Client stores this in SECONDS
    if (widgetProfileTimeout) {
      timerOptions.timeout = widgetProfileTimeout
    }

    this.timer = new TimeoutHelper(timerOptions)
    this.timer.start()
  }

  _extendSession = () => {
    FireflyAPI.extendSession()
      .then(() => {
        const now = Date.now()

        this.lastSessionExtension = now
      })
      .catch(error => error)
  }

  _handleInboundPostMessage = e => {
    const eventData = PostMessage.parse(e.data)
    const type = eventData.type

    if (type === 'logout') {
      this._logout()
    } else if (type === 'ping') {
      this.timer.restart()
      this._extendSession()
    }

    // We listen to mx/sdk/info event to log SDK configs
    if (type === 'mx/sdk/info') {
      this._logSDKConfig(eventData.metadata)
    }
  }

  _logout = () => {
    const doLogout = () => {
      FireflyAPI.logout()
        .then(() => {
          PostMessage.send('logout', {
            logout: true,
          })
          this._windowRedirect()
        })
        .catch(error => error)
    }

    // We want to execute the logout regardless of what happens with analytics.
    Promise.all([this.props.closeFeatureVisit(), this.props.closeAnalyticsSession()])
      .then(doLogout, doLogout)
      .catch(error => error)
  }

  _initiateTimeout = () => {
    this.props.markSessionTimedOut()
    this.setState({ showTimeoutWarning: false })
    this._logout()
  }

  _showTimeoutWarning = () => {
    // we only want clicking the continue button to extend the session?
    this._removeKeepAliveListeners()
    this.setState({
      showTimeoutWarning: true,
    })
  }

  _onWarningExtend = () => {
    this.setState({
      showTimeoutWarning: false,
    })
    this._addKeepAliveListeners()
    this.timer.restart()
  }

  _windowRedirect = () => {
    const widgetType = `${this.props.widgetProfile.type}_widget`
    const url = buildClientSessionTimeoutURL(
      this.props.widgetProfile.session_timeout_url,
      widgetType,
    )

    if (url) {
      if (window.parent && window.parent.location) {
        window.parent.location.href = url
      } else {
        window.location.href = url
      }
    }
  }

  _logWidgetConfig = widgetConfig => {
    // Extract connect and client configs
    const { connect: connectConfig, ...clientConfig } = this.props.clientConfig

    const instrumentationData = {
      message: 'widget-config',
      instrumentation: {
        widget_type: widgetConfig.type,
        ...clientConfig,
        ...connectConfig,
      },
    }
    FireflyAPI.instrumentation(instrumentationData)
  }

  _logSDKConfig = sdkConfig => {
    const instrumentationData = {
      message: 'sdk-info',
      instrumentation: sdkConfig,
    }
    FireflyAPI.instrumentation(instrumentationData)
  }

  render() {
    if (this.props.initialDataLoading) {
      return <LoadSpinner showText={true} />
    }

    const widget = React.cloneElement(React.Children.only(this.props.children), {
      loadedFromMaster: false,
      user: this.props.user,
      userProfile: this.props.userProfile,
    })

    /**
     * The data-ui-test="application-root" on the root application div is
     * used by our Alert Bot and Nuestar services. Modifying this data-attribute
     * will cause down time alerts in production. Please do not change with
     * out coordinating with DevOps/Team Leads who have access to update these
     * scripts for these services.
     */
    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages}>
        <ThemeProvider theme={this.props.theme}>
          {this.props.sessionIsTimedOut ? (
            <div data-ui-test="application-root" id={APP_ROOT_ID} style={{ height: '100%' }}>
              <TimedOutModal />
            </div>
          ) : (
            <div data-ui-test="application-root" id={APP_ROOT_ID} style={{ height: '100%' }}>
              {widget}
              {this.state.widgetType.includes('mini-') ? null : <TermsAndConditions />}
              {_isEmpty(this.props.pendingRule) ? null : (
                <TransactionRecategorizeModal pending={this.props.pendingRule} />
              )}
              {this.state.showTimeoutWarning ? (
                <TimeoutWarningModal
                  onClick={this._onWarningExtend}
                  onMouseEnter={() => {
                    this.timer.pause()
                  }}
                  onMouseLeave={() => {
                    this.timer.resume()
                  }}
                />
              ) : null}
              {this.props.width < 320 && this.state.widgetType.indexOf('mini') === -1 ? (
                <TooSmallModal width={this.props.width} />
              ) : null}
              {this.props.widgetProfile?.enable_ie_11_deprecation &&
              this.state.showIEDeprecationModal &&
              isIE() ? (
                <IEDeprecationModal
                  onClose={() => {
                    this.setState({
                      showIEDeprecationModal: false,
                    })
                    this.props.sendAnalyticsEvent({
                      category: EventCategories.AB_TEST,
                      label: EventLabels.IE_DEPRECATION,
                      action: EventActions.CLOSE,
                    })
                  }}
                  onDownloadBrowser={browser =>
                    this.props.sendAnalyticsEvent({
                      category: EventCategories.AB_TEST,
                      label: EventLabels.IE_DEPRECATION,
                      action: `${EventActions.DOWNLOAD} - ${browser}`,
                    })
                  }
                  width={this.props.width}
                />
              ) : null}
              <ToastOffer widgetType={this.state.widgetType} />
              {this.state.pingUrl ? (
                <img
                  alt=""
                  aria-hidden="true"
                  id="_extendRemoteSession"
                  src={this.state.pingUrl}
                  style={{
                    height: '1px',
                    width: '1px',
                    border: '0px',
                    display: 'none',
                    visibility: 'hidden',
                  }}
                />
              ) : null}
            </div>
          )}
        </ThemeProvider>
      </IntlProvider>
    )
  }
}

const appWrapperState = createSelector(
  state => state.app.loading,
  state => state.userFeatures.loading,
  state => state.experiments.loading,
  state => state.componentStacks.focusStack,
  getCurrentSession,
  getFeatureVisit,
  getLocale,
  getMessages,
  getTrueWidth,
  getSessionIsTimedOut,
  state => state.userProfile,
  state => state.user.details,
  getTheme,
  state => state.widgetProfile,
  getPendingRule,
  state => state.initializedClientConfig,
  state => state.initializedClientConfig.color_scheme,
  (
    masterDataLoading,
    userFeaturesLoading,
    experimentsLoading,
    componentFocusStack,
    currentSession,
    featureVisit,
    locale,
    messages,
    width,
    sessionIsTimedOut,
    userProfile,
    user,
    theme,
    widgetProfile,
    pendingRule,
    clientConfig,
  ) => ({
    closeAnalyticsSession: closeAnalyticsSessionFactory(currentSession),
    closeFeatureVisit: closeFeatureVisitFactory(featureVisit),
    pendingRule,
    componentFocusStack,
    locale,
    initialDataLoading: masterDataLoading || userFeaturesLoading || experimentsLoading,
    messages,
    width,
    sessionIsTimedOut,
    userProfile,
    user,
    theme,
    widgetProfile,
    clientConfig,
  }),
)

const mapDispatchToProps = dispatch => ({
  initializeAnalyticsSession: sessionData => dispatch(initializeAnalyticsSession(sessionData)),
  sendAnalyticsEvent: eventDetails => dispatch(sendAnalyticsEvent(eventDetails)),
  sendPostMessage: (event, data) => dispatch(sendPostMessage(event, data)),
  loadMasterData: appDispatcher(dispatch).loadMasterData,
  markSessionTimedOut: appDispatcher(dispatch).markSessionTimedOut,
  handleHumanEvent: appDispatcher(dispatch).handleHumanEvent,
  loadExperiments: experiments => dispatch(loadExperiments(experiments)),
  loadUserFeatures: () => dispatch(loadUserFeatures()),
  loadTransactionRules: () => dispatch(loadTransactionRules()),
  subscribeBrokawClientToUser: userGuid => BrokawClient.subscribe(dispatch, userGuid),
})

export default connect(appWrapperState, mapDispatchToProps)(AppWrapper)
