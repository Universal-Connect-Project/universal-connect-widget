import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'
import { MessageBox } from '@kyper/messagebox'
import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { Radio } from 'src/privacy/input'
import { defer } from 'rxjs'

import { SlideDown } from 'src/connect/components/SlideDown'

import { __, _p } from 'src/connect/utilities/Intl'
import connectAPI from 'src/connect/services/api'

import useAnalyticsPath from 'src/connect/hooks/useAnalyticsPath'
import { PageviewInfo } from 'src/connect/const/Analytics'

import { ReadableStatuses } from 'src/connect/const/Statuses'

export const DeleteMemberSurvey = props => {
  const { member, onCancel, onDeleteSuccess } = props
  useAnalyticsPath(...PageviewInfo.CONNECT_DELETE_MEMBER_SURVEY)
  const [selectedReason, setSelectedReason] = useState(null)
  const [deleteMemberState, updateDeleteMemberState] = useState({
    loading: false,
    error: null,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const tokens = useTokens()
  const styles = getStyles(tokens)

  useEffect(() => {
    if (deleteMemberState.loading === false) return () => {}

    const request$ = defer(() => connectAPI.deleteMember(member)).subscribe(
      () => onDeleteSuccess(member, selectedReason),
      err => updateDeleteMemberState({ loading: false, error: err }),
    )

    return () => request$.unsubscribe()
  }, [deleteMemberState.loading])

  let reasonList

  if (member.connection_status !== ReadableStatuses.CONNECTED) {
    reasonList = NON_CONECTED_REASONS
  } else {
    reasonList = CONNECTED_REASONS
  }

  const hasDeleteError = deleteMemberState.loading === false && deleteMemberState.error != null

  const handleOnDisconnect = () => {
    // when the user selects to Disconnect the setIsSubmitted is set to true
    setIsSubmitted(true)
    //if there are is no selectedOption then the errors will show
    if (!selectedReason) {
      return false
    }
    return updateDeleteMemberState({ loading: true, error: null })
  }
  return (
    <div role="dialog" style={styles.container}>
      <div style={styles.modal}>
        {hasDeleteError ? (
          <SlideDown delay={100}>
            <div data-test="disconnect-error-header" style={styles.errorHeader}>
              {__('Something went wrong')}
            </div>
            <MessageBox
              data-test="disconnect-error-message"
              style={{ marginBottom: tokens.Spacing.XLarge }}
              variant="error"
            >
              <Text as="ParagraphSmall" tag="p">
                {__(
                  "Oops! We weren't able to disconnect this institution. Please try again later.",
                )}
              </Text>
            </MessageBox>

            <div style={styles.buttons}>
              <Button
                data-test="disconnect-ok-button"
                onClick={onCancel}
                style={styles.errorButton}
                variant="primary"
              >
                {__('Ok')}
              </Button>
            </div>
          </SlideDown>
        ) : (
          <React.Fragment>
            <Text as="Body" data-test="disconnect-disclaimer">
              {_p(
                'connect/deletesurvey/disclaimer/text',
                'Why do you want to disconnect %1?',
                member.name,
              )}
            </Text>
            <div style={styles.reasons}>
              {reasonList.map((reason, i) => (
                <div key={reason} style={{ marginBottom: 20 }}>
                  <Radio
                    autoFocus={i === 0}
                    checked={selectedReason === reason}
                    data-test={`radio-${reason.replace(/\s+/g, '-')}`}
                    data-testid="disconnect-option"
                    id={reason}
                    key={reason}
                    label={reason}
                    labelPosition="right"
                    name="reasons"
                    onChange={() => {
                      setSelectedReason(reason)
                    }}
                  />
                </div>
              ))}
            </div>

            {isSubmitted && !selectedReason && (
              <section role="alert" style={styles.errorContent}>
                <AttentionFilled color={tokens.Color.Error300} />
                <p style={styles.errorMessage}>{__('Choose a reason for deleting')}</p>
              </section>
            )}
            <Button
              data-test="disconnect-button"
              onClick={handleOnDisconnect}
              style={styles.button}
              variant="destructive"
            >
              {__('Disconnect')}
            </Button>

            <Button
              data-test="disconnect-cancel-button"
              onClick={onCancel}
              style={styles.cancelButton}
              variant={'transparent-tertiary'}
            >
              {__('Cancel')}
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

const getStyles = tokens => ({
  component: {
    display: 'block',
    whiteSpace: 'normal',
  },
  container: {
    zIndex: tokens.ZIndex.Modal,
    position: 'absolute',
    width: '100%',
    backgroundColor: tokens.BackgroundColor.Container,
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: tokens.BackgroundColor.Modal,
    color: tokens.TextColor.Default,
    maxWidth: 400,
    width: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  reasons: {
    marginTop: tokens.Spacing.Medium,
  },
  button: {
    width: '100%',
    marginBottom: tokens.Spacing.XSmall,
    marginTop: '20px',
  },
  cancelButton: {
    width: '100%',
  },
  errorButton: {
    width: '100%',
  },
  errorHeader: {
    fontSize: tokens.FontSize.H2,
    fontWeight: tokens.FontWeight.Bold,
    marginBottom: tokens.Spacing.XSmall,
  },
  errorContent: {
    color: tokens.TextColor.Error,
    display: 'flex',
    alignItems: 'center',
  },
  errorMessage: {
    marginLeft: tokens.Spacing.Tiny,
    fontSize: tokens.FontSize.Small,
  },
})

DeleteMemberSurvey.propTypes = {
  member: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
}

const DELETE_REASONS = {
  NO_LONGER_USE_ACCOUNT: __('I no longer use this account or it’s not mine'),
  DONT_WANT_SHARE_DATA: __('I don’t want to share my data'),
  ACCOUNT_INFORMATION_OLD: __('The account information is old or inaccurate'),
  UNABLE_CONNECT_ACCOUNT: __('I am unable to connect this account here'),
  DONT_WANT_TO_USE_APP: __('I don’t want to use this app'),
  DONT_WANT_ACCOUNT_CONNECTED: __('I don’t want this account connected here'),
  OTHER_REASON: __('Other'),
}

const CONNECTED_REASONS = [
  DELETE_REASONS.NO_LONGER_USE_ACCOUNT,
  DELETE_REASONS.DONT_WANT_SHARE_DATA,
  DELETE_REASONS.DONT_WANT_TO_USE_APP,
  DELETE_REASONS.OTHER_REASON,
]
const NON_CONECTED_REASONS = [
  DELETE_REASONS.UNABLE_CONNECT_ACCOUNT,
  DELETE_REASONS.ACCOUNT_INFORMATION_OLD,
  DELETE_REASONS.DONT_WANT_ACCOUNT_CONNECTED,
  DELETE_REASONS.OTHER_REASON,
]
