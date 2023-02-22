import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { Icon } from 'mx-react-components'

export class ErrorLoading extends React.Component {
  static propTypes = {
    theme: PropTypes.object,
  }

  style() {
    const { theme } = this.props

    return {
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
      },
      icon: {
        fill: theme.Colors.GRAY_700,
      },
      h1: {
        color: theme.Colors.GRAY_700,
        fontFamily: theme.Fonts.SEMIBOLD,
        fontSize: theme.FontSizes.XXLARGE,
        marginBottom: theme.Spacing.SMALL,
      },
    }
  }

  render() {
    const style = this.style()

    return (
      <div style={style.container}>
        <Icon size={60} style={style.icon} type="attention-solid" />
        <h1 style={style.h1}>Oops! The widget "{window.app.options.type}" is not available.</h1>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
})

export default connect(mapStateToProps)(ErrorLoading)
