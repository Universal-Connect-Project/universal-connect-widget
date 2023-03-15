import _get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useTokens } from '@kyper/tokenprovider'

import { ViewTitle } from '../../components/ViewTitle'
import { MFAOptions } from './MFAOptions'
import { DefaultMFA } from './DefaultMFA'
import { MFAImages } from './MFAImages'

import { __ } from '../../../utils/Intl'
import { CredentialTypes } from '../../const/Credential'
import { getMFAAnalyticAction, getMFAFieldType } from './utils'
import { EventCategories, EventLabels, EventActions } from '../../const/Analytics'

export const MFAForm = props => {
  const { currentMember, isSubmitting, onSubmit, sendAnalyticsEvent } = props
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const mfaCredentials = _get(currentMember, 'mfa.credentials', [])
  const mfaType = getMFAFieldType(mfaCredentials)
  const isSAS = mfaCredentials[0].external_id === 'single_account_select'

  // analyticAction will depend on the type and credentials, it will be...
  // Options | Image | Images | Challenge | Challenges | null
  const analyticAction = getMFAAnalyticAction(mfaType, mfaCredentials)

  useEffect(() => {
    if (analyticAction !== null) {
      const label = isSAS ? EventLabels.SINGLE_ACCOUNT_SELECT : EventLabels.MFA
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label,
        action: `${label} - ${analyticAction} - ${EventActions.START}`,
      })
    }
  }, [])

  // When a user submits any of the forms we want to see an END analytic event for Connect
  // Consumers don't need to know Connect's analytics, so we add them here
  const handleSubmit = credentials => {
    if (analyticAction !== null) {
      const label = isSAS ? EventLabels.SINGLE_ACCOUNT_SELECT : EventLabels.MFA
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label,
        action: `${label} - ${analyticAction} - ${EventActions.END}`,
      })
    }
    onSubmit(credentials)
  }

  //Default Form
  let Form = (
    <DefaultMFA
      isSubmitting={isSubmitting}
      mfaCredentials={mfaCredentials}
      onSubmit={handleSubmit}
    />
  )

  //Multiple Choice/ Options Form
  if (mfaType === CredentialTypes.OPTIONS) {
    Form = (
      <MFAOptions
        isSubmitting={isSubmitting}
        mfaCredentials={mfaCredentials}
        onSubmit={handleSubmit}
      />
    )
  }

  //Multiple Image Choice
  if (mfaType === CredentialTypes.IMAGE_OPTIONS) {
    Form = (
      <MFAImages
        isSubmitting={isSubmitting}
        mfaCredentials={mfaCredentials}
        onSubmit={handleSubmit}
      />
    )
  }

  return (
    <div className={styles.container}>
      <ViewTitle title={__('Verify identity')} />
      <form onSubmit={e => e.preventDefault()}>{Form}</form>
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      height: '100%',
    },
    credentialLabel: {
      lineHeight: tokens.LineHeight.Paragraph,
      marginBottom: tokens.Spacing.Medium,
    },
    buttonSpacing: {
      marginTop: tokens.Spacing.Medium,
    },
  }
}

MFAForm.propTypes = {
  currentMember: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
}
