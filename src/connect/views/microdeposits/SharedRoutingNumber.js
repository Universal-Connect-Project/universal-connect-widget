import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Accounts } from '@kyper/icon/Accounts'

import { __ } from '../../../utils/Intl'

import { SlideDown } from '../../components/SlideDown'
import { InstitutionTile } from '../../components/InstitutionTile'
import { getDelay } from '../../utilities/getDelay'
import { GoBackButton } from '../../components/GoBackButton'
import { ActionTile } from '../../components/ActionTile'
import { fadeOut } from '../../utilities/Animation'

export const SharedRoutingNumber = props => {
  const { continueMicrodeposits, institutions, onGoBack, routingNumber, selectInstitution } = props
  const containerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  return (
    <div ref={containerRef} style={styles.container}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton handleGoBack={onGoBack} />

        <Text style={styles.title} tag="h2">
          {__('Select your institution')}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text as="Paragraph">
          {// --TR: This will always be 2 or more institutions per routing number
          __('%1 found with routing number %2', institutions.length, routingNumber)}
        </Text>
      </SlideDown>

      {institutions.map(institution => (
        <SlideDown delay={getNextDelay()} key={institution.guid}>
          <div style={styles.institutions}>
            <InstitutionTile
              institution={institution}
              key={institution.guid}
              selectInstitution={() =>
                fadeOut(containerRef.current, 'up', 300).then(() =>
                  selectInstitution(institution.guid),
                )
              }
              size={32}
            />
          </div>
        </SlideDown>
      ))}

      <SlideDown delay={getNextDelay()}>
        <hr aria-hidden={true} />
        <div style={styles.actionTile}>
          <ActionTile
            icon={
              <Accounts
                aria-hidden={true}
                color={tokens.Color.NeutralWhite}
                height={20}
                width={20}
              />
            }
            onSelectAction={e =>
              fadeOut(containerRef.current, 'up', 300).then(() => continueMicrodeposits(e))
            }
            subTitle={__('Use an account and routing number to connect your account.')}
            title={__('Connect with account numbers')}
          />
        </div>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    display: 'block',
    marginBottom: tokens.Spacing.XSmall,
  },
  institutions: {
    marginLeft: '-15px',
    marginRight: '-15px',
  },
  header: {
    borderTop: `1px solid ${tokens.Color.Neutral300}`,
    display: 'block',
    width: '100%',
    marginTop: tokens.Spacing.Small,
    marginBottom: tokens.Spacing.Tiny,
    paddingTop: tokens.Spacing.Large,
  },
  actionTile: {
    marginLeft: `-${tokens.Spacing.Small}px`,
    marginRight: `-${tokens.Spacing.Small}px`,
  },
})

SharedRoutingNumber.propTypes = {
  continueMicrodeposits: PropTypes.func.isRequired,
  institutions: PropTypes.array.isRequired,
  onGoBack: PropTypes.func.isRequired,
  routingNumber: PropTypes.string.isRequired,
  selectInstitution: PropTypes.func.isRequired,
}
