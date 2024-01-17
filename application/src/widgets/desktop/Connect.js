import PropTypes from 'prop-types'
import React from 'react'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _isNil from 'lodash/isNil'
import _toLower from 'lodash/toLower'
import { sha256 } from 'js-sha256'
import { connect } from 'react-redux'
import posthog from 'posthog-js'
import { TokenContext } from '@kyper/tokenprovider'

import * as connectActions from 'reduxify/actions/Connect'
import { ActionTypes as AnalyticsActionTypes } from 'reduxify/actions/Analytics'
import { addAnalyticPath, removeAnalyticPath, sendAnalyticsEvent } from 'reduxify/actions/Analytics'
import { ActionTypes as PostMessageActionTypes } from 'reduxify/actions/PostMessage'

import { isShowNewExistingMemberEnhancementEnabled } from 'reduxify/selectors/UserFeatures'
import { getExperimentNamesToUserVariantMap } from 'reduxify/selectors/Experiments'
import { shouldShowConnectGlobalNavigationHeader } from 'reduxify/selectors/UserFeatures'

import { LoadingSpinner } from 'src/connect/components/LoadingSpinner'
import { GenericError } from 'src/connect/components/GenericError'
import RenderConnectStep from 'src/connect/components/RenderConnectStep'
import { DeleteMemberSurvey } from 'src/connect/components/DeleteMemberSurvey'
import { ConnectNavigationHeader } from 'src/connect/components/ConnectNavigationHeader'

import {
  AnalyticEvents,
  defaultEventMetadata,
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from 'src/connect/const/Analytics'
import { ConnectionStatusMap } from 'src/connect/const/Statuses'
import { AGG_MODE, VERIFY_MODE, TAX_MODE, STEPS } from 'src/connect/const/Connect'
import { connectABExperiments } from 'src/connect/experiments'
import { getActiveABExperimentDetails } from 'src/connect/hooks/useExperiment'
import { isRunningE2ETests } from 'src/connect/utilities/e2e'

import PostMessage from 'src/connect/utilities/PostMessage'
import { combineDispatchers } from 'src/connect/utilities/reduxHelpers'
import { __ } from 'src/connect/utilities/Intl'

export class Connect extends React.Component {
  static propTypes = {
    addAnalyticPath: PropTypes.func.isRequired,
    availableAccountTypes: PropTypes.array,
    clientProfile: PropTypes.object.isRequired,
    connectConfig: PropTypes.object.isRequired,
    connectGoBack: PropTypes.func.isRequired,
    experimentDetails: PropTypes.object.isRequired,
    goBackCredentials: PropTypes.func.isRequired,
    goBackOauth: PropTypes.func.isRequired,
    goBackPostMessage: PropTypes.func.isRequired,
    hasAtriumAPI: PropTypes.bool,
    initializePosthog: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isMobileWebview: PropTypes.bool,
    isTaxStatementIsEnabled: PropTypes.bool,
    isVerificationEnabled: PropTypes.bool.isRequired,
    loadConnect: PropTypes.func.isRequired,
    loadError: PropTypes.object,
    onManualAccountAdded: PropTypes.func,
    onMemberDeleted: PropTypes.func,
    onSuccessfulAggregation: PropTypes.func,
    removeAnalyticPath: PropTypes.func.isRequired,
    resetConnect: PropTypes.func.isRequired,
    sendAnalyticsEvent: PropTypes.func.isRequired,
    sendPostMessage: PropTypes.func.isRequired,
    showConnectGlobalNavigationHeader: PropTypes.bool.isRequired,
    step: PropTypes.string.isRequired,
    stepToAddManualAccount: PropTypes.func.isRequired,
    stepToDeleteMemberSuccess: PropTypes.func.isRequired,
    stepToMicrodeposits: PropTypes.func.isRequired,
    uiMessageVersion: PropTypes.number,
  }

  static defaultProps = {
    showPadding: true,
  }

  constructor(props) {
    super(props)
    const [name, path] = PageviewInfo.CONNECT
    const mode = props.connectConfig.mode

    props.addAnalyticPath({ name, path: `${path}/${mode}${props.experimentDetails.variantPath}` })

    this.state = {
      memberToDelete: null,
      // The `returnToMicrodeposits` is a temp fix to address the go back button.
      // We want to refactor how we handle the go back which will fix this too.
      returnToMicrodeposits: false,
      stepComponentRef: null, // This holds a reference to the current step component.
    }
    this.setState = this.setState.bind(this)
  }

  componentDidMount() {
    // When Connect is being used within our SDK's, we need to support an OS level back action
    // We listen to a specific event to handle our postMessage callback with our `did_go_back` boolean
    // To allow the host to know if we are still within Connect or to close it.
    window.addEventListener('message', this._handleNavigationPostMessage)

    this.props.loadConnect(this.props.connectConfig)

    if (!isRunningE2ETests()) {
      this.props.initializePosthog()
    }

    // Also important to note that this is a race condition between connect
    // mounting and the master data loading the client data. It just so happens
    // that it is usually faster.
    if (this.props.hasAtriumAPI && this.props.isMobileWebview && this.props.uiMessageVersion < 4) {
      window.location = 'atrium://mxConnectLoaded'
    } else if (this.props.hasAtriumAPI && this.props.uiMessageVersion < 4) {
      // This is an old post message that has to be sent out or we break the atrium javascript loader
      PostMessage.send('mxConnect:widgetLoaded')
    }
  }

  componentDidUpdate(prevProps) {
    const isFirstTimeLoading = prevProps.isLoading && !this.props.isLoading

    // If this is the first time loading Connect:
    //  - Send out PostHog Event with config data and initial step.
    //  - Send out GA Event with initial step.
    //  - Send out the loaded post message with the initial step.
    if (isFirstTimeLoading) {
      const config = this.props.connectConfig
      const metadata = { initial_step: this.props.step, mode: _toLower(config.mode) || AGG_MODE }

      if (!_isNil(config.disable_institution_search))
        metadata.disable_institution_search = config.disable_institution_search
      if (!_isNil(config.include_identity)) metadata.include_identity = config.include_identity
      if (!_isNil(config.include_transactions))
        metadata.include_transactions = config.include_transactions
      if (!_isNil(config.current_member_guid))
        metadata.current_member_guid = sha256(config.current_member_guid)
      if (!_isNil(config.current_institution_guid))
        metadata.current_institution_guid = config.current_institution_guid
      if (!_isNil(config.current_institution_code))
        metadata.current_institution_code = config.current_institution_code

      // DONT send to Posthog directly unless in a Class Components.
      // Use the useAnalyticsEvent hook in Functional Components.
      posthog.capture(`connect_${AnalyticEvents.WIDGET_LOAD}`, {
        $groups: { client: this.props.clientProfile.client_guid },
        ...defaultEventMetadata,
        ...metadata,
      })
      this.props.sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label: EventLabels.CONNECT_START,
        action: `${EventActions.INITIAL_STEP} - (${this.props.step})`,
      })
      this.props.sendPostMessage('connect/loaded', { initial_step: this.props.step })
    } else if (prevProps.step !== this.props.step) {
      // Otherwise if the step changed send out the message with prev and current
      this.props.sendPostMessage('connect/stepChange', {
        previous: prevProps.step,
        current: this.props.step,
      })
    }

    // if connectConfig prop changes while connect is already loaded update connect
    if (!_isEqual(prevProps.connectConfig, this.props.connectConfig)) {
      this.props.loadConnect(this.props.connectConfig)
    }
  }

  componentWillUnmount() {
    const mode = this.props.connectConfig.mode
    const variantPath = this.props.experimentDetails.variantPath

    this.props.resetConnect()
    this.props.removeAnalyticPath(`${PageviewInfo.CONNECT[1]}/${mode}${variantPath}`)

    window.removeEventListener('message', this._handleNavigationPostMessage)
  }

  _handleNavigationPostMessage = event => {
    const eventData = PostMessage.parse(event.data)
    if (eventData.type === 'mx/navigation') {
      // Specifically looking for the 'back' action, in the future we could support others
      if (eventData.payload.action === 'back') {
        const dontChangeConnectStep =
          this.props.step === STEPS.SEARCH ||
          this.props.step === STEPS.DISCLOSURE ||
          this.props.step === STEPS.VERIFY_EXISTING_MEMBER ||
          this.props.connectConfig.disable_institution_search

        if (dontChangeConnectStep) {
          // We consider SEARCH and DISCLOSURE to be as far back as Connect goes.
          // Loaded in verify mode, we show VERIFY_EXISTING_MEMBER as the root.
          // If disable_institution_search is `true`, we do not show the SEARCH step.
          // If any of those conditions are met, we do not change the step when a back navigation event is received.
          // Communicate that we did not go back to the SDK via the `did_go_back` payload.
          this.props.sendPostMessage('navigation', { did_go_back: false })
        } else {
          // We want to reset connect by taking us back to the SEARCH or VERIFY_EXISTING_MEMBER step depending on config
          this.props.goBackPostMessage()

          // And communicating that we did go back to the SDK
          this.props.sendPostMessage('navigation', { did_go_back: true })
        }
      }
    }
  }

  _handleAddManualAccountClick = () => {
    const label = EventLabels.MANUAL_ACCOUNT

    this.props.sendAnalyticsEvent({
      category: EventCategories.CONNECT,
      label,
      action: `${label} - ${EventActions.START}`,
    })
    this.props.stepToAddManualAccount()
  }

  _handleCredentialsGoBack = () => {
    // If returnToMicrodeposits is true, we came from MDV and clicking go back should return to MDV
    if (this.state.returnToMicrodeposits) {
      this.props.stepToMicrodeposits()
      this.setState({ returnToMicrodeposits: false })
    } else {
      this.props.goBackCredentials()
    }
  }

  _handleOAuthGoBack = () => {
    // If returnToMicrodeposits is true, we came from MDV and clicking go back should return to MDV
    if (this.state.returnToMicrodeposits) {
      this.props.stepToMicrodeposits()
      this.setState({ returnToMicrodeposits: false })
    } else {
      this.props.goBackOauth(this.props.connectConfig.mode)
    }
  }

  /**
   * We use a callback ref here, so that we can get notified
   * When the corresponding step component has been mounted in the DOM.
   * This is to ensure that the step component has the custom methods attached (if any)
   * Before we can act on it.
   */
  _handleStepDOMChange = ref => {
    this.setState({ stepComponentRef: ref })
  }

  render() {
    const mode = this.props.connectConfig?.mode ?? AGG_MODE
    const label = EventLabels.LOGIN_ERROR

    const IS_IN_TAX_MODE = mode === TAX_MODE
    const IS_IN_VERIFY_MODE = mode === VERIFY_MODE

    /**
     * For Microdeposits to be enabled, you have to have verification enabled,
     * microdeposits enabled, and have connect loaded in verification mode.
     */
    const invalidTaxMode = IS_IN_TAX_MODE && !this.props.isTaxStatementIsEnabled

    const invalidVerifyMode = IS_IN_VERIFY_MODE && !this.props.isVerificationEnabled

    // If the client has tried to load this widget in verify mode, but they
    // don't support verification, don't load anything and show an error. A
    // user should never hit this error unless their client really goofs
    // Or if the client is loading this widget in tax mode, but they
    // don't have tax statments enabled, don't load anything and show an error.
    if (invalidVerifyMode || invalidTaxMode) {
      const title = IS_IN_TAX_MODE
        ? __('Oops! Tax statements must be enabled to use this feature.')
        : __('Oops! Verification must be enabled to use this feature.')

      return <GenericError title={title} />
    }

    if (this.props.isLoading) {
      return <LoadingSpinner showText={true} />
    }

    if (this.props.loadError) {
      return <GenericError title={this.props.loadError.message} />
    }

    return (
      <TokenContext.Consumer>
        {tokens => {
          const styles = this.styles(tokens)

          return (
            <div id="connect-wrapper" style={styles.component}>
              {this.state.memberToDelete && (
                <DeleteMemberSurvey
                  member={this.state.memberToDelete}
                  onCancel={() => {
                    this.setState({ memberToDelete: null })
                    this.props.sendAnalyticsEvent({
                      category: EventCategories.CONNECT,
                      label,
                      action: `${label} - ${EventActions.DELETE_MEMBER} - ${EventActions.CANCEL}`,
                    })
                  }}
                  onDeleteSuccess={(deletedMember, reason) => {
                    const deleteSurveyLabel = EventLabels.DELETE_SURVEY
                    const connection_status_code = deletedMember.connection_status
                    const connection_status_name = ConnectionStatusMap[connection_status_code]

                    this.props.sendAnalyticsEvent({
                      category: EventCategories.CONNECT,
                      label,
                      action: `${label} - ${EventActions.DELETE_MEMBER} - ${EventActions.END}`,
                    })

                    this.props.sendAnalyticsEvent({
                      category: EventCategories.CONNECT,
                      label: deleteSurveyLabel,
                      action: `${deleteSurveyLabel} - (${connection_status_code})${connection_status_name} - ${reason}`,
                    })

                    this.props.sendPostMessage('connect/memberDeleted', {
                      member_guid: deletedMember.guid,
                    })

                    this.setState({ memberToDelete: null }, () => {
                      this.props.stepToDeleteMemberSuccess(deletedMember.guid)
                    })
                  }}
                />
              )}
              {this.props.showConnectGlobalNavigationHeader && (
                <ConnectNavigationHeader
                  connectGoBack={this.props.connectGoBack}
                  stepComponentRef={this.state.stepComponentRef}
                />
              )}
              <RenderConnectStep
                availableAccountTypes={this.props.availableAccountTypes}
                handleAddManualAccountClick={this._handleAddManualAccountClick}
                handleCredentialsGoBack={this._handleCredentialsGoBack}
                handleOAuthGoBack={this._handleOAuthGoBack}
                navigationRef={this._handleStepDOMChange}
                onManualAccountAdded={this.props.onManualAccountAdded}
                onMemberDeleted={this.props.onMemberDeleted}
                onSuccessfulAggregation={this.props.onSuccessfulAggregation}
                setConnectLocalState={this.setState}
              />
            </div>
          )
        }}
      </TokenContext.Consumer>
    )
  }

  styles = tokens => {
    return {
      component: {
        background: tokens.BackgroundColor.Container,
        position: 'relative',
        height: '100%',
      },
    }
  }
}

/**
 * These are all of the common states props between connect implementations.
 * Override this as needed. `connectConfig` is usually implementation specific
 * and should not be set here.
 */
const mapStateToProps = state => ({
  clientProfile: state.clientProfile,
  connectClientConfig: state.initializedClientConfig?.connect,
  experimentDetails: getActiveABExperimentDetails(
    getExperimentNamesToUserVariantMap(state),
    connectABExperiments,
  ),
  loadError: state.connect.loadError,
  hasAtriumAPI: _get(state, 'client.has_atrium_api'),
  hasShowNewExistingMemberEnhancementEnabled: isShowNewExistingMemberEnhancementEnabled(state),
  isLoading: _get(state, 'connect.isComponentLoading', false),
  isMobileWebview: _get(state, 'initializedClientConfig.is_mobile_webview', false),
  isVerificationEnabled: _get(state, 'clientProfile.account_verification_is_enabled', false),
  isTaxStatementIsEnabled: _get(state, 'clientProfile.tax_statement_is_enabled', false),
  showConnectGlobalNavigationHeader: shouldShowConnectGlobalNavigationHeader(state),
  step: state.connect.location[state.connect.location.length - 1]?.step ?? STEPS.SEARCH,
  uiMessageVersion: _get(state, 'initializedClientConfig.ui_message_version', null),
})

/**
 * These are all of the common dispatch props between connect implementations.
 * Override this as needed.
 */
const mapDispatchToProps = combineDispatchers(dispatch => ({
  addAnalyticPath: path => dispatch(addAnalyticPath(path)),
  connectGoBack: () => dispatch({ type: connectActions.ActionTypes.CONNECT_GO_BACK }),
  initializePosthog: () => dispatch({ type: AnalyticsActionTypes.INITIALIZE_POSTHOG }),
  goBackCredentials: () => dispatch({ type: connectActions.ActionTypes.GO_BACK_CREDENTIALS }),
  goBackOauth: mode =>
    dispatch({ type: connectActions.ActionTypes.GO_BACK_OAUTH, payload: { mode } }),
  goBackPostMessage: () => dispatch({ type: connectActions.ActionTypes.GO_BACK_POST_MESSAGE }),
  removeAnalyticPath: path => dispatch(removeAnalyticPath(path)),
  sendAnalyticsEvent: eventData => dispatch(sendAnalyticsEvent(eventData)),
  loadConnect: config => dispatch(connectActions.loadConnect(config)),
  stepToMicrodeposits: () => dispatch(connectActions.stepToMicrodeposits()),
  resetConnect: () => dispatch(connectActions.resetConnect()),
  sendPostMessage: (event, data) =>
    dispatch({ type: PostMessageActionTypes.SEND_POST_MESSAGE, payload: { event, data } }),
  stepToDeleteMemberSuccess: memberGuid =>
    dispatch(connectActions.stepToDeleteMemberSuccess(memberGuid)),
  stepToAddManualAccount: () => dispatch(connectActions.stepToAddManualAccount()),
}))

/**
 * We use this only to prioritize `connectConfig` that is passed from other
 * components over what is in redux. Don't add something else here unless
 * you've talked with the team about it.
 *
 */
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  // above is the default for react-redux, below are overrides
  connectConfig: { ...stateProps.connectClientConfig, ...ownProps.connectConfig },
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Connect)
