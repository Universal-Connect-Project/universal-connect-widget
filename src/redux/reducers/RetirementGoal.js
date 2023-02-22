import _without from 'lodash/without'
import { ActionTypes } from '../actions/RetirementGoal'
import { createReducer, updateObject } from '../../utils/Reducer'

const {
  RETIREMENT_GOAL_ACCOUNT_CREATED,
  RETIREMENT_GOAL_ACCOUNT_DELETED,
  RETIREMENT_GOALS_LOADED,
  RETIREMENT_GOAL_CREATED,
  RETIREMENT_GOAL_DELETED,
  RETIREMENT_GOAL_UPDATED,
} = ActionTypes

const defaultState = {
  goalAccounts: [],
  retirementGoal: null,
}

const createRetirementGoal = (state, action) =>
  updateObject(state, { retirementGoal: action.payload.item })

const createRetirementGoalAccount = (state, action) => {
  const goalAccounts = state.goalAccounts.concat(action.payload.item)
  const accountGuids = goalAccounts.map(ga => ga.account_guid)
  const retirementGoal = state.retirementGoal && {
    ...state.retirementGoal,
    accountGuids,
    _goalAccounts: goalAccounts,
  }

  return updateObject(state, { retirementGoal, goalAccounts })
}

const deleteRetirementGoalAccount = (state, action) => {
  const goalAccounts = _without(state.goalAccounts, action.payload.item)
  const accountGuids = _without(state.retirementGoal.accountGuids, action.payload.item.account_guid)
  const retirementGoal = state.retirementGoal && {
    ...state.retirementGoal,
    accountGuids,
    _goalAccounts: goalAccounts,
  }

  return updateObject(state, { retirementGoal, goalAccounts })
}

const deleteRetirementGoal = state =>
  updateObject(state, {
    retirementGoal: null,
  })

const loadRetirementGoals = (state, action) => {
  const retirementGoal = action.payload.item

  return updateObject(state, { retirementGoal })
}

const updateRetirementGoal = (state, action) =>
  updateObject(state, {
    retirementGoal: updateObject(state.retirementGoal, action.payload.item),
  })

export const retirementGoal = createReducer(defaultState, {
  [RETIREMENT_GOAL_ACCOUNT_CREATED]: createRetirementGoalAccount,
  [RETIREMENT_GOAL_ACCOUNT_DELETED]: deleteRetirementGoalAccount,
  [RETIREMENT_GOAL_CREATED]: createRetirementGoal,
  [RETIREMENT_GOALS_LOADED]: loadRetirementGoals,
  [RETIREMENT_GOAL_DELETED]: deleteRetirementGoal,
  [RETIREMENT_GOAL_UPDATED]: updateRetirementGoal,
})
