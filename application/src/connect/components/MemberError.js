import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { useTokens } from '@kyper/tokenprovider'
import { MessageBox } from '@kyper/messagebox'
import { Text } from '@kyper/text'

import { __ } from 'src/connect/utilities/Intl'
import { ActionTypes } from 'reduxify/actions/PostMessage'
import { AriaLive } from 'src/connect/components/AriaLive'

export const MemberError = props => {
  const dispatch = useDispatch()
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const errorStatus = props.error?.response?.status

  useEffect(() => {
    const errorPayload = {
      institution_guid: props.institution.guid,
      institution_code: props.institution.code,
    }

    dispatch({
      type: ActionTypes.SEND_POST_MESSAGE,
      payload: { event: 'connect/createMemberError', data: errorPayload },
    })
  }, [])

  const getMessage = () => {
    if (errorStatus === 403) {
      return __('Verification must be enabled to use this feature.')
    } else if (errorStatus === 409) {
      return __(
        'Oops! There was a problem. Please check your username and password, and try again.',
      )
    } else {
      return __('Please try again or come back later.')
    }
  }

  return (
    <Fragment>
      <MessageBox
        data-test="credentials-error-message-box"
        style={styles.messageBox}
        title={__('Something went wrong')}
        variant="error"
      >
        <Text as="Paragraph" tag="p">
          {getMessage()}
        </Text>
      </MessageBox>
      <AriaLive level="assertive" message={`Something went wrong. ${getMessage()}`} />
    </Fragment>
  )
}

const getStyles = tokens => ({
  messageBox: {
    marginBottom: tokens.Spacing.Medium,
  },
})

MemberError.propTypes = {
  error: PropTypes.object,
  institution: PropTypes.object.isRequired,
}
