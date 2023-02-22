import PropTypes from 'prop-types'
import React from 'react'
import _merge from 'lodash/merge'

import { connect } from 'react-redux'

export class Scrim extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    showBackground: PropTypes.bool,
    theme: PropTypes.object.isRequired,
  }

  static defaultProps = {
    onClick: () => {},
    showBackground: false,
  }

  render() {
    const { showBackground, style, theme } = this.props

    const componentStyle = _merge(
      {},
      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.Zs.SCRIM,
        backgroundColor: showBackground ? theme.Colors.SCRIM : 'transparent',
      },
      style,
    )

    return <div aria-hidden="true" onClick={this.props.onClick} style={componentStyle} />
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
})

export default connect(mapStateToProps)(Scrim)
