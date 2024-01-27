import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { createEpicMiddleware } from 'redux-observable'

import FireflyAPI from '../utils/FireflyAPI'

import { rootEpic } from './epics'

import { address } from './reducers/Address'
import { agreement } from './reducers/Agreement'
import { analytics } from './reducers/Analytics'
import { banner } from './reducers/Banner'
import { budgets } from './reducers/Budgets'
import { budgetsWidget } from './reducers/BudgetsWidget'
import { cashFlow } from './reducers/CashFlow'
import { categories, categoryTotals } from './reducers/Categories'
import {
  client,
  clientCommunicationProfile,
  clientProfile,
  initializedClientConfig,
} from './reducers/Client'
import { clientColorScheme } from './reducers/ClientColorScheme'
import { connect } from './reducers/Connect'
import { connections } from './reducers/Connections'
import { devices } from './reducers/Devices'
import { experiments } from './reducers/Experiments'
import { finstrong } from './reducers/Finstrong'
// import { goals } from './reducers/Goals'
import { help } from './reducers/Help'
import { holdings } from './reducers/Holdings'
import { institutions } from './reducers/Institutions'
import { members } from './reducers/Members'
import { miniSpendingWidget } from './reducers/MiniSpendingWidget'
import { mobileToken } from './reducers/MobileToken'
import { monthlyCashFlowProfile } from './reducers/MonthlyCashFlowProfile'
import { monthlyCategoryTotals } from './reducers/MonthlyCategoryTotals'
import { netWorth } from './reducers/NetWorth'
import { notifications } from './reducers/Notifications'
import { notificationProfile } from './reducers/NotificationProfile'
import { offers } from './reducers/Offers'
import { retirementGoal } from './reducers/RetirementGoal'
import { spendingPlan } from './reducers/SpendingPlan'
import { taggings, tags } from './reducers/Tags'
import { tour } from './reducers/Tour'
import { transactions } from './reducers/Transactions'
import { transactionRules } from './reducers/TransactionRules'
import { trends } from './reducers/Trends'
import { user, userProfile } from './reducers/User'
import { userFeatures } from './reducers/UserFeatures'
import { accounts } from './reducers/Accounts'
import { accountDetailsDrawer } from './reducers/AccountDetailsDrawer'
import { cashFlowWidget } from './reducers/CashFlowWidget'
import { widgetProfile } from './reducers/WidgetProfile'
import { userCommunicationProfile } from './reducers/UserCommunicationProfile'
import { app } from './reducers/App'
import browser from './reducers/Browser'
import componentStacks from './reducers/ComponentStacks'
import localization from './reducers/Localization'
import subscriptions from './reducers/Subscriptions'
import theme from './reducers/Theme'
import transactionsPaginated from './reducers/TransactionsPaginated'

const epicMiddleWare = createEpicMiddleware({
  dependencies: { FireflyAPI },
})

const reducer = combineReducers({
  accounts,
  accountDetailsDrawer,
  address,
  agreement,
  analytics,
  app,
  banner,
  browser,
  budgets,
  budgetsWidget,
  cashFlow,
  cashFlowWidget,
  categories,
  categoryTotals,
  client,
  clientColorScheme,
  clientCommunicationProfile,
  clientProfile,
  componentStacks,
  connect,
  connections,
  devices,
  experiments,
  finstrong,
  help,
  holdings,
  initializedClientConfig,
  institutions,
  localization,
  members,
  mobileToken,
  monthlyCashFlowProfile,
  monthlyCategoryTotals,
  miniSpendingWidget,
  netWorth,
  notifications,
  notificationProfile,
  offers,
  retirementGoal,
  spendingPlan,
  subscriptions,
  taggings,
  tags,
  theme,
  tour,
  transactions,
  transactionRules,
  trends,
  user,
  userCommunicationProfile,
  userFeatures,
  userProfile,
  widgetProfile,
  transactionsPaginated,
})

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware, epicMiddleWare)),
)

// run() must be called _after_ createStore().
epicMiddleWare.run(rootEpic)
export default store
