import { dispatcher as accountsDispatcher } from '../actions/Accounts'
import { dispatcher as monthlyCashFlowProfileDispatcher } from '../actions/MonthlyCashFlowProfile'
import goalsDispatcher from '../actions/Goals'
import { validateGoal } from '../actions/GoalsWidget'

import { itemAction, setupAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  CLEAR_SELECTED_DEBT: 'debtswidget/clear_selected_debt',
  DEBT_SELECTED: 'debtswidget/debt_selected',
  UPDATE_DEBT_FORM: 'debtswidget/update_debt_form',
  SAVE_DEBT_FORM: 'debtswidget/save_debt_form',
  UPDATE_AND_SAVE_DEBT: 'debtswidget/update_and_save_debt',
  DEBT_FORM_SAVED: 'debtswidget/debt_form_saved',
  DEBT_FORM_SAVE_ERROR: 'debtswidget/debt_form_save_error',
}

const loadDebtWidgetData = () => dispatch => {
  accountsDispatcher(dispatch).loadAccounts()
  goalsDispatcher(dispatch).loadGoals()
  monthlyCashFlowProfileDispatcher(dispatch).loadMonthlyCashFlowProfile()
}

const selectDebt = debt => dispatch => dispatch(itemAction(ActionTypes.DEBT_SELECTED, debt))

const validateThenSaveDebt = debt =>
  validateGoal(
    debt,
    debt => setupAction(ActionTypes.SAVE_DEBT_FORM, debt),
    debt => setupAction(ActionTypes.UPDATE_DEBT_FORM, debt),
  )

const validateUpdateThenSaveGoal = debt =>
  validateGoal(
    debt,
    debt => setupAction(ActionTypes.UPDATE_AND_SAVE_DEBT, debt),
    debt => setupAction(ActionTypes.UPDATE_DEBT_FORM, debt),
  )

export default dispatch => ({
  loadDebtWidgetData: () => dispatch(loadDebtWidgetData()),
  updateDebtForm: partialData => dispatch(setupAction(ActionTypes.UPDATE_DEBT_FORM, partialData)),
  selectDebt: g => dispatch(selectDebt(g)),
  saveDebtForm: debt => dispatch(validateThenSaveDebt(debt)),
  updateAndSaveForm: debt => dispatch(validateUpdateThenSaveGoal(debt)),
  clearSelectedDebt: () => dispatch({ type: ActionTypes.CLEAR_SELECTED_DEBT }),
})
