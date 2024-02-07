import { ActionTypes } from '../actions/Browser'

export default (
  state = { height: 0, isMobile: false, isTablet: false, size: '', width: 0 },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_BROWSER_DIMENSIONS: {
      const { fullHeight, height, isMobile, isTablet, size, trueWidth, width } = action.payload

      return {
        fullHeight,
        height,
        isMobile,
        isTablet,
        size,
        trueWidth,
        width,
      }
    }
    default:
      return state
  }
}
