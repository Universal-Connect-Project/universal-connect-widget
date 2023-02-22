import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Institutions'
import { ActionTypes as AccountActionTypes } from '../actions/Accounts'
import { ActionTypes as ConnectActionTypes } from '../actions/Connect'

const {
  ACCOUNTS_INSTITUTION_LOADED,
  ACCOUNTS_INSTITUTIONS_LOADED,
  ACCOUNTS_INSTITUTIONS_LOADING,
  CONNECT_INSTITUTIONS_LOADING,
  CONNECT_INSTITUTIONS_LOADED,
  CONNECT_INSTITUTIONS_RESET,
  POPULAR_INSTITUTIONS_LOADED,
  POPULAR_INSTITUTIONS_LOADING,
  DISCOVERED_INSTITUTIONS_LOADED,
  DISCOVERED_INSTITUTIONS_LOADING,
  RESET_ACCOUNTS_INSTITUTION,
  RESET_ACCOUNTS_INSTITUTIONS,
  SELECT_ACCOUNTS_INSTITUTION,
} = ActionTypes

export const defaultState = {
  connectInstitution: {},
  connectInstitutions: [],
  connectInstitutionsLoading: false,
  accountsInstitutions: [],
  popularInstitutions: [],
  discoveredInstitutions: [],
  popularInstitutionsLoading: false,
  discoveredInstitutionsLoading: false,
  accountsInstitutionsLoading: false,
}

const connectInstitutionsLoaded = (state, action) => ({
  ...state,
  connectInstitutions: action.payload.connectInstitutions,
  connectInstitutionsLoading: false,
})

const connectInstitutionsLoading = (state, action) => ({
  ...state,
  connectInstitutionsLoading: action.payload ? action.payload.loading : true,
})

const loadAccountsInstitutions = (state, action) => ({
  ...state,
  accountsInstitutions: action.payload.accountsInstitutions,
  accountsInstitutionsLoading: false,
})

const loadAccountsInstitution = (state, action) => {
  const connectInstitution = {
    ...action.payload.item,
    credentials: action.payload.item.credentials.map(credential => credential.credential),
  }

  return {
    ...state,
    connectInstitution,
    accountsInstitutions: [
      ...state.accountsInstitutions.filter(i => i.guid !== action.payload.item.guid),
      connectInstitution,
    ],
  }
}

const accountsInstitutionsLoading = (state, action) => ({
  ...state,
  accountsInstitutionsLoading: action.payload ? action.payload.loading : true,
})

const popularInstitutionsLoading = state => ({ ...state, popularInstitutionsLoading: true })

const popularInstitutionsLoaded = (state, action) => ({
  ...state,
  popularInstitutionsLoading: false,
  popularInstitutions: action.payload.popularInstitutions,
})

const discoveredInstitutionsLoading = state => ({ ...state, discoveredInstitutionsLoading: true })

const discoveredInstitutionsLoaded = (state, action) => ({
  ...state,
  discoveredInstitutionsLoading: false,
  discoveredInstitutions: action.payload.discoveredInstitutions,
})

const resetAccountsInstitution = state => ({
  ...state,
  connectInstitution: {},
  accountsInstitutionsLoading: false,
})

const connectInstitutionsReset = state => ({
  ...state,
  connectInstitutions: [],
  connectInstitutionsLoading: false,
})
const resetAccountsInstitutions = state => ({
  ...state,
  accountsInstitutions: [],
  accountsInstitutionsLoading: false,
})

const selectAccountsInstitution = (state, action) => ({
  ...state,
  connectInstitution: action.payload.item,
})

/**
 * When a manual account is added and there is an institution with it, add it
 * to the accounts items.
 */
const addManualAccount = (state, { payload }) => {
  if (payload && payload.institution) {
    return {
      ...state,
      accountsInstitutions: [
        ...state.accountsInstitutions.filter(i => i.guid !== payload.institution.guid),
        payload.institution,
      ],
    }
  }

  return state
}

export const institutions = createReducer(defaultState, {
  [ACCOUNTS_INSTITUTION_LOADED]: loadAccountsInstitution,
  [ACCOUNTS_INSTITUTIONS_LOADED]: loadAccountsInstitutions,
  [CONNECT_INSTITUTIONS_LOADING]: connectInstitutionsLoading,
  [CONNECT_INSTITUTIONS_LOADED]: connectInstitutionsLoaded,
  [CONNECT_INSTITUTIONS_RESET]: connectInstitutionsReset,
  [ACCOUNTS_INSTITUTIONS_LOADING]: accountsInstitutionsLoading,
  [POPULAR_INSTITUTIONS_LOADED]: popularInstitutionsLoaded,
  [POPULAR_INSTITUTIONS_LOADING]: popularInstitutionsLoading,
  [RESET_ACCOUNTS_INSTITUTION]: resetAccountsInstitution,
  [RESET_ACCOUNTS_INSTITUTIONS]: resetAccountsInstitutions,
  [DISCOVERED_INSTITUTIONS_LOADED]: discoveredInstitutionsLoaded,
  [DISCOVERED_INSTITUTIONS_LOADING]: discoveredInstitutionsLoading,
  [SELECT_ACCOUNTS_INSTITUTION]: selectAccountsInstitution,
  [AccountActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: addManualAccount,
  [ConnectActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: addManualAccount,
})
