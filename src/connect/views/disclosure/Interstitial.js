import React, { useEffect, Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { __, _p } from '../../../utils/Intl'

import { SlideDown } from '../../components/SlideDown'
import { GoBackButton } from '../../components/GoBackButton'
import { getDelay } from '../../utilities/getDelay'
import { DisclosureInstitutionHeader } from '../../components/DisclosureInstitutionHeader'

import { Link } from '@kyper/icon/Link'
import { Lock } from '@kyper/icon/Lock'
import { InfoOutline } from '@kyper/icon/InfoOutline'
import { ChevronRight } from '@kyper/icon/ChevronRight'

import { PrivacyPolicy } from './PrivacyPolicy'

export const DisclosureInterstitial = props => {
  const { handleGoBack, scrollToTop } = props

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  useAnalyticsPath(...PageviewInfo.CONNECT_DISCLOSURE)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()
  const dispatch = useDispatch()
  const institution = useSelector(state => state.connect.selectedInstitution)

  useEffect(() => {
    const label = EventLabels.DISCLOSURE

    dispatch(
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label,
        action: `${label} - ${EventActions.START}`,
      }),
    )
  }, [])

  if (showPrivacyPolicy) {
    return (
      <PrivacyPolicy
        handleGoBack={() => {
          const label = EventLabels.DISCLOSURE

          dispatch(
            sendAnalyticsEvent({
              category: EventCategories.CONNECT,
              label,
              action: `${label} - ${EventActions.PRIVACY_POLICY}`,
            }),
          )

          dispatch(
            sendAnalyticsEvent({
              category: EventCategories.CONNECT,
              label,
              action: `${label} - ${EventActions.PRIVACY_POLICY} - ${EventActions.END}`,
            }),
          )
          setShowPrivacyPolicy(false)
        }}
      />
    )
  }

  return (
    <Fragment>
      <GoBackButton handleGoBack={handleGoBack} />
      <SlideDown delay={getNextDelay()}>
        <DisclosureInstitutionHeader />
      </SlideDown>
      <SlideDown delay={getNextDelay()}>
        <div style={styles.flexGroup}>
          <Text as="H2" style={styles.title} tag="h2">
            {institution.name
              ? __('Your app trusts MX to connect your %1 account', institution.name)
              : __('Your app trusts MX to connect your account')}
          </Text>
        </div>
        <div style={styles.iconGroup}>
          <Link color={tokens.TextColor.Default} size={20} style={styles.icon} />
          <Text as="Body" style={styles.subTitle}>
            {__('Connect in seconds')}
          </Text>
        </div>
        <Text as={'Paragraph'} style={styles.paragraph} tag="p">
          {__(
            'MX helps you connect your financial accounts to apps and services. MX will allow your app to access only the data requested.',
          )}
        </Text>

        <div style={styles.iconGroup}>
          <Lock color={tokens.TextColor.Default} size={20} style={styles.icon} />
          <Text as="Body" style={styles.subTitle}>
            {__('Private and secure')}
          </Text>
        </div>
        <Text as={'Paragraph'} style={styles.paragraph} tag="p">
          {__(
            'Your data is encrypted and shared only with your permission. MX doesn’t sell your info, and you can stop sharing at any time.',
          )}
        </Text>

        <div style={styles.iconGroup}>
          <InfoOutline color={tokens.TextColor.Default} size={20} style={styles.icon} />
          <Text as="Body" style={styles.subTitle}>
            {__('Learn more')}
          </Text>
        </div>
      </SlideDown>
      <Button
        onClick={() => {
          dispatch(
            sendAnalyticsEvent({
              category: EventCategories.CONNECT,
              label: EventLabels.DISCLOSURE,
              action: `${EventLabels.DISCLOSURE} - ${EventActions.PRIVACY_POLICY} - ${EventActions.START}`,
            }),
          )
          scrollToTop()
          setShowPrivacyPolicy(true)
        }}
        style={styles.link}
        variant="link"
      >
        {_p('connect/disclosure/policy/link', 'MX Privacy Policy')}

        <ChevronRight style={styles.chevron} />
      </Button>
    </Fragment>
  )
}

const getStyles = tokens => {
  return {
    flexGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      marginTop: tokens.Spacing.Large,
      marginBottom: tokens.Spacing.Large,
      textAlign: 'center',
      fontWeight: tokens.FontWeight.Bold,
    },
    iconGroup: {
      display: 'flex',
    },
    icon: {
      display: 'block',
      left: '0%',
      right: ' 0%',
      top: '0%',
      bottom: '-0.01%',
    },
    subTitle: {
      fontStyle: 'normal',
      fontWeight: tokens.FontWeight.Semibold,
      fontSize: tokens.FontSize.Body,
      marginLeft: tokens.Spacing.Small,
      marginBottom: tokens.Spacing.Tiny,
    },
    paragraph: {
      fontWeight: tokens.FontWeight.Regular,
      fontSize: tokens.FontSize.Small,
      flexDirection: 'column',
      marginLeft: `36px`,
      marginBottom: tokens.Spacing.Medium,
    },
    link: {
      fontWeight: tokens.FontWeight.Semibold,
      fontSize: tokens.FontSize.Small,
      marginLeft: '32px',
      marginTop: tokens.Spacing.Medium,
    },
    chevron: { marginLeft: '13.02px' },
  }
}

DisclosureInterstitial.propTypes = {
  handleGoBack: PropTypes.func.isRequired,
  scrollToTop: PropTypes.func.isRequired,
}

export default DisclosureInterstitial
