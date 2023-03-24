import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import browserDispatcher from '../../redux/actions/Browser'

class WidgetDimensionObserver extends React.Component {
  static propTypes = {
    heightOffset: PropTypes.number,
    updateDimensions: PropTypes.func.isRequired,
  }

  componentDidMount() {
    //Prevents honeybadget in legacy browsers that do not have this event
    if (!window.onorientationchange) window.onorientationchange = () => {}

    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', this._handleResize)
    }

    window.addEventListener('resize', this._handleResize)
    this._handleResize()
  }

  componentWillUnmount() {
    if ('onorientationchange' in window) {
      window.removeEventListener('orientationchange', this._handleResize)
    }

    window.removeEventListener('resize', this._handleResize)
  }

  _handleResize = () => this.props.updateDimensions(this.props.heightOffset)

  render() {
    return this.props.children
  }
}

export default connect(null, browserDispatcher)(WidgetDimensionObserver)
