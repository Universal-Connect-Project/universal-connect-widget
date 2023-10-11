import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Icon } from 'mx-react-components'
import { Text } from '@kyper/text'

import { __ } from '../../utils/Intl'
import BarebonesModal from '../shared/modals/BarebonesModal'

export const TimedOutModal = props => {
  const styles = timeoutWarningModalStyles(props.theme)

  return (
    <BarebonesModal isRelative={true} modalStyles={styles.container} role="dialog" tabIndex={0}>
      <div style={styles.iconWrapper}>
        <Icon size={50} type="attention" />
      </div>
      <Text tag="p"> {__('Your session has expired. Please refresh your browser.')} </Text>
    </BarebonesModal>
  )
}

TimedOutModal.propTypes = {
  theme: PropTypes.object.isRequired,
}

function timeoutWarningModalStyles(theme) {
  return {
    container: {
      textAlign: 'center',
      padding: `${theme.Spacing.SMALL}px ${theme.Spacing.XLARGE}px ${theme.Spacing.LARGE}px`,
      fontFamily: theme.Fonts.REGULAR,
      fontSize: theme.FontSizes.MEDIUM,
      color: theme.Colors.GRAY_700,
    },
    iconWrapper: {
      fill: theme.Colors.PRIMARY,
      paddingBottom: theme.Spacing.SMALL,
    },

    //os modal styles
    modal: {
      container: {
        zIndex: theme.Zs.TIMEOUTMODAL,
      },
      scrim: {
        // The session timed out modal needs to be above the MFA modal
        zIndex: theme.Zs.TIMEOUTMODAL,
      },
    },
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme,
  }
}

export default connect(mapStateToProps)(TimedOutModal)
