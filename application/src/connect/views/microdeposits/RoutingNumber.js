import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { defer } from 'rxjs'
import _isEmpty from 'lodash/isEmpty'

import { useTokens } from '@kyper/tokenprovider'
import { TextInput } from '@kyper/input'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { ChevronRight } from '@kyper/icon/ChevronRight'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { AriaLive } from '../../accessibility/AriaLive'
import FireflyAPI from '../../../utils/FireflyAPI'
import { __ } from '../../../utils/Intl'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'

import { SharedRoutingNumber } from './SharedRoutingNumber'
import { BLOCKED_REASONS } from './const'
import { SlideDown } from '../../components/SlideDown'
import { GoBackButton } from '../../components/GoBackButton'
import { FindAccountInfo } from '../../components/FindAccountInfo'
import { ActionableUtilityRow } from '../../components/ActionableUtilityRow'
import { useForm } from '../../hooks/useForm'
import { getDelay } from '../../utilities/getDelay'
import { fadeOut } from '../../utilities/Animation'

const schema = {
  routingNumber: {
    label: __('Routing number'),
    required: true,
    pattern: 'digits',
    length: 9,
  },
}

export const RoutingNumber = props => {
  const {
    accountDetails,
    handleGoBack,
    onContinue,
    sendAnalyticsEvent,
    sendPostMessage,
    stepToIAV,
  } = props
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS_ROUTING_NUMBER)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  const [routingBlocked, setRoutingBlocked] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showFindDetails, setShowFindDetails] = useState(false)
  const [institutions, setInstitutions] = useState([])

  const initialForm = { routingNumber: accountDetails?.routing_number ?? '' }
  const { handleTextInputChange, handleSubmit, values, errors } = useForm(
    () => setSubmitting(true),
    schema,
    initialForm,
  )

  useEffect(() => {
    if (errors.routingNumber) {
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label: EventLabels.MICRODEPOSITS,
        action: `${EventLabels.MICRODEPOSITS} - ${EventActions.INVALID_ROUTING_NUMBER}`,
      })
    }
  }, [errors])

  useEffect(() => {
    if (submitting) {
      const newAccountDetails = {
        ...accountDetails,
        routing_number: values.routingNumber,
      }

      const verifyRoutingNumber$ = defer(() =>
        FireflyAPI.verifyRoutingNumber(values.routingNumber),
      ).subscribe(
        resp => {
          if (_isEmpty(resp)) {
            // If resp is empty, the routing number is not blocked.
            return handleContinue(newAccountDetails)
          } else {
            // Routing number blocked, send post message and handle logic.
            sendPostMessage('connect/microdeposits/blockedRoutingNumber', {
              routing_number: values.routingNumber,
              reason: resp.blocked_routing_number.reason_name,
            })

            // If reason is IAV_PREFERRED, load institutions to prepare for user choice.
            if (resp.blocked_routing_number.reason === BLOCKED_REASONS.IAV_PREFERRED) {
              const loadedInstitutions$ = defer(() =>
                FireflyAPI.loadInstitutions({
                  routing_number: values.routingNumber,
                  account_verification_is_enabled: true,
                }),
              ).subscribe(searchedInstitutions => {
                setInstitutions(searchedInstitutions)
                return setSubmitting(false)
              })

              return () => loadedInstitutions$.unsubscribe()
            } else {
              setRoutingBlocked(__('Institution is not supported for microdeposit verification.'))
              return setSubmitting(false)
            }
          }
        },
        err => {
          setRoutingBlocked(
            __('Unable to proceed. Please try again later. Error: %1', err.response.status),
          )
          setSubmitting(false)
        },
      )

      return () => verifyRoutingNumber$.unsubscribe()
    }

    return () => {}
  }, [submitting])

  const handleContinue = newAccountDetails =>
    fadeOut(containerRef.current, 'up', 300).then(() => onContinue(newAccountDetails))

  if (showFindDetails) {
    return <FindAccountInfo onClose={() => setShowFindDetails(false)} step="routingNumber" />
  }

  if (institutions.length > 0) {
    return (
      <SharedRoutingNumber
        continueMicrodeposits={() =>
          onContinue({
            ...accountDetails,
            routing_number: values.routingNumber,
          })
        }
        institutions={institutions}
        onGoBack={() => setInstitutions([])}
        routingNumber={values.routingNumber}
        selectInstitution={institutionGuid => stepToIAV(institutionGuid)}
      />
    )
  }

  return (
    <div ref={containerRef}>
      <GoBackButton handleGoBack={handleGoBack} />

      <SlideDown delay={getNextDelay()}>
        <div style={styles.header}>
          <Text style={styles.title} tag="h2">
            {__('Enter routing number')}
          </Text>
        </div>
      </SlideDown>

      <form onSubmit={e => e.preventDefault()}>
        <SlideDown delay={getNextDelay()}>
          <div style={styles.inputStyle}>
            <TextInput
              autoComplete="off"
              autoFocus={true}
              disabled={submitting}
              errorText={errors.routingNumber ?? routingBlocked}
              label={__('Routing number')}
              name="routingNumber"
              onChange={handleTextInputChange}
              value={values.routingNumber}
            />
          </div>
        </SlideDown>

        <SlideDown delay={getNextDelay()}>
          <Button
            aria-label={__('Continue to confirm details')}
            disabled={submitting}
            onClick={handleSubmit}
            style={styles.button}
            type="submit"
            variant="primary"
          >
            {submitting ? `${__('Checking')}...` : __('Continue')}
          </Button>
        </SlideDown>

        <SlideDown delay={getNextDelay()}>
          <ActionableUtilityRow
            icon={<ChevronRight color={tokens.TextColor.ButtonLinkTertiary} size={16} />}
            onClick={() => setShowFindDetails(true)}
            text={__('Help finding your routing number')}
          />
        </SlideDown>

        <AriaLive level="assertive" message={_isEmpty(errors) ? '' : errors.routingNumber} />
        <AriaLive level="assertive" message={routingBlocked} />
      </form>
    </div>
  )
}

const getStyles = tokens => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: tokens.Spacing.Large,
  },
  inputStyle: {
    marginBottom: tokens.Spacing.XLarge,
  },
  button: {
    width: '100%',
    marginBottom: '12px',
  },
})

RoutingNumber.propTypes = {
  accountDetails: PropTypes.object,
  handleGoBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
  stepToIAV: PropTypes.func.isRequired,
}
