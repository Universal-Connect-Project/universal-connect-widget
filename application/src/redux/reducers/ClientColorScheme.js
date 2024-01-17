import { ActionTypes as AppActionTypes } from 'reduxify/actions/App'

const { LOAD_MASTER_DATA_SUCCESS } = AppActionTypes

export const defaultState = {
  // The database stores these as primary but TokenProvider expects brand_*
  primary_100: '',
  primary_200: '',
  primary_300: '',
  primary_400: '',
  primary_500: '',
  color_scheme: 'light',
  widget_brand_color: null,
}

// TODO: Replace this with an individual load of the resource.
export const loadMasterDataSuccess = (state, action) => {
  const { client_color_scheme } = action.payload

  if (client_color_scheme) {
    return {
      ...state,
      ...client_color_scheme,
      widgetBrandColor: client_color_scheme.widget_brand_color ?? defaultState.widget_brand_color,
    }
  }

  return state
}

export const clientColorScheme = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_MASTER_DATA_SUCCESS:
      return loadMasterDataSuccess(state, action)
    default:
      return state
  }
}
