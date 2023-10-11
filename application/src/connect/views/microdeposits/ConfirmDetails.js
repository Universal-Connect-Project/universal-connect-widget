import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { defer } from 'rxjs'
import { useDispatch, useSelector } from 'react-redux'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import { AccountFields } from './const'
import { AccountTypeLabels, MicrodepositsStatuses } from './const'
import { SlideDown } from '../../components/SlideDown'
import { GoBackButton } from '../../components/GoBackButton'
import { DetailReviewItem } from '../../components/DetailReviewItem'
import { getDelay } from '../../utilities/getDelay'

import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'
import { sendPostMessage } from '../../../redux/actions/PostMessage'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { fadeOut } from '../../utilities/Animation'
import FireflyAPI from '../../../utils/FireflyAPI'
import { __ } from '../../../utils/Intl'

export const ConfirmDetails = props => {
  const {
    accountDetails,
    currentMicrodeposit,
    handleGoBack,
    onEditForm,
    onError,
    onSuccess,
  } = props
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS_CONFIRM_DETAILS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user_guid = useSelector(state => state.user.details.guid)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isSubmitting) return () => {}
    let stream$

    if (currentMicrodeposit.guid) {
      // If we have a microdeposit guid, we're updating an existing microdeposit
      stream$ = defer(() => {
        const { account_number, account_type, routing_number } = accountDetails

        return FireflyAPI.updateMicrodeposit(currentMicrodeposit.guid, {
          account_name: getAccountNickname(accountDetails),
          account_number,
          account_type,
          routing_number,
          user_guid,
        })
      })
    } else {
      // If we don't, we're creating a new microdeposit
      stream$ = defer(() =>
        FireflyAPI.createMicrodeposit({
          ...accountDetails,
          account_name: getAccountNickname(accountDetails),
          user_guid,
        }),
      )
    }

    const subscription = stream$.subscribe(
      response =>
        fadeOut(containerRef.current, 'up', 300).then(() => {
          dispatch(
            sendPostMessage('connect/microdeposits/detailsSubmitted', {
              microdeposit_guid: response.micro_deposit.guid,
            }),
          )
          dispatch(
            sendAnalyticsEvent({
              category: EventCategories.CONNECT,
              label: EventLabels.MICRODEPOSITS,
              action: successAnalyticAction(),
            }),
          )
          setIsSubmitting(false)
          return onSuccess(response.micro_deposit)
        }),
      err => {
        setIsSubmitting(false)
        return fadeOut(containerRef.current, 'up', 300).then(() => onError(err.response))
      },
    )

    return () => subscription.unsubscribe()
  }, [isSubmitting])

  const successAnalyticAction = () => {
    if (currentMicrodeposit?.status === MicrodepositsStatuses.PREINITIATED) {
      // Microdeposit was preinitiated, we are still submitting(SUBMIT) new details.
      return `${EventLabels.MICRODEPOSITS} - ${EventActions.SUBMIT}`
    } else if (accountDetails.guid) {
      // We are editing an existing microdeposit, END the EDIT action flow.
      return `${EventLabels.MICRODEPOSITS} - ${EventActions.EDIT} - ${EventActions.END}`
    } else {
      // Standard flow, submitting(SUBMIT) details for a new microdeposit.
      return `${EventLabels.MICRODEPOSITS} - ${EventActions.SUBMIT}`
    }
  }

  const handleEdit = focus => fadeOut(containerRef.current, 'up', 300).then(() => onEditForm(focus))

  return (
    <div ref={containerRef}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton handleGoBack={handleGoBack} />

        <div style={styles.header}>
          <Text as="H2" style={styles.title}>
            {__('Review your information')}
          </Text>
        </div>
      </SlideDown>

      {props.shouldShowUserDetails && (
        <SlideDown delay={getNextDelay()}>
          <DetailReviewItem
            ariaButtonLabel={__('Edit first and last name')}
            isEditable={isSubmitting}
            label={__('First and last name')}
            onEditClick={() => handleEdit(AccountFields.USER_NAME)}
            value={`${accountDetails.first_name} ${accountDetails.last_name}`}
          />

          <DetailReviewItem
            ariaButtonLabel={__('Edit email')}
            isEditable={isSubmitting}
            label={__('Email')}
            onEditClick={() => handleEdit(AccountFields.EMAIL)}
            value={accountDetails.email}
          />
        </SlideDown>
      )}

      <SlideDown delay={getNextDelay()}>
        <DetailReviewItem
          ariaButtonLabel={__('Edit routing number')}
          isEditable={isSubmitting}
          label={__('Routing number')}
          onEditClick={() => handleEdit(AccountFields.ROUTING_NUMBER)}
          value={accountDetails.routing_number}
        />

        <DetailReviewItem
          ariaButtonLabel={__('Edit account type')}
          isEditable={isSubmitting}
          label={__('Account type')}
          onEditClick={() => handleEdit(AccountFields.ACCOUNT_TYPE)}
          value={AccountTypeLabels[accountDetails.account_type]}
        />

        <DetailReviewItem
          ariaButtonLabel={__('Edit account number')}
          isEditable={isSubmitting}
          label={__('Account number')}
          onEditClick={() => handleEdit(AccountFields.ACCOUNT_NUMBER)}
          value={accountDetails.account_number}
        />
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text as="ParagraphSmall" style={styles.disclaimer}>
          {__(
            'By clicking Confirm, I authorize this app’s service provider, Dwolla, Inc., to originate credits and debits to the checking or savings account identified above for the purposes of micro-deposit verification. This authorization may be revoked at any time by notifying your institution in writing.',
          )}
        </Text>
        <Button
          disabled={isSubmitting}
          onClick={() => setIsSubmitting(true)}
          style={styles.button}
          variant="primary"
        >
          {isSubmitting ? `${__('Sending')}...` : __('Confirm')}
        </Button>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: tokens.Spacing.XSmall,
  },
  institutionGroup: {
    alignItems: 'center',
    display: 'flex',
  },
  institutionGrid: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: tokens.Spacing.Small,
  },
  disclaimer: {
    color: tokens.TextColor.Secondary,
    display: 'block',
    marginTop: tokens.Spacing.Medium,
  },
  button: {
    marginTop: tokens.Spacing.Medium,
    width: '100%',
  },
})

ConfirmDetails.propTypes = {
  accountDetails: PropTypes.object,
  currentMicrodeposit: PropTypes.object,
  handleGoBack: PropTypes.func.isRequired,
  onEditForm: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  shouldShowUserDetails: PropTypes.bool,
}

// Ex default account_name: Checking (...1234)
const getAccountNickname = accountDetails => {
  const lastFour = accountDetails.account_number.slice(-4)
  const formattedAccountType = AccountTypeLabels[accountDetails.account_type]

  return `${formattedAccountType} ...${lastFour}`
}
