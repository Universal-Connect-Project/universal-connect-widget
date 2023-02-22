export const ActionTypes = {
  FAYE_GOALS_CREATED: 'goals/faye_goals_created',
  FAYE_GOALS_DELETED: 'goals/faye_goals_deleted',
  FAYE_GOALS_UPDATED: 'goals/faye_goals_updated',
  GOALS_LOAD: 'goals/goals_load',
  GOALS_LOADED: 'goals/goals_loaded',
  GOALS_LOADED_ERROR: 'goals/goals_loaded_error',
  GOALS_LOADING: 'goals/goals_loading',
  GOALS_ZEROSTATE_DISMISSED: 'goals/goals_zerostate_dismissed',
  GOAL_CREATE: 'goals/goal_create',
  GOAL_CREATED: 'goals/goal_created',
  GOAL_CREATED_ERROR: 'goals/goal_created_error',
  GOAL_DELETE: 'goals/goal_delete',
  GOAL_DELETED: 'goals/goal_deleted',
  GOAL_DELETED_ERROR: 'goals/goal_deleted_error',
  GOAL_UPDATED: 'goals/goal_updated',
  REPOSITION_GOALS: 'goals/reposition_goals',
  REPOSITION_GOALS_SUCCESS: 'goals/reposition_goals_success',
}

export const fetchCreateGoal = goal => ({
  type: ActionTypes.GOAL_CREATE,
  payload: { goal },
})

export const fetchDeleteGoal = goal => ({
  type: ActionTypes.GOAL_DELETE,
  payload: { goal },
})

export const fetchDismissGoalsZerostate = () => ({ type: ActionTypes.GOALS_ZEROSTATE_DISMISSED })

export const fetchGoals = () => ({ type: ActionTypes.GOALS_LOAD })

export const fetchRepositionGoals = goals => ({
  type: ActionTypes.REPOSITION_GOALS,
  payload: { goals },
})

export const fetchUpdateGoal = goal => ({
  type: ActionTypes.GOAL_UPDATE,
  payload: { goal },
})

export default dispatch => ({
  loadGoals: () => dispatch(fetchGoals()),
  onCreateGoal: goal => dispatch(fetchCreateGoal(goal)),
  onDeleteGoal: goal => dispatch(fetchDeleteGoal(goal)),
  onDismissZeroState: () => dispatch(fetchDismissGoalsZerostate()),
  onUpdateGoal: goal => dispatch(fetchUpdateGoal(goal)),
  repositionGoals: goals => dispatch(fetchRepositionGoals(goals)),
})
