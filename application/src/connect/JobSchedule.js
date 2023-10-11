import _find from 'lodash/find'
import _every from 'lodash/every'

import { JOB_TYPES, JOB_STATUSES } from './consts'
import { VERIFY_MODE, AGG_MODE, REWARD_MODE, TAX_MODE } from './const/Connect'

const getJobTypeFromMode = mode => {
  if (mode === VERIFY_MODE) return JOB_TYPES.VERIFICATION
  if (mode === AGG_MODE) return JOB_TYPES.AGGREGATION
  if (mode === REWARD_MODE) return JOB_TYPES.REWARD
  if (mode === TAX_MODE) return JOB_TYPES.TAX

  return JOB_TYPES.AGGREGATION
}

export const UNINITIALIZED = {
  isInitialized: false,
  jobs: [],
}

export const initialize = (member, recentJob, config) => {
  let jobs = []

  const jobFromMode = { type: getJobTypeFromMode(config.mode), status: JOB_STATUSES.PENDING }

  /**
   * If the member is aggregating for a job other than what is configured, we
   * need to add it to the list of jobs as the active job
   */
  if (member.is_being_aggregated && recentJob.job_type !== jobFromMode.type) {
    jobs = [{ type: recentJob.job_type, status: JOB_STATUSES.ACTIVE }, jobFromMode]
  } else {
    jobFromMode.status = JOB_STATUSES.ACTIVE
    jobs = [jobFromMode]
  }

  if (config.include_identity === true) {
    jobs = [...jobs, { type: JOB_TYPES.IDENTIFICATION, status: JOB_STATUSES.PENDING }]
  }

  return { isInitialized: true, jobs }
}

/**
 * Update the schedule with the finished job.
 * - Mark the finished job as DONE
 * - Find and update the next PENDING JOB
 *
 * @param  {Object} schedule   the jobSchedule object
 * @param  {Object} finishedJob the job that was just finished
 * @return {Object}             an updated jobSchedule
 */
export const onJobFinished = (schedule, finishedJob) => {
  let hasSetActiveJob = false
  const updatedJobs = schedule.jobs.map(scheduledJob => {

    if (finishedJob.job_type === scheduledJob.type) {
      // If the finished job's type matched the scheduled one, mark it as done
      return { ...scheduledJob, status: JOB_STATUSES.DONE }
    } else if (!hasSetActiveJob && scheduledJob.status === JOB_STATUSES.PENDING) {
      // If we haven't set an active job and this one is pending, mark it as
      // active, we only have one active job at a time.
      hasSetActiveJob = true
      return { ...scheduledJob, status: JOB_STATUSES.ACTIVE }
    }

    return scheduledJob
  })
  return { isInitialized: true, jobs: updatedJobs }
}

export const areAllJobsDone = schedule => {
  return _every(schedule.jobs, job => job.status === JOB_STATUSES.DONE)
}

export const getActiveJob = schedule => {
  return _find(schedule.jobs, { status: JOB_STATUSES.ACTIVE })
}
