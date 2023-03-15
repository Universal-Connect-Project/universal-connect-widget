import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import { __ } from '../../../utils/Intl'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { SlideDown } from '../../components/SlideDown'
import { GoBackButton } from '../../components/GoBackButton'
import { InstructionList } from '../../components/InstructionList'
import { getDelay } from '../../utilities/getDelay'
import { fadeOut } from '../../utilities/Animation'

export const HowItWorks = ({ handleGoBack, onContinue }) => {
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS_HOW_IT_WORKS)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  return (
    <div ref={containerRef}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton handleGoBack={handleGoBack} />
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <div style={styles.body}>
          <Text as="H2">{__('Connect your institution with account numbers')}</Text>
          <InstructionList
            items={[
              __('Enter your account information.'),
              __("You'll receive two small deposits."),
              __('Return to verify the deposit amounts.'),
            ]}
          />
        </div>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Button
          onClick={() => fadeOut(containerRef.current, 'up', 300).then(() => onContinue())}
          style={styles.button}
          variant="primary"
        >
          {__('Continue')}
        </Button>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => {
  return {
    body: {
      display: 'flex',
      flexDirection: 'column',
    },
    button: {
      marginTop: tokens.Spacing.Medium,
      width: '100%',
    },
  }
}

HowItWorks.propTypes = {
  handleGoBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
}
