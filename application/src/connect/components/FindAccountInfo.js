import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import { fadeOut } from 'src/connect/utilities/Animation'
import { __ } from 'src/connect/utilities/Intl'

import AccountCheckImage from 'src/connect/images/CheckAccountNumber.svg'
import RoutingCheckImage from 'src/connect/images/CheckRoutingNumber.svg'
import { VIEWS } from 'src/connect/views/microdeposits/Microdeposits'
import { GoBackButton } from 'src/connect/components/GoBackButton'
import { SlideDown } from 'src/connect/components/SlideDown'
import { getDelay } from 'src/connect/utilities/getDelay'

import { shouldShowConnectGlobalNavigationHeader } from 'reduxify/selectors/UserFeatures'

export const FindAccountInfo = ({ onClose, step }) => {
  const showConnectGlobalNavigationHeader = useSelector(shouldShowConnectGlobalNavigationHeader)
  const containerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()
  const type = step === VIEWS.ACCOUNT_INFO ? __('account') : __('routing')

  const handleClose = () => fadeOut(containerRef.current, 'up', 300).then(onClose)

  return (
    <div ref={containerRef} style={styles.container}>
      <SlideDown delay={getNextDelay()}>
        {!showConnectGlobalNavigationHeader && <GoBackButton handleGoBack={handleClose} />}

        <Text tag="h2">
          {// --TR: Full string "Find your {account/routing} number"
          __('Find your %1 number', type)}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text style={styles.title} tag="h3">
          {__('Mobile app or online portal')}
        </Text>
        <Text as="Paragraph">
          {// --TR: Full string "Log in and look for an account details section that usually includes your {account/routing} number."
          __(
            'Log in and look for an account details section that usually includes your %1 number.',
            type,
          )}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text style={styles.title} tag="h3">
          {__('Paper check')}
        </Text>
        <div
          aria-hidden={true}
          dangerouslySetInnerHTML={{
            __html: step === VIEWS.ACCOUNT_INFO ? AccountCheckImage : RoutingCheckImage,
          }}
          style={styles.svg}
        />
        <Text as="Paragraph">
          {// --TR: Full string "Your {account/routing} number is on the bottom of your checks."
          __('Your %1 number is on the bottom of your checks.', type)}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text style={styles.title} tag="h3">
          {__('Bank statement')}
        </Text>
        <Text as="Paragraph">
          {// --TR: Full string "Your {account/routing} number is usually included on your bank statement."
          __('Your %1 number is usually included on your bank statement.', type)}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Button onClick={handleClose} style={styles.button} variant="primary">
          {__('Continue')}
        </Button>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    maxWidth: 375,
  },
  title: {
    display: 'block',
    marginBottom: tokens.Spacing.Tiny,
    marginTop: tokens.Spacing.Large,
  },
  svg: {
    marginBottom: tokens.Spacing.XSmall,
    marginTop: tokens.Spacing.Tiny,
    width: '100%',
  },
  button: {
    marginTop: tokens.Spacing.XLarge,
    width: '100%',
  },
})

FindAccountInfo.propTypes = {
  onClose: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired,
}
