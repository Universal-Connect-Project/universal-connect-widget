import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'

import Modal from 'components/shared/Modal'
import TermsModal from 'src/connect/components/TermsModal'
import { ActionTypes as AgreementActionTypes } from 'reduxify/actions/Agreement'
import { acceptTerms } from 'reduxify/actions/User'

export const TermsAndConditions = () => {
  const tokens = useTokens()
  const isMobile = useSelector(state => state.browser.isMobile)
  const showTerms = useSelector(state => state.widgetProfile.display_terms_and_conditions)
  const hasAcceptedTerms = useSelector(state => state.user.details.has_accepted_terms)
  const hasUpdatedTermsAndConditions = useSelector(
    state => state.user.details.has_updated_terms_and_conditions,
  )
  const institutionDisplayName = useSelector(
    state => state.widgetProfile.widgets_display_name || 'MoneyManager',
  )
  const styles = getStyles(tokens, isMobile)
  const dispatch = useDispatch()
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    dispatch({ type: AgreementActionTypes.AGREEMENT_LOADING })
  }, [])

  return !showTerms || (hasAcceptedTerms && !hasUpdatedTermsAndConditions) ? null : (
    <div>
      {showTermsModal ? (
        <TermsModal onRequestClose={() => setShowTermsModal(false)} />
      ) : (
        <Modal isRelative={false} showCloseIcon={false}>
          <div style={styles.modal}>
            <div style={styles.header}>
              <div style={styles.topHeading}>Welcome to</div>
              <div style={styles.bottomHeading}>{institutionDisplayName}</div>
            </div>
            <div style={styles.contentContainer}>
              <div style={styles.iconContainer}>
                {/* <Icon size={50} style={styles.icon} type="accounts" /> */}
                <p style={styles.paragraph}>
                  See all your accounts, including those with other financial institutions, in one
                  place.
                </p>
              </div>
              <div style={styles.iconContainer}>
                {/* <Icon size={50} style={styles.icon} type="spending" /> */}
                <p style={styles.paragraph}>
                  Every transaction is automatically categorized so you can spend smarter.
                </p>
              </div>
              <div style={styles.iconContainer}>
                {/* <Icon size={50} style={styles.icon} type="bubbles" /> */}
                <p style={styles.paragraph}>
                  Keep your finances on track with a budgeting tool that makes sense and is easy to
                  use.
                </p>
              </div>
            </div>
            <Button
              onClick={() => dispatch(acceptTerms())}
              style={styles.acceptButton}
              type="primary"
            >
              Get Started
            </Button>
            <div style={styles.disclaimerText}>
              By clicking "Get Started", you agree to our&nbsp;
              <button
                data-test="disclaimer-link"
                onClick={() => setShowTermsModal(true)}
                style={{ ...styles.disclaimerText, ...styles.termsAndConditionsLink }}
              >
                Terms and Conditions
              </button>
              .
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

const getStyles = (tokens, isMobile) => {
  return {
    modal: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: isMobile ? '100%' : '600px',
      padding: tokens.Spacing.XLarge,
      boxSizing: 'border-box',
      textAlign: isMobile ? 'left' : 'center',
    },
    contentContainer: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      marginTop: tokens.Spacing.XLarge,
      marginBottom: tokens.Spacing.XLarge,
      width: '100%',
    },
    iconContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      alignItems: 'center',
      width: isMobile ? '100%' : '28%',
      marginRight: isMobile ? null : tokens.Spacing.Medium,
      marginBottom: isMobile ? tokens.Spacing.Medium : null,
    },
    icon: {
      fill: tokens.TextColor.Default,
    },
    paragraph: {
      textAlign: isMobile ? 'left' : 'center',
      fontSize: tokens.FontSize.Small,
      width: isMobile ? '70%' : '100%',
      marginLeft: isMobile ? tokens.Spacing.Medium : null,
      color: tokens.TextColor.Default,
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: tokens.TextColor.Default,
    },
    topHeading: {
      fontSize: tokens.FontSize.Small,
      marginBottom: tokens.Spacing.Tiny,
    },
    bottomHeading: {
      fontSize: tokens.FontSize.H1,
    },
    disclaimerText: {
      marginTop: tokens.Spacing.Medium,
      fontFamily: tokens.Font.Regular,
      fontSize: tokens.FontSize.Small,
      fontStyle: 'italic',
    },
    termsAndConditionsLink: {
      textDecoration: 'underline',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      margin: 0,
      padding: 0,
    },
    acceptButton: {
      width: isMobile ? '100%' : null,
    },
  }
}
