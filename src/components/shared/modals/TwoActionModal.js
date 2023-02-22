import PropTypes from 'prop-types'
import React from 'react'

import { Button } from 'mx-react-components'

import BarebonesModal from './BarebonesModal'
import { connect } from 'react-redux'

export const TwoActionModal = ({
  buttonsStyles,
  children,
  componentStyles,
  footer,
  onClose,
  primaryAction,
  primaryButtonProps: { style: primaryButtonStyle, ...primaryButtonProps },
  primaryDescription,
  primaryText,
  secondaryAction,
  secondaryButtonProps: { style: secondaryButtonStyle, ...secondaryButtonProps },
  secondaryDescription,
  secondaryText,
  theme,
  ...rest
}) => {
  const styles = modalStyles(theme)

  return (
    <BarebonesModal onClose={onClose} {...rest}>
      <div style={{ ...styles.component, ...componentStyles }}>
        <div style={styles.content}>{children}</div>
        <div style={{ ...styles.buttons, ...buttonsStyles }}>
          {secondaryText ? (
            <React.Fragment>
              <Button
                onClick={e => {
                  e.stopPropagation()
                  secondaryAction(e)
                }}
                style={{ ...styles.button, ...styles.leftButton, ...secondaryButtonStyle }}
                type="secondary"
                {...secondaryButtonProps}
              >
                {secondaryText}
              </Button>
              {secondaryDescription}
            </React.Fragment>
          ) : null}
          {primaryText ? (
            <React.Fragment>
              <Button
                onClick={e => {
                  e.stopPropagation()
                  primaryAction(e)
                }}
                style={{ ...styles.button, ...primaryButtonStyle }}
                type="primary"
                {...primaryButtonProps}
              >
                {primaryText}
              </Button>
              {primaryDescription}
            </React.Fragment>
          ) : null}
        </div>
      </div>
      {footer}
    </BarebonesModal>
  )
}

TwoActionModal.defaultProps = {
  buttonsStyles: {},
  componentStyles: {},
  footer: null,
  onClose: () => {},
  primaryAction: () => {},
  primaryButtonProps: {},
  secondaryAction: () => {},
  secondaryButtonProps: {},
}

TwoActionModal.propTypes = {
  buttonsStyles: PropTypes.object,
  componentStyles: PropTypes.object.isRequired,
  footer: PropTypes.object,
  onClose: PropTypes.func,
  primaryAction: PropTypes.func.isRequired,
  primaryButtonProps: PropTypes.object,
  primaryDescription: PropTypes.object,
  primaryText: PropTypes.string,
  secondaryAction: PropTypes.func,
  secondaryButtonProps: PropTypes.object,
  secondaryDescription: PropTypes.object,
  secondaryText: PropTypes.string,
  theme: PropTypes.object,
}

const modalStyles = theme => ({
  component: {
    margin: theme.Spacing.LARGE,
    boxSizing: 'border-box',
  },
  footer: {
    textAlign: 'center',
  },
  content: {
    marginBottom: theme.Spacing.LARGE,
    width: '100%',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.Spacing.XSMALL,
  },
  button: {
    flex: '1 1 auto',
    width: '100%',
    marginRight: theme.Spacing.XSMALL,
    marginLeft: theme.Spacing.XSMALL,
  },
})

const mapStateToProps = state => ({
  theme: state.theme,
})

export default connect(mapStateToProps, {})(TwoActionModal)
