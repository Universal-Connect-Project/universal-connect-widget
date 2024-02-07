import { createReducer, updateObject } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Budgets'

const {
  BUDGET_DELETED,
  BUDGET_GENERATION_CLEARED,
  BUDGET_SAVED,
  BUDGETS_DELETED_THEN_GENERATED_SUCCESS,
  BUDGETS_GENERATED,
  BUDGETS_LOAD,
  BUDGETS_LOADED,
  BUDGETS_LOADING,
  BUDGETS_SAVE,
  BUDGETS_SAVED,
} = ActionTypes

export const defaultState = {
  generated: false,
  loading: true,
  items: [],
  recalculating: false,
}

const budgetsLoading = state => updateObject(state, { loading: true })
const budgetGenerationCleared = state => updateObject(state, { generated: false })

const budgetsLoaded = (state, action) => {
  return updateObject(state, {
    items: action.payload.items,
    loading: false,
    recalculating: false,
  })
}

const budgetsGenerated = (state, action) => {
  return updateObject(state, {
    items: action.payload.items,
    loading: false,
    recalculating: false,
    generated: true,
  })
}

const budgetSaved = (state, action) => {
  const { item } = action.payload // not using options here
  const newItems = [...state.items.filter(({ guid }) => guid !== item.guid), item]

  return { ...state, items: newItems }
}

const budgetDeleted = (state, action) => {
  const newItems = state.items.filter(budget => budget.guid !== action.payload.item.guid)

  return { ...state, items: newItems }
}

const budgetsSaved = (state, action) => {
  const { items } = action.payload
  const updatedBudgetsGuid = items.map(({ guid }) => guid)
  const newItems = [
    ...items,
    ...state.items.filter(({ guid }) => !updatedBudgetsGuid.includes(guid)),
  ]

  return { ...state, items: newItems }
}

export const budgets = createReducer(defaultState, {
  [BUDGET_DELETED]: budgetDeleted,
  [BUDGETS_GENERATED]: budgetsGenerated,
  [BUDGETS_DELETED_THEN_GENERATED_SUCCESS]: budgetsGenerated,
  [BUDGET_GENERATION_CLEARED]: budgetGenerationCleared,
  [BUDGET_SAVED]: budgetSaved,
  [BUDGETS_LOAD]: budgetsLoading, // Compat alias. Remove.
  [BUDGETS_LOADED]: budgetsLoaded,
  [BUDGETS_LOADING]: budgetsLoading,
  [BUDGETS_SAVED]: budgetsSaved,
  [BUDGETS_SAVE]: budgetsLoading, // Compat alias. Remove.
})
