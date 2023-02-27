/**
 * READ BEFORE CHANGING
 * These category events are a "temporary" fix for Q2. They were officially
 * removed from documentation 3 years ago:
 * https://developer.mx.com/moneymap/v4/index.html#widget-events-sub-category-deleted
 *
 * and don't exist in the documentation today:
 * https://developer.mx.com/moneymap/mx/#postmessage-events-em-deprecated-em-account-created
 *
 * Q2 is an old integration and, apparently, never moved off of them.
 * Ultimately they should be using webhooks for the problem they are solving,
 * but we are adding these back to help them out.
 *
 * Caveats with these category events:
 * 1. We are NOT documenting them
 * 2. They will NOT be sent in webviews. Too risky to add them there since
 *    it could break other impelementations.
 */
import { merge } from 'rxjs'
import { map, pluck } from 'rxjs/operators'

import { CategoriesCreated$, CategoriesDeleted$ } from '../categories'

/**
 * PostMessages of created members
 */
const CategoryCreatedPostMsg$ = CategoriesCreated$.pipe(
  pluck('payload', 'item'),
  map(category => ({
    type: 'created',
    payload: {
      guid: category.guid,
      is_income: category.is_income,
      name: category.name,
      parent_guid: category.parent_guid,
      type: 'category',
    },
  })),
)

/**
 * PostMessages of deleted members
 */
const CategoriesDeletedPostMsg$ = CategoriesDeleted$.pipe(
  pluck('payload', 'item'),
  map(category => ({
    type: 'deleted',
    payload: { guid: category.guid, type: 'category' },
  })),
)

export default merge(CategoryCreatedPostMsg$, CategoriesDeletedPostMsg$)
