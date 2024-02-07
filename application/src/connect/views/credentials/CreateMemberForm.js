import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { defer } from 'rxjs'
import { catchError, delay, map } from 'rxjs/operators'
import { useDispatch, useSelector } from 'react-redux'

import FireflyAPI from '../../../utils/FireflyAPI'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'
import { sendPostMessage } from '../../../redux/actions/PostMessage'
import { ActionTypes } from '../../../redux/actions/Connect'

import { Credentials } from './Credentials'
import { LoadingSpinner } from '../../components/LoadingSpinner'

/**
 * Responsibilities:
 * - Get the institution creds
 * - Render Credentials with the creds it received
 * - Performs the CREATE
 */
export const CreateMemberForm = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_CREATE_CREDENTIALS)
  const institution = useSelector(state => state.connect.selectedInstitution)
  const connectConfig = useSelector(state => state.connect?.connectConfig ?? {})
  const appConfig = useSelector(state => state.initializedClientConfig ?? {})
  const isHuman = useSelector(state => state.app.humanEvent)
  const [isCreatingMember, setIsCreatingMember] = useState(false)
  const [memberCreateError, setMemberCreateError] = useState(null)
  const [userCredentials, setUserCredentials] = useState(null)
  const [state, setState] = useState({
    isLoading: true,
    response: {},
    error: null,
  })
  const dispatch = useDispatch()

  useEffect(() => {
    const request$ = defer(() => FireflyAPI.getInstitutionCredentials(institution.guid)).subscribe(
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
  }, [])

  useEffect(() => {
    if (!isCreatingMember) return () => {}

    dispatch(
      sendPostMessage('connect/enterCredentials', {
        institution: {
          guid: institution.guid,
          code: institution.code,
        },
      }),
    )

    const memberData = { institution_guid: institution.guid, credentials: userCredentials }

    const createMember$ = defer(() =>
      FireflyAPI.addMember(memberData, connectConfig, appConfig, isHuman),
    )
      .pipe(
        // this delay is dumb, but if we don't wait long enough after the
        // create, then the job afterward is gonna 404.
        delay(400),
        map(response => ({
          type: ActionTypes.CREATE_MEMBER_SUCCESS,
          payload: { item: response.member },
        })),
        catchError(err => {
          if (err.response?.status === 409 && err.response?.data?.guid != null) {
            // Get the member guid and update it instead of something else
            // OR reload the widget with the member guid
            return defer(() =>
              FireflyAPI.updateMember({ ...memberData, guid: err.response.data.guid }),
            ).pipe(
              map(member => ({
                type: ActionTypes.UPDATE_MEMBER_SUCCESS,
                payload: { item: member },
              })),
            )
          }

          throw err
        }),
      )
      .subscribe(
        action => dispatch(action),
        error => {
          setIsCreatingMember(false)
          setMemberCreateError(error.response)
        },
      )

    return () => createMember$.unsubscribe()
  }, [isCreatingMember])

  if (state.isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Credentials
      credentials={state.response}
      error={memberCreateError}
      handleSubmitCredentials={credentials => {
        setUserCredentials(credentials)
        setIsCreatingMember(true)
      }}
      isProcessingMember={isCreatingMember}
      onGoBackClick={props.onGoBackClick}
    />
  )
}

CreateMemberForm.propTypes = {
  onGoBackClick: PropTypes.func.isRequired,
}
