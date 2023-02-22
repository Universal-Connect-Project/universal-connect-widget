import { convertToMessages } from '../utils/Localization'

import PropTypes from 'prop-types'
const SIZES = {
  SMALL: 320, //pixels
  MEDIUM: 450, //pixels
  LARGE: 750, //pixels
  XLARGE: 850, //pixels
}

export const TRANSACTION_TABLE = {
  COLUMNS: ['icon', 'date', 'payee', 'category', 'account', 'amount'],
  COLUMN_MAP: {
    payee_and_category: 'payee',
  },
  END_OF_LIST_MSG_HEIGHT: 73, // pixels
  HEADER_HEIGHT: 32, // pixels
  ROW_HEIGHT: 46, // pixels
  ROW_HEIGHT_MOBILE: 60, // pixels
  SECTION_HEADER_HEIGHT: 25, // pixels
  SIZES,
  WIDTH_MAP: {
    [SIZES.XLARGE]: {
      date: '8%',
      payee: '32%',
      category: '28%',
      account: '27%',
      amount: '10%',
    },
    [SIZES.LARGE]: {
      date: '8%',
      payee_and_category: '38%',
      account: '27%',
      amount: '27%',
    },
    [SIZES.MEDIUM]: {
      date: '15%',
      payee_and_category: '55%',
      amount: '30%',
    },
    [SIZES.SMALL]: {
      payee_and_category: '60%',
      amount: '40%',
    },
  },
}

export const TransactionsMessages = convertToMessages({
  ZERO_STATE_TRANSACTIONS_MESSAGE:
    'Connect all your accounts to see transactions info in one place.',
  ZERO_STATE_TRANSACTIONS_TITLE: 'Simplify your life.',
  ZERO_STATE_TRANSACTIONS_BUTTON: 'Add Account',
})

export const TagShape = PropTypes.shape({
  guid: PropTypes.string,
  name: PropTypes.string.isRequired,
})

export const TaggingShape = PropTypes.shape({
  guid: PropTypes.string,
  tag_guid: PropTypes.string,
  transaction_guid: PropTypes.string,
})

export const TransactionShape = PropTypes.shape({
  guid: PropTypes.string,
  category_guid: PropTypes.string,
})

export const TransactionTypes = {
  CREDIT: 1,
  DEBIT: 2,
}

export const TransactionStatuses = {
  PENDING: 2,
  POSTED: 1,
}
