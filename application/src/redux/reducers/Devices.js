import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Devices'

const { DEVICES_LOADING, DEVICES_LOADED, DEVICE_SAVED, DEVICE_DELETED } = ActionTypes

const defaultState = {
  items: [],
  loading: true,
}

const devicesLoading = state => {
  return {
    ...state,
    loading: true,
  }
}

const devicesLoaded = (state, action) => {
  return {
    ...state,
    loading: false,
    items: action.payload.devices,
  }
}

const deviceSaved = (state, action) => ({
  ...state,
  items: state.items.map(item =>
    item.guid === action.payload.device.guid ? action.payload.device : item,
  ),
})

const deviceDeleted = (state, action) => ({
  ...state,
  items: state.items.filter(item => item.guid !== action.payload.device.guid),
})

const devices = createReducer(defaultState, {
  [DEVICES_LOADING]: devicesLoading,
  [DEVICES_LOADED]: devicesLoaded,
  [DEVICE_SAVED]: deviceSaved,
  [DEVICE_DELETED]: deviceDeleted,
})

export { devices, defaultState }
