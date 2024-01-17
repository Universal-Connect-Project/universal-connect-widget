import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import _pick from 'lodash/pick'
import _isEmpty from 'lodash/isEmpty'

import { useTokens } from '@kyper/tokenprovider'

import * as connectActions from 'reduxify/actions/Connect'
import { sendAnalyticsEvent } from 'reduxify/actions/Analytics'
import { ActionTypes as PostMessageActionTypes } from 'reduxify/actions/PostMessage'

import { getSize } from 'reduxify/selectors/Browser'
import { getCurrentMember, getMembers } from 'reduxify/selectors/Connect'
import { shouldShowConnectGlobalNavigationHeader } from 'reduxify/selectors/UserFeatures'

import { Container } from 'src/connect/components/Container'
import Disclosure from 'src/connect/views/disclosure/Disclosure'
import { Search } from 'src/connect/views/search/Search'
import MFAStep from 'src/connect/views/mfa/MFAStep'
import { OAuthStep } from 'src/connect/views/oauth/OAuthStep'
import { OAuthError } from 'src/connect/views/oauth/OAuthError'
import { UpdateMemberForm } from 'src/connect/views/credentials/UpdateMemberForm'
import { CreateMemberForm } from 'src/connect/views/credentials/CreateMemberForm'
import { DeleteMemberSuccess } from 'src/connect/views/deleteMemberSuccess/DeleteMemberSuccess'
import { Connecting } from 'src/connect/views/connecting/Connecting'
import { LoginError } from 'src/connect/views/loginError/LoginError'
import { Connected } from 'src/connect/views/connected/Connected'
import { Microdeposits } from 'src/connect/views/microdeposits/Microdeposits'
import VerifyExistingMember from 'src/connect/views/verification/VerifyExistingMember'
import { VerifyError } from 'src/connect/views/verification/VerifyError'
import { ManualAccountConnect } from 'src/connect/views/manualAccount/ManualAccountConnect'

import { AGG_MODE, VERIFY_MODE, STEPS } from 'src/connect/const/Connect'
import { EventCategories, EventLabels, EventActions } from 'src/connect/const/Analytics'

const RenderConnectStep = props => {
  const connectConfig = useSelector(state => state.connect?.connectConfig ?? {})
  const initializedClientConfig = useSelector(state => state.initializedClientConfig)
  const client = useSelector(state => state.client)
  const clientProfile = useSelector(state => state.clientProfile)
  const widgetProfile = useSelector(state => state.connect.widgetProfile)
  const size = useSelector(getSize)
  const currentMicrodepositGuid = useSelector(
    state => state.connect?.currentMicrodepositGuid ?? null,
  )
  const step = useSelector(
    state => state.connect.location[state.connect.location.length - 1]?.step ?? STEPS.SEARCH,
  )
  const connectedMembers = useSelector(getMembers)
  const currentMember = useSelector(getCurrentMember)
  const selectedInstitution = useSelector(state => state.connect.selectedInstitution)
  const updateCredentials = useSelector(state => state.connect.updateCredentials)
  const verifyMemberError = useSelector(state => state.connect.error)
  const showConnectGlobalNavigationHeader = useSelector(shouldShowConnectGlobalNavigationHeader)

  const dispatch = useDispatch()

  const tokens = useTokens()
  const styles = getStyles(tokens, step)

  const mode = connectConfig?.mode ?? AGG_MODE
  const isInstitutionSearchEnabled = !connectConfig?.disable_institution_search
  const isMicrodepositsEnabled =
    mode === VERIFY_MODE && // MDV is only enabled in verification
    clientProfile.account_verification_is_enabled && // Client supports verification
    clientProfile.is_microdeposits_enabled && // Client supports MDV
    widgetProfile.show_microdeposits_in_connect // Client shows MDV in Connect

  /**
   * To show the add manual accounts option, you have to have the profile enabled,
   * be in agg mode, and not be an atrium client.
   */
  const isManualAccountsEnabled =
    widgetProfile.enable_manual_accounts && mode === AGG_MODE && !hasAtriumAPI

  const showSupport = widgetProfile.enable_support_requests && mode === AGG_MODE
  const hasAtriumAPI = client.has_atrium_api
  const usePopularOnly =
    (clientProfile.uses_custom_popular_institution_list ?? false) ||
    (client.has_limited_institutions ?? false)
  const isDeleteInstitutionOptionEnabled = widgetProfile?.display_delete_option_in_connect ?? true
  const uiMessageVersion = initializedClientConfig?.ui_message_version ?? null
  const isMobileWebview = initializedClientConfig?.is_mobile_webview ?? false

  const sendAnalyticsEventHandler = eventData => dispatch(sendAnalyticsEvent(eventData))
  const sendPostMessage = (event, data) =>
    dispatch({ type: PostMessageActionTypes.SEND_POST_MESSAGE, payload: { event, data } })

  const handleInstitutionSelect = institution => {
    sendPostMessage(
      'connect/selectedInstitution',
      _pick(institution, ['name', 'guid', 'url', 'code']),
    )

    // The institution doesn't have credentials until we request it again from server
    dispatch(connectActions.selectInstitution(institution.guid))
  }

  let connectStepView = null

  if (step === STEPS.DISCLOSURE) {
    connectStepView = (
      <Disclosure
        mode={mode}
        onContinue={() => dispatch({ type: connectActions.ActionTypes.ACCEPT_DISCLOSURE })}
        size={size}
      />
    )
  } else if (step === STEPS.SEARCH) {
    connectStepView = (
      <Search
        connectConfig={connectConfig}
        connectedMembers={connectedMembers}
        enableManualAccounts={isManualAccountsEnabled}
        enableSupportRequests={showSupport}
        isMicrodepositsEnabled={isMicrodepositsEnabled}
        onAddManualAccountClick={props.handleAddManualAccountClick}
        onInstitutionSelect={handleInstitutionSelect}
        ref={props.navigationRef}
        size={size}
        stepToMicrodeposits={() => dispatch(connectActions.stepToMicrodeposits())}
        usePopularOnly={usePopularOnly}
      />
    )
  } else if (step === STEPS.ADD_MANUAL_ACCOUNT) {
    connectStepView = (
      <ManualAccountConnect
        availableAccountTypes={props.availableAccountTypes}
        onClose={() => dispatch({ type: connectActions.ActionTypes.GO_BACK_MANUAL_ACCOUNT })}
        onManualAccountAdded={props.onManualAccountAdded}
        ref={props.navigationRef}
      />
    )
  } else if (step === STEPS.ENTER_CREDENTIALS) {
    let showOAuth = false

    // To show OAuth step, the client profile must be set
    if (clientProfile.uses_oauth) {
      // If there is a current member, look to wether it supports oauth or
      // not to decide to show oauth.
      if (!_isEmpty(currentMember)) {
        showOAuth = currentMember.is_oauth
      } else {
        // If there is not a current member, look to the selected institution
        showOAuth = selectedInstitution.supports_oauth
      }
    }

    if (showOAuth) {
      connectStepView = (
        <OAuthStep
          institution={selectedInstitution}
          onGoBack={props.handleOAuthGoBack}
          ref={props.navigationRef}
        />
      )
    } else if (updateCredentials) {
      connectStepView = (
        <UpdateMemberForm
          navigationRef={props.navigationRef}
          onDeleteConnectionClick={() =>
            props.setConnectLocalState({ memberToDelete: currentMember })
          }
          onGoBackClick={() => {
            dispatch(
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.ENTER_CREDENTIALS,
                action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.GO_BACK}`,
              }),
            )

            props.handleCredentialsGoBack()
          }}
        />
      )
    } else {
      connectStepView = (
        <CreateMemberForm
          navigationRef={props.navigationRef}
          onGoBackClick={() => {
            dispatch(
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.ENTER_CREDENTIALS,
                action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.GO_BACK}`,
              }),
            )

            props.handleCredentialsGoBack()
          }}
        />
      )
    }
  } else if (step === STEPS.MICRODEPOSITS && isMicrodepositsEnabled) {
    connectStepView = (
      <Microdeposits
        microdepositGuid={currentMicrodepositGuid}
        ref={props.navigationRef}
        sendAnalyticsEvent={sendAnalyticsEventHandler}
        stepToIAV={guid => {
          dispatch(connectActions.selectInstitution(guid))
          // Set returnToMicrodeposits to true so if user clicks go back, they are taken to MDV
          props.setConnectLocalState({ returnToMicrodeposits: true })
        }}
      />
    )
  } else if (step === STEPS.CONNECTING) {
    connectStepView = (
      <Connecting
        connectConfig={connectConfig}
        hasAtriumAPI={hasAtriumAPI}
        institution={selectedInstitution}
        isMobileWebview={isMobileWebview}
        uiMessageVersion={uiMessageVersion}
      />
    )
  } else if (step === STEPS.MFA) {
    connectStepView = (
      <MFAStep
        enableSupportRequests={showSupport}
        institution={selectedInstitution}
        onGoBack={() => dispatch({ type: connectActions.ActionTypes.RESET_WIDGET_MFA_STEP })}
        ref={props.navigationRef}
        sendAnalyticsEvent={sendAnalyticsEventHandler}
      />
    )
  } else if (step === STEPS.LOGIN_ERROR) {
    connectStepView = (
      <LoginError
        institution={selectedInstitution}
        isDeleteInstitutionOptionEnabled={isDeleteInstitutionOptionEnabled}
        member={currentMember}
        onDeleteConnectionClick={() =>
          props.setConnectLocalState({ memberToDelete: currentMember })
        }
        onRefreshClick={() => dispatch(connectActions.stepToConnecting())}
        onUpdateCredentialsClick={() => dispatch(connectActions.stepToUpdateCredentials())}
        ref={props.navigationRef}
        sendAnalyticsEvent={sendAnalyticsEventHandler}
        showExternalLinkPopup={clientProfile.show_external_link_popup}
        showSupport={showSupport}
        size={size}
      />
    )
  } else if (step === STEPS.VERIFY_EXISTING_MEMBER) {
    connectStepView = (
      <VerifyExistingMember
        members={connectedMembers}
        onAddNew={() => dispatch(connectActions.verifyDifferentConnection())}
      />
    )
  } else if (step === STEPS.VERIFY_ERROR) {
    connectStepView = (
      <VerifyError
        error={verifyMemberError}
        onGoBack={() => dispatch(connectActions.stepToVerifyExistingMember())}
      />
    )
  } else if (step === STEPS.CONNECTED) {
    connectStepView = (
      <Connected
        currentMember={currentMember}
        institution={selectedInstitution}
        isInstitutionSearchEnabled={isInstitutionSearchEnabled}
        onContinueClick={() => {
          if (props.onSuccessfulAggregation) {
            props.onSuccessfulAggregation(currentMember)
          }
          dispatch({ type: connectActions.ActionTypes.RESET_WIDGET_CONNECTED })
        }}
        sendAnalyticsEvent={sendAnalyticsEventHandler}
      />
    )
  } else if (step === STEPS.DELETE_MEMBER_SUCCESS) {
    connectStepView = (
      <DeleteMemberSuccess
        institution={selectedInstitution}
        isInstitutionSearchEnabled={isInstitutionSearchEnabled}
        onContinueClick={() => {
          if (props.onMemberDeleted) {
            props.onMemberDeleted()
          }
          dispatch({ type: connectActions.ActionTypes.DELETE_MEMBER_SUCCESS_RESET })
        }}
      />
    )
  } else if (step === STEPS.OAUTH_ERROR) {
    connectStepView = (
      <OAuthError
        currentMember={currentMember}
        institution={selectedInstitution}
        onRetry={() => dispatch(connectActions.retryOAuth())}
        onReturnToSearch={props.handleOAuthGoBack}
        ref={props.navigationRef}
      />
    )
  }

  return showConnectGlobalNavigationHeader ? (
    <div style={styles.container}>
      <div style={styles.content}>{connectStepView}</div>
    </div>
  ) : (
    <Container step={step}>{connectStepView}</Container>
  )
}

RenderConnectStep.propTypes = {
  availableAccountTypes: PropTypes.array,
  handleAddManualAccountClick: PropTypes.func.isRequired,
  handleCredentialsGoBack: PropTypes.func.isRequired,
  handleOAuthGoBack: PropTypes.func.isRequired,
  navigationRef: PropTypes.func.isRequired,
  onManualAccountAdded: PropTypes.func,
  onMemberDeleted: PropTypes.func,
  onSuccessfulAggregation: PropTypes.func,
  setConnectLocalState: PropTypes.func.isRequired,
}

RenderConnectStep.displayName = 'RenderConnectStep'

const getStyles = (tokens, step) => {
  return {
    container: {
      backgroundColor: tokens.BackgroundColor.Container,
      minHeight: 'calc(100% - 60px)',
      maxHeight: step === STEPS.SEARCH ? 'calc(100% - 60px)' : null,
      display: 'flex',
      justifyContent: 'center',
    },
    content: {
      maxWidth: '352px', // Our max content width (does not include side margin)
      minWidth: '270px', // Our min content width (does not include side margin)
      width: '100%', // We want this container to shrink and grow between our min-max
      margin: `0px ${tokens.Spacing.Large}px ${tokens.Spacing.Large}px`,
    },
  }
}

export default RenderConnectStep
