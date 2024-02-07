import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { css } from '@mxenabled/cssinjs'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { MessageBox } from '@kyper/messagebox'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { fadeOut } from '../../utilities/Animation'
import { __ } from '../../../utils/Intl'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'

import { SlideDown } from '../../components/SlideDown'
import {
  MicrodepositsStatuses,
  AccountTypeLabels,
  ReadableStatuses,
} from './const'

export const MicrodepositErrors = ({
  // If a microdeposit fails to create we can access the form data from accountDetails and error
  // from microdepositCreateError. This is needed if we get a network error when attempting to
  // create a new Microdeposit.
  accountDetails,
  microdeposit,
  microdepositCreateError,
  onResetMicrodeposits,
  resetMicrodeposits,
  sendAnalyticsEvent,
  sendPostMessage,
}) => {
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS_MICRODEPOSIT_ERRORS)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const isErroredStatus =
    microdeposit?.status === MicrodepositsStatuses.ERRORED ||
    microdepositCreateError?.status === 400

  // Retrieving account number
  const accountNumber =
    microdeposit?.account_number ||
    microdepositCreateError?.data.micro_deposit.account_number ||
    accountDetails.account_number

  const getTitle = () => {
    if (microdeposit.status === MicrodepositsStatuses.PREVENTED) {
      return __('Account not connected')
    } else {
      return __('Something went wrong')
    }
  }
  const getMessage = () => {
    if (microdeposit.status === MicrodepositsStatuses.PREVENTED) {
      return __("This account can't be connected. There were too many failed attempts.")
    } else if (isErroredStatus) {
      return __(
        'We’re unable to connect this account. Please review the account details you submitted.',
      )
    } else {
      return __('We’re unable to connect this account. Please try again later.')
    }
  }
  const handleContinue = () => {
    if (
      [MicrodepositsStatuses.PREVENTED, MicrodepositsStatuses.REJECTED].includes(
        microdeposit.status,
      )
    ) {
      sendPostMessage('connect/microdeposits/error/primaryAction', {
        status: ReadableStatuses[microdeposit.status],
        guid: microdeposit.guid,
      })
    } else if (microdeposit.status === MicrodepositsStatuses.ERRORED) {
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label: EventLabels.MICRODEPOSITS,
        action: `${EventLabels.MICRODEPOSITS} - ${EventActions.EDIT} - ${EventActions.START}`,
      })
    }

    return fadeOut(containerRef.current, 'down').then(
      // If ERRORRED/accountDetails view, it should step to Account Info
      // Else, resetMicrodeposits which returns user to Connect Institution Search
      isErroredStatus ? resetMicrodeposits : onResetMicrodeposits,
    )
  }

  return (
    <div ref={containerRef}>
      <SlideDown>
        <div style={styles.header}>
          <Text as="H2" style={styles.title}>
            {getTitle()}
          </Text>
        </div>

        <MessageBox style={styles.messageBox} variant="error">
          <Text as="ParagraphSmall" role="alert" tag="p">
            {getMessage()}
          </Text>
        </MessageBox>
      </SlideDown>

      <SlideDown delay={100}>
        <div className={css(styles.infoRow)}>
          <div style={styles.textGroup}>
            <Text as="Small" style={styles.rowHeader}>
              {__('Account type')}
            </Text>
            <Text as="Body" style={styles.bold}>
              {AccountTypeLabels[microdeposit?.account_type ?? accountDetails.account_type]}
            </Text>
          </div>
        </div>
        <div className={css(styles.infoRow)}>
          <div style={styles.textGroup}>
            <Text as="Small" style={styles.rowHeader}>
              {__('Routing number')}
            </Text>
            <Text as="Body" style={styles.bold}>
              {microdeposit?.routing_number ||
                microdepositCreateError.data.micro_deposit?.routing_number ||
                accountDetails.routing_number}
            </Text>
          </div>
        </div>
        <div className={css(styles.infoRow)}>
          <div style={styles.textGroup}>
            <Text as="Small" style={styles.rowHeader}>
              {__('Account number')}
            </Text>
            <Text as="Body" style={styles.bold}>
              {`•••• ${accountNumber.substr(-4)}`}
            </Text>
          </div>
        </div>
      </SlideDown>

      <SlideDown delay={200}>
        <Button onClick={handleContinue} style={styles.button} variant="primary">
          {isErroredStatus ? __('Edit details') : __('Continue')}
        </Button>
        {isErroredStatus && (
          <Button
            onClick={() => fadeOut(containerRef.current, 'down').then(onResetMicrodeposits)}
            style={styles.button}
            variant="neutral"
          >
            {__('Connect a different account')}
          </Button>
        )}
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
  messageBox: {
    marginBottom: tokens.Spacing.Small,
  },
  infoRow: {
    alignItems: 'center',
    borderBottom: `1px solid ${tokens.Color.Neutral300}`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.Spacing.Small}px 0`,
    '&:last-of-type': {
      marginBottom: tokens.Spacing.Medium,
    },
  },
  textGroup: {
    display: 'flex',
    flowGrow: 1,
    flexDirection: 'column',
  },
  rowHeader: {
    color: tokens.TextColor.InputLabel,
  },
  bold: {
    fontWeight: tokens.FontWeight.Bold,
    overflowWrap: 'anywhere',
  },
  button: {
    display: 'inline-flex',
    marginTop: tokens.Spacing.Medium,
    width: '100%',
  },
})

MicrodepositErrors.propTypes = {
  accountDetails: PropTypes.object,
  microdeposit: PropTypes.object,
  microdepositCreateError: PropTypes.object,
  onResetMicrodeposits: PropTypes.func.isRequired,
  resetMicrodeposits: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
}
