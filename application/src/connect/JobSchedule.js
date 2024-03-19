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
  const jobType = mapJobType(config.mode)
  /**
   * If the member is aggregating for a job other than what is configured, we
   * need to add it to the list of jobs as the active job
   */
  // first job
  if (jobType === "aggregate_extendedhistory") {
    jobs = [...jobs, { type: JOB_TYPES.HISTORY, status: JOB_STATUSES.ACTIVE }]
  } else if (jobType === "aggregate_identity") {
    jobs = [...jobs, { type: JOB_TYPES.IDENTIFICATION, status: JOB_STATUSES.ACTIVE }]
  } else {
    jobFromMode.status = JOB_STATUSES.ACTIVE
    jobs = [jobFromMode]
  }

  // sequential jobs
  if (['mx_int', 'mx'].includes(member.provider)) {
    if (config.include_identity === true || jobType === "aggregate_identity_verification") {
      jobs = [...jobs, { type: JOB_TYPES.IDENTIFICATION, status: JOB_STATUSES.PENDING }]
    }
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

function mapJobType(input){
  switch (input) {
    case 'agg':
    case 'aggregation':
    case 'aggregate':
    case 'add':
    case 'utils':
    case 'util':
    case 'demo':
    case 'vc_transactions':
    case 'vc_transaction':
      return 'aggregate';
    case 'all':
    case 'everything':
    case 'aggregate_all':
    case 'aggregate_everything':
    case 'agg_all':
    case 'agg_everything':
      return 'aggregate_identity_verification';
    case 'fullhistory':
    case 'aggregate_extendedhistory':
      return 'aggregate_extendedhistory';
    case 'auth':
    case 'bankauth':
    case 'verify':
    case 'verification':
    case 'vc_account':
    case 'vc_accounts':
      return 'verification';
    case 'identify':
    case 'vc_identity':
      return 'aggregate_identity';
    default:
      return 'aggregate'
  }
}

