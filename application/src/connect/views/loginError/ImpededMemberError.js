import React from 'react'

import { __ } from '../../../utils/Intl'
import PropTypes from 'prop-types'

import { getInstitutionLoginUrl } from '../../utilities/Institution'
import { goToUrlLink } from '../../utilities/global'

import { EventCategories, EventLabels, EventActions } from '../../const/Analytics'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'
import { ChevronRight } from '@kyper/icon/ChevronRight'

export const ImpededMemberError = ({
  institution,
  message,
  onRefreshClick,
  sendAnalyticsEvent,
  setIsLeaving,
  showExternalLinkPopup,
  title,
}) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.container}>
      <Text as="H2">{title}</Text>
      <Text as="Paragraph">{message}</Text>
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <div style={styles.numberIcon}>1</div>
        </div>
        <div>
          <Text as="Paragraph">
            {__("Log in to %1's website and resolve the issue.", institution.name)}
          </Text>
          <div style={styles.actionArea}>
            <Button
              onClick={() => {
                if (showExternalLinkPopup) {
                  setIsLeaving(true)
                  sendAnalyticsEvent({
                    category: EventCategories.CONNECT,
                    label: EventLabels.LOGIN_ERROR,
                    action: `${EventLabels.LOGIN_ERROR} - ${EventActions.VISIT_BANK} - ${EventActions.START}`,
                  })
                } else {
                  sendAnalyticsEvent({
                    category: EventCategories.CONNECT,
                    label: EventLabels.LOGIN_ERROR,
                    action: `${EventLabels.LOGIN_ERROR} - ${EventActions.VISIT_BANK}`,
                  })

                  const url = getInstitutionLoginUrl(institution)

                  goToUrlLink(url)
                }
              }}
              variant="link"
            >
              {__('Visit website')}
            </Button>
            <ChevronRight color={tokens.Color.Primary300} />
          </div>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <div style={styles.numberIcon}>2</div>
        </div>
        <div>
          <Text as="Paragraph">{__('Come back here and try to connect your account again.')}</Text>
          <div style={styles.actionArea}>
            <Button onClick={onRefreshClick} variant="link">
              {__('Try again')}
            </Button>
            <ChevronRight color={tokens.Color.Primary300} />
          </div>
        </div>
      </div>
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: tokens.Spacing.Medium,
      marginBottom: tokens.Spacing.Medium,
    },
    iconWrapper: {
      marginRight: tokens.Spacing.Small,
    },
    numberIcon: {
      borderRadius: '50%',
      fontFamily: tokens.Font.Semibold,
      height: tokens.Spacing.Large,
      width: tokens.Spacing.Large,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.Color.Primary100,
    },
    actionArea: {
      display: 'flex',
      alignItems: 'center',
    },
  }
}

ImpededMemberError.propTypes = {
  institution: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  setIsLeaving: PropTypes.func.isRequired,
  showExternalLinkPopup: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}
