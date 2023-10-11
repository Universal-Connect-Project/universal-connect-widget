import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { defer, interval } from 'rxjs'
import { filter, mergeMap, pluck, scan, switchMap, take } from 'rxjs/operators'
import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'

import { SlideDown } from '../../components/SlideDown'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorStatuses, MicrodepositsStatuses } from './const'
import { fadeOut } from '../../utilities/Animation'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import FireflyAPI from '../../../utils/FireflyAPI'
import { __ } from '../../../utils/Intl'

export const Verifying = ({ microdeposit, onError, onSuccess }) => {
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS_VERIFYING)
  const tokens = useTokens()
  const styles = getStyles(tokens)

  /**
   * 1. Call loadMicrodepositByGuid() to get current status of Microdeposit
   * 2. Call refreshMicrodepositStatus() to tell backend to ask Dwolla for updated status
   * 3. Poll loadMicrodepositByGuid() and compare to microdeposit from step 1.
   *   - Once status has updated call onSuccess
   *   - If an error occurs call onError
   */
  useEffect(() => {
    const pollStatus = originalMicrodeposit =>
      interval(3000).pipe(
        switchMap(() => defer(() => FireflyAPI.loadMicrodepositByGuid(microdeposit.guid))),
        scan(
          (acc, newMicrodeposit) => {
            return {
              newMicrodeposit,
              attempts: acc.attempts + 1,
            }
          },
          { newMicrodeposit: {}, attempts: 0 },
        ),
        filter(({ attempts, newMicrodeposit }) => {
          // If we have polled more then 5 attempts (15 seconds)
          // load to view based off currrent status
          if (attempts > 5) {
            return true
          }
          // If status is updated, load based off current status
          if (originalMicrodeposit.status !== newMicrodeposit.status) {
            return true
          }
          return false
        }),
        pluck('newMicrodeposit'),
        take(1),
      )

    const poller$ = defer(() => FireflyAPI.refreshMicrodepositStatus(microdeposit.guid))
      .pipe(mergeMap(() => pollStatus(microdeposit)))
      .subscribe(newMicrodeposit => {
        // If new status is success or one of 4 errors navigate to step, else keep polling
        if (newMicrodeposit.status === MicrodepositsStatuses.VERIFIED) {
          fadeOut(containerRef.current, 'down').then(() => onSuccess(newMicrodeposit))
        } else if (ErrorStatuses.includes(newMicrodeposit.status)) {
          fadeOut(containerRef.current, 'down').then(() => onError(newMicrodeposit))
        }
      })

    return () => poller$.unsubscribe()
  }, [microdeposit.guid]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef}>
      <SlideDown>
        <div style={styles.header}>
          <Text as="H2" style={styles.title}>
            {__('Verifying ...')}
          </Text>
          <Text as="Paragraph" style={styles.subtitle}>
            {__('Checking microdeposit amounts.')}
          </Text>
        </div>
      </SlideDown>

      <SlideDown>
        <div style={styles.spinner}>
          <LoadingSpinner />
        </div>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: tokens.Spacing.XSmall,
  },
  subtitle: {
    marginBottom: tokens.Spacing.XLarge,
  },
  spinner: {
    margin: `0px auto ${tokens.Spacing.Large}px`,
  },
})

Verifying.propTypes = {
  microdeposit: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}
