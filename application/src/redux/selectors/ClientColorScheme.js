import _get from 'lodash/get'
import _every from 'lodash/every'
import { createSelector } from 'reselect'

import StyleUtils from '../../utils/Style'

export const getClientColorScheme = state =>
  _get(state, 'initializedClientConfig.color_scheme') ||
  _get(state, 'clientColorScheme.color_scheme')

export const getNewClientColors = state => ({
  Brand100: state.clientColorScheme.primary_100,
  Brand200: state.clientColorScheme.primary_200,
  Brand300: state.clientColorScheme.primary_300,
  Brand400: state.clientColorScheme.primary_400,
  Brand500: state.clientColorScheme.primary_500,
})

// This should only be used in conjuction with the TokenProvider to accomodate custom brand color via `widget_brand_color`.
export const getOldClientColors = state => {
  // `primary` can be the old blue or set in Batcave>Client>Client Color Scheme>Widget Brand Color
  const primary = _get(state, 'theme.Colors.PRIMARY')

  // If primary is the old blue, return no brand(will use Kyper tokens)
  if (primary === '#359BCF') {
    return {}
  }

  return {
    Brand100: '#F8F9FB', // We couldn't come up with a consistent good looking color with the proper aspect ratio. Defaults to Neutral_100.
    Brand200: StyleUtils.adjustColor(primary, +15),
    Brand300: primary,
    Brand400: StyleUtils.adjustColor(primary, -15),
    Brand500: StyleUtils.adjustColor(primary, -30),
  }
}

export const getTokenProviderValues = createSelector(
  getClientColorScheme,
  getNewClientColors,
  getOldClientColors,
  (theme, newColors, oldColors) => {
    // If we have all the new client colors from the database, use the new colors
    const hasNewColors = _every(Object.values(newColors), color => !!color)

    if (hasNewColors) {
      return {
        tokenOverrides: {
          Color: {
            ...newColors,
          },
        },
        theme,
      }
    }

    return {
      tokenOverrides: {
        Color: {
          ...oldColors,
        },
      },
      theme,
    }
  },
)
