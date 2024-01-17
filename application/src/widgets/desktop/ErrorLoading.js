import React from 'react'

import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { TokenContext } from '@kyper/tokenprovider'

export class ErrorLoading extends React.Component {
  static contextType = TokenContext

  style() {
    return {
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
      },
      h1: {
        color: this.context.TextColor.Secondary,
        fontFamily: this.context.Font.Semibold,
        fontSize: this.context.FontSize.H3,
        marginBottom: this.context.Spacing.SMALL,
      },
    }
  }

  render() {
    const style = this.style()

    return (
      <div style={style.container}>
        <AttentionFilled color={this.context.TextColor.Secondary} height={60} width={60} />

        <h1 style={style.h1}>Oops! The widget "{window.app.options.type}" is not available.</h1>
      </div>
    )
  }
}

export default ErrorLoading
