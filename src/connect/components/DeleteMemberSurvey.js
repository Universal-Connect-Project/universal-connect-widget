import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { Radio } from '@kyper/input'
import { useTokens } from '@kyper/tokenprovider'
import { MessageBox } from '@kyper/messagebox'
import { defer } from 'rxjs'

import Modal from '../../components/shared/Modal'
import { SlideDown } from './SlideDown'

import { __, _p } from '../../utils/Intl'
import FireflyAPI from '../../utils/FireflyAPI'

import useAnalyticsPath from '../hooks/useAnalyticsPath'
import { PageviewInfo } from '../const/Analytics'

import { ReadableStatuses } from '../const/Statuses'

export const DeleteMemberSurvey = props => {
  const { member, onCancel, onDeleteSuccess } = props
  useAnalyticsPath(...PageviewInfo.CONNECT_DELETE_MEMBER_SURVEY)
  const [selectedReason, setSelectedReason] = useState(null)
  const [deleteMemberState, updateDeleteMemberState] = useState({
    loading: false,
    error: null,
  })
  const tokens = useTokens()
  const styles = getStyles(tokens)

  useEffect(() => {
    if (deleteMemberState.loading === false) return () => {}

    const request$ = defer(() => FireflyAPI.deleteMember(member)).subscribe(
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

  return (
    <Modal
      aria-labelledby="mx-delete-survey-header"
      contentHasTabIndex={false}
      contentStyle={styles.modalContent}
      onRequestClose={onCancel}
      role="dialog"
      showCloseIcon={false}
      style={styles.modal}
      styles={styles.modalScrim}
    >
      {hasDeleteError ? (
        <SlideDown delay={100}>
          <div style={styles.errorHeader}>{__('Something went wrong')}</div>
          <MessageBox style={{ marginBottom: tokens.Spacing.XLarge }} variant="error">
            <Text as="ParagraphSmall" tag="p">
              {__("Oops! We weren't able to disconnect this institution. Please try again later.")}
            </Text>
          </MessageBox>
          <div style={styles.buttons}>
            <Button onClick={onCancel} style={styles.errorButton} variant="primary">
              {__('Ok')}
            </Button>
          </div>
        </SlideDown>
      ) : (
        <React.Fragment>
          <Text as="Body">
            {_p(
              'connect/deletesurvey/disclaimer/text',
              'Why do you want to disconnect %1?',
              member.name,
            )}
          </Text>
          <div style={styles.reasons}>
            {reasonList.map(reason => (
              <div key={reason} style={{ marginBottom: 20 }}>
                <Radio
                  checked={selectedReason === reason}
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
          <div style={styles.buttons}>
            <Button onClick={onCancel} style={styles.button}>
              {__('Cancel')}
            </Button>
            <Button
              disabled={!selectedReason}
              onClick={() => updateDeleteMemberState({ loading: true, error: null })}
              style={styles.button}
              variant="destructive"
            >
              {__('Disconnect')}
            </Button>
          </div>
        </React.Fragment>
      )}
    </Modal>
  )
}

const getStyles = tokens => ({
  component: {
    display: 'block',
    whiteSpace: 'normal',
  },
  modal: {
    backgroundColor: tokens.BackgroundColor.Modal,
    color: tokens.TextColor.Default,
    maxWidth: 400,
    width: '100%',
  },
  modalScrim: {
    scrim: {
      padding: `0 ${tokens.Spacing.Medium}`,
    },
    overlay: {
      backgroundColor: tokens.BackgroundColor.ModalScrim,
    },
  },
  modalContent: {
    padding: tokens.Spacing.XLarge,
    overflowY: 'hidden',
  },
  reasons: {
    marginBottom: '20px',
    marginTop: tokens.Spacing.Medium,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    display: 'inline',
    marginLeft: tokens.Spacing.Tiny,
    marginRight: tokens.Spacing.Tiny,
  },
  errorButton: {
    width: '100%',
  },
  errorHeader: {
    fontSize: tokens.FontSize.H2,
    fontWeight: tokens.FontWeight.Bold,
    marginBottom: tokens.Spacing.XSmall,
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
