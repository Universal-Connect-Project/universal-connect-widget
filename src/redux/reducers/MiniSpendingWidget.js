const { createReducer } = require('../../utils/Reducer')

const {
  NEW_SPENDING_DATA_AVAILABLE,
  SYNC_MINI_SPENDING_DATA,
  SPENDING_DATA_SYNC_COMPLETE,
} = require('../actions/miniSpending').ActionTypes

export const defaultState = {
  newDataAvailable: false,
  syncing: false,
}

const updateSpendingDataAvailable = state => ({
  ...state,
  newDataAvailable: true,
})

const initializeSync = state => ({
  ...state,
  syncing: true,
})

const noSpendingDataAvailable = state => ({
  ...state,
  newDataAvailable: false,
  syncing: false,
})

export const miniSpendingWidget = createReducer(defaultState, {
  [NEW_SPENDING_DATA_AVAILABLE]: updateSpendingDataAvailable,
  [SYNC_MINI_SPENDING_DATA]: initializeSync,
  [SPENDING_DATA_SYNC_COMPLETE]: noSpendingDataAvailable,
})
