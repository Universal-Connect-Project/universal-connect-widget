import keycode from 'keycode'

export const isEnterOrSpaceKey = e => ['enter', 'space'].includes(keycode(e))
export const isEnterKey = e => ['enter'].includes(keycode(e))
export const isEscapeKey = e => ['esc'].includes(keycode(e))
export const isLeftOrUpKey = e => ['left', 'up'].includes(keycode(e))
export const isRightOrDownKey = e => ['right', 'down'].includes(keycode(e))
export const isSpaceKey = e => ['space'].includes(keycode(e))

/**
 * Some components add a listener to the window or document. For example, AccountDetails
 * adds a 'keyup' listener for arrow key traversal through the accounts. The only way to
 * prevent that global listener from firing from a React component listener is to call
 * stopImmediatePropagation on the native event and stopPropagation and preventDefault
 * on the synthetic event.
 */
export const preventDefaultAndStopAllPropagation = event => {
  event.preventDefault()
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()
}
