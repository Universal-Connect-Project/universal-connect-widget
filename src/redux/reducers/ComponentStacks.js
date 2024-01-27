import { ActionTypes } from '../actions/ComponentStacks'
import { createReducer } from '../../utils/Reducer'

const {
  POP_FOCUS_COMPONENT,
  POP_SCRIM_COMPONENT,
  PUSH_FOCUS_COMPONENT,
  PUSH_SCRIM_COMPONENT,
  SHIFT_SCRIM_COMPONENT,
  UNSHIFT_SCRIM_COMPONENT,
} = ActionTypes

export const defaultState = {
  scrimStack: [],
  focusStack: [],
}

const popFocusStack = state => ({
  ...state,
  focusStack: state.focusStack.slice(0, -1),
})

const pushFocusStack = (state, action) => ({
  ...state,
  focusStack: [...state.focusStack, action.payload],
})

const pushScrimStack = (state, action) => ({
  ...state,
  focusStack: [...state.focusStack, action.payload],
  scrimStack: [...state.scrimStack, action.payload],
})

const popScrimStack = state => ({
  ...state,
  focusStack: state.focusStack.slice(0, -1),
  scrimStack: state.scrimStack.slice(0, -1),
})

const shiftScrimStack = state => ({
  ...state,
  focusStack: state.focusStack.slice(1),
  scrimStack: state.scrimStack.slice(1),
})

const unshiftScrimStack = (state, action) => ({
  ...state,
  focusStack: [action.payload, ...state.focusStack],
  scrimStack: [action.payload, ...state.scrimStack],
})

export default createReducer(defaultState, {
  [POP_FOCUS_COMPONENT]: popFocusStack,
  [POP_SCRIM_COMPONENT]: popScrimStack,
  [PUSH_FOCUS_COMPONENT]: pushFocusStack,
  [PUSH_SCRIM_COMPONENT]: pushScrimStack,
  [SHIFT_SCRIM_COMPONENT]: shiftScrimStack,
  [UNSHIFT_SCRIM_COMPONENT]: unshiftScrimStack,
})
