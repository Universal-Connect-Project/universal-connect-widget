import PropTypes from 'prop-types'
import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'mx-react-components'
import { __ } from '../../utils/Intl'

import BarebonesModal from '../shared/modals/BarebonesModal'

class TooSmallModal extends Component {
  render() {
    const styles = this.styles()

    return (
      <BarebonesModal isRelative={true} modalStyles={styles.container} role="dialog" tabIndex={0}>
        <Icon size={60} style={styles.icon} type="info" />
        <p style={styles.title}>{__('Unsupported Width')}</p>
        <p>
          {__(
            'The minimum supported width is 320 pixels. Please rotate your device to see the full page.',
          )}
        </p>
      </BarebonesModal>
    )
  }

  styles() {
    const theme = this.props.theme

    return {
      container: {
        padding: `${theme.Spacing.SMALL}px ${theme.Spacing.XLARGE}px ${theme.Spacing.LARGE}px`,
        fontFamily: theme.Fonts.REGULAR,
        fontSize: theme.FontSizes.MEDIUM,
        color: theme.Colors.GRAY_700,
        textAlign: 'center',
      },
      title: {
        fontSize: theme.FontSizes.LARGE,
        fontFamily: theme.Fonts.SEMIBOLD,
        textAlign: 'center',
        marginBottom: theme.Spacing.SMALL,
      },
      icon: {
        fill: theme.Colors.PRIMARY,
        marginBottom: theme.Spacing.XSMALL,
      },

      //os modal styles
      modal: {
        container: {
          zIndex: theme.Zs.TIMEOUTMODAL,
        },
        scrim: {
          zIndex: theme.Zs.TIMEOUTMODAL,
        },
      },
    }
  }
}

TooSmallModal.propTypes = {
  theme: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    theme: state.theme,
  }
}

export default connect(mapStateToProps)(TooSmallModal)
