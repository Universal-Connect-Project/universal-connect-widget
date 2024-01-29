import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import _uniqueId from 'lodash/uniqueId'
import { connect } from 'react-redux'

import { FocusTrap } from 'mx-react-components'

import Scrim from '../../shared/Scrim'

import { focusElement } from '../../../utils/Accessibility'
import { isMobile } from '../../../utils/Browser'

import {
  shiftComponentFromStack,
  unshiftScrimComponentToStack,
} from '../../../redux/actions/ComponentStacks'

import { APP_ROOT_ID } from  '../../../constants/App'

import { isEscapeKey } from '../../../utils/KeyPress'

const BarebonesModal = ({
  children,
  componentWithScrim,
  focusTrapProps,
  isRelative,
  modalStyles,
  onClose,
  shiftComponentFromStack,
  theme,
  unshiftScrimComponentToStack,
  ...rest
}) => {
  const _modal = useRef(null)
  const [uniqueId] = useState(_uniqueId('mx-modal-'))
  const mergedFocusTrapProps = {
    focusTrapOptions: {
      clickOutsideDeactivates: true,
      portalTo: `#${APP_ROOT_ID}`,
    },
    ...focusTrapProps,
  }
  const styles = {
    component: {
      backgroundColor: 'transparent',
      bottom: 0,
      left: 0,
      position: 'fixed',
      right: 0,
      textAlign: 'center',
      top: 0,
      zIndex: 1000,
    },
    childrenWrapper: {
      backgroundColor: theme.Colors.WHITE,
      borderRadius: 2,
      boxShadow: theme.ShadowHigh,
      boxSizing: 'border-box',
      display: 'inline-block',
      fontFamily: theme.Fonts.REGULAR,
      maxWidth: 'calc(100% - 40px)',
      position: isRelative ? 'relative' : 'absolute',
      overflow: 'auto',
      top: 20,
      zIndex: 1001,
    },
  }

  useEffect(
    () => {
      // Modals should be added as the first component in the stack
      // as they can be displayed over drawers
      unshiftScrimComponentToStack(uniqueId)

      /**
       * Mobile Voice over apps only honor the dialog role
       * if you focus the wrapping div and no internal content
       */
      if (isMobile()) {
        focusElement(_modal)
      }

      return () => shiftComponentFromStack()
    },
    // unshiftScrimComponentToStack, uniqueId, shiftComponentFromStack should never
    // change so the useEffect will only run once (like componentDidMount)
    [unshiftScrimComponentToStack, uniqueId, shiftComponentFromStack],
  )

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  return (
    <FocusTrap {...mergedFocusTrapProps}>
      <div
        data-ui-test="modal-container"
        onKeyUp={e => {
          if (isEscapeKey(e)) {
            e.stopPropagation()
            onClose(e)
          }
        }}
        style={styles.component}
      >
        <Scrim onClick={onClose} showBackground={componentWithScrim === uniqueId} />
        <div
          ref={_modal}
          style={{ ...styles.childrenWrapper, ...modalStyles }} // Merge default styles with custom styles
          // Entire modal must be focusable for mobile voice over to honor dialog role
          tabIndex={isMobile() ? 0 : -1}
          {...rest}
        >
          {children}
        </div>
      </div>
    </FocusTrap>
  )
}

BarebonesModal.propTypes = {
  componentWithScrim: PropTypes.string,
  focusTrapProps: PropTypes.object,
  isRelative: PropTypes.bool,
  modalStyles: PropTypes.object,
  onClose: PropTypes.func,
  shiftComponentFromStack: PropTypes.func.isRequired,
  theme: PropTypes.object,
  unshiftScrimComponentToStack: PropTypes.func.isRequired,
}

BarebonesModal.defaultProps = {
  isRelative: true,
  modalStyles: {},
  onClose: () => {},
}

const mapStateToProps = state => ({
  componentWithScrim: state.componentStacks.scrimStack[0],
  theme: state.theme,
})

const mapDispatchToProps = {
  shiftComponentFromStack,
  unshiftScrimComponentToStack,
}

export default connect(mapStateToProps, mapDispatchToProps)(BarebonesModal)
