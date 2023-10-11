import { from, of } from 'rxjs'
import { catchError, flatMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { itemAction, setupAction } from '../../utils/ActionHelpers'

import { ActionTypes } from '../actions/AccountDetailsDrawer'
import { formatAccountFieldsForSaving } from '../../components/accounts/utils/AccountDetailsFields'

export const saveEditForm = (actions$, _, { FireflyAPI }) =>
  actions$.pipe(
    ofType(ActionTypes.SAVE_EDIT_FORM),
    pluck('payload'),
    map(formatAccountFieldsForSaving),
    flatMap(formattedAccount =>
      from(FireflyAPI.saveAccount(formattedAccount)).pipe(
        map(resp => itemAction(ActionTypes.SAVE_EDIT_FORM_SUCCESS, resp)),
        catchError(err => of(setupAction(ActionTypes.SAVE_EDIT_FORM_ERROR, err))),
      ),
    ),
  )
