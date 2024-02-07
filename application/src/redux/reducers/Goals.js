import _clone from 'lodash/clone'
import _keyBy from 'lodash/keyBy'
//import { setTrackType } from '../../utils/Goal'
import { ActionTypes } from '../actions/Goals'
import { ActionTypes as GoalWidgetActionTypes } from '../actions/GoalsWidget'
import { createReducer, upsertItem, updateObject } from '../../utils/Reducer'
const {
  FAYE_GOALS_CREATED,
  FAYE_GOALS_DELETED,
  FAYE_GOALS_UPDATED,
  GOAL_CREATED,
  GOAL_UPDATED,
  GOAL_DELETED,
  GOALS_LOADED,
  GOALS_LOAD,
  GOALS_ZEROSTATE_DISMISSED,
  REPOSITION_GOALS_SUCCESS,
} = ActionTypes

export const defaultState = {
  loading: true,
  items: [],
  zeroStateDismissed: false,
}

const upsertGoal = (state, action) => upsertItem(state, setTrackType(action.payload.item))

const deleteGoal = (state, action) =>
  updateObject(state, {
    items: state.items.filter(item => item.guid !== action.payload.item.guid),
  })

const dismissZeroState = state => updateObject(state, { zeroStateDismissed: true })

const loadedGoals = (state, action) =>
  updateObject(state, {
    items: action.payload.items.map(_clone).map(setTrackType),
    loading: false,
  })

const loadGoals = state => updateObject(state, { loading: true })

const repositionGoals = (state, action) => {
  const repositionedGoals = action.payload.items.map(setTrackType)
  const repositionedGoalsMap = _keyBy(repositionedGoals, 'guid')

  // replace the repositioned goals
  const items = state.items.map(item =>
    repositionedGoalsMap[item.guid] ? repositionedGoalsMap[item.guid] : item,
  )

  return updateObject(state, { items })
}

export const goals = createReducer(defaultState, {
  [FAYE_GOALS_CREATED]: upsertGoal,
  [FAYE_GOALS_DELETED]: deleteGoal,
  [FAYE_GOALS_UPDATED]: upsertGoal,
  [GOALS_LOAD]: loadGoals,
  [GOALS_LOADED]: loadedGoals,
  [GOALS_ZEROSTATE_DISMISSED]: dismissZeroState,
  [GOAL_CREATED]: upsertGoal,
  [GOAL_DELETED]: deleteGoal,
  [GOAL_UPDATED]: upsertGoal,
  [REPOSITION_GOALS_SUCCESS]: repositionGoals,
  [GoalWidgetActionTypes.GOAL_FORM_SAVED]: upsertGoal,
  [GoalWidgetActionTypes.MARK_GOAL_AS_SPENT_SUCCESS]: upsertGoal,
})
