import _merge from 'lodash/merge'
import { StyleUtils } from 'mx-react-components'
import StyleConstants from '../constants/Style'

const Style = _merge({}, StyleUtils, StyleConstants, {
  // HACK: tempororary until we can update all uses of getWindowSize
  getWindowSize: (breakpoints = StyleConstants.BreakPoints) =>
    StyleUtils.getWindowSize(breakpoints),

  getMiniWidgetDimension: ({ height, width }) => {
    if (height > 400 && width > 460) return StyleConstants.MiniWidgetDimensions.NOT_FOUND
    if (height < 400 && width >= 400) return StyleConstants.MiniWidgetDimensions.LANDSCAPE
    if (height <= 320 && width <= 180) return StyleConstants.MiniWidgetDimensions.MINIPORTRAIT
    if (height <= 400 && width <= 250) return StyleConstants.MiniWidgetDimensions.PORTRAIT

    return StyleConstants.MiniWidgetDimensions.STANDARD
  },

  getSvgMaxWidth: ({ height, width }, miniSvgWidth, maxSvgWidth, customStyle) => {
    const widgetDimension = Style.getMiniWidgetDimension({ height, width })
    const isMiniLandscape = widgetDimension === StyleConstants.MiniWidgetDimensions.LANDSCAPE
    const isMiniPortrait = widgetDimension === StyleConstants.MiniWidgetDimensions.MINIPORTRAIT

    let maxWidth = isMiniLandscape || isMiniPortrait ? miniSvgWidth : maxSvgWidth

    if (customStyle && customStyle.width) maxWidth = customStyle.width

    return maxWidth
  },

  validateZChange: ({ z, times }) => {
    if (!times || times >= 10 || times <= 0) throw new Error('Times out of bounds for z index')
    if (!z && z !== 0) throw new Error('Unsupported Z Index Constant')
  },

  incrementZ: ({ z, times }) => {
    try {
      Style.validateZChange({ z, times })
      return z + times * 10
    } catch {
      return 'initial'
    }
  },

  /**
   * We can't use the imported Style constants
   * here because then the clients theme is
   * not applied. We have to take theme as an
   * argument in the call.
   *
   * If these thresholds (100, 80) are changed
   * please also update in utils/Budget.js
   * getProgressText function
   */
  PercentageColor(percentage, theme) {
    if (percentage > 100) {
      return theme.Colors.DANGER
    } else if (percentage > 80) {
      return theme.Colors.WARNING
    } else {
      return theme.Colors.SUCCESS
    }
  },

  /**
   * We can't use the imported Style constants
   * here because then the clients theme is
   * not applied. We have to take theme as an
   * argument in the call.
   *
   * If these thresholds (100, 80) are changed
   * please also update in utils/Budget.js
   * getProgressText function
   */
  MercuryColor(percentage, theme) {
    if (percentage > 100) {
      return theme.Colors.LIGHT_DANGER
    } else if (percentage > 80) {
      return theme.Colors.LIGHT_WARNING
    } else {
      return theme.Colors.LIGHT_SUCCESS
    }
  },
})

export default Style
