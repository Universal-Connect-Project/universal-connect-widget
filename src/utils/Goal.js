import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import _has from 'lodash/has'
import _includes from 'lodash/includes'
import _isEmpty from 'lodash/isEmpty'
import _max from 'lodash/max'
import _sortBy from 'lodash/sortBy'
import moment from 'moment'
import { AssetTypes, AccountAssetTypes } from '../constants/Account'
import * as AccountUtils from './Account'
import * as GoalConstants from '../constants/Goal'

export const accountsByGoalType = (accounts, goalType) => {
  const assetType =
    goalType === GoalConstants.GoalTypes.SAVE ? AssetTypes.ASSET : AssetTypes.LIABILITY

  return accounts.filter(account => AccountAssetTypes[account.account_type] === assetType)
}

export const allDebtGoals = goals => {
  return goals.filter(goal => goal.track_type === GoalConstants.TrackTypes.DEBT_TRACK)
}

export const allSavingsGoals = goals => {
  return goals.filter(goal => goal.track_type === GoalConstants.TrackTypes.SAVINGS_TRACK)
}

export const calculatePercentageShortOfTarget = goal => {
  return (goal.target_amount - goal.projected_amount) / goal.target_amount
}

export const percentageComplete = goal => {
  //safety check to make sure rendering still occurs if no goal
  if (!goal) return 0

  return Math.floor((progressAmount(goal) / amount(goal)) * 100)
}

export const convertAccountToMetaType = account => {
  return (
    (account.account_subtype &&
      GoalConstants.AccountSubTypeMetaTypeMapping[account.account_subtype]) ||
    (account.account_type && GoalConstants.AccountTypeMetaTypeMapping[account.account_type]) ||
    GoalConstants.MetaTypes.OTHER
  )
}

export const completionDate = goal => {
  let completion

  if (goal.completed_at) {
    completion = moment.unix(goal.completed_at)
  } else if (isProjectedToComplete(goal) || isRetirementGoal(goal)) {
    completion = moment.unix(goal.projected_to_complete_at)
  } else {
    // cap at maximum
    completion = moment().add(GoalConstants.MAX_PROJECTED_YEARS, 'years')
  }

  return completion.toDate()
}

export const createRetirementGoal = () => {
  return {
    accountGuids: [],
    current_amount: 0,
    name: 'Retirement',
    projected_growth_rate: 6.0,
    retirement_age: 65,
    target_amount: null, // no default, make the user choose
    track_type: GoalConstants.TrackTypes.RETIREMENT_TRACK,
  }
}

export const _getProjectedRetirementDate = (retirementAge, user) => {
  return moment
    .unix(user.birthday)
    .add(retirementAge, 'years')
    .unix()
}

export const checkForAccounts = (goals, accounts) => {
  return goals.map(goal => {
    const account = _find(accounts, { guid: goal.account_guid })

    return {
      ...goal,
      error: !account && !goal.completed_at,
    }
  })
}

export const mapRetirementGoal = (retirementGoal, user, accounts) => {
  const retirementAccounts = AccountUtils.getVisibleAccounts(accounts).filter(account =>
    _includes(retirementGoal.accountGuids, account.guid),
  )

  return {
    ...retirementGoal,
    amount: retirementGoal.target_amount,
    error: _isEmpty(retirementAccounts),
    is_complete: retirementGoal.is_completed,
    meta_type: GoalConstants.MetaTypes.RETIREMENT,
    name: 'Retirement',
    position: 1,
    projected_to_complete_at: _getProjectedRetirementDate(retirementGoal.retirement_age, user),
    track_type: GoalConstants.TrackTypes.RETIREMENT_TRACK,
    warning: !isProjectedToComplete(retirementGoal),
  }
}

export const createSavingsGoal = position => {
  return {
    goal_type: GoalConstants.GoalTypes.SAVE,
    position,
    track_type: GoalConstants.TrackTypes.SAVINGS_TRACK,
  }
}

export const cleanUserInput = input => {
  let cleanInput = input.replace(/\D/g, '')

  if (cleanInput !== '') {
    cleanInput = Number(cleanInput)
  }

  return cleanInput
}

export const isAccountAvailable = (goals, account) => {
  return !_find(goals, { account_guid: account.guid, is_complete: false })
}

export const isDebtType = type => {
  return type === GoalConstants.GoalTypes.PAY_OFF
}

export const isDebtGoal = g => {
  return isDebtType(g.goal_type)
}

export const getAccount = (goal, accounts) => {
  return _find(accounts, { guid: goal.account_guid })
}

export const isSaveType = g => {
  return (
    g.goal_type === GoalConstants.GoalTypes.SAVE &&
    g.meta_type !== GoalConstants.MetaTypes.RETIREMENT
  )
}

export const isRetirementGoal = goal => {
  return _has(goal, 'retirement_age')
}

export const isRetirementType = g => {
  return (
    g.goal_type === GoalConstants.GoalTypes.SAVE &&
    g.meta_type === GoalConstants.MetaTypes.RETIREMENT
  )
}

/**
 * The amount the user is aiming to reach.
 * For savings goals it will be a value greater than 0 and for debts it will be 0.
 * @param {Object} goal
 */
export const amount = goal => {
  return isDebtGoal(goal) ? goal.initial_amount || goal.current_amount : goal.amount
}

/**
 * The dollar amount of progress towards the end goal amount.
 * @param {Object} goal
 */
export const progressAmount = goal => {
  if (isDebtGoal(goal)) {
    // initial_amount can be null in which case we don't know the actual progress so 0 is returned
    return goal.initial_amount ? goal.initial_amount - goal.current_amount : 0
  } else {
    return goal.current_amount
  }
}

export const isProjectedToComplete = goal => {
  if (isRetirementGoal(goal)) {
    return goal.projected_amount >= goal.target_amount
  } else {
    if (goal.completed_at) return true
    if (!goal.projected_to_complete_at) return false

    const date = moment.unix(goal.projected_to_complete_at)

    return date.isValid() && date.isBefore(moment().add(GoalConstants.MAX_PROJECTED_YEARS, 'years'))
  }
}

export const nextGoalPosition = (goals, track_type) => {
  const positions = goals.filter(g => g.track_type === track_type).map(g => g.position)

  return (_max(positions) || 0) + 1
}

// TODO: remove use of setTrackType and track_type everywhere once
//       debt goals have been moved to their own service.
export const setTrackType = goal => {
  if (isDebtGoal(goal)) {
    goal.track_type = GoalConstants.TrackTypes.DEBT_TRACK
  } else if (isSaveType(goal)) {
    goal.track_type = GoalConstants.TrackTypes.SAVINGS_TRACK
  } else if (isRetirementType(goal)) {
    goal.track_type = GoalConstants.TrackTypes.RETIREMENT_TRACK
  }
  return goal
}

export const removeAndInsertGoal = (goals, goalToReposition, newPosition) => {
  const dupGoals = _cloneDeep(goals)
  const newGoalArrayPosition = newPosition - 1 // Set position to be 0-indexed
  const indexForGoalToReposition = _findIndex(dupGoals, goalToReposition)

  dupGoals.splice(indexForGoalToReposition, 1)
  dupGoals.splice(newGoalArrayPosition, 0, goalToReposition)

  return dupGoals
}

// Takes goals, goal to update, new position & puts them in correct order
export const reorderGoalsByPosition = (goals, goalToReposition, newPosition) => {
  const sortedGoals = sortGoalPositionForType(goals, goalToReposition.goal_type)
  const orderedGoals = removeAndInsertGoal(sortedGoals, goalToReposition, newPosition)

  return orderedGoals
}

// Takes goals, goal to update, and new position for goal
export const repositionGoals = (goals, goalToReposition, newPosition) => {
  const orderedGoals = reorderGoalsByPosition(goals, goalToReposition, newPosition)
  const updatedGoals = updateGoalPositions(orderedGoals)

  return updatedGoals
}

export const sortGoalPositionForType = (goals, goalType) => {
  const goalsForType = goals.filter(goal => goal.goal_type === goalType)
  const sortedGoals = _sortBy(goalsForType, 'position')

  return sortedGoals
}

export const updateGoalPositions = goals => {
  return goals.map((goal, index) => {
    goal.position = index + 1
    return goal
  })
}

export const sumAllGoalContributions = profile => {
  return (
    profile.amount_allocated_for_savings_goals +
    profile.amount_allocated_for_debt_goals +
    profile.amount_allocated_for_retirement_goals
  )
}

export const sumContributionsOfExistingGoalTypes = (profile, goals, retirementGoal) => {
  const savingsAmount = allSavingsGoals(goals).length
    ? profile.amount_allocated_for_savings_goals
    : 0
  const debtAmount = allDebtGoals(goals).length ? profile.amount_allocated_for_debt_goals : 0

  const retirementAmount = retirementGoal ? profile.amount_allocated_for_retirement_goals : 0

  return savingsAmount + debtAmount + retirementAmount
}

export const numOfNoAccountErrors = (goals, accounts) => {
  const unfinishedGoals = goals.filter(goal => goal.has_been_spent === false)

  return unfinishedGoals.filter(goal => {
    return accounts.filter(account => account.guid === goal.account_guid).length === 0
  }).length
}
