import theme from '../../constants/Style'
import * as BrowserUtils from '../../utils/Browser'
import StyleUtils from '../../utils/Style'

export const ActionTypes = { SET_BROWSER_DIMENSIONS: 'browser/set_browser_dimensions' }

const updateDimensions = (extraHeightOffset = 0) => {
  const fullHeight = BrowserUtils.getWindowHeight()
  const height = fullHeight - theme.actionBarHeight - extraHeightOffset

  return {
    type: ActionTypes.SET_BROWSER_DIMENSIONS,
    payload: {
      fullHeight,
      height,
      isMobile: BrowserUtils.isMobile(),
      isTablet: BrowserUtils.isTablet(),
      size: StyleUtils.getWindowSize(),
      width: BrowserUtils.getWindowWidth(),
      trueWidth: BrowserUtils.getTrueWindowWidth(),
    },
  }
}

export default dispatch => ({
  updateDimensions: extraHeightOffset => dispatch(updateDimensions(extraHeightOffset)),
})
