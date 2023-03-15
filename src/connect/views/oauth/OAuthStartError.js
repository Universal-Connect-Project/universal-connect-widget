import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@kyper/button'

import { useTokens } from '@kyper/tokenprovider'

import { SlideDown } from '../../components/SlideDown'
import { InstitutionBlock } from '../../components/InstitutionBlock'
import { MemberError } from '../../components/MemberError'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'
import { getDelay } from '../../utilities/getDelay'

import { __ } from '../../../utils/Intl'

export const OAuthStartError = props => {
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  return (
    <div>
      <SlideDown delay={getNextDelay()}>
        <InstitutionBlock institution={props.institution} />
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <MemberError error={props.oauthStartError} institution={props.institution} />
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Button onClick={props.onOAuthTryAgain} style={styles.primaryButton} variant="primary">
          {__('Try again')}
        </Button>
        <Button onClick={props.onReturnToSearch} style={styles.neutralButton}>
          {__('Cancel')}
        </Button>
        <PrivateAndSecure />
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  spinner: {
    marginTop: tokens.Spacing.XLarge,
  },
  primaryButton: {
    display: 'inline-block',
    marginTop: tokens.Spacing.Large,
    width: '100%',
  },
  neutralButton: {
    marginTop: tokens.Spacing.Small,
    width: '100%',
  },
})

OAuthStartError.propTypes = {
  institution: PropTypes.object.isRequired,
  oauthStartError: PropTypes.object.isRequired,
  onOAuthTryAgain: PropTypes.func.isRequired,
  onReturnToSearch: PropTypes.func.isRequired,
}
