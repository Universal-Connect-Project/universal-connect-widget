import React from 'react'
import PropTypes from 'prop-types'
import { css } from '@mxenabled/cssinjs'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'

import { __ } from '../../../../utils/Intl'
import useAnalyticsPath from '../../../hooks/useAnalyticsPath'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../../const/Analytics'

import { InstitutionTile } from '../../../components/InstitutionTile'
import { SlideDown } from '../../../components/SlideDown'

import { INSTITUTION_TYPES } from '../consts'

import { getDelay } from '../../../utilities/getDelay'
import { sendAnalyticEvent as sendPosthogEvent } from '../../../utilities/analytics'

export const PopularInstitutionsList = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_SEARCH_POPULAR)
  const {
    institutions,
    handleSelectInstitution,
    onAddManualAccountClick,
    onSearchInstituionClick,
    sendAnalyticsEvent,
    enableManualAccounts,
  } = props

  const getNextDelay = getDelay()

  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.listContainer}>
      {institutions.map((institution, index) => {
        // Want to ensure we send the correct event based on if they are clicking
        // a 'popular' or 'discovered' institution
        const analyticAction =
          institution.analyticType === INSTITUTION_TYPES.POPULAR
            ? EventLabels.INSTITUTION_SEARCH + '-' + EventActions.POPULAR_SELECT
            : EventLabels.INSTITUTION_SEARCH + '-' + EventActions.DISCOVERED_SELECT

        return (
          <div className={css(styles.flexItem)} key={institution.guid}>
            <SlideDown delay={getNextDelay()}>
              <InstitutionTile
                institution={institution}
                selectInstitution={() => {
                  sendAnalyticsEvent({
                    category: EventCategories.CONNECT,
                    label: EventLabels.INSTITUTION_SEARCH,
                    action: analyticAction,
                    value: (index + 1).toString(),
                  })
                  sendPosthogEvent('select_popular_institution', {
                    institution_guid: institution.guid,
                    institution_name: institution.name,
                  })

                  handleSelectInstitution(institution)
                }}
                size={48}
              />
            </SlideDown>
          </div>
        )
      })}

      <hr aria-hidden={true} style={styles.horizontalLine} />

      <div style={styles.transparentButton}>
        <SlideDown delay={getNextDelay()}>
          <Button onClick={onSearchInstituionClick} variant={'transparent'}>
            {__('Search for your institution')}
          </Button>
        </SlideDown>
        {enableManualAccounts && (
          <SlideDown delay={getNextDelay()}>
            <Button onClick={onAddManualAccountClick} variant={'transparent'}>
              {__('Add account manually')}
            </Button>
          </SlideDown>
        )}
      </div>
    </div>
  )
}

const getStyles = tokens => {
  return {
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: `-${tokens.Spacing.Small}px`,
      marginRight: `-${tokens.Spacing.Small}px`,
      overflow: 'auto',
      maxHeight: '100%',
      background: tokens.BackgroundColor.Container,
    },
    flexItem: {
      width: '100%',
    },
    title: {
      display: 'block',
      fontWeight: tokens.FontWeight.Bold,
      marginBottom: tokens.Spacing.Tiny,
      marginTop: tokens.Spacing.Large,
    },
    actionTile: {
      marginBottom: tokens.Spacing.Tiny,
    },
    transparentButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
    horizontalLine: {
      margin: tokens.Spacing.Small,
    },
  }
}

PopularInstitutionsList.propTypes = {
  enableManualAccounts: PropTypes.bool.isRequired,
  handleSelectInstitution: PropTypes.func.isRequired,
  institutions: PropTypes.array.isRequired,
  onAddManualAccountClick: PropTypes.func.isRequired,
  onSearchInstituionClick: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
}
