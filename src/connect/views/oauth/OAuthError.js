import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'
import { MessageBox } from '@kyper/messagebox'
import { useTokens } from '@kyper/tokenprovider'

import { __ } from '../../../utils/Intl'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { OAUTH_ERROR_REASONS } from '../../const/Connect'

import { SlideDown } from '../../components/SlideDown'
import { Container } from '../../components/Container'
import { ViewTitle } from '../../components/ViewTitle'
import { getDelay } from '../../utilities/getDelay'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'

export const OAuthError = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_OAUTH_ERROR)
  const { currentMember, onRetry, sendAnalyticsEvent, sendPostMessage } = props

  const errorReason = useSelector(state => state.connect.oauthErrorReason)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  // If we have an oauth error, send the post message.
  useEffect(() => {
    sendPostMessage('connect/oauthError', {
      member_guid: currentMember.guid,
      error_reason: errorReason ?? OAUTH_ERROR_REASONS.SERVER_ERROR,
    })
  }, [])

  return (
    <Container>
      <SlideDown delay={getNextDelay()}>
        <ViewTitle title={__('Something went wrong')} />

        <MessageBox variant="error">
          <Text as="Paragraph" role="alert" tag="p">
            {getOAuthErrorMessage(errorReason, currentMember?.name)}
          </Text>
        </MessageBox>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Button
          autoFocus={true}
          onClick={() => {
            sendAnalyticsEvent({
              category: EventCategories.CONNECT,
              label: EventLabels.OAUTH,
              action: `${EventLabels.OAUTH} - ${EventActions.OAUTH_ERROR_RETRY}`,
            })
            onRetry()
          }}
          style={styles.button}
          variant="primary"
        >
          {__('Try again')}
        </Button>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <PrivateAndSecure />
      </SlideDown>
    </Container>
  )
}

OAuthError.propTypes = {
  currentMember: PropTypes.object.isRequired,
  onRetry: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
}

const getStyles = tokens => {
  return {
    button: {
      marginTop: tokens.Spacing.Large,
      width: '100%',
    },
  }
}

export const getOAuthErrorMessage = (errorReason, memberName = null) => {
  switch (errorReason) {
    case OAUTH_ERROR_REASONS.CANCELLED:
      return __(
        'Looks like you declined to share your account info with this app. If this was a mistake, please try again. If you change your mind, you can connect your account later.',
      )
    case OAUTH_ERROR_REASONS.DENIED:
      return __('Looks like there was a problem logging in. Please try again.')
    case OAUTH_ERROR_REASONS.PROVIDER_ERROR:
      if (memberName) {
        return __(
          'Looks like something went wrong while connecting to %1. Please try again.',
          memberName,
        )
      }

      // Fallback message if membername is not available
      return __(
        'Looks like something went wrong while connecting to this institution. Please try again.',
      )
    case OAUTH_ERROR_REASONS.IMPEDED:
      if (memberName) {
        return __(
          "Your attention is needed at this institution's website. Please log in to the appropriate website for %1 and follow the steps to resolve the issue.",
          memberName,
        )
      }

      // Fallback message if membername is not available
      return __(
        "Your attention is needed at this institution's website. Please log in to their website and follow the steps to resolve the issue.",
      )
    default:
      return __('Oops! There was an error trying to connect your account. Please try again.')
  }
}

export default OAuthError
