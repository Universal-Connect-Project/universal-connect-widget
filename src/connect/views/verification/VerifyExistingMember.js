import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'
import { UtilityRow } from '@kyper/utilityrow'
import { InstitutionLogo } from '@kyper/institutionlogo'
// import { InstitutionLogo } from '../../components/InstitutionLogo'

import { __, _n } from '../../../utils/Intl'
import FireflyAPI from '../../../utils/FireflyAPI'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { Container } from '../../components/Container'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { verifyExistingConnection } from '../../../redux/actions/Connect'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'

const VerifyExistingMember = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_VERIFY_EXISTING_MEMBER)
  const dispatch = useDispatch()
  const { members, onAddNew, sendAnalyticsEvent } = props
  const category = EventCategories.CONNECT
  const label = EventLabels.VERIFICATION
  const iavMembers = members.filter(member => member.verification_is_enabled)

  const tokens = useTokens()

  const styles = getStyles(tokens)

  return (
    <Container column={true} flex={true}>
      <Text as="H3" style={styles.headerText}>
        {__('Select your institution')}
      </Text>
      <Text as="Paragraph" style={styles.primaryParagraph}>
        {__("Choose from institutions you've already connected or search for a new one.")}
      </Text>
      <Text as="ParagraphSmall" style={styles.secondaryParagraph}>
        {_n('%1 Connected institution', '%1 Connected institutions', iavMembers.length)}
      </Text>
      {iavMembers.map(member => {
        return (
          <UtilityRow
            borderType="none"
            key={member.guid}
            leftChildren={
              <InstitutionLogo aria-hidden={true} institutionGuid={member.institution_guid} />
            }
            onClick={() => {
              sendAnalyticsEvent({
                category,
                label,
                action: `${label} - ${EventActions.INSTITUTION_SELECTED}`,
              })

              FireflyAPI.loadInstitutionByGuid(member.institution_guid).then(institution => {
                dispatch(verifyExistingConnection(member, institution))
              })
            }}
            subTitle={member.institution_url}
            title={member.name}
          />
        )
      })}
      <Button
        onClick={() => {
          sendAnalyticsEvent({
            category,
            label,
            action: `${label} - ${EventActions.VERIFY_NEW}`,
          })
          onAddNew()
        }}
        style={styles.buttonSpacing}
        variant="neutral"
      >
        {__('Search more institutions')}
      </Button>
      <PrivateAndSecure />
    </Container>
  )
}

const getStyles = tokens => {
  return {
    headerText: {
      marginBottom: tokens.Spacing.Tiny,
    },
    primaryParagraph: {
      marginBottom: tokens.Spacing.Large,
    },
    secondaryParagraph: {
      marginBottom: tokens.Spacing.XSmall,
      fontWeight: tokens.FontWeight.Semibold,
    },
    buttonSpacing: {
      marginTop: tokens.Spacing.Medium,
    },
  }
}

VerifyExistingMember.propTypes = {
  members: PropTypes.array.isRequired,
  onAddNew: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
}

export default VerifyExistingMember
