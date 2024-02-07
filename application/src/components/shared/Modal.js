import PropTypes from 'prop-types'
import React from 'react'
import _uniqueId from 'lodash/uniqueId'
import { Modal } from 'mx-react-components'
import { APP_ROOT_ID } from '../../constants/App'
import { connect } from 'react-redux'

import {
  shiftComponentFromStack,
  unshiftScrimComponentToStack,
} from '../../redux/actions/ComponentStacks'

export class WrappedModal extends React.Component {
  static propTypes = {
    componentWithScrim: PropTypes.string,
    shiftComponentFromStack: PropTypes.func.isRequired,
    showScrim: PropTypes.bool,
    unshiftScrimComponentToStack: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this._uniqueId = _uniqueId('mx-modal-')
  }

  componentDidMount() {
    // Modals should be added as the first component in the stack
    // as they can be displayed over drawers
    this.props.unshiftScrimComponentToStack(this._uniqueId)
  }

  componentWillUnmount() {
    this.props.shiftComponentFromStack()
  }

  render() {
    return (
      <Modal
        portalTo={`#${APP_ROOT_ID}`}
        {...this.props}
        showScrim={
          this.props.componentWithScrim === this._uniqueId && this.props.showScrim !== false
        }
      >
        {this.props.children}
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  componentWithScrim: state.componentStacks.scrimStack[0],
})

const mapDispatchToProps = {
  shiftComponentFromStack,
  unshiftScrimComponentToStack,
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedModal)
