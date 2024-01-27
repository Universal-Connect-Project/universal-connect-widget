export const focusElement = element => {
  if (element && 'focus' in element) {
    element.focus()
  }
}
