import { merge } from 'rxjs'

import AccountPostMessages$ from './accounts/PostMessages'
import MemberPostMessages$ from './members/PostMessages'
import TransactionPostMessages$ from './transactions/PostMessages'
import CategoriesPostMessages$ from './categories/PostMessages'

import GoalEvents$ from './goals'
import CategoriesEvents$ from './categories'
import { AccountsActions$ } from './accounts'
import { MembersActions$ } from './members'
import { TransactionActions$ } from './transactions'
import { MiniSpendingActions$ } from './miniSpending'

export const PostMessages$ = merge(
  AccountPostMessages$,
  MemberPostMessages$,
  TransactionPostMessages$,
  /**
   * WARNING: READ THE ACTUAL CREATE POSTMESSAGES FILE FOR INFO BEFORE CHANGING
   */
  CategoriesPostMessages$,
)

export const EventsToDispatch$ = merge(
  AccountsActions$,
  CategoriesEvents$,
  GoalEvents$,
  MembersActions$,
  MiniSpendingActions$,
  TransactionActions$,
)
