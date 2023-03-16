import React from 'react'
import PropTypes from 'prop-types'

import { __ } from '../../../utils/Intl'

import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

import { SlideDown } from '../../components/SlideDown'
import { Container } from '../../components/Container'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'

import { getDelay } from '../../utilities/getDelay'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

export const DeleteMemberSuccess = ({
  institution,
  isInstitutionSearchEnabled,
  onContinueClick,
}) => {
  useAnalyticsPath(...PageviewInfo.CONNECT_DELETE_MEMBER_SUCCESS)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  return (
    <Container>
      <SlideDown delay={getNextDelay()}>
        <p style={styles.primaryText}>{__('Disconnected')}</p>
        <p style={styles.secondaryText}>
          {__('You have successfully disconnected %1.', institution.name)}
        </p>
      </SlideDown>

      {isInstitutionSearchEnabled && (
        <SlideDown delay={getNextDelay()}>
          <Button onClick={onContinueClick} style={styles.button} variant="primary">
            {__('Done')}
          </Button>
        </SlideDown>
      )}

      <SlideDown delay={getNextDelay()}>
        <PrivateAndSecure />
      </SlideDown>
    </Container>
  )
}

const getStyles = tokens => {
  return {
    primaryText: {
      fontSize: tokens.FontSize.H2,
      fontWeight: tokens.FontWeight.Bold,
      color: tokens.TextColor.Default,
    },
    secondaryText: {
      fontSize: tokens.FontSize.Paragraph,
      marginBottom: tokens.Spacing.XLarge,
      color: tokens.TextColor.Default,
    },
    button: {
      width: '100%',
    },
  }
}

DeleteMemberSuccess.propTypes = {
  institution: PropTypes.object.isRequired,
  isInstitutionSearchEnabled: PropTypes.bool,
  onContinueClick: PropTypes.func.isRequired,
}
