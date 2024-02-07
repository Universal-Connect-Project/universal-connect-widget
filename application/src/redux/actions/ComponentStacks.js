export const ActionTypes = {
  POP_FOCUS_COMPONENT: 'componentstacks/pop_focus_component',
  POP_SCRIM_COMPONENT: 'componentstacks/pop_scrim_component',
  PUSH_FOCUS_COMPONENT: 'componentstacks/push_focus_component',
  PUSH_SCRIM_COMPONENT: 'componentstacks/push_scrim_component',
  SHIFT_SCRIM_COMPONENT: 'componentstacks/shift_scrim_component',
  UNSHIFT_SCRIM_COMPONENT: 'componentstacks/unshift_scrim_component',
}

export const pushFocusComponentToStack = componentName => ({
  type: ActionTypes.PUSH_FOCUS_COMPONENT,
  payload: componentName,
})

export const popFocusComponentFromStack = () => ({
  type: ActionTypes.POP_FOCUS_COMPONENT,
})

export const pushScrimComponentToStack = componentName => ({
  type: ActionTypes.PUSH_SCRIM_COMPONENT,
  payload: componentName,
})

export const popScrimComponentFromStack = () => ({
  type: ActionTypes.POP_SCRIM_COMPONENT,
})

export const shiftComponentFromStack = () => ({
  type: ActionTypes.SHIFT_SCRIM_COMPONENT,
})

export const unshiftScrimComponentToStack = componentName => ({
  type: ActionTypes.UNSHIFT_SCRIM_COMPONENT,
  payload: componentName,
})
