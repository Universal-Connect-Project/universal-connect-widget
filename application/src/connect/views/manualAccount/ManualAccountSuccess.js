import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { __ } from '../../../utils/Intl'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'

import { fadeOut } from '../../utilities/Animation'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { SlideDown } from '../../components/SlideDown'
import { AccountTypeNames } from './constants'
import { getDelay } from '../../utilities/getDelay'
import { StyledAccountTypeIcon } from '../../components/StyledAccountTypeIcon'

export const ManualAccountSuccess = props => {
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MANUAL_ACCOUNT_SUCCESS)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  const handleDone = () => fadeOut(containerRef.current, 'up', 300).then(() => props.handleDone())

  return (
    <div ref={containerRef} style={styles.container}>
      <SlideDown delay={getNextDelay()}>
        <StyledAccountTypeIcon
          icon={props.accountType}
          iconSize={40}
          size={64}
          style={styles.icon}
        />
        <Text as="H2" style={styles.title}>
          {__('%1 added', AccountTypeNames[props.accountType])}
        </Text>
        <Text style={styles.paragraph} tag="p">
          {__('Your account has been saved manually. You can edit or delete it later.')}
        </Text>
      </SlideDown>
      <SlideDown delay={getNextDelay()}>
        <Button onClick={handleDone} style={styles.button} variant="primary">
          {__('Done')}
        </Button>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    textAlign: 'center',
  },
  icon: {
    margin: `${tokens.Spacing.XLarge}px auto`,
  },
  title: {
    display: 'block',
    paddingBottom: tokens.Spacing.XSmall,
  },
  button: {
    marginTop: tokens.Spacing.XLarge,
    width: '100%',
  },
})

ManualAccountSuccess.propTypes = {
  accountType: PropTypes.number.isRequired,
  handleDone: PropTypes.func.isRequired,
}
