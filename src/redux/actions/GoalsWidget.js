import { setupAction, itemAction } from '../../utils/ActionHelpers'
import Validation from '../../utils/Validation'
import GoalSchema from '../../schemas/Goal'
import _isNil from 'lodash/isNil'

export const ActionTypes = {
  SELECT_GOAL: 'goalswidget/select_goal',
  UPDATE_GOAL_FORM: 'goalswidget/update_goal_form',
  CLOSE_GOAL_FORM: 'goalswidget/close_goal_form',
  SAVE_GOAL_FORM: 'goalswidget/save_goal_form',
  GOAL_FORM_SAVED: 'goalswidget/goal_form_saved',
  GOAL_FORM_SAVE_ERROR: 'goalswidget/goal_form_save_error',
  GOAL_FORM_ERRORS: 'goalswidget/goal_form_errors',
  UPDATE_AND_SAVE_GOAL: 'goalswidget/update_and_save_goal',
  SHOW_COMPLETE_MODAL: 'goalswidget/show_complete_modal',
  HIDE_COMPLETE_MODAL: 'goalswidget/hide_complete_modal',
  MARK_GOAL_AS_SPENT: 'goalswidget/mark_goal_as_spent',
  MARK_GOAL_AS_SPENT_SUCCESS: 'goalswidget/mark_goal_as_spent_success',
  MARK_GOAL_AS_SPENT_ERROR: 'goalswidget/mark_goal_as_spent_error',
  TOGGLE_GOAL_DETAILS_DRAWER: 'goalswidget/toggle_goal_details_drawer',
  SHOW_RETIREMENT_COMPLETE_MODAL: 'goalswidget/show_retirement_complete_modal',
  HIDE_RETIREMENT_COMPLETE_MODAL: 'goalswidget/hide_retirement_complete_modal',
}

export const validateGoal = (goal, onValid, onError) => {
  const errors = Validation.validate(GoalSchema.getSchema(goal.goal_type), goal)

  if (_isNil(errors)) {
    return onValid(goal)
  }

  return onError(goal)
}

/**
 * Validate the given goal. If there are errors, set them. Otherwise save the
 * goal.
 */
const validateThenSaveGoal = goal => {
  return validateGoal(
    goal,
    goal => itemAction(ActionTypes.SAVE_GOAL_FORM, goal),
    goal => itemAction(ActionTypes.UPDATE_GOAL_FORM, goal),
  )
}

/**
 * Validate, the given goal, if it is valid, update the goal, then save it.
 * Otherwise just update it in the form
 */
const validateUpdateThenSaveGoal = goal => {
  return validateGoal(
    goal,
    goal => itemAction(ActionTypes.UPDATE_AND_SAVE_GOAL, goal),
    goal => itemAction(ActionTypes.UPDATE_GOAL_FORM, goal),
  )
}

export const toggleGoalDetailsDrawer = () => ({
  type: ActionTypes.TOGGLE_GOAL_DETAILS_DRAWER,
})

export const selectGoal = goal => setupAction(ActionTypes.SELECT_GOAL, goal)
export const updateGoalForm = data => itemAction(ActionTypes.UPDATE_GOAL_FORM, data)
export const closeGoalForm = () => setupAction(ActionTypes.CLOSE_GOAL_FORM)
export const saveGoalForm = goal => validateThenSaveGoal(goal)
export const showCompleteModal = guid => setupAction(ActionTypes.SHOW_COMPLETE_MODAL, guid)
export const hideCompleteModal = () => setupAction(ActionTypes.HIDE_COMPLETE_MODAL)
export const updateAndSaveGoal = goal => validateUpdateThenSaveGoal(goal)
export const markGoalAsSpent = goal => setupAction(ActionTypes.MARK_GOAL_AS_SPENT, goal)
export const showRetirementCompleteModal = guid =>
  setupAction(ActionTypes.SHOW_RETIREMENT_COMPLETE_MODAL, guid)
export const hideRetirementCompleteModal = () =>
  setupAction(ActionTypes.HIDE_RETIREMENT_COMPLETE_MODAL)

export default dispatch => ({
  selectGoal: goal => dispatch(selectGoal(goal)),
  updateGoalForm: data => dispatch(updateGoalForm(data)),
  closeGoalForm: () => dispatch(closeGoalForm()),
  saveGoalForm: goal => dispatch(saveGoalForm(goal)),
  showCompleteModal: guid => dispatch(showCompleteModal(guid)),
  hideCompleteModal: () => dispatch(hideCompleteModal()),
  updateAndSaveGoal: goal => dispatch(updateAndSaveGoal(goal)),
  markGoalAsSpent: goal => dispatch(markGoalAsSpent(goal)),
  toggleGoalDetailsDrawer: () => dispatch(toggleGoalDetailsDrawer()),
  showRetirementCompleteModal: guid => dispatch(showRetirementCompleteModal(guid)),
  hideRetirementCompleteModal: () => dispatch(hideRetirementCompleteModal()),
})
