import PropTypes from 'prop-types'
import Honeybadger from 'honeybadger-js'
import React from 'react'
import { connect } from 'react-redux'

import { Icon } from 'mx-react-components'

export class GlobalErrorBoundary extends React.Component {
  static propTypes = {
    theme: PropTypes.object,
  }

  state = { hasError: false }

  componentDidCatch(error) {
    this.setState({
      hasError: true,
    })

    Honeybadger.notify(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          subtitle="We've notified support and we're looking into the issue. Please try again later."
          theme={this.props.theme}
          title="Oops! Something went wrong."
        />
      )
    }

    return this.props.children
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
})

export default connect(mapStateToProps)(GlobalErrorBoundary)

export const ErrorDisplay = ({ colorScheme, subtitle, theme, title, tokens }) => {
  const style = {
    container: {
      backgroundColor: colorScheme === 'dark' ? tokens.BackgroundColor.Body : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100%',
      padding: theme?.Spacing?.XSMALL,
    },
    icon: {
      fill: colorScheme === 'dark' ? tokens.TextColor.Default : theme?.Colors?.GRAY_700,
    },
    h1: {
      width: '100%', // IE 11 text wrapping in flex children
      color: colorScheme === 'dark' ? tokens.TextColor.Default : theme?.Colors?.GRAY_700,
      fontFamily: theme?.Fonts?.SEMIBOLD,
      fontSize: theme?.FontSizes?.XXLARGE,
      marginBottom: theme?.Spacing?.SMALL,
      textAlign: 'center',
    },
    h4: {
      width: '100%', // IE 11 text wrapping in flex children
      color: colorScheme === 'dark' ? tokens.TextColor.Default : theme?.Colors?.GRAY_700,
      fontSize: theme?.FontSizes?.LARGE,
      textAlign: 'center',
    },
  }

  return (
    <div style={style.container}>
      <Icon size={60} style={style.icon} type="attention-solid" />
      <h1 style={style.h1}>{title}</h1>
      <h4 style={style.h4}>{subtitle}</h4>
    </div>
  )
}

ErrorDisplay.propTypes = {
  colorScheme: PropTypes.string,
  subtitle: PropTypes.string,
  theme: PropTypes.object,
  title: PropTypes.string,
  tokens: PropTypes.object,
}
