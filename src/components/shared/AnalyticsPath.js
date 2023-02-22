import React from 'react'
import { connect } from 'react-redux'

import { removeAnalyticPath, sendAnalyticPath } from '../../redux/actions/Analytics'

const withAnalyticsPath = (Component, name, path) => {
  class componentWithPath extends React.Component {
    static propTypes = Component.propTypes

    componentDidMount() {
      this.props.sendAnalyticPath({ path, name })
    }

    componentWillUnmount() {
      this.props.removeAnalyticPath(path)
    }

    render() {
      return <Component {...this.props}>{this.props.children}</Component>
    }
  }

  const mapDispatchToProps = dispatch => ({
    sendAnalyticPath: path => dispatch(sendAnalyticPath(path)),
    removeAnalyticPath: path => dispatch(removeAnalyticPath(path)),
  })

  return connect(null, mapDispatchToProps)(componentWithPath)
}

export default withAnalyticsPath
