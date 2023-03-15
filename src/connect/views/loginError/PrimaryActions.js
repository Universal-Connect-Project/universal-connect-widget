import React from 'react'

import { __ } from '../../../utils/Intl'
import PropTypes from 'prop-types'

import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

import { EventCategories, EventLabels, EventActions } from '../../const/Analytics'

import { REFRESH, UPDATE_CREDENTIALS } from './consts'

export const PrimaryActions = ({
  actions,
  onRefreshClick,
  onUpdateCredentialsClick,
  sendAnalyticsEvent,
}) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const actionMap = {
    [REFRESH]: {
      text: __('Try again'),
      onClick: () => {
        sendAnalyticsEvent({
          category: EventCategories.CONNECT,
          label: EventLabels.LOGIN_ERROR,
          action: `${EventLabels.LOGIN_ERROR} - ${EventActions.TRY_REFRESHING}`,
        })
        onRefreshClick()
      },
    },
    [UPDATE_CREDENTIALS]: {
      text: __('Connect'),
      onClick: () => {
        sendAnalyticsEvent({
          category: EventCategories.CONNECT,
          label: EventLabels.LOGIN_ERROR,
          action: `${EventLabels.LOGIN_ERROR} - ${EventActions.UPDATE_CREDENTIALS}`,
        })
        onUpdateCredentialsClick()
      },
    },
  }

  return (
    <div style={styles.container}>
      {actions.map(actionKey => {
        const actionObject = actionMap[actionKey]

        return (
          <Button
            key={actionKey}
            onClick={actionObject.onClick}
            style={styles.button}
            variant="primary"
          >
            {actionObject.text}
          </Button>
        )
      })}
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      marginTop: tokens.Spacing.XLarge,
    },
    button: {
      width: '100%',
    },
  }
}

PrimaryActions.propTypes = {
  actions: PropTypes.array.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onUpdateCredentialsClick: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
}
