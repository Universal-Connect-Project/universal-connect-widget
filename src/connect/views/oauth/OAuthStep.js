import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { defer, of } from 'rxjs'
import { mergeMap, map, pluck } from 'rxjs/operators'

import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

import { __ } from '../../../utils/Intl'
import FireflyAPI from '../../../utils/FireflyAPI'
import connectAPI from '../../../connect/services/api'
import useAnalyticsPath from '../../../connect/hooks/useAnalyticsPath'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from 'src/connect/const/Analytics'
import { ReadableStatuses } from '../../../connect/const/Statuses'
import { REFERRAL_SOURCES } from '../../../connect/const/Connect'

import { Container } from '../../../connect/components/Container'
import { InstitutionBlock } from '../../../connect/components/InstitutionBlock'
import { SlideDown } from '../../../connect/components/SlideDown'
import { PrivateAndSecure } from '../../../connect/components/PrivateAndSecure'
import { getDelay } from '../../../connect/utilities/getDelay'
import { goToUrlLink } from '../../../connect/utilities/global'
import { ViewTitle } from '../../../connect/components/ViewTitle'
import { WaitingForOAuth } from '../../../connect/views/oauth/WaitingForOAuth'
import { OAuthStartError } from '../../../connect/views/oauth/OAuthStartError'
import { LeavingNoticeFlat } from '../../../connect/components/LeavingNoticeFlat'
import { InstructionalText } from '../../../connect/components/InstructionalText'
import { InstructionList } from '../../../connect/components/InstructionList'

import { getCurrentMember } from '../../../redux/selectors/Connect'
import * as connectActions from '../../../redux/actions/Connect'
import { CONNECT_HIDE_LIGHT_DISCLOSURE_EXPERIMENT } from '../../../connect/experiments'
import useExperiment from '../../../connect/hooks/useExperiment'
import PoweredByMX from '../../../connect/views/disclosure/PoweredByMX'
import StickyComponentContainer from '../../../connect/components/StickyComponentContainer'

import { scrollToTop } from '../../../connect/utilities/ScrollToTop'

import { DisclosureInterstitial } from '../../../connect/views/disclosure/Interstitial'

export const OAuthStep = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_OAUTH)
  const {
    institution,
    isInstitutionSearchEnabled,
    onGoBack,
    sendAnalyticsEvent,
    sendPostMessage,
  } = props

  const { experimentVariant: hideLightDisclosure } = useExperiment(
    CONNECT_HIDE_LIGHT_DISCLOSURE_EXPERIMENT,
  )

  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()
  const oauthWindow = useRef(null)
  const interstitialRef = useRef(null)
  const containerRef = useRef(null)
  const [isWaitingForOAuth, setIsWaitingForOAuth] = useState(false)
  const [oauthStartError, setOAuthStartError] = useState(null)
  const [isStartingOauth, setIsStartingOauth] = useState(false)
  const connectConfig = useSelector(state => state.connect.connectConfig)
  const initializedClientConfig = useSelector(state => state.initializedClientConfig)
  const member = useSelector(state => getCurrentMember(state))
  const pendingOauthMember = useSelector(
    state =>
      state.connect.members.filter(
        member =>
          member.institution_guid === institution.guid &&
          member.connection_status === ReadableStatuses.PENDING,
      )[0],
  )
  const isOauthLoading = useSelector(state => state.connect.isOauthLoading)
  const oauthURL = useSelector(state => state.connect.oauthURL)
  const showExternalLinkPopup = useSelector(state => state.clientProfile.show_external_link_popup)
  const showDisclosureStep = useSelector(
    state => state.connect.widgetProfile.display_disclosure_in_connect,
  )
  const dispatch = useDispatch()

  const [isLeavingUrl, setIsLeavingUrl] = useState(null)
  const [showInterstitialDisclosure, setShowInterstitialDisclosure] = useState(false)

  /**
   * Called when we succesfully generate an oauth window uri for the exsting
   * member, or use the uri from a brand new member.
   */
  function onStartOAuthSuccess(member, oauthWindowURI) {
    setIsStartingOauth(false)
    setOAuthStartError(null)
    dispatch({
      type: connectActions.ActionTypes.START_OAUTH_SUCCESS,
      payload: { member, oauthWindowURI },
    })
  }

  /**
   * Called when something goes wrong when trying to generate an oauth url for
   * the member.
   */
  function onStartOAuthFail(err) {
    setIsStartingOauth(false)
    setOAuthStartError(err)
  }

  /**
   * Generate an oauth URL when the widget loads, or when we retry OAuth
   */
  useEffect(() => {
    if (oauthURL == null) {
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label: EventLabels.OAUTH,
        action: `${EventLabels.OAUTH} - ${EventActions.START}`,
      })

      setIsStartingOauth(true)
    }
  }, [])

  /**
   * Start an oauth flow by either getting an existing member's oauth_window_uri, or
   * creating a new member
   */
  useEffect(() => {
    if (!isStartingOauth) return () => {}

    let member$

    // If there is already an existing member/current memeber, don't create a new one, use that one
    if (member.is_oauth) {
      member$ = of(member)
    } else if (pendingOauthMember) {
      // If there is a pending oauth member, don't create a new one, use that one
      member$ = of(pendingOauthMember)
    } else {
      /**
       * At this point we have a new member, create it and use it's oauth URL
       */
      const newMemberStream$ = defer(() =>
        connectAPI.addMember(
          { is_oauth: true, institution_guid: institution.guid },
          connectConfig,
          initializedClientConfig,
        ),
      )
        .pipe(pluck('member'))
        .subscribe(
          member => onStartOAuthSuccess(member, member.oauth_window_uri),
          err => onStartOAuthFail(err),
        )

      return () => newMemberStream$.unsubscribe()
    }

    const existingMemberStream$ = member$
      .pipe(
        mergeMap(existingMember =>
          defer(() =>
            FireflyAPI.getOAuthWindowURI(existingMember.guid, initializedClientConfig),
          ).pipe(map(({ oauth_window_uri }) => [existingMember, oauth_window_uri])),
        ),
      )
      .subscribe(
        ([member, oauthWindowURI]) => onStartOAuthSuccess(member, oauthWindowURI),
        err => onStartOAuthFail(err),
      )

    return () => existingMemberStream$.unsubscribe()
  }, [isStartingOauth])

  /**
   * When the user clicks sign in we need to send the post message for
   * oauthRequested and open a window (if possible). Then go to the waiting
   * view while the user completes oauth
   */
  function onSignInClick() {
    sendAnalyticsEvent({
      category: EventCategories.CONNECT,
      label: EventLabels.OAUTH,
      action: `${EventLabels.OAUTH} - ${EventActions.END}`,
    })
    sendPostMessage('connect/oauthRequested', {
      url: oauthURL,
      member_guid: member.guid,
    })

    if (
      !initializedClientConfig.is_mobile_webview &&
      initializedClientConfig.connect?.oauth_referral_source === REFERRAL_SOURCES.BROWSER
    ) {
      oauthWindow.current = window.open(oauthURL)
    }

    setIsWaitingForOAuth(true)
  }

  function closeOAuthWindow() {
    if (oauthWindow.current) {
      oauthWindow.current.close()
      oauthWindow.current = null
    }
  }

  function handleOAuthRetry() {
    setIsStartingOauth(true)
    setIsWaitingForOAuth(false)
  }

  function handleOAuthSuccess(memberGuid) {
    closeOAuthWindow()
    dispatch(connectActions.handleOAuthSuccess(memberGuid))
  }

  function handleOAuthError(memberGuid, errorReason = null) {
    closeOAuthWindow()
    dispatch(connectActions.handleOAuthError({ memberGuid, errorReason }))
  }

  let oauthView = null

  if (isLeavingUrl) {
    oauthView = (
      <SlideDown>
        <LeavingNoticeFlat
          onCancel={() => {
            dispatch(
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.ENTER_CREDENTIALS,
                action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.VISIT_BANK} - ${EventActions.CANCEL}`,
              }),
            )
            setIsLeavingUrl(null)
          }}
          onContinue={() => {
            dispatch(
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.ENTER_CREDENTIALS,
                action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.VISIT_BANK} - ${EventActions.END}`,
              }),
            )

            goToUrlLink(isLeavingUrl)
          }}
        />
      </SlideDown>
    )
  } else if (showInterstitialDisclosure) {
    oauthView = (
      <Container ref={interstitialRef}>
        <DisclosureInterstitial
          handleGoBack={() => setShowInterstitialDisclosure(false)}
          scrollToTop={() => scrollToTop(interstitialRef)}
        />
      </Container>
    )
  } else if (isWaitingForOAuth) {
    oauthView = (
      <WaitingForOAuth
        institution={institution}
        member={member}
        onOAuthError={handleOAuthError}
        onOAuthRetry={handleOAuthRetry}
        onOAuthSuccess={handleOAuthSuccess}
        onReturnToSearch={onGoBack}
      />
    )
  } else if (oauthStartError) {
    oauthView = (
      <OAuthStartError
        institution={institution}
        oauthStartError={oauthStartError}
        onOAuthTryAgain={handleOAuthRetry}
        onReturnToSearch={onGoBack}
      />
    )
  } else {
    const selectedInstructionalData =
      member?.instructional_data ??
      pendingOauthMember?.instructional_data ??
      institution.instructional_data

    const footer =
      !showDisclosureStep && !hideLightDisclosure ? (
        <PoweredByMX
          onClick={() => {
            scrollToTop(containerRef)
            setShowInterstitialDisclosure(true)
          }}
        />
      ) : null

    // This view has a unique footer, so return now
    return (
      <StickyComponentContainer footer={footer} ref={containerRef}>
        <div role="alert">
          <InstitutionBlock institution={institution} />
          <ViewTitle
            title={selectedInstructionalData.title ?? __('Sign in with %1', institution.name)}
          />
          <SlideDown delay={getNextDelay()}>
            {selectedInstructionalData.description && (
              <InstructionalText
                instructionalText={selectedInstructionalData.description}
                setIsLeavingUrl={setIsLeavingUrl}
                showExternalLinkPopup={showExternalLinkPopup}
              />
            )}
            <InstructionList
              items={
                selectedInstructionalData.steps?.length > 0
                  ? selectedInstructionalData.steps
                  : [
                      __("We'll direct you to %1.", institution.name),
                      __(
                        "You'll sign in to %1 and choose accounts to connect. Your login information is never shared.",
                        institution.name,
                      ),
                      __("We'll return you here to finish connecting."),
                    ]
              }
              setIsLeavingUrl={setIsLeavingUrl}
              showExternalLinkPopup={showExternalLinkPopup}
            />
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <Button
              disabled={isOauthLoading || !oauthURL}
              onClick={() => onSignInClick()}
              role="link"
              style={{ ...styles.primaryButton, ...styles.fullWidthBtn }}
              variant="primary"
            >
              {isOauthLoading ? __('Loading ...') : __('Continue')}
            </Button>
            {isInstitutionSearchEnabled ? (
              <Button
                onClick={() => {
                  sendAnalyticsEvent({
                    category: EventCategories.CONNECT,
                    label: EventLabels.OAUTH,
                    action: `${EventLabels.OAUTH} - ${EventActions.CANCEL}`,
                  })
                  onGoBack()
                }}
                style={{ ...styles.neutralButton, ...styles.fullWidthBtn }}
              >
                {__('Cancel')}
              </Button>
            ) : null}
          </SlideDown>

          <SlideDown delay={getNextDelay()}>
            <PrivateAndSecure />
          </SlideDown>
        </div>
      </StickyComponentContainer>
    )
  }

  return <Container>{oauthView}</Container>
}

OAuthStep.propTypes = {
  institution: PropTypes.object.isRequired,
  isInstitutionSearchEnabled: PropTypes.bool.isRequired,
  onGoBack: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
}

const getStyles = tokens => {
  return {
    paragraphSpacing: {
      paddingBottom: tokens.Spacing.Small,
    },
    primaryButton: {
      display: 'inline-block',
      marginTop: tokens.Spacing.Medium,
    },
    neutralButton: {
      marginTop: tokens.Spacing.Medium,
    },
    fullWidthBtn: {
      width: '100%',
    },
  }
}
