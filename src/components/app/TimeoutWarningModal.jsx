import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { __ } from '../../utils/Intl'

import { Text } from '@kyper/text'
import { Icon } from 'mx-react-components'

import TwoActionModal from '../shared/modals/TwoActionModal'

class TimeoutWarningModal extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
  }

  componentWillUnmount() {
    this.props.onMouseLeave()
  }

  render() {
    const styles = this.styles(this.props.theme)

    return (
      <TwoActionModal
        buttonsStyles={styles.buttons}
        componentStyles={styles.container}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        primaryAction={this.props.onClick}
        primaryButtonProps={{
          style: styles.button,
        }}
        primaryText={__('Continue')}
        role="region"
      >
        <div style={styles.iconWrapper}>
          <Icon size={50} type="attention" />
        </div>
        <div>
          <Text tag="p">
            {__('There has been no recent activity. Please click Continue to avoid timing out.')}
          </Text>
        </div>
      </TwoActionModal>
    )
  }

  styles = theme => {
    return {
      container: {
        textAlign: 'center',
        fontFamily: theme.Fonts.REGULAR,
        fontSize: theme.FontSizes.MEDIUM,
        color: theme.Colors.GRAY_700,
      },
      iconWrapper: {
        fill: theme.Colors.PRIMARY,
        paddingBottom: theme.Spacing.SMALL,
      },
      button: {
        flex: 'none',
        width: 'auto',
      },
      buttons: {
        justifyContent: 'center',
      },
      //os modal styles
      modal: {
        container: {
          zIndex: theme.Zs.TIMEOUTMODAL,
        },
        scrim: {
          // The session time out warning modal needs to be above the MFA modal
          zIndex: theme.Zs.TIMEOUTMODAL,
        },
      },
    }
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme,
  }
}

export default connect(mapStateToProps)(TimeoutWarningModal)
