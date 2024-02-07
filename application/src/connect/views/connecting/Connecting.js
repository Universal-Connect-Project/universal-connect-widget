import React, { useEffect, useState, useRef } from 'react'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { defer, of } from 'rxjs'
import {
  filter,
  take,
  pluck,
  tap,
  mergeMap,
  concatMap,
  catchError,
  map,
  retry,
} from 'rxjs/operators'
import { useSelector, useDispatch } from 'react-redux'

import { Text } from '@kyper/text'
import { useTokens } from '@kyper/tokenprovider'

import { Container } from '../../components/Container'
import { SlideDown } from '../../components/SlideDown'
import { getDelay } from '../../utilities/getDelay'
import { pollMember, CONNECTING_MESSAGES } from '../../utilities/pollers'
import { STEPS, VERIFY_MODE } from '../../const/Connect'
import { ConnectInstitutionHeader } from '../../components/ConnectInstitutionHeader'
import { ProgressBar } from './progress/ProgressBar'
import * as JobSchedule from '../../JobSchedule'
import { AriaLive } from '../../accessibility/AriaLive'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'

import { ErrorStatuses, ReadableStatuses } from '../../const/Statuses'

import { getCurrentMember } from '../../../redux/selectors/Connect'
import {
  connectComplete,
  initializeJobSchedule,
  jobComplete,
  ActionTypes,
} from '../../../redux/actions/Connect'
import PostMessage from '../../../utils/PostMessage'

import { fadeOut } from '../../utilities/Animation'
import { __ } from '../../../utils/Intl'
import FireflyAPI from '../../../utils/FireflyAPI'
import { EventCategories, PageviewInfo } from '../../const/Analytics'
import { ReadableAccountTypes } from '../../const/Accounts'
import {ConnectionStatusMap} from '../../../constants/Member'
import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'

export const Connecting = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_CONNECTING)
  const {
    connectConfig,
    institution,
    sendPostMessage,
    uiMessageVersion,
    hasAtriumAPI,
    isMobileWebview,
  } = props

  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()
  const dispatch = useDispatch()

  const connectingRef = useRef(null)

  const currentMember = useSelector(state => getCurrentMember(state))
  const jobSchedule = useSelector(state => state.connect.jobSchedule)

  const [message, setMessage] = useState(CONNECTING_MESSAGES.STARTING)
  const [timedOut, setTimedOut] = useState(false)

  const activeJob = JobSchedule.getActiveJob(jobSchedule)
  const needsToInitializeJobSchedule = jobSchedule.isInitialized === false

  function handleMemberPoll(pollingState) {
    // If we have been polling for more than 15 attempts (60 seconds)
    // show the timeout message
    // Unless this is a PENDING member, then we don't show the timeout
    // since PENDING may take much longer to resolve.
    if (
      pollingState.pollingCount > 15 &&
      pollingState.currentResponse?.connection_status !== ReadableStatuses.PENDING
    ) {
      setTimedOut(true)
    }

    const statusChanged =
      pollingState.previousResponse?.connection_status !==
      pollingState.currentResponse?.connection_status

    // if status changes during connecting or timeout send out a post message
    if (pollingState.previousResponse != null && statusChanged) {
      sendPostMessage('connect/memberStatusUpdate', {
        member_guid: pollingState.currentResponse.guid,
        connection_status: pollingState.currentResponse.connection_status,
      })
      dispatch(
        sendAnalyticsEvent({
          category: `${EventCategories.CONNECT}`,
          label: 'Status Change',
          action: `Status  - ` + ConnectionStatusMap[pollingState.currentResponse.connection_status].key,
          value: 1,
        }),
      )
    }

    setMessage(pollingState.userMessage)
  }

  // If all jobs are done, fade out and move onto the connected step
  useEffect(() => {
    if (!needsToInitializeJobSchedule && JobSchedule.areAllJobsDone(jobSchedule)) {
      dispatch(
        sendAnalyticsEvent({
          category: `${EventCategories.CONNECT}`,
          label: 'Connected',
          action: `Success  - Status CONNECTED`,
          value: 1,
        }),
      )
      // give the animation a bit more time for the user to see the complete
      // state
      //  console.log(currentMember)
      // send member connected post message before analytic event, this allows clients to show their own "connected" window before the connect complete step.
      if (uiMessageVersion === 4) {
        sendPostMessage('connect/memberConnected', {
          user_guid: currentMember.user_guid,
          member_guid: currentMember.guid,
          provider: currentMember.provider,
        })
      } else if (hasAtriumAPI && isMobileWebview === true) {
        PostMessage.setWebviewUrl(`atrium://memberAdded/${currentMember.guid}`)
      } else {
        PostMessage.send('mxConnect:memberAdded', {
          member_guid: currentMember.guid,
          user_guid: currentMember.user_guid,
          provider: currentMember.provider,
        })
      }

      fadeOut(connectingRef.current, 'down').then(() => {
        dispatch(connectComplete())
      }, 1500)
    }
  }, [needsToInitializeJobSchedule, jobSchedule])

  // When we mount, try to initialize the jobSchedule, but first we need the
  // most recent job details
  useEffect(() => {
    if (!needsToInitializeJobSchedule) return () => {}

    const sub$ = defer(() => {
      // If we have a most recent job guid, get it, otherwise, just pass null
      if (currentMember.most_recent_job_guid) {
        return defer(() => FireflyAPI.loadJob(currentMember.most_recent_job_guid)).pipe(
          // I have to retry here because sometimes this is too fast in sand and
          // it 404s. This is a long standing backend problem.
          retry(1),
          // If we do error for real, just act as if there is no job
          catchError(() => of(null)),
        )
      } else {
        return of(null)
      }
    }).subscribe(job => dispatch(initializeJobSchedule(currentMember, job, connectConfig)))

    return () => sub$.unsubscribe()
  }, [needsToInitializeJobSchedule])

  /**
   * If the member is not aggregating, start a job, otherwise, poll the
   * member until it's done aggregating.
   */
  useEffect(() => {
    // If we still need to initialize the job schedule, do nothing
    if (needsToInitializeJobSchedule) return () => {}

    const connectMember$ = defer(() => {
      const needsJobStarted = currentMember.is_being_aggregated === false

      const startJob$ = defer(() =>
        FireflyAPI.runJob(activeJob.type, currentMember.guid, connectConfig, true),
      ).pipe(
        mergeMap(() => FireflyAPI.loadMemberByGuid(currentMember.guid)),
        catchError(() => {
          // For now, if there was an error starting the job, it was most
          // likely a 409 because there was already a job running, in this
          // case we just want to skip the job creation and poll the member
          // and see what happens. Currently there is no error handling
          // here becuase it has, frankly, never been thought of or designed
          // beyond 409.
          return of(currentMember)
        }),
      )

      // If the current member is not being aggregated, start a job
      // otherwise, just go with the member we have now
      return needsJobStarted ? startJob$ : of(currentMember)
    })
      .pipe(
        concatMap(member =>
          pollMember(member.guid, connectConfig).pipe(
            tap(pollingState => handleMemberPoll(pollingState)),
            filter(pollingState => pollingState.jobIsDone),
            pluck('currentResponse'),
            take(1),
            mergeMap(member => {
              const mfaCredentials = _get(member, 'mfa.credentials', [])
              const isSAS = mfaCredentials[0]?.external_id === 'single_account_select'

              const loadLatestJob$ = defer(() =>
                FireflyAPI.loadJob(member.most_recent_job_guid),
              ).pipe(map(job => ({ member, job, hasInvalidData: false })))

              const invalidData$ = of({ member: {}, job: {}, hasInvalidData: true })

              if (
                connectConfig.mode === VERIFY_MODE &&
                member.connection_status === ReadableStatuses.CONNECTED
              ) {
                return defer(() => FireflyAPI.loadAccountsByMember(member.guid)).pipe(
                  mergeMap(accounts => {
                    const checkingSavingsAccounts = accounts.filter(account =>
                      [ReadableAccountTypes.CHECKING, ReadableAccountTypes.SAVINGS].includes(
                        account.account_type,
                      ),
                    )

                    return !checkingSavingsAccounts.length ? invalidData$ : loadLatestJob$
                  }),
                  catchError(() => loadLatestJob$),
                )
              }

              if (
                member.connection_status === ReadableStatuses.CHALLENGED &&
                isSAS &&
                !mfaCredentials[0].options.length
              ) {
                return invalidData$
              }

              return loadLatestJob$
            }),
          ),
        ),
      )
      .subscribe(({ member, job, hasInvalidData }) => {
        if (hasInvalidData) {
          return dispatch({ type: ActionTypes.HAS_INVALID_DATA })
        }
        // if we are in an error state, fade out to ease the transition away
        // from this view
        if (ErrorStatuses.includes(member.connection_status)) {
          return fadeOut(connectingRef.current, 'down').then(() => {
            dispatch(jobComplete(member, job))
          })
        } else {
          return dispatch(jobComplete(member, job))
        }
      })

    return () => connectMember$.unsubscribe()
  }, [needsToInitializeJobSchedule, activeJob])

  /**
   * We removed the timeout step, but customer's relied on the timeout value in
   * the step change event to do things in their UI, so we need to bring the
   * message back in a way that makes sense.
   *
   * Now send the 'stepChange' event with the expected values when we move into
   * the timeout message here.
   */
  useEffect(() => {
    if (timedOut === true) {
      sendPostMessage('connect/stepChange', {
        previous: STEPS.CONNECTING,
        current: 'timeOut', // old value for the step
      })
    }
  }, [timedOut])

  return (
    <Container>
      <div ref={connectingRef} style={styles.container}>
        <SlideDown delay={getNextDelay()}>
          <ConnectInstitutionHeader institution={institution} />
          <Text style={styles.subHeader} tag="h2">
            {__('Connecting to %1', institution.name)}
          </Text>
        </SlideDown>

        <SlideDown delay={getNextDelay()}>
          <ProgressBar jobSchedule={jobSchedule} />
        </SlideDown>
        <AriaLive level="assertive" message={message} timeout={500} />
      </div>
    </Container>
  )
}

const getStyles = tokens => ({
  container: {
    textAlign: 'center',
  },
  message: {
    marginTop: tokens.Spacing.XLarge,
  },
  subHeader: {
    marginTop: tokens.Spacing.XLarge,
  },
  spinner: {
    marginTop: tokens.Spacing.XLarge,
  },
})

Connecting.propTypes = {
  connectConfig: PropTypes.object.isRequired,
  hasAtriumAPI: PropTypes.bool,
  institution: PropTypes.object.isRequired,
  isMobileWebview: PropTypes.bool,
  sendPostMessage: PropTypes.func.isRequired,
  uiMessageVersion: PropTypes.number,
}
