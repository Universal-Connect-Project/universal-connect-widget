import StyleConstants from '../../constants/Style'
import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Theme'
import { ActionTypes as AppActionTypes } from '../actions/App'

const { CONFIG_THEME_LOADED } = ActionTypes
const { LOAD_MASTER_DATA_SUCCESS } = AppActionTypes

const getDefaultTheme = () => {
  const defaultTheme = {}

  for (const key in StyleConstants) {
    if (StyleConstants.hasOwnProperty(key) && typeof StyleConstants[key] !== 'function') {
      defaultTheme[key] = StyleConstants[key]
    }
  }

  return defaultTheme
}

const loadMasterDataSuccess = (state, action) => {
  const { client_color_scheme } = action.payload

  // We only want to over write PRIMARY if it wasn't set by the client configuration
  if (
    client_color_scheme &&
    state.Colors.PRIMARY === StyleConstants.Colors.PRIMARY &&
    client_color_scheme.widget_brand_color
  ) {
    return {
      ...state,
      Colors: {
        ...state.Colors,
        PRIMARY: client_color_scheme.widget_brand_color,
      },
    }
  }

  return state
}

const configThemeLoaded = (state, action) => {
  const { colors } = action.payload
  const mappedColors = {}

  for (const key in colors) {
    if (state.Colors.hasOwnProperty(key.toUpperCase())) {
      mappedColors[key.toUpperCase()] = colors[key]
    }
  }

  return {
    ...state,
    Colors: {
      ...state.Colors,
      ...mappedColors,
    },
  }
}

export default createReducer(getDefaultTheme(), {
  [LOAD_MASTER_DATA_SUCCESS]: loadMasterDataSuccess,
  [CONFIG_THEME_LOADED]: configThemeLoaded,
})
