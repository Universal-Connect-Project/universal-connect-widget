import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'

import { useTokens } from '@kyper/tokenprovider'
import { CheckmarkFilled as CheckmarkFilledIcon } from '@kyper/icon/CheckmarkFilled'
import { Text } from '@kyper/text'
import { TextArea } from '@kyper/textarea'
import { Button, ButtonGroup } from '@kyper/button'
import { UserFeedback, FEED_BACK_ICONS_VARIANTS, FEED_BACK_ICONS_VALUES } from '@kyper/userfeedback'

import { fadeOut } from '../utilities/Animation'

import { SlideDown } from './SlideDown'
import { getDelay } from '../utilities/getDelay'

import { __ } from '../../utils/Intl'
import FireflyAPI from '../../utils/FireflyAPI'

import useAnalyticsPath from '../hooks/useAnalyticsPath'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../const/Analytics'
import { ConnectionStatusMap } from '../const/Statuses'

const feedbackLabels = {
  [FEED_BACK_ICONS_VARIANTS.FEED_BACK_ICON_1]: {
    label: __('Very bad'),
    isVisible: true,
  },
  [FEED_BACK_ICONS_VARIANTS.FEED_BACK_ICON_2]: {
    label: __('Bad'),
    isVisible: false,
  },
  [FEED_BACK_ICONS_VARIANTS.FEED_BACK_ICON_3]: {
    label: __('Okay'),
    isVisible: false,
  },
  [FEED_BACK_ICONS_VARIANTS.FEED_BACK_ICON_4]: {
    label: __('Good'),
    isVisible: false,
  },
  [FEED_BACK_ICONS_VARIANTS.FEED_BACK_ICON_5]: {
    label: __('Very good'),
    isVisible: true,
  },
}

const feedbackValueLabelsMap = {
  [FEED_BACK_ICONS_VALUES.Feedback1]: feedbackLabels.Feedback1.label,
  [FEED_BACK_ICONS_VALUES.Feedback2]: feedbackLabels.Feedback2.label,
  [FEED_BACK_ICONS_VALUES.Feedback3]: feedbackLabels.Feedback3.label,
  [FEED_BACK_ICONS_VALUES.Feedback4]: feedbackLabels.Feedback4.label,
  [FEED_BACK_ICONS_VALUES.Feedback5]: feedbackLabels.Feedback5.label,
}

export const SurveyPrompt = ({
  currentMember,
  eventLabel, // Event label for a given step
  onCancel,
  title,
  sendAnalyticsEvent,
  setAriaLiveRegionMessage,
}) => {
  useAnalyticsPath(...PageviewInfo.CONNECT_SURVEY_FEEDBACK)
  const [rating, setRating] = useState('')
  const [labelForRating, setLabelForRating] = useState('')
  const [feedBackComment, setFeedBackComment] = useState('')
  const [showFeedBackContainer, setShowFeedBackContainer] = useState(false)
  const [showThankYouMessage, setShowThankYouMessage] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const connectionStatusCode = currentMember.connection_status
  const containerRef = useRef(null)

  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  useEffect(() => {
    sendAnalytics(eventLabel, EventActions.FEED_BACK, EventActions.START)
  }, [])

  /**
   * The parent component should contain an ARIA live region for the announcements to work
   * This avoids "noise" in screen readers since only one ARIA live region would be present.
   */
  useEffect(() => {
    if (showThankYouMessage) {
      setAriaLiveRegionMessage(__('Thanks for your feedback!'))
    } else {
      setAriaLiveRegionMessage(title)
    }

    return () => {
      setAriaLiveRegionMessage('')
    }
  }, [showThankYouMessage, title])

  useEffect(() => {
    if (submitting) {
      const feedBack = {
        rating,
        comments: feedBackComment,
        source: connectionStatusCode,
      }

      FireflyAPI.submitConnectFeedBack(feedBack).then(() => onFeedBackComplete())
    }
  }, [submitting])

  const onChangeHandler = rating => {
    setRating(rating)
    setLabelForRating(feedbackValueLabelsMap[rating])
    setShowFeedBackContainer(true)
  }

  const onFeedBackComplete = () => {
    const connectionStatusName = ConnectionStatusMap[connectionStatusCode]

    // Setting submitting back to false
    setSubmitting(false)

    // Fire analytic events
    sendAnalytics(eventLabel, EventActions.FEED_BACK, EventActions.END)

    sendAnalytics(
      EventLabels.CONNECT_FEEDBACK,
      `(${connectionStatusCode})${connectionStatusName} - ${rating}`,
      EventActions.SUBMITTED,
    )

    setShowThankYouMessage(true)
    // We want to redirect the user after 2000ms
    setTimeout(() => {
      setShowThankYouMessage(false)
      onCancel()
    }, 2000)
  }

  const sendAnalytics = (label, action, actionType) => {
    sendAnalyticsEvent({
      category: EventCategories.CONNECT,
      label,
      action: `${label} - ${action} - ${actionType}`,
      value: rating.toString(),
    })
  }

  return (
    <div ref={containerRef}>
      {showThankYouMessage ? (
        <SlideDown delay={getNextDelay()}>
          <div style={styles.thankYouContainer}>
            <CheckmarkFilledIcon color={tokens.Color.Success300} size={48} />
            <Text style={styles.thankYouMessage} tag="h2">
              {__('Thanks for your feedback!')}
            </Text>
          </div>
        </SlideDown>
      ) : (
        <React.Fragment>
          <SlideDown delay={getNextDelay()}>
            <Text style={styles.title} tag="h2">
              {title}
            </Text>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <UserFeedback
              feedbackLabels={feedbackLabels}
              name={`${eventLabel}-userfeedback`}
              onChange={onChangeHandler}
              style={styles.userFeedback}
            />
          </SlideDown>
          {showFeedBackContainer && (
            <SlideDown delay={getNextDelay()}>
              <TextArea
                aria-label={__('Feedback text box.')}
                name="feedBackComment"
                onChange={e => setFeedBackComment(e.target.value)}
                placeholder={__('What was %1 about it?', labelForRating.toLowerCase())}
                style={styles.textArea}
                value={feedBackComment || ''}
              />
              <Text style={styles.disclaimer} tag="p">
                {__(
                  'We welcome your feedback. Please do not share personal or financial information, such as account numbers or passwords. Your feedback is anonymous and will be available to this app and their data access provider, MX, to help improve the experience of connecting financial data.',
                )}
              </Text>
            </SlideDown>
          )}

          <SlideDown delay={getNextDelay()}>
            <ButtonGroup>
              <Button
                onClick={() => {
                  sendAnalytics(eventLabel, EventActions.FEED_BACK, EventActions.CANCEL)
                  fadeOut(containerRef.current, 'up', 300).then(() => onCancel())
                }}
                style={styles.button}
              >
                {__('Cancel')}
              </Button>
              <Button
                disabled={!rating}
                onClick={() => setSubmitting(true)}
                style={styles.button}
                variant="primary"
              >
                {__('Send')}
              </Button>
            </ButtonGroup>
          </SlideDown>
        </React.Fragment>
      )}
    </div>
  )
}

SurveyPrompt.propTypes = {
  currentMember: PropTypes.object.isRequired,
  eventLabel: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  setAriaLiveRegionMessage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

const getStyles = tokens => ({
  title: {
    marginTop: tokens.Spacing.XLarge,
    marginBottom: tokens.Spacing.Large,
  },
  userFeedback: {
    marginBottom: tokens.Spacing.Large,
  },
  textArea: {
    resize: 'none',
    marginBottom: tokens.Spacing.XSmall,
  },
  button: {
    width: '100%',
  },
  thankYouContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: tokens.Spacing.SuperJumbo,
  },
  thankYouMessage: {
    textAlign: 'center',
    marginTop: tokens.Spacing.Large,
  },
  disclaimer: {
    fontSize: tokens.FontSize.XSmall,
    lineHeight: tokens.LineHeight.Small,
    marginBottom: tokens.Spacing.XLarge,
    color: tokens.TextColor.Secondary,
  },
})
