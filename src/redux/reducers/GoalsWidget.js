import _isNil from 'lodash/isNil'

import { ActionTypes } from '../actions/GoalsWidget'
import { createReducer } from '../../utils/Reducer'
import Validation from '../../utils/Validation'
import GoalSchema from '../../schemas/Goal'

export const DEFAULT_STATE = {
  goalForm: null,
  errors: {},
  showCompleteModal: false,
  showRetirementCompletedModal: false,
  goalToComplete: null,
  showGoalDetailsDrawer: false,
}

/**
 * Select a goal in the goal widget for editing.
 * NOTE: Don't call this with null to clear out the goal, use closeGoalForm
 * instead
 */
const goalSelected = (state, action) => ({ ...state, goalForm: action.payload })

/**
 * Clear out the goal form and error state
 */
const closeGoalForm = state => ({
  ...state,
  goalForm: null,
  errors: {},
})

/**
 * Merge the incoming goal state into the form, set any errors.
 */
const updateGoalForm = (state, action) => {
  const updatedGoal = { ...state.goalForm, ...action.payload.item }

  return {
    ...state,
    goalForm: updatedGoal,
    errors: Validation.validate(GoalSchema.getSchema(updatedGoal.goal_type), updatedGoal),
  }
}

const showCompleteModal = (state, action) => ({
  ...state,
  showCompleteModal: true,
  goalToComplete: action.payload,
})

const hideCompleteModal = state => ({
  ...state,
  showCompleteModal: false,
  goalToComplete: null,
})

const showRetirementCompletedModal = (state, action) => ({
  ...state,
  showRetirementCompletedModal: true,
  goalToComplete: action.payload,
})

const hideRetirementCompletedModal = state => ({
  ...state,
  showRetirementCompletedModal: false,
  goalToComplete: null,
})

const markGoalAsSpentSuccess = (state, action) => {
  const goalForm =
    !_isNil(state.goalForm) && action.payload.item.guid === state.goalForm.guid
      ? { ...state.goalForm, ...action.payload.item }
      : state.goalForm

  return {
    ...state,
    showCompleteModal: false,
    goalToComplete: null,
    goalForm,
  }
}

const toggleGoalDetailDrawer = state => {
  return {
    ...state,
    showGoalDetailsDrawer: !state.showGoalDetailsDrawer,
  }
}

export const goalsWidget = createReducer(DEFAULT_STATE, {
  [ActionTypes.SELECT_GOAL]: goalSelected,
  [ActionTypes.UPDATE_GOAL_FORM]: updateGoalForm,
  [ActionTypes.CLOSE_GOAL_FORM]: closeGoalForm,
  [ActionTypes.UPDATE_AND_SAVE_GOAL]: updateGoalForm,
  [ActionTypes.GOAL_FORM_SAVED]: updateGoalForm,
  [ActionTypes.SHOW_COMPLETE_MODAL]: showCompleteModal,
  [ActionTypes.HIDE_COMPLETE_MODAL]: hideCompleteModal,
  [ActionTypes.MARK_GOAL_AS_SPENT_SUCCESS]: markGoalAsSpentSuccess,
  [ActionTypes.TOGGLE_GOAL_DETAILS_DRAWER]: toggleGoalDetailDrawer,
  [ActionTypes.SHOW_RETIREMENT_COMPLETE_MODAL]: showRetirementCompletedModal,
  [ActionTypes.HIDE_RETIREMENT_COMPLETE_MODAL]: hideRetirementCompletedModal,
})
