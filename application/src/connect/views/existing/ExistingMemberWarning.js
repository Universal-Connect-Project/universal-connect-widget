import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

import { __ } from '../../../utils/Intl'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { AriaLive } from '../../accessibility/AriaLive'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'

import { SlideDown } from '../../components/SlideDown'
import { Container } from '../../components/Container'
import { InstitutionBlock } from '../../components/InstitutionBlock'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'

import { getDelay } from '../../utilities/getDelay'

export const ExistingMemberWarning = ({
  addAnother,
  institution,
  onCancel,
  sendAnalyticsEvent,
}) => {
  useAnalyticsPath(...PageviewInfo.CONNECT_EXISTING_MEMBER_WARNING)
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const getNextDelay = getDelay()

  return (
    <Container>
      <SlideDown delay={getNextDelay()}>
        <InstitutionBlock institution={institution} />
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text color="primary" style={styles.headerText} tag="h2">
          {__('Already connected')}
        </Text>

        <Text color="primary" style={styles.text} tag="p">
          {__(
            'You have already connected to %1. Are you sure you want to connect to %1 with a different login?',
            institution.name,
          )}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <div style={styles.buttonContainer}>
          <Button
            aria-label={__('Cancel')}
            onClick={() => {
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.DUPLICATE_CONNECTION,
                action: EventLabels.DUPLICATE_CONNECTION + ' - ' + EventActions.GO_BACK,
              })
              onCancel()
            }}
            style={styles.button}
            variant="neutral"
          >
            {__('Cancel')}
          </Button>

          <Button
            aria-label={__('Yes, continue')}
            onClick={() => {
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label: EventLabels.DUPLICATE_CONNECTION,
                action: EventLabels.DUPLICATE_CONNECTION + ' - ' + EventActions.ADD_ANOTHER,
              })

              addAnother()
            }}
            style={{ ...styles.button, ...styles.buttonContinue }}
            variant="neutral"
          >
            {__('Yes, continue')}
          </Button>
        </div>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <PrivateAndSecure />
      </SlideDown>

      <AriaLive
        level="assertive"
        message={__('You have already connected to %1.', institution.name)}
        timeout={100}
      />
    </Container>
  )
}

const getStyles = tokens => {
  return {
    headerText: {
      marginBottom: tokens.Spacing.Medium,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      width: '100%',
    },
    buttonContinue: {
      marginLeft: tokens.Spacing.XSmall,
    },
    text: {
      marginBottom: tokens.Spacing.XLarge,
    },
  }
}

ExistingMemberWarning.propTypes = {
  addAnother: PropTypes.func.isRequired,
  institution: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
}
