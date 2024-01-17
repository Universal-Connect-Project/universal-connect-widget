import { dispatcher as appDispatcher, ActionTypes } from 'reduxify/actions/App'
import { createReduxActionUtils } from 'utils/Test'

const { actions, expectDispatch, resetDispatch } = createReduxActionUtils(appDispatcher)

describe('app Dispatcher', () => {
  beforeEach(() => {
    resetDispatch()
  })

  it('should dispatch SESSION_IS_TIMED_OUT', () => {
    actions.markSessionTimedOut()
    expectDispatch({ type: ActionTypes.SESSION_IS_TIMED_OUT })
  })
})
