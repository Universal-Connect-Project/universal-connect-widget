import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { __ } from '../../../utils/Intl'
import { fadeOut } from '../../utilities/Animation'

import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
//import { InstitutionLogo } from '@kyper/institutionlogo'
import { InstitutionLogo } from '../../components/InstitutionLogo'
import { useTokens } from '@kyper/tokenprovider'
import { ChevronRight as ChevronRightIcon } from '@kyper/icon/ChevronRight'

import { SlideDown } from '../../components/SlideDown'
import { Container } from '../../components/Container'
import { getDelay } from '../../utilities/getDelay'
import { ActionableUtilityRow } from '../../components/ActionableUtilityRow'
import { SurveyPrompt } from '../../components/SurveyPrompt'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'
import { AriaLive } from '../../accessibility/AriaLive'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'

import { EventLabels, PageviewInfo } from '../../const/Analytics'
import { focusElement } from '../../utilities/Accessibility'

export const Connected = ({
  currentMember,
  isInstitutionSearchEnabled,
  institution,
  onContinueClick,
  sendAnalyticsEvent,
  sendPostMessage,
}) => {
  useAnalyticsPath(...PageviewInfo.CONNECT_CONNECTED)
  const containerRef = useRef(null)
  const continueButtonRef = useRef(null)

  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  const [showFeedBack, setShowFeedBack] = useState(false)

  const { name: institutionName } = institution

  const [ariaLiveRegionMessage, setAriaLiveRegionMessage] = useState(
    __('You have successfully connected to %1!', institutionName),
  )
  useEffect(() => {
    focusElement(continueButtonRef.current)
  }, [institutionName])

  return (
    <Container ref={containerRef}>
      {showFeedBack ? (
        <SurveyPrompt
          currentMember={currentMember}
          eventLabel={EventLabels.CONNECT_MEMBER_SUCCESS}
          onCancel={() => {
            setShowFeedBack(false)
            focusElement(continueButtonRef.current)
          }}
          sendAnalyticsEvent={sendAnalyticsEvent}
          setAriaLiveRegionMessage={setAriaLiveRegionMessage}
          title={__('How would you rate your experience?')}
        />
      ) : (
        <React.Fragment>
          <SlideDown delay={getNextDelay()}>
            <InstitutionLogo
              alt=""
              institution={institution}
              size={64}
              style={styles.institutionLogo}
            />
          </SlideDown>

          <SlideDown delay={getNextDelay()}>
            <Text style={styles.title} tag="h2">
              {__('Connected')}
            </Text>
            <Text as="Paragraph" style={styles.body} tag="p">
              {__('You have successfully connected to %1!', institutionName)}
            </Text>
          </SlideDown>

          {isInstitutionSearchEnabled && (
            <SlideDown delay={getNextDelay()}>
              <Button
                onClick={() => {
                  sendPostMessage('connect/connected/primaryAction')
                  fadeOut(containerRef.current, 'up', 500).then(() => onContinueClick())
                }}
                ref={continueButtonRef}
                style={styles.button}
                variant="primary"
              >
                {__('Continue')}
              </Button>
            </SlideDown>
          )}

          <SlideDown delay={getNextDelay()}>
            <ActionableUtilityRow
              icon={<ChevronRightIcon color={tokens.TextColor.ButtonLinkTertiary} size={16} />}
              onClick={() => setShowFeedBack(true)}
              text={__('Give feedback')}
            />
          </SlideDown>

          <SlideDown delay={getNextDelay()}>
            <PrivateAndSecure />
          </SlideDown>
        </React.Fragment>
      )}
      <AriaLive level="assertive" message={ariaLiveRegionMessage} timeout={100} />
    </Container>
  )
}

const getStyles = tokens => {
  return {
    institutionLogo: {
      display: 'block',
      margin: `${tokens.Spacing.Large}px auto 40px`,
    },
    title: {
      marginBottom: tokens.Spacing.Tiny,
    },
    body: {
      marginBottom: tokens.Spacing.XLarge,
    },
    button: {
      marginBottom: tokens.Spacing.Small,
      width: '100%',
    },
  }
}

Connected.propTypes = {
  currentMember: PropTypes.object.isRequired,
  institution: PropTypes.object.isRequired,
  isInstitutionSearchEnabled: PropTypes.bool,
  onContinueClick: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
}
