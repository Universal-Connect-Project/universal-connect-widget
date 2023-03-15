import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { MessageBox } from '@kyper/messagebox'
import { Text } from '@kyper/text'

import { Container } from '../../components/Container'
import { SlideDown } from '../../components/SlideDown'
import { ViewTitle } from '../../components/ViewTitle'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'

import { __ } from '../../../utils/Intl'
import { getDelay } from '../../utilities/getDelay'

export const VerifyError = ({ error, onGoBack }) => {
  const buttonText = __('Go back')

  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  return (
    <Container>
      <SlideDown delay={getNextDelay()}>
        <ViewTitle title={__('Something went wrong')} />
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <MessageBox variant="error">
          <Text role="alert" tag="p">
            {__(getErrorMessage(error?.response?.status))}
          </Text>
        </MessageBox>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Button aria-label={buttonText} onClick={onGoBack} style={styles.button} variant="primary">
          {buttonText}
        </Button>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <PrivateAndSecure />
      </SlideDown>
    </Container>
  )
}

function getErrorMessage(status = 500) {
  if (status === 403) {
    return __("This connection doesn't support verification.")
  } else if ([409, 422].includes(status)) {
    return __("We can't verify this connection right now. Please try again later.")
  } else {
    return __('Oops! Something went wrong. Error code: %1', status)
  }
}

const getStyles = tokens => {
  return {
    header: {
      fontSize: tokens.FontSize.H2,
      fontWeight: tokens.FontWeight.Bold,
      marginBottom: tokens.Spacing.XSmall,
    },
    button: {
      marginTop: tokens.Spacing.Large,
      width: '100%',
    },
  }
}

VerifyError.propTypes = {
  error: PropTypes.object,
  onGoBack: PropTypes.func.isRequired,
}
