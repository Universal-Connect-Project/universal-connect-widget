import { merge } from 'rxjs'
import { map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../../redux/actions/Goals'
import { WSEventSubject$ } from '../Subjects'
import { BROKAW_EVENTS } from '../../constants/Brokaw'

export const GoalsCreated$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.GOALS_CREATED),
  pluck('payload'),
  map(createdGoal => ({ type: ActionTypes.FAYE_GOALS_CREATED, payload: { item: createdGoal } })),
)

export const GoalsUpdated$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.GOALS_UPDATED),
  pluck('payload'),
  map(updatedGoal => ({ type: ActionTypes.FAYE_GOALS_UPDATED, payload: { item: updatedGoal } })),
)

export const GoalsDeleted$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.GOALS_DELETED),
  pluck('payload'),
  map(deletedGoal => ({ type: ActionTypes.FAYE_GOALS_DELETED, payload: { item: deletedGoal } })),
)

export default merge(GoalsCreated$, GoalsUpdated$, GoalsDeleted$)
