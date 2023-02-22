import { createReducer } from '../../utils/Reducer'

import { ActionTypes } from '../actions/DebtsWidget'
import Validation from '../../utils/Validation'
import GoalSchema from '../../schemas/Goal'

export const defaultState = {
  debt: {},
  loading: true,
  debtForm: null,
  formErrors: {},
}

/**
 * Set the selected debt on state and use the goal for the new goal form.
 */
const debtSelected = (state, action) => {
  const debt = { ...action.payload.item }

  return { ...state, debt, debtForm: { ...debt.goal } }
}

/**
 * Update the goal form with the supplied partial data
 */
const updateDebtForm = (state, action) => {
  const updatedForm = { ...state.debtForm, ...action.payload }

  return {
    ...state,
    debtForm: updatedForm,
    formErrors: Validation.validate(GoalSchema.getSchema(updatedForm.goal_type), updatedForm) || {},
  }
}

/**
 * Set the debt, debtForm, and formErrors to their default state when we clear
 * the selected debt.
 */
const clearSelectedDebt = state => {
  return {
    ...state,
    debt: defaultState.debt,
    debtForm: defaultState.debtForm,
    formErrors: defaultState.formErrors,
  }
}

export default createReducer(defaultState, {
  [ActionTypes.CLEAR_SELECTED_DEBT]: clearSelectedDebt,
  [ActionTypes.DEBT_SELECTED]: debtSelected,
  [ActionTypes.UPDATE_DEBT_FORM]: updateDebtForm,
  [ActionTypes.UPDATE_AND_SAVE_DEBT]: updateDebtForm,
})
