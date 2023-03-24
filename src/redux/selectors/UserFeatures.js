import { createSelector } from 'reselect'

import {
  ENABLE_TWELVE_MONTH_CASH_FLOW,
  GOALS_NOTIFICATIONS,
  GOALS_WIDGET_REDESIGN,
  HAS_MINI_FINSTRONG_POST_MESSAGES,
  HELP_SECTION_REDIRECT,
  HIDE_CONNECT_FUNCTIONALITY,
  HIDE_FINSTRONG_SCORE,
  INVESTMENTS_REDESIGN,
  SPENDING_WIDGET_OTHER_TAB,
  SHOW_ABSOLUTE_TRANSACTION_AMOUNT,
  SHOW_ACCOUNTS_AGGREGATION_CTA,
  SHOW_CARTOGRAPHER_TRANSACTIONS_WIDGET,
  SHOW_CASHFLOW_CALENDAR_VIEW_BY_DEFAULT,
  SHOW_EXTRA_MARGIN_IN_ACCOUNT_FILTER,
  SHOW_FINSTRONG_CAROUSEL,
  SHOW_FINSTRONG_RECATEGORIZATION,
  SHOW_FINSTRONG_SAVINGS_FIRST,
  SHOW_FINSTRONG_WIDGET,
  SHOW_NEW_EXISTING_MEMBER_ENHANCEMENT,
  SHOW_SPENDING_PLAN_WIDGET,
  SHOW_OLD_SUPPORT_FLOW,
  SHOW_UNSTYLED_GROUPED_ACCOUNTS,
  TRANSACTION_SUBSCRIPTIONS_DISABLED,
  USE_REGIONS_HELP_WIDGET_COPY,
} from '../../constants/UserFeatures'

import * as UserFeatures from '../../utils/UserFeatures'

const getGoalsRedesignWidgetProfileFlagEnabled = state => state.widgetProfile.enable_goals_redesign

export const getUserFeatures = state => state.userFeatures.items

export const isSubscriptionsEnabled = createSelector(getUserFeatures, userFeatures => {
  return !UserFeatures.isFeatureEnabled(userFeatures, TRANSACTION_SUBSCRIPTIONS_DISABLED)
})

export const hideConnectFunctionality = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, HIDE_CONNECT_FUNCTIONALITY)
})

export const isGoalsRedesignEnabled = createSelector(
  getUserFeatures,
  getGoalsRedesignWidgetProfileFlagEnabled,
  (userFeatures, goalsRedesignEnabled) => {
    return (
      UserFeatures.isFeatureEnabled(userFeatures, GOALS_WIDGET_REDESIGN) || goalsRedesignEnabled
    )
  },
)

export const isInvestmentsRedesignEnabled = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, INVESTMENTS_REDESIGN)
})

export const shouldShowFinstrongWidget = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_FINSTRONG_WIDGET)
})

export const shouldShowFinstrongRecategorization = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_FINSTRONG_RECATEGORIZATION)
})

export const shouldShowFinstrongCarousel = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_FINSTRONG_CAROUSEL)
})

export const shouldHideFinstrongScore = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, HIDE_FINSTRONG_SCORE)
})

export const isGoalsNotificationsEnabled = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, GOALS_NOTIFICATIONS)
})

export const isAccountAggregationCtaEnabled = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_ACCOUNTS_AGGREGATION_CTA)
})

// AB TEST https://gitlab.mx.com/mx/moneymap/-/issues/2565
export const showSavingsIndicatorFirstExperiment = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_FINSTRONG_SAVINGS_FIRST)
})

export const shouldHelpSectionRedirect = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, HELP_SECTION_REDIRECT)
})

export const shouldShowSpendingWidgetOtherTab = createSelector(getUserFeatures, userFeatures =>
  UserFeatures.isFeatureEnabled(userFeatures, SPENDING_WIDGET_OTHER_TAB),
)

export const shouldShowUnstyledGroupedAccounts = createSelector(getUserFeatures, userFeatures =>
  UserFeatures.isFeatureEnabled(userFeatures, SHOW_UNSTYLED_GROUPED_ACCOUNTS),
)

export const isShowNewExistingMemberEnhancementEnabled = createSelector(
  getUserFeatures,
  userFeatures => {
    return UserFeatures.isFeatureEnabled(userFeatures, SHOW_NEW_EXISTING_MEMBER_ENHANCEMENT)
  },
)

export const hasMiniFinstrongPostMessagingEnabled = createSelector(
  getUserFeatures,
  userFeatures => {
    return UserFeatures.isFeatureEnabled(userFeatures, HAS_MINI_FINSTRONG_POST_MESSAGES)
  },
)

export const shouldShowCartographerTransactionsWidget = createSelector(
  getUserFeatures,
  userFeatures => {
    return UserFeatures.isFeatureEnabled(userFeatures, SHOW_CARTOGRAPHER_TRANSACTIONS_WIDGET)
  },
)

export const shouldShowCashflowCalendarViewByDefault = createSelector(
  getUserFeatures,
  userFeatures => {
    return UserFeatures.isFeatureEnabled(userFeatures, SHOW_CASHFLOW_CALENDAR_VIEW_BY_DEFAULT)
  },
)

export const shouldShowAbsoluteTransactionAmount = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_ABSOLUTE_TRANSACTION_AMOUNT)
})

export const shouldShowExtraMarginInAccountFilter = createSelector(
  getUserFeatures,
  userFeatures => {
    return UserFeatures.isFeatureEnabled(userFeatures, SHOW_EXTRA_MARGIN_IN_ACCOUNT_FILTER)
  },
)

export const shouldShowSpendingPlanWidget = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_SPENDING_PLAN_WIDGET)
})

export const shouldShowOldSupportFlow = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, SHOW_OLD_SUPPORT_FLOW)
})

export const shouldEnableTwelveMonthCashFlow = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, ENABLE_TWELVE_MONTH_CASH_FLOW)
})

export const shouldUseRegionsHelpWidgetText = createSelector(getUserFeatures, userFeatures => {
  return UserFeatures.isFeatureEnabled(userFeatures, USE_REGIONS_HELP_WIDGET_COPY)
})
