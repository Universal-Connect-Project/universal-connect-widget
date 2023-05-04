import PropTypes from 'prop-types'
import React from 'react'
import _get from 'lodash/get'
import _pick from 'lodash/pick'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import { connect } from 'react-redux'
import { TokenContext } from '@kyper/tokenprovider'

import * as connectActions from '../../redux/actions/Connect'
import { ActionTypes as AnalyticsActionTypes } from '../../redux/actions/Analytics'
import {
  addAnalyticPath,
  createNewFeatureVisit,
  removeAnalyticPath,
  sendAnalyticsEvent,
} from '../../redux/actions/Analytics'
import { sendPostMessage } from '../../redux/actions/PostMessage'

import { getCurrentMember } from '../../redux/selectors/Connect'
import { getMembers } from '../../redux/selectors/Connect'
import { getSize } from '../../redux/selectors/Browser'
import { isShowNewExistingMemberEnhancementEnabled } from '../../redux/selectors/UserFeatures'
import { getExperimentNamesToUserVariantMap } from '../../redux/selectors/Experiments'

import Disclosure from '../../connect/views/disclosure/Disclosure'
import { Search } from '../../connect/views/search/Search'
import MFAStep from '../../connect/views/mfa/MFAStep'
import { OAuthStep } from '../../connect/views/oauth/OAuthStep'
import { OAuthError } from '../../connect/views/oauth/OAuthError'
import { UpdateMemberForm } from '../../connect/views/credentials/UpdateMemberForm'
import { CreateMemberForm } from '../../connect/views/credentials/CreateMemberForm'
import { DeleteMemberSuccess } from '../../connect/views/deleteMemberSuccess/DeleteMemberSuccess'
import { Connecting } from '../../connect/views/connecting/Connecting'
import { ExistingMemberWarning } from '../../connect/views/existing/ExistingMemberWarning'
import { LoginError } from '../../connect/views/loginError/LoginError'
import { Connected } from '../../connect/views/connected/Connected'
import { Microdeposits } from '../../connect/views/microdeposits/Microdeposits'
import VerifyExistingMember from '../../connect/views/verification/VerifyExistingMember'
import { VerifyError } from '../../connect/views/verification/VerifyError'
import { ManualAccountConnect } from '../../connect/views/manualAccount/ManualAccountConnect'

import { DeleteMemberSurvey } from '../../connect/components/DeleteMemberSurvey'
import { LoadingSpinner } from '../../connect/components/LoadingSpinner'
import { GenericError } from '../../connect/components/GenericError'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../connect/const/Analytics'
import { EventLabels as ManualAccountEventLabels } from '../../constants/analytics/shared/ManualAccount'

import { ConnectionStatusMap } from '../../connect/const/Statuses'
import { AGG_MODE, VERIFY_MODE, TAX_MODE, STEPS } from '../../connect/const/Connect'

import PostMessage from '../../utils/PostMessage'
import { combineDispatchers } from '../../utils/ActionHelpers'
import { __ } from '../../utils/Intl'
import { connectABExperiments } from '../../connect/experiments'
import { getActiveABExperimentDetails } from '../../connect/hooks/useExperiment'

const isShowingNewConnectView = step => {
  /*
   * Uncomment the step below once it is fully using Kyper,
   * so that it can get the proper height 100% applied to the container
   *
   * Once all steps are uncommented, we can remove the use of this function
   */
  const newViews = [
    STEPS.ADD_MANUAL_ACCOUNT,
    STEPS.CONNECTED,
    STEPS.CONNECTING,
    STEPS.DELETE_MEMBER_SUCCESS,
    STEPS.DISCLOSURE,
    STEPS.ENTER_CREDENTIALS,
    // TODO: ERROR
    STEPS.EXISTING_MEMBER,
    STEPS.LOGIN_ERROR,
    STEPS.MFA,
    STEPS.MICRODEPOSITS,
    // TODO: OAUTH
    STEPS.OAUTH_ERROR,
    STEPS.SEARCH,
    STEPS.VERIFY_ERROR,
    STEPS.VERIFY_EXISTING_MEMBER,
  ]

  return newViews.includes(step)
}

export class Connect extends React.Component {
  static propTypes = {
    acceptDisclosure: PropTypes.func.isRequired,
    addAnalyticPath: PropTypes.func.isRequired,
    availableAccountTypes: PropTypes.array,
    clientProfile: PropTypes.object.isRequired,
    connectConfig: PropTypes.object.isRequired,
    connectedMembers: PropTypes.array,
    createNewFeatureVisit: PropTypes.func.isRequired,
    currentMember: PropTypes.object,
    currentMicrodepositGuid: PropTypes.string,
    currentSession: PropTypes.object.isRequired,
    experimentDetails: PropTypes.object.isRequired,
    hasAtriumAPI: PropTypes.bool,
    initializePosthog: PropTypes.func.isRequired,
    isDeleteInstitutionOptionEnabled: PropTypes.bool.isRequired,
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
    resetStep: PropTypes.func.isRequired,
    retryOAuth: PropTypes.func.isRequired,
    selectedInstitution: PropTypes.object.isRequired,
    selectInstitution: PropTypes.func.isRequired,
    sendAnalyticsEvent: PropTypes.func.isRequired,
    sendPostMessage: PropTypes.func.isRequired,
    showExternalLinkPopup: PropTypes.bool,
    size: PropTypes.string.isRequired,
    step: PropTypes.string.isRequired,
    stepToAddManualAccount: PropTypes.func.isRequired,
    stepToConnecting: PropTypes.func.isRequired,
    stepToDeleteMemberSuccess: PropTypes.func.isRequired,
    stepToEnterCredentials: PropTypes.func.isRequired,
    stepToMicrodeposits: PropTypes.func.isRequired,
    stepToUpdateCredentials: PropTypes.func.isRequired,
    stepToVerifyExistingMember: PropTypes.func.isRequired,
    uiMessageVersion: PropTypes.number,
    updateCredentials: PropTypes.bool,
    useAnalytics: PropTypes.bool,
    usePopularOnly: PropTypes.bool,
    verifyDifferentConnection: PropTypes.func.isRequired,
    verifyMemberError: PropTypes.object,
    widgetProfile: PropTypes.object.isRequired,
  }

  static defaultProps = {
    useAnalytics: true,
    showPadding: true,
  }

  constructor(props) {
    super(props)
    const [name, path] = PageviewInfo.CONNECT
    const mode = props.connectConfig.mode

    props.addAnalyticPath({ name, path: `${path}/${mode}${props.experimentDetails.variantPath}` })

    // reference to the oauth window even if opened.
    this.state = {
      memberToDelete: null,
      // The `returnToMicrodeposits` is a temp fix to address the go back button.
      // We want to refactor how we handle the go back which will fix this too.
      returnToMicrodeposits: false,
    }
  }

  componentDidMount() {
    // When Connect is being used within our SDK's, we need to support an OS level back action
    // We listen to a specific event to handle our postMessage callback with our `did_go_back` boolean
    // To allow the host to know if we are still within Connect or to close it.
    window.addEventListener('message', this._handleNavigationPostMessage)

    this.props.loadConnect(this.props.connectConfig)

    if (this.props.useAnalytics) {
      this.props.createNewFeatureVisit('Connect', this.props.currentSession)
    }

    this.props.initializePosthog()

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

    // If this is the first time loading Connect send out the loaded post message with the initial step.
    if (isFirstTimeLoading) {
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

  _handleInstitutionSelect = institution => {
    this.props.sendPostMessage(
      'connect/selectedInstitution',
      _pick(institution, ['name', 'guid', 'url', 'code']),
    )
    // The institution doesn't have credentials until we request it again from server
    this.props.selectInstitution(institution.guid)
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
          this._resetStep()

          // And communicating that we did go back to the SDK
          this.props.sendPostMessage('navigation', { did_go_back: true })
        }
      }
    }
  }

  _handleAddManualAccountClick = () => {
    const label = ManualAccountEventLabels.MANUAL_ACCOUNT

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
      this._resetStep()
    }
  }

  /**
   * This is an alias for resetStep. It has to have the mode to work but it's
   * tedious to pass the mode to everything that needs to call it. So now
   * children can call this, which has the mode.
   */
  _resetStep = () => {
    this.props.resetStep(this.props.connectConfig.mode)
  }

  _renderStep = () => {
    const { currentMicrodepositGuid } = this.props
    const step = this.props.step
    const mode = this.props.connectConfig?.mode ?? AGG_MODE
    const isInstitutionSearchEnabled = !this.props.connectConfig?.disable_institution_search
    const isMicrodepositsEnabled =
      this.props.clientProfile.is_microdeposits_enabled &&
      mode === VERIFY_MODE &&
      (this.props.clientProfile.account_verification_is_enabled ?? false)

    /**
     * To show the add manual accounts option, you have to have the profile enabled,
     * be in agg mode, and not be an atrium client.
     */
    const isManualAccountsEnabled =
      this.props.widgetProfile.enable_manual_accounts &&
      mode === AGG_MODE &&
      !this.props.hasAtriumAPI

    const showSupport = this.props.widgetProfile.enable_support_requests && mode === AGG_MODE

    if (step === STEPS.DISCLOSURE) {
      return (
        <Disclosure mode={mode} onContinue={this.props.acceptDisclosure} size={this.props.size} />
      )
    } else if (step === STEPS.SEARCH) {
      return (
        <Search
          connectConfig={this.props.connectConfig}
          connectedMembers={this.props.connectedMembers}
          enableManualAccounts={isManualAccountsEnabled}
          enableSupportRequests={showSupport}
          isMicrodepositsEnabled={isMicrodepositsEnabled}
          onAddManualAccountClick={this._handleAddManualAccountClick}
          onInstitutionSelect={this._handleInstitutionSelect}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
          sendPostMessage={this.props.sendPostMessage}
          size={this.props.size}
          stepToMicrodeposits={this.props.stepToMicrodeposits}
          usePopularOnly={this.props.usePopularOnly}
        />
      )
    } else if (step === STEPS.ADD_MANUAL_ACCOUNT) {
      return (
        <ManualAccountConnect
          availableAccountTypes={this.props.availableAccountTypes}
          onClose={this._resetStep}
          onManualAccountAdded={this.props.onManualAccountAdded}
        />
      )
    } else if (step === STEPS.EXISTING_MEMBER) {
      return (
        <ExistingMemberWarning
          addAnother={this.props.stepToEnterCredentials}
          institution={this.props.selectedInstitution}
          onCancel={this._handleCredentialsGoBack}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
        />
      )
    } else if (step === STEPS.ENTER_CREDENTIALS) {
      let showOAuth = false
      // To show OAuth step, the client profile must be set
      if (this.props.clientProfile.uses_oauth) {
        // If there is a current member, look to wether it supports oauth or
        // not to decide to show oauth.
        if (!_isEmpty(this.props.currentMember)) {
          showOAuth = this.props.currentMember.is_oauth
        } else {
          // If there is not a current member, look to the selected institution
          showOAuth = this.props.selectedInstitution.supports_oauth
        }
      }

      if (showOAuth) {
        return (
          <OAuthStep
            institution={this.props.selectedInstitution}
            isInstitutionSearchEnabled={isInstitutionSearchEnabled}
            onGoBack={this._handleCredentialsGoBack}
            sendAnalyticsEvent={this.props.sendAnalyticsEvent}
            sendPostMessage={this.props.sendPostMessage}
          />
        )
      } else if (this.props.updateCredentials) {
        return (
          <UpdateMemberForm
            onDeleteConnectionClick={() =>
              this.setState({ memberToDelete: this.props.currentMember })
            }
            onGoBackClick={() => {
              this.props.sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.ENTER_CREDENTIALS,
                action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.GO_BACK}`,
              })

              this._handleCredentialsGoBack()
            }}
          />
        )
      } else {
        return (
          <CreateMemberForm
            onGoBackClick={() => {
              this.props.sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.ENTER_CREDENTIALS,
                action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.GO_BACK}`,
              })

              this._handleCredentialsGoBack()
            }}
          />
        )
      }
    } else if (step === STEPS.MICRODEPOSITS && isMicrodepositsEnabled) {
      return (
        <Microdeposits
          microdepositGuid={currentMicrodepositGuid}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
          sendPostMessage={this.props.sendPostMessage}
          stepToIAV={guid => {
            this.props.selectInstitution(guid)

            // Set returnToMicrodeposits to true so if user clicks go back, they are taken to MDV
            this.setState({ returnToMicrodeposits: true })
          }}
        />
      )
    } else if (step === STEPS.CONNECTING) {
      return (
        <Connecting
          connectConfig={this.props.connectConfig}
          hasAtriumAPI={this.props.hasAtriumAPI}
          institution={this.props.selectedInstitution}
          isMobileWebview={this.props.isMobileWebview}
          sendPostMessage={this.props.sendPostMessage}
          uiMessageVersion={this.props.uiMessageVersion}
        />
      )
    } else if (step === STEPS.MFA) {
      return (
        <MFAStep
          enableSupportRequests={showSupport}
          institution={this.props.selectedInstitution}
          onGoBack={this._resetStep}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
          sendPostMessage={this.props.sendPostMessage}
        />
      )
    } else if (step === STEPS.LOGIN_ERROR) {
      return (
        <LoginError
          institution={this.props.selectedInstitution}
          isDeleteInstitutionOptionEnabled={this.props.isDeleteInstitutionOptionEnabled}
          member={this.props.currentMember}
          onDeleteConnectionClick={() =>
            this.setState({ memberToDelete: this.props.currentMember })
          }
          onRefreshClick={() => this.props.stepToUpdateCredentials() || true || this.props.stepToConnecting()}
          onUpdateCredentialsClick={() => this.props.stepToUpdateCredentials()}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
          sendPostMessage={this.props.sendPostMessage}
          showExternalLinkPopup={this.props.showExternalLinkPopup}
          showSupport={showSupport}
          size={this.props.size}
        />
      )
    } else if (step === STEPS.VERIFY_EXISTING_MEMBER) {
      return (
        <VerifyExistingMember
          members={this.props.connectedMembers}
          onAddNew={this.props.verifyDifferentConnection}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
        />
      )
    } else if (step === STEPS.VERIFY_ERROR) {
      return (
        <VerifyError
          error={this.props.verifyMemberError}
          onGoBack={this.props.stepToVerifyExistingMember}
        />
      )
    } else if (step === STEPS.CONNECTED) {
      return (
        <Connected
          currentMember={this.props.currentMember}
          institution={this.props.selectedInstitution}
          isInstitutionSearchEnabled={isInstitutionSearchEnabled}
          onContinueClick={() => {
            if (this.props.onSuccessfulAggregation) {
              this.props.onSuccessfulAggregation(this.props.currentMember)
            }
            this._resetStep()
          }}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
          sendPostMessage={this.props.sendPostMessage}
        />
      )
    } else if (step === STEPS.DELETE_MEMBER_SUCCESS) {
      return (
        <DeleteMemberSuccess
          institution={this.props.selectedInstitution}
          isInstitutionSearchEnabled={isInstitutionSearchEnabled}
          onContinueClick={() => {
            if (this.props.onMemberDeleted) {
              this.props.onMemberDeleted()
            }
            this._resetStep()
          }}
        />
      )
    } else if (step === STEPS.OAUTH_ERROR) {
      return (
        <OAuthError
          currentMember={this.props.currentMember}
          institution={this.props.selectedInstitution}
          onRetry={this.props.retryOAuth}
          sendAnalyticsEvent={this.props.sendAnalyticsEvent}
          sendPostMessage={this.props.sendPostMessage}
        />
      )
    } else {
      return null
    }
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
          const isNewConnectView = isShowingNewConnectView(this.props.step)
          const styles = this.styles(tokens, isNewConnectView)

          return (
            <div ref={ref => (this._connectWrapperRef = ref)} style={styles.component}>
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

              {isNewConnectView ? (
                this._renderStep()
              ) : (
                <div style={styles.oldStepWrapper}>{this._renderStep()}</div>
              )}
            </div>
          )
        }}
      </TokenContext.Consumer>
    )
  }

  styles = (tokens, isNewConnectView) => {
    return {
      component: {
        background: tokens.BackgroundColor.Body,
        // We must currently maintain two different height implementations
        // since we have a mix of old and new connect views still, and
        // they rely on the parent container in different ways for height..
        // Please do not change these values without communicating to the team.
        // Ideally we can remove all this conditional rendering based on new
        // and old views when Add Manual Account UI is updated.
        minHeight: isNewConnectView ? 'initial' : '100%',
        height: isNewConnectView ? '100%' : 'initial',
      },
      oldStepWrapper: {
        // required to offset the 10px margin on LogoWrapper child or else you
        // will get scroll
        paddingTop: '10px',
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
  connectedMembers: getMembers(state),
  currentMember: getCurrentMember(state),
  currentMicrodepositGuid: state.connect?.currentMicrodepositGuid ?? null,
  currentSession: state.analytics.currentSession,
  experimentDetails: getActiveABExperimentDetails(
    getExperimentNamesToUserVariantMap(state),
    connectABExperiments,
  ),
  loadError: state.connect.loadError,
  hasAtriumAPI: _get(state, 'client.has_atrium_api'),
  hasShowNewExistingMemberEnhancementEnabled: isShowNewExistingMemberEnhancementEnabled(state),
  isDeleteInstitutionOptionEnabled:
    state.connect.widgetProfile?.display_delete_option_in_connect ?? true,
  isLoading: _get(state, 'connect.isComponentLoading', false),
  isMobileWebview: _get(state, 'initializedClientConfig.is_mobile_webview', false),
  isVerificationEnabled: _get(state, 'clientProfile.account_verification_is_enabled', false),
  isTaxStatementIsEnabled: _get(state, 'clientProfile.tax_statement_is_enabled', false),
  selectedInstitution: state.connect.selectedInstitution,
  showExistingMember: state.connect.showExistingMember,
  showExternalLinkPopup: state.clientProfile.show_external_link_popup,
  size: getSize(state),
  step: state.connect.step,
  uiMessageVersion: _get(state, 'initializedClientConfig.ui_message_version', null),
  verifyMemberError: state.connect.error,
  updateCredentials: state.connect.updateCredentials,
  usePopularOnly:
    _get(state, 'clientProfile.uses_custom_popular_institution_list', false) ||
    _get(state, 'client.has_limited_institutions', false),
  widgetProfile: state.connect.widgetProfile,
})

/**
 * These are all of the common dispatch props between connect implementations.
 * Override this as needed.
 */
const mapDispatchToProps = combineDispatchers(dispatch => ({
  acceptDisclosure: () => dispatch({ type: connectActions.ActionTypes.ACCEPT_DISCLOSURE }),
  addAnalyticPath: path => dispatch(addAnalyticPath(path)),
  createNewFeatureVisit: featureName => dispatch(createNewFeatureVisit(featureName)),
  initializePosthog: () => dispatch({ type: AnalyticsActionTypes.INITIALIZE_POSTHOG }),
  removeAnalyticPath: path => dispatch(removeAnalyticPath(path)),
  sendAnalyticsEvent: eventData => dispatch(sendAnalyticsEvent(eventData)),
  loadConnect: config => dispatch(connectActions.loadConnect(config)),
  stepToMicrodeposits: () => dispatch(connectActions.stepToMicrodeposits()),
  resetStep: mode => dispatch(connectActions.resetStep(mode)),
  resetConnect: () => dispatch(connectActions.resetConnect()),
  sendPostMessage: (type, payload) => dispatch(sendPostMessage(type, payload)),
  selectInstitution: guid => dispatch(connectActions.selectInstitution(guid)),
  stepToConnecting: () => dispatch(connectActions.stepToConnecting()),
  stepToEnterCredentials: () => dispatch(connectActions.stepToEnterCredentials()),
  stepToUpdateCredentials: () => dispatch(connectActions.stepToUpdateCredentials()),
  stepToDeleteMemberSuccess: memberGuid =>
    dispatch(connectActions.stepToDeleteMemberSuccess(memberGuid)),
  retryOAuth: () => dispatch(connectActions.retryOAuth()),
  stepToVerifyExistingMember: () => dispatch(connectActions.stepToVerifyExistingMember()),
  stepToAddManualAccount: () => dispatch(connectActions.stepToAddManualAccount()),
  verifyDifferentConnection: () => dispatch(connectActions.verifyDifferentConnection()),
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
export const ConnectWidget = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Connect)
