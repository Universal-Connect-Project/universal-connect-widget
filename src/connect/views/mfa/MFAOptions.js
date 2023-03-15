import React, { useState } from 'react'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'
import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { SelectionBox } from '@kyper/selectionbox'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { __ } from '../../../utils/Intl'

export const MFAOptions = props => {
  const { isSubmitting, mfaCredentials, onSubmit } = props
  const isSAS = mfaCredentials[0].external_id === 'single_account_select'
  const pageView = isSAS
    ? PageviewInfo.CONNECT_MFA_SINGLE_ACCOUNT_SELECT
    : PageviewInfo.CONNECT_MFA_OPTIONS

  useAnalyticsPath(...pageView)

  // selected option is for css changes and to confirm that an option has been selected before submitting the form (this is par of the form validation)
  const [selectedOption, setSelectedOption] = useState({})
  // isSubmitted will help us to make sure that we only show validation errors if the form has been submitted otherwise the error would show every time there are no items selected
  const [isSubmitted, setIsSubmitted] = useState(false)

  // credentials are set upon selection and these credentialsToSubmit are fed to the parent and submitted on the update member
  const [credentialsToSubmit, setCredentials] = useState(
    mfaCredentials.map(cred => ({ guid: cred.guid, value: null })),
  )

  const handleOnSubmit = () => {
    // when the user selects to Continue the setIsSubmitted is set to true
    setIsSubmitted(true)

    //if there are is no selectedOption then the errors will show
    if (_isEmpty(selectedOption)) {
      return false
    }

    //otherwise if there is an item selected to submit we submit those credentials
    return onSubmit(credentialsToSubmit)
  }

  const tokens = useTokens()
  const styles = getStyles(tokens)
  const mfaLabel = mfaCredentials.map(credential => credential.label)
  const dynamicLabel = mfaLabel[0] ? mfaLabel[0] : __('Choose an authentication method.')

  return (
    <div>
      <Text style={styles.label} tag="p">
        {dynamicLabel}
      </Text>
      {mfaCredentials.map(credential => {
        return credential.options.map((option, i) => {
          const isSelected = selectedOption.guid === option.guid

          return (
            <SelectionBox
              autoFocus={i === 0}
              checked={isSelected}
              disabled={isSubmitting}
              id={`${option.guid}`}
              key={`${option.guid}`}
              label={
                <Text as="Paragraph" bold={true}>
                  {option.label}
                </Text>
              }
              name="options-selection-box"
              onChange={() => {
                setSelectedOption({ guid: option.guid })
                setCredentials(
                  credentialsToSubmit.map(cred =>
                    credential.guid === option.credential_guid
                      ? { guid: option.credential_guid, value: option.guid }
                      : cred,
                  ),
                )
              }}
              style={styles.card}
              value={option.label}
              variant="radio"
            />
          )
        })
      })}

      {isSubmitted && _isEmpty(selectedOption) && (
        <section role="alert" style={styles.errorContent}>
          <AttentionFilled color={tokens.Color.Error300} />
          <p style={styles.errorMessage}>{__('Choose an option')}</p>
        </section>
      )}
      <Button onClick={handleOnSubmit} style={styles.submitButton} variant="primary">
        {isSubmitting ? `${__('Checking')}...` : __('Continue')}
      </Button>
    </div>
  )
}

const getStyles = tokens => {
  return {
    label: {
      marginBottom: tokens.Spacing.Medium,
    },
    optionLabel: {
      textAlign: 'left',
      wordBreak: 'break-word',
    },
    card: {
      fontWeight: tokens.FontWeight.Bold,
      padding: tokens.Spacing.SelectionBoxPadding,
      marginBottom: tokens.Spacing.Small,
    },
    selected: {
      color: tokens.Color.Brand400,
      backgroundColor: tokens.BackgroundColor.SelectionBoxLinkHover,
    },
    errored: {
      border: `2px solid ${tokens.BorderColor.InputError}`,
    },
    checkMark: {
      backgroundColor: tokens.Color.NeutralWhite,
      borderRadius: '50%',
      border: `2px solid ${tokens.Color.NeutralWhite}`,
    },
    errorContent: {
      color: tokens.TextColor.Error,
      display: 'flex',
      alignItems: 'center',
    },
    errorMessage: {
      marginLeft: tokens.Spacing.Tiny,
    },
    submitButton: {
      width: '100%',
      marginTop: tokens.Spacing.Large,
    },
  }
}

MFAOptions.propTypes = {
  isSubmitting: PropTypes.bool,
  mfaCredentials: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
