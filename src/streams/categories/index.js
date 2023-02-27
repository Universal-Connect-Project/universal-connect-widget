import { merge } from 'rxjs'
import { map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { ActionTypes } from '../../redux/actions/Categories'
import { WSEventSubject$ } from '../Subjects'
import { BROKAW_EVENTS } from '../../constants/Brokaw'

export const CategoriesCreated$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.CATEGORIES_CREATED),
  pluck('payload'),
  map(createdCategories => ({
    type: ActionTypes.FAYE_CATEGORIES_CREATED,
    payload: { item: createdCategories },
  })),
)

export const CategoriesUpdated$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.CATEGORIES_UPDATED),
  pluck('payload'),
  map(updatedCategories => ({
    type: ActionTypes.FAYE_CATEGORIES_UPDATED,
    payload: { item: updatedCategories },
  })),
)

export const CategoriesDeleted$ = WSEventSubject$.pipe(
  ofType(BROKAW_EVENTS.CATEGORIES_DELETED),
  pluck('payload'),
  map(updatedCategories => ({
    type: ActionTypes.FAYE_CATEGORIES_DELETED,
    payload: { item: updatedCategories },
  })),
)

export default merge(CategoriesCreated$, CategoriesUpdated$, CategoriesDeleted$)
