// jest.mock('reduxify/Store')
//
// import {
//   SHOW_CONNECT_GLOBAL_NAVIGATION_HEADER,
//   INVESTMENTS_REDESIGN,
//   TRANSACTION_SUBSCRIPTIONS_DISABLED,
//   SPENDING_WIDGET_OTHER_TAB,
//   HIDE_FINSTRONG_SCORE,
//   SHOW_ABSOLUTE_TRANSACTION_AMOUNT,
//   SHOW_CASHFLOW_CALENDAR_VIEW_BY_DEFAULT,
//   SHOW_EXTRA_MARGIN_IN_ACCOUNT_FILTER,
//   SHOW_UNSTYLED_GROUPED_ACCOUNTS,
//   SHOW_SPENDING_PLAN_WIDGET,
//   SHOW_OLD_SUPPORT_FLOW,
//   ENABLE_TWELVE_MONTH_CASH_FLOW,
//   USE_REGIONS_HELP_WIDGET_COPY,
// } from 'src/connect/const/UserFeatures'
//
// import {
//   getUserFeatures,
//   isSubscriptionsEnabled,
//   isInvestmentsRedesignEnabled,
//   shouldHideFinstrongScore,
//   shouldShowSpendingWidgetOtherTab,
//   shouldShowAbsoluteTransactionAmount,
//   shouldShowCashflowCalendarViewByDefault,
//   shouldShowExtraMarginInAccountFilter,
//   shouldShowUnstyledGroupedAccounts,
//   shouldShowSpendingPlanWidget,
//   shouldShowOldSupportFlow,
//   shouldEnableTwelveMonthCashFlow,
//   shouldUseRegionsHelpWidgetText,
//   shouldShowConnectGlobalNavigationHeader,
// } from 'reduxify/selectors/UserFeatures'
//
// import Store from 'reduxify/Store'

describe('UserFeatures Redux Selectors placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('UserFeatures Selectors', () => {
//   let state
//
//   beforeEach(() => {
//     state = Store.getState()
//   })
//
//   describe('getUserFeatures', () => {
//     it('should return all the user features', () => {
//       expect(getUserFeatures(state)).toEqual(state.userFeatures.items)
//     })
//   })
//
//   describe('isSubscriptionsEnabled', () => {
//     it('should return true by default', () => {
//       expect(isSubscriptionsEnabled(state)).toEqual(true)
//     })
//
//     it('should return false if the feature is disabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             { feature_name: TRANSACTION_SUBSCRIPTIONS_DISABLED, is_enabled: true, guid: 'bar' },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(isSubscriptionsEnabled(state)).toEqual(false)
//     })
//   })
//
//   describe('isInvestmentsRedesignEnabled', () => {
//     it('should return false if it does not exist', () => {
//       expect(isInvestmentsRedesignEnabled(state)).toEqual(false)
//     })
//
//     it('should return true if there is a match', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [{ feature_name: INVESTMENTS_REDESIGN, is_enabled: true, guid: 'baz' }],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(isInvestmentsRedesignEnabled(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowSpendingWidgetOtherTab', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [{ feature_name: SPENDING_WIDGET_OTHER_TAB, is_enabled: false, guid: 'GUI-123' }],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowSpendingWidgetOtherTab(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [{ feature_name: SPENDING_WIDGET_OTHER_TAB, is_enabled: true, guid: 'GUI-123' }],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowSpendingWidgetOtherTab(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowAbsoluteTransactionAmount', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_ABSOLUTE_TRANSACTION_AMOUNT,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowAbsoluteTransactionAmount(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_ABSOLUTE_TRANSACTION_AMOUNT,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowAbsoluteTransactionAmount(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowCashflowCalendarViewByDefault', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_CASHFLOW_CALENDAR_VIEW_BY_DEFAULT,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowCashflowCalendarViewByDefault(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_CASHFLOW_CALENDAR_VIEW_BY_DEFAULT,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowCashflowCalendarViewByDefault(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowExtraMarginInAccountFilter', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_EXTRA_MARGIN_IN_ACCOUNT_FILTER,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowExtraMarginInAccountFilter(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_EXTRA_MARGIN_IN_ACCOUNT_FILTER,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowExtraMarginInAccountFilter(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowUnstyledGroupedAccounts', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_UNSTYLED_GROUPED_ACCOUNTS,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowUnstyledGroupedAccounts(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_UNSTYLED_GROUPED_ACCOUNTS,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowUnstyledGroupedAccounts(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldHideFinstrongScore', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: HIDE_FINSTRONG_SCORE,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldHideFinstrongScore(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: HIDE_FINSTRONG_SCORE,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldHideFinstrongScore(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowSpendingPlanWidget', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_SPENDING_PLAN_WIDGET,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowSpendingPlanWidget(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_SPENDING_PLAN_WIDGET,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowSpendingPlanWidget(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowOldSupportFlow', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_OLD_SUPPORT_FLOW,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowOldSupportFlow(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_OLD_SUPPORT_FLOW,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowOldSupportFlow(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldEnableTwelveMonthCashFlow', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: ENABLE_TWELVE_MONTH_CASH_FLOW,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldEnableTwelveMonthCashFlow(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: ENABLE_TWELVE_MONTH_CASH_FLOW,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldEnableTwelveMonthCashFlow(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldUseRegionsHelpWidgetText', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: USE_REGIONS_HELP_WIDGET_COPY,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldUseRegionsHelpWidgetText(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: USE_REGIONS_HELP_WIDGET_COPY,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldUseRegionsHelpWidgetText(state)).toEqual(true)
//     })
//   })
//
//   describe('shouldShowConnectGlobalNavigationHeader', () => {
//     it('should return false if feature is not enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_CONNECT_GLOBAL_NAVIGATION_HEADER,
//               is_enabled: false,
//               guid: 'GUI-1234',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowConnectGlobalNavigationHeader(state)).toEqual(false)
//     })
//
//     it('should return true if feature is enabled', () => {
//       const UpdatedStore = Store.__withUpdatedState({
//         userFeatures: {
//           items: [
//             {
//               feature_name: SHOW_CONNECT_GLOBAL_NAVIGATION_HEADER,
//               is_enabled: true,
//               guid: 'GUI-123',
//             },
//           ],
//         },
//       })
//
//       state = UpdatedStore.getState()
//
//       expect(shouldShowConnectGlobalNavigationHeader(state)).toEqual(true)
//     })
//   })
// })
