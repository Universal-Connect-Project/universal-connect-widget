import React from 'react'

import { __ } from 'src/connect/utilities/Intl'
import PropTypes from 'prop-types'

// External Dependencies
import { goToUrlLink } from 'src/connect/utilities/global'
import { getInstitutionLoginUrl } from 'src/connect/utilities/Institution'
import useAnalyticsEvent from 'src/connect/hooks/useAnalyticsEvent'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'

import {
  AnalyticEvents,
  EventCategories,
  EventLabels,
  EventActions,
} from 'src/connect/const/Analytics'

import {
  GET_HELP,
  DISCONNECT_INSTITUTION,
  VISIT_WEBSITE,
  TRY_ANOTHER_INSTITUTION,
} from 'src/connect/views/loginError/consts'

export const SecondaryActions = ({
  actions,
  institution,
  isDeleteInstitutionOptionEnabled,
  isInstitutionSearchEnabled,
  member,
  showSupport,
  showExternalLinkPopup,
  onGetHelpClick,
  onTryAnotherInstitutionClick,
  sendAnalyticsEvent,
  onDeleteConnectionClick,
  setIsLeaving,
}) => {
  const sendPosthogEvent = useAnalyticsEvent()
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const actionMap = [
    {
      key: VISIT_WEBSITE,
      title: __("Go to bank's website"),
      onClick: () => {
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
      },
      shouldShow: true,
    },
    {
      key: TRY_ANOTHER_INSTITUTION,
      title: __('Try another institution'),
      onClick: () => {
        onTryAnotherInstitutionClick()
      },
      shouldShow: isInstitutionSearchEnabled,
    },
    {
      key: GET_HELP,
      title: __('Get help'),
      onClick: () => {
        sendPosthogEvent(AnalyticEvents.LOGIN_ERROR_CLICKED_GET_HELP)
        onGetHelpClick()
      },
      shouldShow: showSupport,
    },
    {
      key: DISCONNECT_INSTITUTION,
      title: __('Disconnect this institution'),
      onClick: () => {
        sendAnalyticsEvent({
          category: EventCategories.CONNECT,
          label: EventLabels.LOGIN_ERROR,
          action: `${EventLabels.LOGIN_ERROR} - ${EventActions.DELETE_MEMBER} - ${EventActions.START}`,
        })
        onDeleteConnectionClick()
      },
      shouldShow:
        member.is_managed_by_user && !member.is_being_aggreated && isDeleteInstitutionOptionEnabled,
    },
  ]

  return (
    <div style={styles.container}>
      {actionMap.map(action => {
        if (!action.shouldShow) return false
        if (!actions.includes(action.key)) return false

        return (
          <Button
            data-test={`${action.title.replace(/\s+/g, '-')}-button`}
            key={action.key}
            onClick={action.onClick}
            role={action.key === VISIT_WEBSITE ? 'link' : 'button'}
            style={styles.button}
            variant="transparent"
          >
            {action.title}
          </Button>
        )
      })}
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: tokens.Spacing.XSmall,
    },
    button: {
      width: '100%',
    },
  }
}

SecondaryActions.propTypes = {
  actions: PropTypes.array.isRequired,
  institution: PropTypes.object.isRequired,
  isDeleteInstitutionOptionEnabled: PropTypes.bool.isRequired,
  isInstitutionSearchEnabled: PropTypes.bool.isRequired,
  member: PropTypes.object.isRequired,
  onDeleteConnectionClick: PropTypes.func.isRequired,
  onGetHelpClick: PropTypes.func.isRequired,
  onTryAnotherInstitutionClick: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  setIsLeaving: PropTypes.func.isRequired,
  showExternalLinkPopup: PropTypes.bool.isRequired,
  showSupport: PropTypes.bool.isRequired,
}
