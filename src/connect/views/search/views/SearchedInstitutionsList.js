import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import useAnalyticsPath from '../../../hooks/useAnalyticsPath'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../../const/Analytics'

import { __, _n } from '../../../../utils/Intl'

import { InstitutionTile } from '../../../components/InstitutionTile'
import { SlideDown } from '../../../components/SlideDown'
import { getDelay } from '../../../utilities/getDelay'
import { sendAnalyticEvent as sendPosthogEvent } from '../../../utilities/analytics'

export const SearchedInstitutionsList = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_SEARCHED)
  const {
    enableManualAccounts,
    enableSupportRequests,
    institutions,
    isMicrodepositsEnabled,
    handleSelectInstitution,
    onAddManualAccountClick,
    onRequestInstitution,
    onVerifyWithMicrodeposits,
    sendAnalyticsEvent,
    setAriaLiveRegionMessage,
  } = props
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  useEffect(() => {
    setAriaLiveRegionMessage(_n('%1 search result', '%1 search results', institutions.length))
    return () => {
      setAriaLiveRegionMessage('')
    }
  }, [institutions.length])

  return (
    <div style={styles.container}>
      <SlideDown delay={getNextDelay()}>
        <Text as="Paragraph" style={styles.paragraph}>
          {_n('%1 search result', '%1 search results', institutions.length)}
        </Text>
        {institutions.map((institution, index) => {
          return (
            <InstitutionTile
              institution={institution}
              key={institution.guid}
              selectInstitution={() => {
                sendAnalyticsEvent({
                  category: EventCategories.CONNECT,
                  label: EventLabels.INSTITUTION_SEARCH,
                  action:
                    EventLabels.INSTITUTION_SEARCH +
                    ' - ' +
                    EventActions.END +
                    ' (Institution Selected)',
                  value: (index + 1).toString(),
                })
                sendPosthogEvent('select_searched_institution', {
                  institution_guid: institution.guid,
                  institution_name: institution.name,
                })

                handleSelectInstitution(institution)
              }}
              size={32}
            />
          )
        })}
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <hr aria-hidden={true} style={styles.rule} />
        <div style={styles.transparentButton}>
          {enableManualAccounts && (
            <Button onClick={onAddManualAccountClick} variant={'transparent'}>
              {__('Add account manually')}
            </Button>
          )}
          {enableSupportRequests && (
            <Button onClick={onRequestInstitution} variant={'transparent'}>
              {__('Submit an institution request')}
            </Button>
          )}

          {/* Microdeposits uses ACH which isn't availbale in Canada(fr-CA) so not translating */}
          {isMicrodepositsEnabled && (
            <Button onClick={onVerifyWithMicrodeposits} variant={'transparent'}>
              {__('Connect with account numbers')}
            </Button>
          )}
        </div>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      background: tokens.BackgroundColor.Container,
      flexFlow: 'column',
      marginLeft: `-${tokens.Spacing.Small}px`,
      marginRight: `-${tokens.Spacing.Small}px`,
      overflow: 'auto',
      maxHeight: '100%',
    },
    paragraph: {
      display: 'block',
      margin: `0 0 ${tokens.Spacing.Tiny}px ${tokens.Spacing.Small}px`,
    },
    subhead: {
      marginBottom: tokens.Spacing.XSmall,
    },
    rule: {
      margin: tokens.Spacing.Small,
    },
    transparentButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
  }
}

SearchedInstitutionsList.propTypes = {
  enableManualAccounts: PropTypes.bool.isRequired,
  enableSupportRequests: PropTypes.bool.isRequired,
  handleSelectInstitution: PropTypes.func.isRequired,
  institutions: PropTypes.array,
  isMicrodepositsEnabled: PropTypes.bool.isRequired,
  onAddManualAccountClick: PropTypes.func.isRequired,
  onRequestInstitution: PropTypes.func.isRequired,
  onVerifyWithMicrodeposits: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  setAriaLiveRegionMessage: PropTypes.func.isRequired,
}
