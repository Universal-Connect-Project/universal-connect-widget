import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import Store from '../../redux/__mocks__/Store'

const TestWrapper = ({ children, store }) => {
  return <Provider store={store}>{children}</Provider>
}

TestWrapper.propTypes = {
  store: PropTypes.object.isRequired,
}

export function getMountOptions(store = Store) {
  return {
    context: { store },
    childContextTypes: {
      store: PropTypes.object,
    },
    wrappingComponent: TestWrapper,
    wrappingComponentProps: {
      store,
    },
  }
}
