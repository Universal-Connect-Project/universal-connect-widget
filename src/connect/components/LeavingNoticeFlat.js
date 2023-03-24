import React from 'react'
import PropTypes from 'prop-types'

import { __ } from '../../utils/Intl'

import { Text } from '@kyper/text'
import { Button, ButtonGroup } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

import { SlideDown } from './SlideDown'

import { getDelay } from '../utilities/getDelay'

export const LeavingNoticeFlat = ({ onContinue, onCancel }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const getNextDelay = getDelay()

  return (
    <div role="alert">
      <SlideDown delay={getNextDelay()}>
        <Text style={styles.title} tag="h3">
          {__('You are leaving')}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text style={styles.text} tag="p">
          {__(
            'Selecting Continue will take you to an external location that we do not control. We are not responsible for the products, services, or information provided there.',
          )}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text style={{ ...styles.text, ...styles.padding }} tag="p">
          {__(
            'Keep in mind how their privacy policy, security measures, and terms and conditions may impact you.',
          )}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <ButtonGroup>
          <Button autoFocus={true} onClick={onCancel} style={styles.button}>
            {__('Cancel')}
          </Button>
          <Button onClick={onContinue} style={styles.button} variant="primary">
            {__('Continue')}
          </Button>
        </ButtonGroup>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => {
  return {
    title: {
      fontSize: tokens.FontSize.H2,
      fontWeight: tokens.FontWeight.Bold,
      marginBottom: tokens.Spacing.Medium,
    },
    text: {
      fontSize: tokens.FontSize.Body,
      lineHeight: tokens.LineHeight.Paragraph,
      marginBottom: tokens.Spacing.Small,
    },
    padding: {
      marginBottom: tokens.Spacing.XLarge,
    },
    button: {
      width: '100%',
    },
  }
}

LeavingNoticeFlat.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
}
