import { mount } from 'enzyme'
import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'

/*
  ==================
  React Hook Testing
  ==================

  React hooks must be called from a functional Component, which makes testing
  Hooks in isolation a little more difficult.

  Using this helper you can test the results from a hook call more easily because
  it wraps your hook into a Functional Component for you.  (which means you can
  also rely on other hooks, like react-redux selectors)

  To see a real working example you can view
  src/connect/hooks/__tests__/useExperiment.test.js

  ========================================================
  Example code to test a hook that relies on a Redux store
  ========================================================
  // In your test.js file
  
  let hookResults
  const runHook = store => {
    testHook(() => {
      hookResults = useMyHook(param1, param2)
    }, store)
  }

  test('run hook and test results', () => {
    // After runHook() runs, hookResults will hold the values from useMyHook
    // It's up to you to provide your redux store to runHook
    runHook(store)

    // Now the test can expect on the hookResults values
    expect(hookResults.yourHookValue).toBe('yourExpectedValue')
  })
*/

const TestHook = ({ callback }) => {
  callback()
  return null
}

TestHook.propTypes = {
  callback: PropTypes.func.isRequired,
}

const testHook = (callback, store = null) => {
  mount(
    <Provider store={store}>
      <TestHook callback={callback} />
    </Provider>,
  )
}

export default testHook
