import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { defer } from 'rxjs'
import { useDispatch, useSelector } from 'react-redux'

import FireflyAPI from '../../../utils/FireflyAPI'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'
import { sendPostMessage } from '../../../redux/actions/PostMessage'
import { ActionTypes } from '../../../redux/actions/Connect'
import { getCurrentMember } from '../../../redux/selectors/Connect'

import { Credentials } from './Credentials'
import { LoadingSpinner } from '../../components/LoadingSpinner'

/**
 * Responsibilities:
 * - Get the member creds
 * - Render Credentials with the creds it received
 * - Performs the UPDATE
 */
export const UpdateMemberForm = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_UPDATE_CREDENTIALS)
  const institution = useSelector(state => state.connect.selectedInstitution)
  const currentMember = useSelector(getCurrentMember)
  const connectConfig = useSelector(state => state.connect?.connectConfig ?? {})
  const isHuman = useSelector(state => state.app.humanEvent)
  const [isUpdatingMember, setIsUpdatingMember] = useState(false)
  const [memberUpdateError, setMemberUpdateError] = useState(null)
  const [state, setState] = useState({
    isLoading: true,
    response: {},
    error: null,
  })
  const dispatch = useDispatch()

  useEffect(() => {
    const request$ = defer(() => FireflyAPI.getMemberCredentials(currentMember.guid)).subscribe(
      response =>
        setState({
          isLoading: false,
          response,
          error: null,
        }),
      error =>
        setState({
          isLoading: false,
          response: {},
          error,
        }),
    )

    return () => request$.unsubscribe()
  }, [currentMember])

  const handleUpdateMember = credentials => {
    setIsUpdatingMember(true)
    const memberData = { ...currentMember, credentials }

    dispatch(
      sendPostMessage('connect/updateCredentials', {
        institution: {
          guid: institution.guid,
          code: institution.code,
        },
        member_guid: currentMember.guid,
      }),
    )

    FireflyAPI.updateMember(memberData, connectConfig, isHuman)
      .then(response =>
        dispatch({
          type: ActionTypes.UPDATE_MEMBER_SUCCESS,
          payload: { item: response },
        }),
      )
      .catch(error => {
        setIsUpdatingMember(false)
        setMemberUpdateError(error.response)
      })
  }

  if (state.isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Credentials
      credentials={state.response}
      error={memberUpdateError}
      handleSubmitCredentials={handleUpdateMember}
      isProcessingMember={isUpdatingMember}
      onDeleteConnectionClick={props.onDeleteConnectionClick}
      onGoBackClick={props.onGoBackClick}
    />
  )
}

UpdateMemberForm.propTypes = {
  onDeleteConnectionClick: PropTypes.func,
  onGoBackClick: PropTypes.func.isRequired,
}
