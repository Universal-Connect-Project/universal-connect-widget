import React, { useEffect, useRef, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { css } from '@mxenabled/cssinjs'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { Lock } from '@kyper/icon/Lock'

import { AGG_MODE, TAX_MODE, VERIFY_MODE } from '../../const/Connect'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { __, _p } from '../../../utils/Intl'
import { fadeOut } from '../../utilities/Animation'

import { SlideDown } from '../../components/SlideDown'
import { getDelay } from '../../utilities/getDelay'
import { Container } from '../../components/Container'
import { ConnectInstitutionHeader } from '../../components/ConnectInstitutionHeader'

import { PrivacyPolicy } from './PrivacyPolicy'
import PoweredByMXText from './PoweredByMXText'
import { scrollToTop } from '../../utilities/ScrollToTop'

export const Disclosure = props => {
  const { mode, onContinue, size } = props
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_DISCLOSURE)
  const isSmall = size === 'small'
  const tokens = useTokens()
  const styles = getStyles(tokens, isSmall)
  const getNextDelay = getDelay()
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const dispatch = useDispatch()

  const IS_IN_AGG_MODE = mode === AGG_MODE
  const IS_IN_TAX_MODE = mode === TAX_MODE
  const IS_IN_VERIFY_MODE = mode === VERIFY_MODE

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

  return (
    <Container
      // neustar looks for this id for automated tests
      // DO NOT change without first also changing neustar
      id="mx-connect-disclosure"
      ref={containerRef}
    >
      {showPrivacyPolicy ? (
        <SlideDown delay={getNextDelay()}>
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
        </SlideDown>
      ) : (
        <Fragment>
          <SlideDown delay={getNextDelay()}>
            <ConnectInstitutionHeader />
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.flexGroup}>
              <Text as="H2" style={styles.title}>
                {_p('connect/disclosure/title', 'Connect your account')}
              </Text>

              <Text as="Paragraph">
                {_p(
                  'connect/disclosure/body',
                  'This app will have access to the information below unless you choose to disconnect:',
                )}
              </Text>

              <ul style={styles.dataList}>
                {IS_IN_AGG_MODE && (
                  <Fragment>
                    <li className={css(styles.listItem)}>
                      <Text as="Paragraph">{__('Account details')}</Text>
                    </li>
                    <li className={css(styles.listItem)}>
                      <Text as="Paragraph">{__('Account balances and transactions')}</Text>
                    </li>
                  </Fragment>
                )}

                {IS_IN_TAX_MODE && (
                  <Fragment>
                    <li className={css(styles.listItem)}>
                      <Text as="Paragraph">{__('Basic account information')}</Text>
                    </li>
                    <li className={css(styles.listItem)}>
                      <Text as="Paragraph">{__('Tax documents')}</Text>
                    </li>
                  </Fragment>
                )}

                {IS_IN_VERIFY_MODE && (
                  <Fragment>
                    <li className={css(styles.listItem)}>
                      <Text as="Paragraph">{__('Routing and account numbers')}</Text>
                    </li>
                    <li className={css(styles.listItem)}>
                      <Text as="Paragraph">{__('Account balances')}</Text>
                    </li>
                  </Fragment>
                )}
              </ul>

              <div style={styles.lockGroup}>
                <Lock color={tokens.TextColor.Default} size={16} style={styles.lockIcon} />
                <Text as="Paragraph" tag="p">
                  {__('Your information is protected with bank-level security.')}
                </Text>
              </div>
              <Text as="XSmall" style={styles.disclaimer}>
                {_p('connect/disclosure/policy/text', 'By clicking Continue, you agree to the ')}
                <Button
                  onClick={() => {
                    dispatch(
                      sendAnalyticsEvent({
                        category: EventCategories.CONNECT,
                        label: EventLabels.DISCLOSURE,
                        action: `${EventLabels.DISCLOSURE} - ${EventActions.PRIVACY_POLICY} - ${EventActions.START}`,
                      }),
                    )
                    scrollToTop(containerRef)
                    setShowPrivacyPolicy(true)
                  }}
                  style={styles.link}
                  variant="link"
                >
                  {_p('connect/disclosure/policy/link', 'MX Privacy Policy.')}
                </Button>
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.flexGroup}>
              <Button
                data-test="disclosure-continue"
                onClick={() => {
                  const label = EventLabels.DISCLOSURE

                  dispatch(
                    sendAnalyticsEvent({
                      category: EventCategories.CONNECT,
                      label,
                      action: `${label} - ${EventActions.END}`,
                    }),
                  )

                  fadeOut(containerRef.current, 'up', 300).then(() => onContinue())
                }}
                variant="primary"
              >
                {_p('connect/disclosure/button', 'Continue')}
              </Button>
              <div style={styles.poweredBy}>
                <PoweredByMXText />
              </div>
            </div>
          </SlideDown>
        </Fragment>
      )}
    </Container>
  )
}

const getStyles = tokens => {
  return {
    svg: {
      margin: `${tokens.Spacing.Large}px auto 0`,
      width: 240,
    },
    flexGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      margin: `${tokens.Spacing.XLarge}px auto ${tokens.Spacing.Medium}px auto`,
      textAlign: 'center',
    },
    dataList: {
      listStylePosition: 'outside',
      marginTop: tokens.Spacing.XSmall,
      marginBottom: tokens.Spacing.Small,
      marginLeft: tokens.Spacing.XSmall,
    },
    listItem: {
      color: tokens.TextColor.Default,
      marginLeft: tokens.Spacing.Medium,
      '& span': {
        marginLeft: tokens.Spacing.XTiny,
      },
    },
    lockGroup: {
      display: 'flex',
    },
    lockIcon: {
      display: 'block',
      marginRight: tokens.Spacing.XSmall,
      marginTop: tokens.Spacing.Tiny,
      marginLeft: tokens.Spacing.Tiny,
    },
    disclaimer: {
      textAlign: 'center',
      marginTop: tokens.Spacing.XLarge,
      marginBottom: tokens.Spacing.Medium,
      lineHeight: tokens.LineHeight.Small,
      color: tokens.TextColor.Secondary,
    },
    link: {
      fontSize: tokens.FontSize.XSmall,
      display: 'inline',
    },
    poweredBy: {
      marginTop: tokens.Spacing.Medium,
    },
  }
}

Disclosure.propTypes = {
  mode: PropTypes.string.isRequired,
  onContinue: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
}

export default Disclosure
