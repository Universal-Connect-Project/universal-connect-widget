import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'
import { clearPendingRule, createRule, saveRule } from '../../../redux/actions/TransactionRules'

import TwoActionModal from '../../shared/modals/TwoActionModal'
import withAnalyticsPath from '../../shared/AnalyticsPath'

import { EventCategories, EventLabels, EventActions } from '../../../constants/analytics/Transactions'
import { PageviewInfo } from '../../../constants/Analytics'

import { getRules } from '../../../redux/selectors/TransactionRules'

import { __ } from '../../../utils/Intl'

export class TransactionRecategorizeModal extends React.Component {
  static propTypes = {
    clearPendingRule: PropTypes.func.isRequired,
    createTransactionRule: PropTypes.func.isRequired,
    isSmall: PropTypes.bool.isRequired,
    pending: PropTypes.object.isRequired,
    saveTransactionRule: PropTypes.func.isRequired,
    sendAnalyticsEvent: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    transactionRules: PropTypes.array,
  }

  render() {
    const { category, originalTransaction, updatedTransaction } = this.props.pending
    const styles = this.styles()

    return (
      <TwoActionModal
        componentStyles={styles.content}
        onClose={() => {
          this.props.sendAnalyticsEvent({
            category: EventCategories.TRANSACTIONS,
            label: EventLabels.CHANGE_CATEGORY_RULE,
            action: `${EventLabels.CHANGE_CATEGORY_RULE} - ${EventActions.ONE_TIME}`,
          })
          this.props.clearPendingRule()
        }}
        primaryAction={() => {
          this.props.sendAnalyticsEvent({
            category: EventCategories.TRANSACTIONS,
            label: EventLabels.CHANGE_CATEGORY_RULE,
            action: `${EventLabels.CHANGE_CATEGORY_RULE} - ${EventActions.ALL_TRANSACTIONS}`,
          })

          const existingRule = this.props.transactionRules.find(
            rule => rule.guid === updatedTransaction.user_transaction_rule_guid,
          )

          if (existingRule) {
            this.props.saveTransactionRule({
              ...existingRule,
              category_guid: category.guid,
              description: updatedTransaction.payee,
            })
          } else {
            this.props.createTransactionRule(
              updatedTransaction.payee,
              originalTransaction.payee,
              category.guid,
            )
          }

          this.props.clearPendingRule()
        }}
        primaryText="Yes, Always Do This."
        role="dialog"
        secondaryAction={() => {
          this.props.sendAnalyticsEvent({
            category: EventCategories.TRANSACTIONS,
            label: EventLabels.CHANGE_CATEGORY_RULE,
            action: `${EventLabels.CHANGE_CATEGORY_RULE} - ${EventActions.ONE_TIME}`,
          })
          this.props.clearPendingRule()
        }}
        secondaryText="This Time Only"
      >
        <h2 style={styles.contentHeader}>
          {`Do you want all past and future ${originalTransaction.payee} transactions to be described as "${updatedTransaction.payee}" and categorized as`}
          <p data-test="mx-custom-category-test" style={styles.newCategoryText}>
            "{__(category.name)}"?
          </p>
        </h2>
      </TwoActionModal>
    )
  }

  styles = () => {
    const { isSmall, theme } = this.props

    return {
      content: {
        maxWidth: isSmall ? 300 : 390,
        color: theme.Colors.GRAY_700,
        fontFamily: theme.Fonts.REGULAR,
      },
      contentHeader: {
        boxSizing: 'border-box',
        textAlign: 'center',
        width: '100%',
      },
      newCategoryText: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
      buttonWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        flexDirection: isSmall ? 'column' : 'row',
      },
      button: {
        minWidth: 120,
      },
      rightButton: {
        marginTop: isSmall ? theme.Spacing.MEDIUM : 0,
        marginLeft: isSmall ? 0 : theme.Spacing.MEDIUM,
      },
    }
  }
}

const mapDispatchToProps = dispatch => ({
  clearPendingRule: () => dispatch(clearPendingRule()),
  createTransactionRule: (updatedDescription, originalDescription, categoryGuid) =>
    dispatch(createRule(updatedDescription, originalDescription, categoryGuid)),
  saveTransactionRule: rule => dispatch(saveRule(rule)),
  sendAnalyticsEvent: payload => dispatch(sendAnalyticsEvent(payload)),
})

const mapStateToProps = state => ({
  isSmall: state.browser.size === 'small',
  theme: state.theme,
  transactionRules: getRules(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withAnalyticsPath(TransactionRecategorizeModal, ...PageviewInfo.TRANSACTION_RECATEGORIZE))
