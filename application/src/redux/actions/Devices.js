import FireflyAPI from '../../utils/FireflyAPI'

const ActionTypes = {
  DEVICES_LOADED: 'devices/devices_loaded',
  DEVICES_LOADING: 'devices/devices_loading',
  DEVICE_SAVED: 'devices/device_saved',
  DEVICE_DELETED: 'devices/device_deleted',
}

const loadDevices = () => dispatch => {
  dispatch({ type: ActionTypes.DEVICES_LOADING })
  return FireflyAPI.loadDevices().then(devices =>
    dispatch({
      type: ActionTypes.DEVICES_LOADED,
      payload: { devices: devices.map(device => device.device) },
    }),
  )
}

const deleteDevice = device => dispatch =>
  FireflyAPI.deleteDevice(device).then(() =>
    dispatch({ type: ActionTypes.DEVICE_DELETED, payload: { device } }),
  )

const saveDevice = device => dispatch =>
  FireflyAPI.saveDevice(device).then(() =>
    dispatch({ type: ActionTypes.DEVICE_SAVED, payload: { device } }),
  )

const dispatcher = dispatch => ({
  loadDevices: () => dispatch(loadDevices()),
  deleteDevice: device => dispatch(deleteDevice(device)),
  saveDevice: device => dispatch(saveDevice(device)),
})

export { ActionTypes, dispatcher }
