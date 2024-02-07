import { from, of, zip, defer } from 'rxjs'
import { catchError, mergeMap, map, pluck } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import _get from 'lodash/get'

import {
  ActionTypes,
  loadConnectSuccess,
  loadConnectError,
  selectInstitutionSuccess,
  selectInstitutionError,
} from '../../redux/actions/Connect'
import { ReadableStatuses } from '../const/Statuses'
import { VERIFY_MODE } from '../const/Connect'
import FireflyAPI from '../../utils/FireflyAPI'
import { __ } from '../../utils/Intl'

/**
 * Load connenct with the given config.
 *
 * If current_member_guid is configured, it takes precedence
 * next is current_microdeposit_guid
 * next is current_institution_guid
 * next is current_institution_code
 * last is no config, which doesn't actually fetch anything, just sets
 * loading to false.
 *
 * NOTE: loadConnectSuccess action is handled by multiple reducers in
 * connect, members, and instittuions, make sure to test all of them if you
 * change it.
 */
export const loadConnect = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.LOAD_CONNECT),
    pluck('payload'),
    mergeMap((config = {}) => {
      let request$

      if (config.current_member_guid) {
        request$ = loadConnectFromMemberConfig(config)
      } else if (config.current_institution_guid || config.current_institution_code) {
        request$ = loadConnectFromInstitutionConfig(config)
      } else if (config.mode === VERIFY_MODE && config.current_microdeposit_guid) {
        request$ = loadConnectFromMicrodepositConfig(config)
      } else if (config.mode === VERIFY_MODE) {
        request$ = loadConnectInVerify(config)
      } else {
        request$ = of({ config })
      }

      return request$.pipe(
        mergeMap(dependencies =>
          from(FireflyAPI.loadMembers()).pipe(
            map(members => loadConnectSuccess({ members, ...dependencies })),
          ),
        ),
        catchError(err => {
          if (err instanceof VerifyNotEnabled) {
            return of(
              loadConnectError({ message: __("This connection doesn't support verification.") }),
            )
          } else {
            return _get(err, 'response.status', null) === 404
              ? of(loadConnectError({ message: __("Oops! We couldn't find that connection.") }))
              : of(
                  loadConnectError({
                    message: 'Oops! Something went wrong. Please try again later',
                  }),
                )
          }
        }),
      )
    }),
  )

/**
 * Select an insitution from the search list.
 * - Get the institution
 * - Check to see if we should show the existing member modal
 */
export const selectInstitution = (actions$, state$) => 
  actions$.pipe(
    ofType(ActionTypes.SELECT_INSTITUTION),
    pluck('payload'),
    mergeMap(guid =>
      from(FireflyAPI.loadInstitutionByGuid(guid)).pipe(
        map(institution => {
          const currentMembers = _get(state$, 'value.connect.members', [])
          const institutionMembers = currentMembers.filter(
            member => member.institution_guid === institution.guid,
          )

          let showExistingMember = false

          const atLeastOneNotPendingMember = institutionMembers.some(
            member => member.connection_status !== ReadableStatuses.PENDING,
          )

          // If there are institution members and at least one of those members is NOT pending, show the modal

          if (atLeastOneNotPendingMember) {
            showExistingMember = true
          }

          return selectInstitutionSuccess({
            clientProfile: state$.value.clientProfile,
            institution,
            showExistingMember,
          })
        }),
        catchError(err => of(selectInstitutionError(err))),
      ),
    ),
  )

/**
 * Load the data required for loading connect in verify. This is just the
 * accounts, members, and institutions. Pass the mode along for the reducer
 */
function loadConnectInVerify(config) {
  return zip(FireflyAPI.loadAccounts(), FireflyAPI.loadInstitutions()).pipe(
    map(([{ members, accounts }, institutions]) => ({
      config,
      members,
      accounts,
      institutions,
    })),
  )
}

/**
 * Load the data for the configured member. Dispatch an error if mode is in
 * verification but member does not support it.
 * @param  {object} config -  the client config for the widget
 * @return {Observable}
 */
function loadConnectFromMemberConfig(config) {
  return from(FireflyAPI.loadMemberByGuid(config.current_member_guid)).pipe(
    mergeMap(member => {
      if (config.mode === VERIFY_MODE && !member.verification_is_enabled) {
        throw new VerifyNotEnabled(member, 'Loaded member does not support verification')
      }

      if (config.mode === VERIFY_MODE && member.connection_status === ReadableStatuses.CONNECTED) {
        return zip(
          FireflyAPI.loadInstitutionByGuid(member.institution_guid),
          FireflyAPI.loadAccountsByMember(member.guid),
        ).pipe(map(([institution, accounts]) => ({ member, institution, config, accounts })))
      }

      return defer(() => FireflyAPI.loadInstitutionByGuid(member.institution_guid)).pipe(
        map(institution => ({ member, institution, config })),
      )
    }),
  )
}

/**
 * Load the institution that is configured for the connect. When the
 * institution is successfully loaded, maker sure it is a valid configuration.
 *
 * @param  {Object} config - the client config for the widget
 * @return {Observable}
 */
function loadConnectFromInstitutionConfig(config) {
  const request$ = config.current_institution_guid
    ? from(FireflyAPI.loadInstitutionByGuid(config.current_institution_guid))
    : from(FireflyAPI.loadInstitutionByCode(config.current_institution_code))

  return request$.pipe(
    map(institution => {
      if (config.mode === VERIFY_MODE && !institution.account_verification_is_enabled) {
        throw new VerifyNotEnabled(institution, 'Loaded institution does not support verification')
      }
      return { institution, config }
    }),
  )
}

/**
 * Load the microdeposit that is configured for the connect. Microdeposit status will be used to
 * determine initial step(SEARCH or MICRODEPOSITS) in the reducer.
 *
 * @param  {Object} config - the client config for the widget
 * @return {Observable}
 */
function loadConnectFromMicrodepositConfig(config) {
  return from(FireflyAPI.loadMicrodepositByGuid(config.current_microdeposit_guid)).pipe(
    map(microdeposit => ({ microdeposit, config })),
  )
}

/**
 * Derived from the example at SO:
 * https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
 */
function VerifyNotEnabled(entity, message) {
  this.name = 'VerifyNotEnabled'
  this.message = message
  this.stack = new Error().stack
  this.entity = entity
}
VerifyNotEnabled.prototype = new Error()
