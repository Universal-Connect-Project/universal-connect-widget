import Honeybadger from 'honeybadger-js'
import { defer, interval, of } from 'rxjs'
import { catchError, scan, switchMap, tap, filter } from 'rxjs/operators'

import { ErrorStatuses, ProcessingStatuses, ReadableStatuses } from '../const/Statuses'

import { __ } from '../../utils/Intl'
import FireflyAPI from '../../utils/FireflyAPI'
import { OauthState } from '../consts'

export const CONNECTING_MESSAGES = {
  STARTING: __('Starting'),
  MFA: __('Additional Information Required'),
  VERIFYING: __('Verifying credentials'),
  SYNCING: __('Syncing data'),
  FINISHING: __('Finishing'),
  OAUTH: __('Waiting for authentication'),
  ERROR: __('Error has occurred'),
}

export const DEFAULT_POLLING_STATE = {
  isError: false, // whether or not the last poll was an error
  pollingCount: 0, // used to count how many times we have polled
  previousResponse: {}, // previous response from last poll
  currentResponse: {}, // current response
  jobIsDone: false, // whether or not we should stop polling
  userMessage: CONNECTING_MESSAGES.STARTING, // message to show the end user
}

export function pollMember(memberGuid) {
  return interval(3000).pipe(
    switchMap(() =>
      // Poll the currentMember. Catch errors but don't handle it here
      // the scan will handle it below
      defer(() => FireflyAPI.loadMemberByGuid(memberGuid)).pipe(catchError(error => of(error))),
    ),
    scan(
      (acc, response) => {
        const isError = response instanceof Error

        const pollingState = {
          // only track if the most recent poll was an error
          isError,
          // always increase polling count
          pollingCount: acc.pollingCount + 1,
          // dont update previous response if this is an error
          previousResponse: isError ? acc.previousResponse : acc.currentResponse,
          // dont update current response if this is an error
          currentResponse: isError ? acc.currentResponse : response,
        }

        const [shouldStopPolling, messageKey] = handlePollingResponse(pollingState)

        return {
          ...pollingState,
          // we should keep polling based on the member
          jobIsDone: isError ? false : shouldStopPolling,
          userMessage: messageKey,
        }
      },
      { ...DEFAULT_POLLING_STATE },
    ),
    tap(pollingState => {
      // if pollingState.currentResponse is undefined we have a problem so
      // log it to honeybadger
      if (pollingState.currentResponse === undefined) {
        Honeybadger.notify({
          name: 'ConnectPollingUndefinedMemberError',
          message: 'Member poller said no error, but response is undefined',
          context: { ...pollingState },
        })
      }
    }),
  )
}

export function handlePollingResponse(pollingState) {
  const polledMember = pollingState.currentResponse
  const previousMember = pollingState.previousResponse
  const justFinishedAggregating =
    previousMember.is_being_aggregated === true && polledMember.is_being_aggregated === false
  const isNotAggregatingAtAll =
    previousMember.is_being_aggregated === false && polledMember.is_being_aggregated === false

  // If we are challenged update the message and stop polling
  if (polledMember.connection_status === ReadableStatuses.CHALLENGED) {
    return [true, CONNECTING_MESSAGES.MFA]
  }

  // If we are still processing update the message but keep polling
  if (ProcessingStatuses.indexOf(polledMember.connection_status) !== -1) {
    return [false, CONNECTING_MESSAGES.VERIFYING]
  }

  if (polledMember.connection_status === ReadableStatuses.CONNECTED) {
    // if we are still being aggregated keep polling
    if (polledMember.is_being_aggregated) {
      return [false, CONNECTING_MESSAGES.SYNCING]
    }

    return [true, CONNECTING_MESSAGES.FINISHING]
  }

  // At this point we are probably in an error state, but we need to wait for
  // aggregation to finish to know for sure.
  if (polledMember.is_being_aggregated) {
    return [false, CONNECTING_MESSAGES.VERIFYING]
  }

  // if we aren't aggregating whatsoever and in an error state, stop polling
  if (isNotAggregatingAtAll && ErrorStatuses.includes(polledMember.connection_status)) {
    return [true, CONNECTING_MESSAGES.ERROR]
  }

  /**
   * If this is an OAuth member, we could be stuck 'connecting' forever if the
   * user bails out of the authentication process, leaving the member in the
   * same state we started with.
   *
   * We will keep polling oauth members until they either fit a condition above,
   * or the member goes from
   * - `is_being_aggregated: true` to `is_being_aggregated: false`
   */
  if (polledMember.is_oauth && justFinishedAggregating === false) {
    return [false, CONNECTING_MESSAGES.OAUTH]
  }

  return [true, CONNECTING_MESSAGES.ERROR]
}

/**
 * Poll an oauth state until it is SUCCESS OR COMPLETED
 *
 * @param {string} oauthStateGuid the guid of oauthstate to poll
 */
export function pollOauthState(oauthStateGuid) {
  return interval(3000).pipe(
    switchMap(() =>
      // Poll the oauthstate. Catch errors but don't handle it here
      // the scan will handle it below
      defer(() => FireflyAPI.loadOAuthState(oauthStateGuid)).pipe(catchError(error => of(error))),
    ),
    scan(
      (acc, response) => {
        const isError = response instanceof Error

        return {
          // only track if the most recent poll was an error
          isError,
          // always increase polling count
          pollingCount: acc.pollingCount + 1,
          // dont update previous response if this is an error
          previousResponse: isError ? acc.previousResponse : acc.currentResponse,
          // dont update current response if this is an error
          currentResponse: isError ? acc.currentResponse : response,
        }
      },
      { ...DEFAULT_POLLING_STATE },
    ),
    filter(pollingState => {
      return pollingState.isError
        ? false
        : [OauthState.AuthStatus.SUCCESS, OauthState.AuthStatus.ERRORED].includes(
            pollingState.currentResponse?.auth_status,
          )
    }),
  )
}
