import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon } from 'mx-react-components'

import { combineDispatchers, filterDispatcher } from '../utils/ActionHelpers'

import Modal from './shared/Modal'
import TermsModal from './settings/profile/TermsModal'

import { dispatcher as agreementDispatcher } from '../redux/actions/Agreement'
import { dispatcher as userDispatcher } from '../redux/actions/User'

export class TermsAndConditions extends React.Component {
  static propTypes = {
    acceptTerms: PropTypes.func,
    hasAcceptedTerms: PropTypes.bool,
    hasUpdatedTermsAndConditions: PropTypes.bool,
    institutionDisplayName: PropTypes.string,
    isMobile: PropTypes.bool,
    loadAgreement: PropTypes.func,
    showTerms: PropTypes.bool,
    theme: PropTypes.object,
  }

  state = {
    showTermsModal: false,
  }

  componentDidMount() {
    this.props.loadAgreement()
  }

  render() {
    const styles = this.styles()

    return !this.props.showTerms ||
      (this.props.hasAcceptedTerms && !this.props.hasUpdatedTermsAndConditions) ? null : (
      <div>
        {this.state.showTermsModal ? (
          <TermsModal onRequestClose={() => this.setState({ showTermsModal: false })} />
        ) : (
          <Modal isRelative={false} showCloseIcon={false}>
            <div style={styles.modal}>
              <div style={styles.header}>
                <div style={styles.topHeading}>Welcome to</div>
                <div style={styles.bottomHeading}>{this.props.institutionDisplayName}</div>
              </div>
              <div style={styles.contentContainer}>
                <div style={styles.iconContainer}>
                  <Icon size={50} style={styles.icon} type="accounts" />
                  <p style={styles.paragraph}>
                    See all your accounts, including those with other financial institutions, in one
                    place.
                  </p>
                </div>
                <div style={styles.iconContainer}>
                  <Icon size={50} style={styles.icon} type="spending" />
                  <p style={styles.paragraph}>
                    Every transaction is automatically categorized so you can spend smarter.
                  </p>
                </div>
                <div style={styles.iconContainer}>
                  <Icon size={50} style={styles.icon} type="bubbles" />
                  <p style={styles.paragraph}>
                    Keep your finances on track with a budgeting tool that makes sense and is easy
                    to use.
                  </p>
                </div>
              </div>
              <Button onClick={this.props.acceptTerms} style={styles.acceptButton} type="primary">
                Get Started
              </Button>
              <div style={styles.disclaimerText}>
                By clicking "Get Started", you agree to our&nbsp;
                <button
                  data-test="disclaimer-link"
                  onClick={() => this.setState({ showTermsModal: true })}
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

  styles = () => {
    const { isMobile, theme } = this.props

    return {
      modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: isMobile ? '100%' : '600px',
        padding: theme.Spacing.XLARGE,
        boxSizing: 'border-box',
        textAlign: isMobile ? 'left' : 'center',
      },
      contentContainer: {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        marginTop: theme.Spacing.XLARGE,
        marginBottom: theme.Spacing.XLARGE,
        width: '100%',
      },
      iconContainer: {
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        alignItems: 'center',
        width: isMobile ? '100%' : '28%',
        marginRight: isMobile ? null : theme.Spacing.MEDIUM,
        marginBottom: isMobile ? theme.Spacing.MEDIUM : null,
      },
      icon: {
        fill: theme.Colors.CHARCOAL,
      },
      paragraph: {
        textAlign: isMobile ? 'left' : 'center',
        fontSize: theme.FontSizes.MEDIUM,
        width: isMobile ? '70%' : '100%',
        marginLeft: isMobile ? theme.Spacing.MEDIUM : null,
        color: theme.Colors.CHARCOAL,
      },
      header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.Colors.CHARCOAL,
      },
      topHeading: {
        fontSize: theme.FontSizes.MEDIUM,
        marginBottom: theme.Spacing.XSMALL,
      },
      bottomHeading: {
        fontSize: theme.FontSizes.JUMBO,
      },
      disclaimerText: {
        marginTop: theme.Spacing.MEDIUM,
        fontFamily: theme.Fonts.ITALIC,
        fontSize: theme.FontSizes.MEDIUM,
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
}

const mapDispatchToProps = combineDispatchers(
  agreementDispatcher,
  filterDispatcher(userDispatcher, 'acceptTerms'),
)

const mapStateToProps = state => {
  return {
    isMobile: state.browser.isMobile,
    theme: state.theme,
    hasAcceptedTerms: state.user.details.has_accepted_terms,
    hasUpdatedTermsAndConditions: state.user.details.has_updated_terms_and_conditions,
    showTerms: state.widgetProfile.display_terms_and_conditions,
    institutionDisplayName: state.widgetProfile.widgets_display_name || 'MoneyManager',
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions)
