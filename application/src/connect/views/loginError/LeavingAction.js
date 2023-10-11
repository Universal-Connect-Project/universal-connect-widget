import React from 'react'
import PropTypes from 'prop-types'

// External dependencies
import { goToUrlLink } from '../../utilities/global'
import { getInstitutionLoginUrl } from '../../utilities/Institution'

import { EventCategories, EventLabels, EventActions } from '../../const/Analytics'

import { LeavingNoticeFlat } from '../../components/LeavingNoticeFlat'

export const LeavingAction = ({ institution, sendAnalyticsEvent, setIsLeaving, size }) => {
  return (
    <LeavingNoticeFlat
      onCancel={() => {
        sendAnalyticsEvent({
          category: EventCategories.CONNECT,
          label: EventLabels.LOGIN_ERROR,
          action: `${EventLabels.LOGIN_ERROR} - ${EventActions.VISIT_BANK} - ${EventActions.CANCEL}`,
        })
        setIsLeaving(false)
      }}
      onContinue={() => {
        sendAnalyticsEvent({
          category: EventCategories.CONNECT,
          label: EventLabels.LOGIN_ERROR,
          action: `${EventLabels.LOGIN_ERROR} - ${EventActions.VISIT_BANK} - ${EventActions.END}`,
        })

        const url = getInstitutionLoginUrl(institution)

        goToUrlLink(url)
      }}
      size={size}
    />
  )
}

LeavingAction.propTypes = {
  institution: PropTypes.object.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  setIsLeaving: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
}
