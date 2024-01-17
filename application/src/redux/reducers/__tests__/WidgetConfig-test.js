import { widgetProfile as reducer } from 'reduxify/reducers/WidgetProfile'
import { ActionTypes } from 'reduxify/actions/WidgetProfile'

describe('WidgetProfile Reducer', () => {
  describe('widgetProfileLoaded', () => {
    it('should add the payload to state', () => {
      const action = {
        type: ActionTypes.WIDGET_PROFILE_LOADED,
        payload: {
          foo: 'bar',
        },
      }

      expect(reducer(undefined, action)).toEqual({ foo: 'bar' }) //eslint-disable-line no-undefined
    })
  })
})
