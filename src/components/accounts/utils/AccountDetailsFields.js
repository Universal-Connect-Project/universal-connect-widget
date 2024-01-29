import _isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import numeral from 'numeral'

import {
  AccountIcons,
  AccountTypeMessages,
  AccountTypeNames,
  AccountTypes,
  PropertyIcons,
  PropertyTypeMessages,
  PropertyTypeNames,
  PropertyTypes,
} from '../../../constants/Account'

import { convertToMessages } from '../../../utils/Localization'
import { formatCurrencyFactory, formatPercentFactory, isValidNumber } from '../../../utils/Formatting'
import * as AccountUtils from '../../../utils/Account'
import Validation from '../../../utils/Validation'

export const messages = convertToMessages({
  'Account Balance': 'Account Balance',
  'Account Name': 'Account Name',
  'Account Type': 'Account Type',
  'Credit Limit': 'Credit Limit',
  'Enter Account Balance': 'Enter Account Balance',
  'Enter Account Name': 'Enter Account Name',
  'Enter APR': 'Enter APR',
  'Enter APY': 'Enter APY',
  'Enter Credit Limit': 'Enter Credit Limit',
  'Enter Day Payment is Due': 'Enter Day Payment is Due',
  'Enter Interest Rate': 'Enter Interest Rate',
  'Enter Minimum Payment': 'Enter Minimum Payment',
  'Enter Original Balance': 'Enter Original Balance',
  'Interest Rate': 'Interest Rate',
  'Link Status': 'Link Status',
  'Minimum Payment': 'Minimum Payment',
  'Next Payment': 'Next Payment',
  'Original Balance': 'Original Balance',
  'Payment Due': 'Payment Due',
  'Property Type': 'Property Type',
  'Select A Property Type': 'Select A Property Type',
  'Select An Account Type': 'Select An Account Type',
  APR: 'APR',
  APY: 'APY',
  Business: 'Business',
  WHAT_DAY_OF_MONTH: 'What day of the month do you typically make this payment?',
})

/**
 * @param {Object} field - field from getFormFields
 * @param {Object} value
 * @returns the value formatted for display, field.displayFormatter is applied if available
 */
export function formatFieldValue(field, value) {
  return field.displayFormatter ? field.displayFormatter(value) : value
}

/**
 * @param {Object} field - field from getFormFields
 * @param {Object} value
 * @returns the value parsed for storage, field.parser is applied if available
 */
export function parseFieldValue(field, value) {
  return field.parser ? field.parser(value) : value
}

/**
 * @param {Object[]} fields - fields from getFormFields
 * @returns {Object} the schema for the fields
 */
export function getSchema(fields) {
  return fields.reduce(
    (schema, field) => ({
      ...schema,
      [field.name]: { ...field.validation, label: field.label },
    }),
    {},
  )
}

/**
 * This helps to manage validating either one field or all fields.
 * currentErrors are combined with any new errors and resolved errors
 * are removed.
 *
 * @param {Object[]} fields - fields from getFormFields
 * @param {Object[]} currentErrors - errors from previously running this function
 * @param {Object[]} account - an account record
 * @returns {Object} validation errors where the key maps to field.name
 */
export function getValidationErrors(fields, currentErrors, account, intl) {
  const schema = getSchema(fields)
  const fieldNames = fields.map(field => field.name)

  return Validation.validateFields(schema, fieldNames, account, currentErrors, intl)
}

/**
 * @returns {Object[]} fields for the AccountDetailsForm
 */
export function getFormFields(intl, account, member) {
  const { formatMessage } = intl
  const isManagedByUser = _isEmpty(member) || member.is_managed_by_user
  const displayFormatter = messages => text =>
    messages[text] ? formatMessage(messages[text]) : text
  const accountFormatter = displayFormatter(AccountTypeMessages)
  const propertyFormatter = displayFormatter(PropertyTypeMessages)
  const formatCurrency = formatCurrencyFactory(intl)(account.currency_code)
  const formatPercent = formatPercentFactory(intl)
  const currencyFormatter = value => (isValidNumber(value) ? formatCurrency(value) : value)
  const percentageFormatter = value => (isValidNumber(value) ? formatPercent(value / 100) : value)

  const lastUpdatedTime =
    member.successfully_aggregated_at &&
    moment.unix(member.successfully_aggregated_at).format('MMM D, YYYY')
  const showLinkStatus = !account.isManual && lastUpdatedTime
  const accountTypeOptions = AccountUtils.getSelectOptions(
    AccountTypes,
    AccountTypeNames,
    AccountIcons,
    accountFormatter,
  )
  const selectedAccountTypeOption = AccountUtils.getSelectedOption(
    account['account_type'],
    AccountTypeNames,
    AccountIcons,
    accountFormatter,
  )

  const fields = [
    {
      disabled: false,
      label: formatMessage(messages['Account Name']),
      name: 'user_name',
      placeholder: formatMessage(messages['Enter Account Name']),
      type: 'DisplayInput',
      validation: {
        required: true,
      },
    },
    account.guid && {
      label: formatMessage(messages['Account Type']),
      name: 'account_type',
      options: accountTypeOptions,
      placeholder: formatMessage(messages['Select An Account Type']),
      selectedOption: selectedAccountTypeOption,
      type: 'DisplaySelect',
      validation: {
        required: true,
      },
    },
    {
      displayFormatter: value => !value, // business label is opposite of is_personal
      disabled: false,
      label: formatMessage(messages['Business']),
      name: 'is_personal',
      type: 'ToggleSwitch',
    },
  ].filter(f => f)

  if (AccountUtils.isManual(account)) {
    fields.unshift({
      displayFormatter: currencyFormatter,
      label: formatMessage(messages['Account Balance']),
      name: 'balance',
      pattern: 'number',
      parser: number => number.replace(/,/g, ''),
      placeholder: formatMessage(messages['Enter Account Balance']),
      type: 'DisplayInput',
      validation: {
        pattern: 'number',
        max: 999999999999,
      },
    })
  }

  if (account.account_type === AccountTypes.PROPERTY) {
    const propertyTypeOptions = AccountUtils.getSelectOptions(
      PropertyTypes,
      PropertyTypeNames,
      PropertyIcons,
      propertyFormatter,
    )
    const selectedPropertyTypeOption = AccountUtils.getSelectedOption(
      account['property_type'],
      PropertyTypeNames,
      PropertyIcons,
      propertyFormatter,
    )

    fields.push({
      label: formatMessage(messages['Property Type']),
      name: 'property_type',
      options: propertyTypeOptions,
      selectedOption: selectedPropertyTypeOption,
      placeholder: formatMessage(messages['Select A Property Type']),
      type: 'DisplaySelect',
      validation: {
        required: true,
      },
    })
  }

  if (AccountUtils.usesInterestRateField(account)) {
    const name = AccountUtils.getInterestAttribute(account)
    const label = AccountUtils.getInterestLabel(account)

    fields.push({
      displayFormatter: percentageFormatter,
      // the value for any input should never be null, default to 0 for interest rates
      valueFormatter: val => (val === null ? 0 : val),
      label: formatMessage(messages[label]),
      name,
      placeholder: formatMessage(messages[`Enter ${label}`]),
      type: 'DisplayInput',
      validation: {
        pattern: 'number',
        min: 0,
        max: 100,
      },
    })
  }

  if (AccountUtils.isAccountLiability(account)) {
    fields.push({
      displayFormatter: currencyFormatter,
      label: formatMessage(messages['Minimum Payment']),
      name: 'minimum_payment',
      placeholder: formatMessage(messages['Enter Minimum Payment']),
      type: 'DisplayInput',
      validation: {
        pattern: 'number',
        max: 99999999,
      },
    })

    if (account.payment_due_at) {
      fields.push({
        label: formatMessage(messages['Next Payment']),
        name: 'payment_due_at',
        type: 'DisplayDate',
      })
    } else {
      fields.push({
        header: formatMessage(messages.WHAT_DAY_OF_MONTH),
        label: formatMessage(messages['Payment Due']),
        name: 'day_payment_is_due',
        placeholder: formatMessage(messages['Enter Day Payment is Due']),
        type: 'DayOfMonthSelect',
        validation: {
          required: true,
        },
      })
    }
  }

  if (AccountUtils.usesCreditLimitField(account)) {
    fields.push({
      displayFormatter: currencyFormatter,
      label: formatMessage(messages['Credit Limit']),
      name: 'credit_limit',
      placeholder: formatMessage(messages['Enter Credit Limit']),
      type: 'DisplayInput',
      validation: {
        pattern: 'number',
        max: 99999999,
      },
    })
  }

  if (AccountUtils.usesOriginalBalanceField(account)) {
    fields.push({
      displayFormatter: currencyFormatter,
      label: formatMessage(messages['Original Balance']),
      name: 'original_balance',
      placeholder: formatMessage(messages['Enter Original Balance']),
      type: 'DisplayInput',
      validation: {
        pattern: 'number',
        max: 999999999999,
      },
    })
  }

  if (showLinkStatus) {
    fields.push({
      children: `Last Updated ${lastUpdatedTime}`,
      label: formatMessage(messages['Link Status']),
      style: { cursor: 'default' },
    })
  }

  return fields.map(field => ({
    ...field,
    disabled: field.hasOwnProperty('disabled') ? field.disabled : !isManagedByUser,
  }))
}

export const EDIT_ACCOUNT_FORM_SCHEMA = {
  user_name: {
    label: 'Account name',
    required: true,
  },
  account_type: {
    label: 'Account type',
    required: true,
  },
  balance: {
    label: 'Balance',
    pattern: 'money',
    max: 999999999999,
  },
  property_type: {
    label: 'Property type',
    required: true,
  },
  apy: {
    label: 'APY',
    pattern: 'number',
    min: 0,
    max: 100,
  },
  apr: {
    label: 'APR',
    pattern: 'number',
    min: 0,
    max: 100,
  },
  interest_rate: {
    label: 'Interest rate',
    pattern: 'number',
    min: 0,
    max: 100,
  },
  minimum_payment: {
    label: 'Minimum payment',
    pattern: 'money',
    max: 99999999,
  },
  day_payment_is_due: {
    label: 'Day payment is due',
    required: true,
  },
  credit_limit: {
    label: 'Credit limit',
    pattern: 'money',
    max: 99999999,
  },
  original_balance: {
    label: 'Original balance',
    pattern: 'money',
    max: 999999999999,
  },
}

export function getEditFormFields(account) {
  if (!account.member_is_managed_by_user && !AccountUtils.isManual(account)) return ['user_name']

  const fields = ['user_name']

  if (AccountUtils.isManual(account)) {
    fields.push('balance')
  }

  // We allow accounts that are managed by the user to have their type changed
  // Sometimes it is wrong
  // We won't allow the user to edit the account type for Checking Line of Credit accounts
  if (account.account_type !== AccountTypes.CHECKING_LINE_OF_CREDIT) {
    fields.push('account_type')
  } else {
    // Checking Line of Credit accounts will always need apr and apy
    fields.push('apr')
    fields.push('apy')
  }

  if (account.account_type === AccountTypes.PROPERTY) {
    fields.push('property_type')
  }

  if (AccountUtils.usesInterestRateField(account)) {
    fields.push(AccountUtils.getInterestAttribute(account))
  }

  if (AccountUtils.isAccountLiability(account)) {
    fields.push('minimum_payment')
    fields.push('day_payment_is_due')
  }

  if (AccountUtils.usesCreditLimitField(account)) {
    fields.push('credit_limit')
  }

  if (AccountUtils.usesOriginalBalanceField(account)) {
    fields.push('original_balance')
  }

  return fields
}

/**
 * We store the form values for these fields as string like:
 *
 * "12,000"
 * "1.2389"
 *
 * but the backend expects numbers, so we convert them here with numeral.
 */
export function formatAccountFieldsForSaving(account) {
  return {
    ...account,
    balance: numeral(account.balance).value(),
    credit_limit: numeral(account.credit_limit).value(),
    interest_rate: numeral(account.interest_rate).value(),
    minimum_payment: numeral(account.minimum_payment).value(),
    original_balance: numeral(account.original_balance).value(),
  }
}
