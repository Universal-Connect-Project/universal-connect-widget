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

  if (config.mode !== 'identify' && config.include_identity === true && ['mx_int', 'mx'].includes(member.provider)) {
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
export const onJobFinished = (schedule, _finishedJob) => {
  const activeJob = schedule.jobs.find(job => job.status === JOB_STATUSES.ACTIVE)
  const pendingJobs = schedule.jobs.filter(job => job.status === JOB_STATUSES.PENDING)
  const doneJobs = schedule.jobs.filter(job => job.status === JOB_STATUSES.DONE)
  if (pendingJobs.length > 0) {
    const updatedPending = pendingJobs.map((job, index) => {
      if (index === 0){
        return { ...job, status: JOB_STATUSES.ACTIVE }
      } else {
        return { ...job }
      }
    })
    return { isInitialized: true, jobs: [{ ...activeJob, status: JOB_STATUSES.DONE }, ...updatedPending, ...doneJobs] }
  } else if (activeJob != null) {
    return { isInitialized: true, jobs: [{...activeJob, status: JOB_STATUSES.DONE }, ...doneJobs] }
  } else {
    return schedule
  }
}

export const areAllJobsDone = schedule => {
  return _every(schedule.jobs, job => job.status === JOB_STATUSES.DONE)
}

export const getActiveJob = schedule => {
  return _find(schedule.jobs, { status: JOB_STATUSES.ACTIVE })
}
