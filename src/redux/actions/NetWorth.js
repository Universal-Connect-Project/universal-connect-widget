import * as NetWorthUtils from '../../utils/NetWorth'
import { getSortedAccountsWithMembers } from '../../utils/Account'
import { setupAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  NET_WORTH_ACCOUNT_SELECTED: 'networth/account_selected',
  NET_WORTH_DATA_LOADED: 'networth/data_loaded',
  NET_WORTH_DATA_ERROR: 'networth/data_error',
  NET_WORTH_EDIT_MANUAL_ACCOUNT: 'networth/edit_manual_account',
  NET_WORTH_MONTH_OPTION_UPDATED: 'networth/month_option_updated',
  NET_WORTH_MONTH_HIGHLIGHTED: 'networth/month_highlighted',
  NET_WORTH_MONTH_SELECTED: 'networth/month_selected',
  NET_WORTH_DATA_LOADING: 'networth/data_loading',
  NET_WORTH_SAVE_ACCOUNT: 'networth/save_account',
  NET_WORTH_SAVE_ACCOUNT_SUCCESS: 'networth/save_account_success',
  NET_WORTH_SAVE_ACCOUNT_ERROR: 'networth/save_account_error',
}

import { EXP_USE_HISTORICAL_ACCOUNT_BALANCES } from '../../constants/Experiments'
import { getExperimentNamesToUserVariantMap } from '../selectors/Experiments'
import FireflyAPI from '../../utils/FireflyAPI'

//sets items on Members
//sets items on Accounts
//clears items on Transactions
//sets assetsAndLiabilities, loading, and monthlyAccountBalances on NetWorth
const loadNetWorthData = () => (dispatch, getState) => {
  const experiments = getExperimentNamesToUserVariantMap(getState())
  const isNetWorthExperimentRunning = !!experiments[EXP_USE_HISTORICAL_ACCOUNT_BALANCES]

  dispatch({ type: ActionTypes.NET_WORTH_DATA_LOADING })
  return FireflyAPI.loadNetWorthData(isNetWorthExperimentRunning).then(response => {
    const { accounts, members } = response
    const sortedAccountsWithMembers = getSortedAccountsWithMembers(accounts, members)

    dispatch(
      setupAction(ActionTypes.NET_WORTH_DATA_LOADED, {
        accounts: sortedAccountsWithMembers,
        loading: false,
        members: response.members,
        monthlyAccountBalances: response.monthlyAccountBalances,
      }),
    )
  })
}

export const saveAccount = account => dispatch =>
  dispatch({ type: ActionTypes.NET_WORTH_SAVE_ACCOUNT, payload: account })

export const editManualNetWorthAccount = account => dispatch =>
  dispatch({
    type: ActionTypes.NET_WORTH_EDIT_MANUAL_ACCOUNT,
    payload: account,
  })

export const dispatcher = dispatch => ({
  loadNetWorthData: () => dispatch(loadNetWorthData()),
  highLightMonth: highLightedMonth =>
    dispatch(setupAction(ActionTypes.NET_WORTH_MONTH_HIGHLIGHTED, highLightedMonth)),
  selectMonth: selectedMonth =>
    dispatch(setupAction(ActionTypes.NET_WORTH_MONTH_SELECTED, selectedMonth)),
  selectAccount: selectedAccount =>
    dispatch(setupAction(ActionTypes.NET_WORTH_ACCOUNT_SELECTED, { selectedAccount })),
  // TODO: make updateMonthOption and updateWindowWidth single action
  updateMonthOption: (data, browserSize) =>
    dispatch(
      setupAction(ActionTypes.NET_WORTH_MONTH_OPTION_UPDATED, {
        margins: {
          ...data.margins,
          svgScale: NetWorthUtils.getSvgScale(data.numberOfMonths, browserSize),
        },
        numberOfMonths: data.numberOfMonths,
      }),
    ),
})

export default dispatcher
