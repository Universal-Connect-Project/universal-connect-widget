import _omit from 'lodash/omit'
import _difference from 'lodash/difference'
import _includes from 'lodash/includes'
import _isEmpty from 'lodash/isEmpty'

import FireflyAPI from '../../utils/FireflyAPI'

export const ActionTypes = {
  RETIREMENT_GOAL_ACCOUNT_CREATED: 'retirementgoal/retirement_goal_account_created',
  RETIREMENT_GOAL_ACCOUNT_DELETED: 'retirementgoal/retirement_goal_account_deleted',
  RETIREMENT_GOAL_CREATED: 'retirementgoal/retirement_goal_created',
  RETIREMENT_GOAL_DELETED: 'retirementgoal/retirement_goal_deleted',
  RETIREMENT_GOAL_UPDATED: 'retirementgoal/retirement_goal_updated',
  RETIREMENT_GOALS_LOADED: 'retirementgoal/retirement_goals_loaded',
}
const setupAction = (type, payload) => ({ type, payload })
const itemAction = (type, item) => setupAction(type, { item })

const createRetirementGoalAccounts = (goalAccounts, dispatch) => {
  const goalAccountPromises = []

  goalAccounts.forEach(goalAccount => {
    goalAccountPromises.push(FireflyAPI.createRetirementGoalAccount(goalAccount))
  })

  return Promise.all(goalAccountPromises).then(
    responses =>
      responses.forEach(response =>
        dispatch(
          itemAction(ActionTypes.RETIREMENT_GOAL_ACCOUNT_CREATED, response.retirement_goal_account),
        ),
      ),
    () => {
      // TODO: dispatch an error action instead
      return dispatch(fetchRetirementGoal())
    },
  )
}

const deleteRetirementGoalAccounts = (goalAccounts, accountGuids, dispatch) => {
  const goalAccountPromises = []

  goalAccounts.forEach(goalAccount => {
    const shouldDeleteGoalAccount = !_includes(accountGuids, goalAccount.account_guid)

    if (shouldDeleteGoalAccount) {
      goalAccountPromises.push(
        FireflyAPI.deleteRetirementGoalAccount(goalAccount).then(() => {
          dispatch(itemAction(ActionTypes.RETIREMENT_GOAL_ACCOUNT_DELETED, goalAccount))
        }),
      )
    }
  })

  return Promise.all(goalAccountPromises).then(
    () => {},
    () => {
      // TODO: dispatch an error action instead
      return dispatch(fetchRetirementGoal())
    },
  )
}

const fetchRetirementGoal = () => dispatch => {
  return Promise.all([
    FireflyAPI.loadRetirementGoals(),
    FireflyAPI.loadRetirementGoalAccounts(),
  ]).then(values => {
    const retirementGoal = values[0].retirement_goals[0] || {}
    const _goalAccounts = values[1].retirement_goal_accounts
    const accountGuids = _goalAccounts.map(ga => ga.account_guid)
    const goal = !_isEmpty(retirementGoal)
      ? { ...retirementGoal, ...{ accountGuids, _goalAccounts } }
      : null

    return dispatch(itemAction(ActionTypes.RETIREMENT_GOALS_LOADED, goal))
  })
}

const buildRetirementGoal = (retirementGoal, accountGuids) => {
  const _goalAccounts = accountGuids.map(account_guid => ({
    account_guid,
    retirement_goal_guid: retirementGoal.guid,
  }))

  return { ...retirementGoal, ...{ accountGuids, _goalAccounts } }
}

const fetchCreateRetirementGoal = goal => dispatch => {
  const { accountGuids } = goal
  //omit fields for API call
  const goalFields = _omit(goal, 'accountGuids', '_goalAccounts')

  return FireflyAPI.createRetirementGoal(goalFields).then(
    response => {
      const retirementGoal = buildRetirementGoal(response.retirement_goal, accountGuids)

      dispatch(itemAction(ActionTypes.RETIREMENT_GOAL_CREATED, retirementGoal))

      return createRetirementGoalAccounts(retirementGoal._goalAccounts, dispatch)
    },
    () => {
      // TODO: dispatch an error action instead
      dispatch(fetchRetirementGoal())
    },
  )
}

const fetchDeleteRetirementGoal = goal => dispatch => {
  return FireflyAPI.deleteRetirementGoal(goal).then(
    () => dispatch(itemAction(ActionTypes.RETIREMENT_GOAL_DELETED, goal)),
    () => {
      // TODO: dispatch an error action instead
      dispatch(fetchRetirementGoal())
    },
  )
}

const fetchUpdateRetirementGoal = goal => dispatch => {
  const { accountGuids, _goalAccounts } = goal
  const currentAccountGuids = _goalAccounts.map(ga => ga.account_guid)
  const retirement_goal_guid = goal.guid
  //omit fields for API call
  const goalFields = _omit(goal, 'accountGuids', '_goalAccounts')

  const goalAccountsToCreate = _difference(accountGuids, currentAccountGuids).map(account_guid => ({
    account_guid,
    retirement_goal_guid,
  }))

  return Promise.all([
    FireflyAPI.updateRetirementGoal(goalFields),
    createRetirementGoalAccounts(goalAccountsToCreate, dispatch),
    deleteRetirementGoalAccounts(_goalAccounts, accountGuids, dispatch),
  ]).then(
    responses => {
      const updateResponse = responses[0]
      const retirementGoal = buildRetirementGoal(updateResponse.retirement_goal, accountGuids)

      dispatch(itemAction(ActionTypes.RETIREMENT_GOAL_UPDATED, retirementGoal))
    },
    () => {
      // TODO: dispatch an error action instead
      dispatch(fetchRetirementGoal())
    },
  )
}

export default dispatch => ({
  createRetirementGoal: goal => dispatch(fetchCreateRetirementGoal(goal)),
  deleteRetirementGoal: goal => dispatch(fetchDeleteRetirementGoal(goal)),
  loadRetirementGoal: () => dispatch(fetchRetirementGoal()),
  updateRetirementGoal: goal => dispatch(fetchUpdateRetirementGoal(goal)),
})
