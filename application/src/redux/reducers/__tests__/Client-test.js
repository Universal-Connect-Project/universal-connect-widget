import { ActionTypes as ClientActionTypes, initializeClientConfig } from 'reduxify/actions/Client'
import { ActionTypes as AppActionTypes } from 'reduxify/actions/App'

import {
  client as clientReducer,
  clientProfile as clientProfileReducer,
  initializedClientConfig as initializedReducer,
  defaultClientConfig,
} from 'reduxify/reducers/Client'

const { LOAD_MASTER_DATA_SUCCESS } = AppActionTypes
const { CLIENT_LOADED, CLIENT_PROFILE_LOADED } = ClientActionTypes

describe('Client related reducers', () => {
  describe('Client reducer', () => {
    it('should have a default empty state', () => {
      expect(clientReducer(undefined, {})).toEqual({})
    })

    describe('CLIENT_LOADED', () => {
      it('should set the payload of the action on state', () => {
        const action = {
          type: CLIENT_LOADED,
          payload: {
            foo: 'bar',
          },
        }

        expect(clientReducer(undefined, action).foo).toEqual('bar')
      })
    })

    describe('LOAD_MASTER_DATA_SUCCESS', () => {
      it('should update if the master data provides the key', () => {
        const client = { guid: 'CLT-1' }
        const action = {
          type: LOAD_MASTER_DATA_SUCCESS,
          payload: {
            client,
          },
        }

        expect(clientReducer(undefined, action).guid).toEqual('CLT-1')
      })

      it('should not update if the master data request is missing the key', () => {
        const action = { type: LOAD_MASTER_DATA_SUCCESS, payload: { foo: 'bar' } }

        expect(clientReducer(undefined, action).foo).toEqual(undefined)
      })
    })
  })

  describe('Client Profile reducer', () => {
    it('should have a default empty state', () => {
      expect(clientProfileReducer(undefined, {})).toEqual({})
    })

    describe('CLIENT_PROFILE_LOADED', () => {
      it('should set the the payload of the action on state', () => {
        const action = {
          type: CLIENT_PROFILE_LOADED,
          payload: {
            foo: 'bar',
          },
        }

        expect(clientProfileReducer(undefined, action).foo).toEqual('bar')
      })
    })

    describe('LOAD_MASTER_DATA_SUCCESS', () => {
      it('should update if the master data provides the key', () => {
        const client_profile = { foo: 'bar' }
        const action = {
          type: LOAD_MASTER_DATA_SUCCESS,
          payload: {
            client_profile,
          },
        }

        expect(clientProfileReducer(undefined, action).foo).toEqual('bar')
      })

      it('should not update if the master data request is missing the key', () => {
        const action = { type: LOAD_MASTER_DATA_SUCCESS, payload: { foo: 'bar' } }

        expect(clientProfileReducer(undefined, action).foo).toEqual(undefined)
      })
    })
  })
})

describe('Initialized client config reducer', () => {
  it('should have a default empty state', () => {
    expect(initializedReducer(undefined, {})).toEqual(defaultClientConfig)
  })

  it('should merge the playload of the action on state', () => {
    const action = initializeClientConfig({
      something: 'else',
      connect: {
        update_credentials: true,
        enable_app2app: false,
      },
    })
    const afterState = initializedReducer(defaultClientConfig, action)

    expect(afterState.something).toEqual('else')
    expect(afterState.connect.update_credentials).toBe(true)
    expect(afterState.connect.disable_institution_search).toBe(false)
    expect(afterState.connect.enable_app2app).toBe(false)
  })

  it('should move is_mobile_webview to the top if it is configured via connect', () => {
    const action = initializeClientConfig({
      connect: {
        is_mobile_webview: true,
        update_credentials: true,
      },
    })

    const afterState = initializedReducer(defaultClientConfig, action)

    expect(afterState.is_mobile_webview).toBe(true)
    expect(afterState.connect.update_credentials).toBe(true)
    expect(afterState.connect.is_mobile_webview).toBe(undefined)
  })

  it('should move is_mobile_webview to the top if it is configured via master', () => {
    const action = initializeClientConfig({
      master: {
        is_mobile_webview: true,
      },
    })

    const afterState = initializedReducer(defaultClientConfig, action)

    expect(afterState.is_mobile_webview).toBe(true)
    expect(afterState.master.is_mobile_webview).toBe(undefined)
  })

  it('should move ui message version stuff and color_scheme to the top', () => {
    const action = initializeClientConfig({
      connect: {
        ui_message_protocol: 'webview',
        ui_message_version: 4,
        ui_message_webview_url_scheme: 'atrium',
        color_scheme: 'light',
      },
    })

    const afterState = initializedReducer(defaultClientConfig, action)

    expect(afterState.ui_message_version).toBe(4)
    expect(afterState.ui_message_protocol).toBe('webview')
    expect(afterState.ui_message_webview_url_scheme).toBe('atrium')
    expect(afterState.color_scheme).toBe('light')
    expect(afterState.connect.ui_message_version).toBe(undefined)
    expect(afterState.connect.ui_message_protocol).toBe(undefined)
    expect(afterState.connect.ui_message_webview_url_scheme).toBe(undefined)
    expect(afterState.connect.color_scheme).toBe(undefined)
  })
})
