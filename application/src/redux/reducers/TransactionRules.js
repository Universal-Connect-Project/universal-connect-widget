import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/TransactionRules'

const {
  CLEAR_RULE_PENDING,
  RESET_SELECTED_RULE,
  RULE_CREATED,
  RULE_DELETED,
  RULE_UPDATED,
  RULE_SAVED,
  RULES_LOADED,
  RULES_LOADING,
  RULE_PENDING,
} = ActionTypes

export const defaultState = {
  loading: true,
  pendingRule: {},
  rules: [],
  selectedRule: null,
}

const setPendingRule = (state, action) => ({
  ...state,
  pendingRule: {
    ...action.payload,
  },
})

const clearPendingRule = state => ({
  ...state,
  pendingRule: defaultState.pendingRule,
})

const resetSelectedRule = state => ({
  ...state,
  selectedRule: null,
})

const ruleCreated = (state, action) => ({
  ...state,
  rules: [...state.rules, action.payload.item],
})

const ruleDeleted = (state, action) => ({
  ...state,
  rules: state.rules.filter(rule => rule.guid !== action.payload.item.guid),
})

const ruleUpdated = (state, action) => ({
  ...state,
  selectedRule: action.payload.item,
})

const ruleSaved = (state, action) => ({
  ...state,
  rules: state.rules.map(rule =>
    rule.guid === action.payload.item.guid ? action.payload.item : rule,
  ),
})

const rulesLoaded = (state, action) => ({
  ...state,
  rules: action.payload.items,
  loading: false,
})

const rulesLoading = state => ({
  ...state,
  loading: true,
})

export const transactionRules = createReducer(defaultState, {
  [RULE_PENDING]: setPendingRule,
  [CLEAR_RULE_PENDING]: clearPendingRule,
  [RESET_SELECTED_RULE]: resetSelectedRule,
  [RULE_CREATED]: ruleCreated,
  [RULE_DELETED]: ruleDeleted,
  [RULE_UPDATED]: ruleUpdated,
  [RULE_SAVED]: ruleSaved,
  [RULES_LOADED]: rulesLoaded,
  [RULES_LOADING]: rulesLoading,
})
