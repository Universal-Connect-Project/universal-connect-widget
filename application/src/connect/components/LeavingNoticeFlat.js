import React from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

import { __ } from 'src/connect/utilities/Intl'

import { Text } from '@kyper/text'
import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

import { SlideDown } from 'src/connect/components/SlideDown'
import { GoBackButton } from 'src/connect/components/GoBackButton'

import { getDelay } from 'src/connect/utilities/getDelay'

export const LeavingNoticeFlat = ({ onContinue, onCancel, portalTo = 'connect-wrapper' }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const getNextDelay = getDelay()

  return createPortal(
    <div role="alert" style={styles.container}>
      <div style={styles.content}>
        <SlideDown delay={getNextDelay()}>
          <GoBackButton handleGoBack={onCancel} />
        </SlideDown>
        <SlideDown delay={getNextDelay()}>
          <div style={styles.header}>
            <Text data-test="leaving-notice-flat-header" style={styles.title} tag="h3">
              {__('You are leaving')}
            </Text>
            <AttentionFilled color={tokens.BackgroundColor.MessageBoxError} size={24} />
          </div>
          <Text data-test="leaving-notice-flat-paragraph1" style={styles.text} tag="p">
            {__(
              'Selecting Continue will take you to an external website with a different privacy policy, security measures, and terms and conditions.',
            )}
          </Text>
        </SlideDown>
        <SlideDown delay={getNextDelay()}>
          <Button
            autoFocus={true}
            data-test="leaving-notice-flat-continue-button"
            onClick={onContinue}
            style={styles.continueButton}
            variant="primary"
          >
            {__('Continue')}
          </Button>
          <Button
            data-test="leaving-notice-flat-cancel-button"
            onClick={onCancel}
            style={styles.cancelButton}
            variant="transparent"
          >
            {__('Cancel')}
          </Button>
        </SlideDown>
      </div>
    </div>,
    document.getElementById(portalTo),
  )
}

const getStyles = tokens => {
  return {
    container: {
      top: 0,
      margin: '0 auto',
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: tokens.ZIndex.Modal,
      backgroundColor: tokens.BackgroundColor.Container,
    },
    content: {
      maxWidth: '400px',
      margin: `${tokens.Spacing.Medium}px auto 0`,
      padding: '0 24px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.Spacing.Medium,
    },
    title: {
      fontSize: tokens.FontSize.H2,
      fontWeight: tokens.FontWeight.Bold,
    },
    text: {
      fontSize: tokens.FontSize.Body,
      lineHeight: tokens.LineHeight.Paragraph,
      marginBottom: tokens.Spacing.Small,
    },
    padding: {
      marginBottom: tokens.Spacing.XLarge,
    },
    continueButton: {
      width: '100%',
      marginTop: tokens.Spacing.Large,
    },
    cancelButton: {
      width: '100%',
      marginTop: tokens.Spacing.XSmall,
    },
  }
}

LeavingNoticeFlat.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
}
