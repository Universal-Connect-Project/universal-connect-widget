import _without from 'lodash/without'
import _includes from 'lodash/includes'
import _isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import { ActionTypes } from '../actions/Transactions'
import { ActionTypes as NetWorthActionTypes } from '../actions/NetWorth'
import { TransactionTypes } from '../../constants/Transaction'
import { createReducer, updateObject } from '../../utils/Reducer'
import Validation from '../../utils/Validation'

const {
  DEFAULT_MANUAL_TRANSACTION_SELECTED,
  EDIT_TRANSACTION,
  EDIT_TRANSACTION_CATEGORY,
  FAYE_TRANSACTIONS_UPDATED,
  MANUAL_TRANSACTION_CREATED,
  RESET_TRANSACTION,
  SET_TRANSACTION_ATTRIBUTES,
  TRANSACTION_DELETED,
  TRANSACTIONS_LOADED,
  TRANSACTION_SPLIT_CREATED,
  TRANSACTION_SPLIT_DELETED,
  TRANSACTIONS_LOADING,
  TRANSACTION_SPLIT_SELECTED,
  TRANSACTION_UPDATED,
  TRANSACTION_BATCH_UPDATED,
  UPDATE_TRANSACTIONS_SEARCH,
  UPDATE_TRANSACTIONS_SORT,
} = ActionTypes
const { NET_WORTH_DATA_LOADED } = NetWorthActionTypes

const schema = {
  account_guid: {
    label: 'Account',
    required: true,
  },
  amount: {
    label: 'Amount',
    required: true,
    pattern: 'number',
    min: 0.01,
    max: 99999999,
  },
  category_guid: {
    label: 'Category',
    required: true,
  },
  date: val => {
    const message = 'Invalid Date'

    return moment.unix(val).isValid() ? null : message
  },
  memo: {
    label: 'Memo',
    required: false,
  },
  description: {
    label: 'Payee',
    required: true,
  },
}

export const defaultState = {
  details: {},
  editingCategory: null,
  errors: {},
  selectedSplits: [],
  items: [],
  loading: true,
  schema,
  searchTerm: '',
  sortColumn: 'date',
  sortDirection: 'desc',
  valid: true,
}

const deleteBy = (stateKey = 'guid', actionKey = 'guid') => (state, action) =>
  updateObject(state, {
    details: {},
    items: state.items.filter(item => item[stateKey] !== action.payload[actionKey]),
  })

const select = (state, action) =>
  updateObject(state, {
    details: action.payload,
  })

const load = (state, action) =>
  updateObject(state, {
    loading: false,
    items: action.payload.items,
    selectedSplits: [], // clear out splits on new load
  })

const loadNetWorthData = state =>
  load(state, {
    payload: { items: [] },
  })

const loading = state =>
  updateObject(state, {
    loading: true,
  })

const manualTransactionCreated = (state, action) => {
  return updateObject(state, { items: [...state.items, action.payload.item] })
}

const updateBatch = (state, action) => {
  const items = state.items.map(item =>
    action.payload[item.guid] ? action.payload[item.guid] : item,
  )

  return { ...state, items }
}

const update = (state, action) => {
  const updatedItem = action.payload.item

  const items = state.items.map(item => {
    if (item.guid === updatedItem.guid) {
      return updateObject(item, updatedItem)
    }

    if (item.childTransactions && item.childTransactions.length) {
      const newChildren = item.childTransactions.map(child => {
        if (child.guid === updatedItem.guid) {
          return updateObject(child, updatedItem)
        }

        return child
      })

      return updateObject(item, { childTransactions: newChildren })
    }

    return item
  })

  return updateObject(state, { items })
}

/**
 * A split was created so update the item and add the new children to the list
 * of transactions
 */
const splitCreated = (state, { payload }) => {
  const updatedTransaction = payload.parent
  const newChildren = payload.children

  const items = state.items
    .map(item => {
      if (item.guid === updatedTransaction.guid) {
        return updateObject(item, updatedTransaction)
      }

      return item
    })
    .concat(newChildren)

  return updateObject(state, { items })
}

/**
 * Remove the given splits from the list of transactions
 */
const splitDeleted = (state, { payload }) => {
  const items = state.items.reduce((acc, transaction) => {
    if (transaction.parent_guid === payload) {
      return acc
    } else if (transaction.guid === payload) {
      return [...acc, { ...transaction, has_been_split: false }]
    } else {
      return [...acc, transaction]
    }
  }, [])

  return { ...state, items }
}

const setAttributes = (state, action) => {
  const { attributes } = action.payload
  const errors = Object.assign({}, state.errors)
  const attributeErrors = Validation.validate(state.schema, attributes) || {}
  const attributeKeys = Object.keys(attributes)

  attributeKeys.forEach(key => {
    if (attributeErrors[key]) {
      errors[key] = attributeErrors[key]
    } else {
      delete errors[key]
    }
  })

  return updateObject(state, {
    details: updateObject(state.details, action.payload.attributes),
    errors,
  })
}

const sort = (state, action) =>
  updateObject(state, {
    sortColumn: action.payload.sortColumn,
    sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
  })

const search = (state, action) =>
  updateObject(state, {
    searchTerm: action.payload.searchTerm,
  })

const reset = state => updateObject(state, { errors: {} })

/**
 * Add the given payload (which is a guid), to the expandedSplits state.
 * Remove it if it already exists
 */
const selectTransactionSplit = (state, { payload }) => {
  if (_includes(state.selectedSplits, payload)) {
    return updateObject(state, {
      selectedSplits: _without(state.selectedSplits, payload),
    })
  }

  return updateObject(state, {
    selectedSplits: state.selectedSplits.concat(payload),
  })
}

const editTransactionCategory = (state, { payload }) => {
  return updateObject(state, {
    editingCategory: _isEmpty(payload) ? null : payload,
  })
}

const defaultManualTransactionSelected = state =>
  updateObject(state, {
    details: {
      account_guid: null,
      amount: 0,
      category_guid: null,
      date: moment()
        .startOf('day')
        .unix(),
      is_manual: true,
      transaction_type: TransactionTypes.DEBIT,
      description: null,
    },
  })

export const transactions = createReducer(defaultState, {
  [MANUAL_TRANSACTION_CREATED]: manualTransactionCreated,
  [DEFAULT_MANUAL_TRANSACTION_SELECTED]: defaultManualTransactionSelected,
  [EDIT_TRANSACTION]: select,
  [EDIT_TRANSACTION_CATEGORY]: editTransactionCategory,
  [NET_WORTH_DATA_LOADED]: loadNetWorthData,
  [RESET_TRANSACTION]: reset,
  [SET_TRANSACTION_ATTRIBUTES]: setAttributes,
  [TRANSACTION_DELETED]: deleteBy(),
  [TRANSACTIONS_LOADED]: load,
  [TRANSACTIONS_LOADING]: loading,
  [TRANSACTION_SPLIT_CREATED]: splitCreated,
  [TRANSACTION_SPLIT_DELETED]: splitDeleted,
  [TRANSACTION_SPLIT_SELECTED]: selectTransactionSplit,
  [TRANSACTION_UPDATED]: update,
  [TRANSACTION_BATCH_UPDATED]: updateBatch,
  [UPDATE_TRANSACTIONS_SEARCH]: search,
  [UPDATE_TRANSACTIONS_SORT]: sort,
  [FAYE_TRANSACTIONS_UPDATED]: update,
})
