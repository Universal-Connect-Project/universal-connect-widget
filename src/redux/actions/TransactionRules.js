export const ActionTypes = {
  CLEAR_RULE_PENDING: 'transactionrules/clear_rule_pending',
  CREATE_RULE: 'transactionrules/create_rule',
  DELETE_RULE: 'transactionrules/delete_rule',
  RESET_SELECTED_RULE: 'transactionrules/reset_selected_rule',
  RULE_CREATED: 'transactionrules/rule_created',
  RULE_CREATED_ERROR: 'transactionrules/rule_created_error',
  RULE_DELETED: 'transactionrules/rule_deleted',
  RULE_DELETED_ERROR: 'transactionrules/rule_deleted_error',
  RULE_UPDATED: 'transactionrules/rule_updated',
  RULE_SAVED: 'transactionrules/rule_saved',
  RULE_SAVED_ERROR: 'transactionrules/rule_saved_error',
  RULES_LOADED: 'transactionrules/rules_loaded',
  RULES_LOADED_ERROR: 'transactionrules/rules_loaded_error',
  RULES_LOADING: 'transactionrules/rules_loading',
  RULE_PENDING: 'transactionrules/rule_pending',
  SAVE_RULE: 'transactionrules/save_rule',
}

export const setPendingRule = (updatedTransaction, originalTransaction, category) => ({
  type: ActionTypes.RULE_PENDING,
  payload: {
    originalTransaction,
    updatedTransaction,
    category,
  },
})

export const clearPendingRule = () => ({
  type: ActionTypes.CLEAR_RULE_PENDING,
})

export const createRule = (updatedDescription, originalDescription, category_guid) => ({
  type: ActionTypes.CREATE_RULE,
  payload: {
    transaction_rule: {
      category_guid,
      description: updatedDescription,
      match_description: originalDescription,
    },
  },
})

export const editRule = item => ({
  type: ActionTypes.RULE_UPDATED,
  payload: { item },
})

export const loadTransactionRules = () => ({
  type: ActionTypes.RULES_LOADING,
})

export const deleteRule = rule => ({
  type: ActionTypes.DELETE_RULE,
  payload: { item: rule },
})

export const saveRule = rule => ({
  type: ActionTypes.SAVE_RULE,
  payload: { item: rule },
})

export const resetSelectedRule = () => ({
  type: ActionTypes.RESET_SELECTED_RULE,
})

export const ruleCreated = item => ({
  type: ActionTypes.RULE_CREATED,
  payload: { item },
})

export const ruleDeleted = item => ({
  type: ActionTypes.RULE_DELETED,
  payload: { item },
})

export const ruleSaved = item => ({
  type: ActionTypes.RULE_SAVED,
  payload: { item },
})

export const rulesLoading = () => ({
  type: ActionTypes.RULES_LOADING,
})

export const selectRule = item => ({
  type: ActionTypes.RULE_UPDATED,
  payload: { item },
})

export default dispatch => ({
  clearPendingRule: () => dispatch(clearPendingRule()),
  createRule: rule => dispatch(createRule(rule)),
  deleteRule: rule => dispatch(deleteRule(rule)),
  editRule: rule => dispatch(editRule(rule)),
  saveRule: rule => dispatch(saveRule(rule)),
  loadTransactionRules: () => dispatch(loadTransactionRules()),
  resetSelectedRule: () => dispatch(resetSelectedRule()),
  ruleCreated: rule => dispatch(ruleCreated(rule)),
  ruleDeleted: rule => dispatch(ruleDeleted(rule)),
  ruleSaved: rule => dispatch(ruleSaved(rule)),
  rulesLoading: () => dispatch(rulesLoading()),
  selectRule: rule => dispatch(selectRule(rule)),
  setPendingRule: (updatedTransaction, originalTransaction, category) =>
    dispatch(setPendingRule(updatedTransaction, originalTransaction, category)),
})
