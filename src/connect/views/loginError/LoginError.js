import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { __ } from '../../../utils/Intl'

import { ReadableStatuses } from '../../const/Statuses'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { getMemberStatusMessage } from '../../consts'

import { Container } from '../../components/Container'
import { SlideDown } from '../../components/SlideDown'
import { ViewTitle } from '../../components/ViewTitle'
import { InstitutionBlock } from '../../components/InstitutionBlock'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'
import { Support, VIEWS as SUPPORT_VIEWS } from '../../components/support/Support'

import { LeavingAction } from './LeavingAction'
import { PrimaryActions } from './PrimaryActions'
import { SecondaryActions } from './SecondaryActions'
import { MessageBoxStatus } from './MessageBoxStatus'
import { ImpededMemberError } from './ImpededMemberError'
import { NoEligibleAccounts } from './NoEligibleAccountsError'

import { getDelay } from '../../utilities/getDelay'

import {
  REFRESH,
  GET_HELP,
  VISIT_WEBSITE,
  DISCONNECT_INSTITUTION,
  UPDATE_CREDENTIALS,
} from './consts'

export const LoginError = ({
  isDeleteInstitutionOptionEnabled,
  sendPostMessage,
  member,
  size,
  institution,
  onDeleteConnectionClick,
  sendAnalyticsEvent,
  onRefreshClick,
  onUpdateCredentialsClick,
  showSupport,
  showExternalLinkPopup,
}) => {
  useAnalyticsPath(...PageviewInfo.CONNECT_LOGIN_ERROR)
  const [isLeaving, setIsLeaving] = useState(false)
  const [showSupportView, setShowSupportView] = useState(false)
  const hasInvalidData = useSelector(state => state.connect.hasInvalidData || false)

  const getNextDelay = getDelay()

  useEffect(() => {
    sendPostMessage('connect/memberError', {
      member: {
        guid: member.guid,
        connection_status: member.connection_status,
      },
    })
  }, [sendPostMessage, member])

  const memberStatusActionsMap = {
    [ReadableStatuses.PREVENTED]: {
      variant: 'error',
      title: __('New credentials needed'),
      message: getMemberStatusMessage(ReadableStatuses.PREVENTED, institution.name),
      primary: [UPDATE_CREDENTIALS],
      secondary: [GET_HELP, VISIT_WEBSITE, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.DENIED]: {
      variant: 'error',
      title: __('Please re-enter your credentials'),
      message: getMemberStatusMessage(ReadableStatuses.DENIED, institution.name),
      primary: [UPDATE_CREDENTIALS],
      secondary: [GET_HELP, VISIT_WEBSITE, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.REJECTED]: {
      variant: 'error',
      title: __('Incorrect information'),
      message: getMemberStatusMessage(ReadableStatuses.REJECTED, institution.name),
      primary: [REFRESH],
      secondary: [GET_HELP, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.LOCKED]: {
      variant: 'error',
      title: __('Account is locked'),
      message: getMemberStatusMessage(ReadableStatuses.LOCKED, institution.name),
      primary: [],
      secondary: [GET_HELP, VISIT_WEBSITE, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.IMPEDED]: {
      renderBody: (
        <ImpededMemberError
          institution={institution}
          message={getMemberStatusMessage(ReadableStatuses.IMPEDED, institution.name)}
          onRefreshClick={onRefreshClick}
          sendAnalyticsEvent={sendAnalyticsEvent}
          setIsLeaving={setIsLeaving}
          showExternalLinkPopup={showExternalLinkPopup}
          title={__('Your attention is needed')}
        />
      ),
      primary: [],
      secondary: [GET_HELP, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.DEGRADED]: {
      variant: 'help',
      title: __('Connection maintenance'),
      message: getMemberStatusMessage(ReadableStatuses.DEGRADED, institution.name),
      primary: [],
      secondary: [GET_HELP, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.DISCONNECTED]: {
      variant: 'help',
      title: __('Connection maintenance'),
      message: getMemberStatusMessage(ReadableStatuses.DISCONNECTED, institution.name),
      primary: [],
      secondary: [GET_HELP, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.DISCONTINUED]: {
      variant: 'error',
      title: __('Connection discontinued'),
      message: getMemberStatusMessage(ReadableStatuses.DISCONTINUED, institution.name),
      primary: [],
      secondary: [GET_HELP, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.CLOSED]: {
      variant: 'error',
      title: __('Closed account'),
      message: getMemberStatusMessage(ReadableStatuses.CLOSED, institution.name),
      primary: [],
      secondary: [VISIT_WEBSITE, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.FAILED]: {
      variant: 'error',
      title: __('Connection failed'),
      message: getMemberStatusMessage(ReadableStatuses.FAILED, institution.name),
      primary: [],
      secondary: [GET_HELP, VISIT_WEBSITE, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.DISABLED]: {
      variant: 'error',
      title: __('Connection disabled'),
      message: getMemberStatusMessage(ReadableStatuses.DISABLED, institution.name),
      primary: [],
      secondary: [GET_HELP, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.IMPORTED]: {
      variant: 'error',
      title: __('New credentials needed'),
      message: getMemberStatusMessage(ReadableStatuses.IMPORTED, institution.name),
      primary: [UPDATE_CREDENTIALS],
      secondary: [GET_HELP, DISCONNECT_INSTITUTION],
    },
    [ReadableStatuses.CHALLENGED]: {
      variant: 'error',
      title: __('Something went wrong'),
      message: __('Please try again or come back later.'),
      primary: [REFRESH],
      secondary: [],
    },
    [ReadableStatuses.EXPIRED]: {
      variant: 'error',
      title: __('Credentials expired'),
      message: getMemberStatusMessage(ReadableStatuses.EXPIRED, institution.name),
      primary: [REFRESH],
      secondary: [],
    },
    [ReadableStatuses.IMPAIRED]: {
      variant: 'error',
      title: __('New credentials needed'),
      message: getMemberStatusMessage(ReadableStatuses.IMPAIRED, institution.name),
      primary: [UPDATE_CREDENTIALS],
      secondary: [VISIT_WEBSITE, DISCONNECT_INSTITUTION],
    },
  }

  const defaultMemberStatusAction = {
    variant: 'error',
    title: __('Something went wrong'),
    message: __("We've notified support and are looking into the issue. Please try again later."),
    primary: [],
    secondary: [GET_HELP, DISCONNECT_INSTITUTION],
  }

  let statusActions
  if (hasInvalidData) {
    statusActions = {
      renderBody: <NoEligibleAccounts />,
      primary: [],
      secondary: [],
      title: '',
    }
  } else {
    statusActions = memberStatusActionsMap[member.connection_status] || defaultMemberStatusAction
  }

  if (showSupportView) {
    return (
      <Support
        loadToView={SUPPORT_VIEWS.GENERAL_SUPPORT}
        onClose={() => setShowSupportView(false)}
      />
    )
  }

  return (
    <Container>
      {isLeaving ? (
        <SlideDown>
          <LeavingAction
            institution={institution}
            sendAnalyticsEvent={sendAnalyticsEvent}
            setIsLeaving={setIsLeaving}
            size={size}
          />
        </SlideDown>
      ) : (
        <Fragment>
          <SlideDown delay={getNextDelay()}>
            <InstitutionBlock institution={institution} />
          </SlideDown>

          <SlideDown delay={getNextDelay()}>
            <ViewTitle title={statusActions.title} />
          </SlideDown>

          <SlideDown delay={getNextDelay()}>
            {statusActions.renderBody ? (
              statusActions.renderBody
            ) : (
              <MessageBoxStatus message={statusActions.message} variant={statusActions.variant} />
            )}
          </SlideDown>

          {statusActions.primary.length > 0 && (
            <SlideDown delay={getNextDelay()}>
              <PrimaryActions
                actions={statusActions.primary}
                onRefreshClick={onRefreshClick}
                onUpdateCredentialsClick={onUpdateCredentialsClick}
                sendAnalyticsEvent={sendAnalyticsEvent}
              />
            </SlideDown>
          )}

          {statusActions.secondary.length > 0 && (
            <SlideDown delay={getNextDelay()}>
              <SecondaryActions
                actions={statusActions.secondary}
                institution={institution}
                isDeleteInstitutionOptionEnabled={isDeleteInstitutionOptionEnabled}
                member={member}
                onDeleteConnectionClick={onDeleteConnectionClick}
                onGetHelpClick={() => setShowSupportView(true)}
                sendAnalyticsEvent={sendAnalyticsEvent}
                setIsLeaving={setIsLeaving}
                showExternalLinkPopup={showExternalLinkPopup}
                showSupport={showSupport}
              />
            </SlideDown>
          )}

          <SlideDown delay={getNextDelay()}>
            <PrivateAndSecure />
          </SlideDown>
        </Fragment>
      )}
    </Container>
  )
}

LoginError.propTypes = {
  institution: PropTypes.object.isRequired,
  isDeleteInstitutionOptionEnabled: PropTypes.bool.isRequired,
  member: PropTypes.object.isRequired,
  onDeleteConnectionClick: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onUpdateCredentialsClick: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
  showExternalLinkPopup: PropTypes.bool.isRequired,
  showSupport: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired,
}
