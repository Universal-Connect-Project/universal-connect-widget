import _get from 'lodash/get'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { of, defer } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import PropTypes from 'prop-types'
import { MessageBox } from '@kyper/messagebox'
import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'
import { ChevronRight } from '@kyper/icon/ChevronRight'

import { Container } from '../../components/Container'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'
import { ActionableUtilityRow } from '../../components/ActionableUtilityRow'
import { InstitutionBlock } from '../../components/InstitutionBlock'
import { MFAForm } from './MFAForm'
import { SlideDown } from '../../components/SlideDown'
import { Support, VIEWS as SUPPORT_VIEWS } from '../../components/support/Support'
import { ReadableStatuses } from '../../const/Statuses'

import { getCurrentMember } from '../../../redux/selectors/Connect'

import { ActionTypes } from '../../../redux/actions/Connect'

import FireflyAPI from '../../../utils/FireflyAPI'
import { __ } from '../../../utils/Intl'
import { EventCategories, EventLabels, EventActions } from '../../const/Analytics'
import { getDelay } from '../../utilities/getDelay'

const MFAStep = props => {
  const {
    enableSupportRequests,
    institution,
    onGoBack,
    sendAnalyticsEvent,
    sendPostMessage,
  } = props
  const connectConfig = useSelector(state => state.connect?.connectConfig ?? {})
  const isHuman = useSelector(state => state.app.humanEvent)
  const currentMember = useSelector(getCurrentMember)

  const [showSupportView, setShowSupportView] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatedMember, setUpdatedMember] = useState(currentMember)
  const dispatch = useDispatch()

  const mfaCredentials = _get(currentMember, 'mfa.credentials', [])
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  useEffect(() => {
    if (!isSubmitting) return () => {}

    dispatch({
      type: ActionTypes.MFA_CONNECT_SUBMIT,
      payload: { guid: updatedMember.guid },
    })

    /**
     * Prevent an update to the member, it causes the member to go CHALLENGED again,
     * and it prevents the user from seeing the real error.
     *
     * If a user starts the MFA process and waits until the member becomes expired
     * before submitting an answer, we should let the user know via an error message
     * that they took too long
     */
    if (updatedMember?.connection_status === ReadableStatuses.EXPIRED) {
      return of({
        type: ActionTypes.MFA_CONNECT_SUBMIT_ERROR,
      })
    }

    const mfaConnectSubmit$ = defer(() =>
      FireflyAPI.updateMember(updatedMember, connectConfig, isHuman),
    )
      .pipe(
        map(member => ({
          type: ActionTypes.MFA_CONNECT_SUBMIT_SUCCESS,
          payload: { item: member },
        })),
        catchError(() => {
          return of({
            type: ActionTypes.MFA_CONNECT_SUBMIT_ERROR,
          })
        }),
      )
      .subscribe(action => {
        setIsSubmitting(false)
        dispatch(action)
      })

    return () => mfaConnectSubmit$.unsubscribe()
  }, [isSubmitting])

  if (showSupportView) {
    return (
      <Support
        loadToView={SUPPORT_VIEWS.GENERAL_SUPPORT}
        onClose={() => setShowSupportView(false)}
      />
    )
  }

  return (
    <Container>
      <SlideDown delay={getNextDelay()}>
        <InstitutionBlock institution={institution} />
      </SlideDown>
      {mfaCredentials.length === 0 ? (
        <SlideDown delay={getNextDelay()}>
          <MessageBox
            title={__('Oops! Something went wrong. Please try again later.')}
            variant="error"
          >
            <Button onClick={onGoBack} size="small" style={styles.goBackButton} variant="link">
              {__('Go Back')}
            </Button>
          </MessageBox>
        </SlideDown>
      ) : (
        <SlideDown delay={getNextDelay()}>
          <MFAForm
            currentMember={currentMember}
            isSubmitting={isSubmitting}
            onSubmit={credentials => {
              sendPostMessage('connect/submitMFA', {
                member_guid: currentMember.guid,
              })
              setUpdatedMember(previousMember => ({
                ...previousMember,
                credentials,
              }))
              setIsSubmitting(true)
            }}
            sendAnalyticsEvent={sendAnalyticsEvent}
          />
        </SlideDown>
      )}

      {enableSupportRequests && (
        <SlideDown delay={getNextDelay()}>
          <div style={styles.getHelp}>
            <ActionableUtilityRow
              icon={<ChevronRight color={tokens.TextColor.ButtonLinkTertiary} size={16} />}
              onClick={() => {
                sendAnalyticsEvent({
                  category: EventCategories.CONNECT,
                  label: EventLabels.MFA,
                  action: `${EventLabels.MFA} - ${EventActions.NEED_HELP}`,
                })

                setShowSupportView(true)
              }}
              text={__('Get help')}
            />
          </div>
        </SlideDown>
      )}

      <SlideDown delay={getNextDelay()}>
        <PrivateAndSecure />
      </SlideDown>
    </Container>
  )
}

MFAStep.propTypes = {
  enableSupportRequests: PropTypes.bool.isRequired,
  institution: PropTypes.object.isRequired,
  onGoBack: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
}

const getStyles = tokens => {
  return {
    goBackButton: {
      marginRight: tokens.Spacing.Large,
      marginTop: tokens.Spacing.Medium,
    },
    getHelp: {
      paddingTop: tokens.Spacing.Small,
    },
  }
}

export default MFAStep
