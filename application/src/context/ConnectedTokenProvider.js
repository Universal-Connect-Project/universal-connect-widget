import { connect } from 'react-redux'
import { TokenProvider } from '@kyper/tokenprovider'

import { getTokenProviderValues } from 'reduxify/selectors/ClientColorScheme'

const mapStateToProps = state => ({
  ...getTokenProviderValues(state),
})

export const ConnectedTokenProvider = connect(mapStateToProps)(TokenProvider)
