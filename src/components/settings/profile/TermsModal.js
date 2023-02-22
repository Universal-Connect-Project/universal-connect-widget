import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { css } from '@mxenabled/cssinjs'

import { Loader } from 'mx-react-components'

import Modal from '../../shared/Modal'

export class TermsModal extends React.Component {
  static propTypes = {
    agreement: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  }

  render() {
    const styles = this.styles()

    return (
      <Modal
        contentStyle={styles.content}
        isRelative={true}
        onRequestClose={this.props.onRequestClose}
        showTitleBar={true}
        style={styles.container}
        title={this.props.agreement.details.title}
      >
        <div>
          {this.props.agreement.loading ? (
            <Loader isLoading={true} isRelative={true} isSmall={true} />
          ) : null}

          <div
            className={css(styles.termsAndConditions)}
            dangerouslySetInnerHTML={{ __html: this.props.agreement.details.text }}
          />
        </div>
      </Modal>
    )
  }

  styles = () => {
    return {
      container: {
        height: 'calc(100% - 40px)',
        width: '95%',
      },
      content: {
        padding: 30,
      },
      termsAndConditions: {
        fontSize: '14px',
        '& ol': {
          marginLeft: '40px',
          marginBottom: '10px',
        },
        '& ul': {
          marginLeft: '40px',
          marginBottom: '10px',
        },
        '& li': {
          lineHeight: '1.4em',
        },
        '& p': {
          marginBottom: '10px',
        },
        '& b': {
          fontWeight: 'bold',
        },
      },
    }
  }
}

export default connect(state => ({ agreement: state.agreement }))(TermsModal)
