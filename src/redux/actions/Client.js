export const ActionTypes = {
  CLIENT_PROFILE_LOADED: 'client/client_profile_loaded',
  CLIENT_COMMUNICATION_PROFILE_LOADED: 'client/client_communication_profile_loaded',
  CLIENT_LOADED: 'client/client_loaded',
  INITIALIZED_CLIENT_CONFIG: 'client/initialized_client_config',
}

export const initializeClientConfig = config => ({
  type: ActionTypes.INITIALIZED_CLIENT_CONFIG,
  payload: config,
})
