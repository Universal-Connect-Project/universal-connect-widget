import React from 'react'

import { __ } from '../../../utils/Intl'
import PropTypes from 'prop-types'

// External Dependencies
import { goToUrlLink } from '../../utilities/global'
import { getInstitutionLoginUrl } from '../../utilities/Institution'

import { Export } from '@kyper/icon/Export'
import { useTokens } from '@kyper/tokenprovider'
import { ChevronRight } from '@kyper/icon/ChevronRight'

import { ActionableUtilityRow } from '../../components/ActionableUtilityRow'

import { EventCategories, EventLabels, EventActions } from '../../const/Analytics'

import {
  GET_HELP,
  DISCONNECT_INSTITUTION,
  VISIT_WEBSITE,
} from './consts'

export const SecondaryActions = ({
  actions,
  institution,
  isDeleteInstitutionOptionEnabled,
  member,
  showSupport,
  showExternalLinkPopup,
  onGetHelpClick,
  sendAnalyticsEvent,
  onDeleteConnectionClick,
  setIsLeaving,
}) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const actionMap = [
    {
      key: VISIT_WEBSITE,
      icon: Export,
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
      key: GET_HELP,
      icon: ChevronRight,
      title: __('Get help'),
      onClick: () => {
        onGetHelpClick()
      },
      shouldShow: showSupport,
    },
    {
      key: DISCONNECT_INSTITUTION,
      icon: ChevronRight,
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
        const Icon = action.icon

        if (!action.shouldShow) return false
        if (!actions.includes(action.key)) return false

        return (
          <div key={action.key}>
            <ActionableUtilityRow
              icon={<Icon color={tokens.Color.Neutral700} size={16} />}
              onClick={action.onClick}
              role={action.key === VISIT_WEBSITE ? 'link' : 'button'}
              text={action.title}
            />
          </div>
        )
      })}
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      marginTop: tokens.Spacing.Large,
    },
    text: {
      paddingLeft: tokens.Spacing.XSmall,
      color: tokens.Color.Primary300,
    },
  }
}

SecondaryActions.propTypes = {
  actions: PropTypes.array.isRequired,
  institution: PropTypes.object.isRequired,
  isDeleteInstitutionOptionEnabled: PropTypes.bool.isRequired,
  member: PropTypes.object.isRequired,
  onDeleteConnectionClick: PropTypes.func.isRequired,
  onGetHelpClick: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  setIsLeaving: PropTypes.func.isRequired,
  showExternalLinkPopup: PropTypes.bool.isRequired,
  showSupport: PropTypes.bool.isRequired,
}
