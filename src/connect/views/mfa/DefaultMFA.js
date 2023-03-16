import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { TextInput } from '@kyper/input'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import { __ } from '../../../utils/Intl'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { useForm } from '../../hooks/useForm'
import { buildInitialValues, buildFormSchema } from './utils'
import { focusElement } from '../../utilities/Accessibility'
import { AriaLive } from '../../accessibility/AriaLive'

export const DefaultMFA = props => {
  const { isSubmitting, mfaCredentials, onSubmit } = props
  useAnalyticsPath(...PageviewInfo.CONNECT_MFA_DEFAULT)
  const buttonRef = useCallback(button => {
    focusElement(button)
  }, [])

  const tokens = useTokens()
  const styles = getStyles(tokens)

  const credentials = mfaCredentials.map(credential => credential)

  // initialFormValues is used to build out the form in order to use the useForm validation hook we first build the initialValues based on the data structure
  // we then build out the formSchema which is then send out to the useForm hook along with the initialValues to validate those fields
  const initialFormValues = buildInitialValues(credentials)
  const formSchema = buildFormSchema(credentials)
  const { values, handleTextInputChange, handleSubmit, errors } = useForm(
    submitMFA,
    formSchema,
    initialFormValues,
  )

  //when we submitMFA this function maps over those credentials and finds the value based on the credential.label value if there are errors those errors
  //continue to show and if part of the form no longer have errors those are cleared out we only submit the form until all errors have been cleared out
  function submitMFA() {
    const credentialsPayload = credentials.map(credential => {
      return {
        guid: credential.guid,
        value: values[credential.label],
      }
    })

    onSubmit(credentialsPayload)
  }

  return (
    <React.Fragment>
      {mfaCredentials.map((credential, i) => {
        const metaData = credential.meta_data || credential.image_data

        return (
          <div key={credential.label} style={styles.label}>
            <Text style={styles.challengeLabel} tag="p">
              {credential.label}
            </Text>
            {metaData ? (
              <div style={styles.metaData}>
                <img alt={__('Challenge Image')} src={metaData} style={styles.mfaImage} />
              </div>
            ) : null}
            <TextInput
              aria-label={credential.label}
              disabled={isSubmitting}
              errorText={errors[credential.label]}
              name={credential.label}
              onChange={handleTextInputChange}
              ref={i === 0 ? buttonRef : null}
              showErrorIcon={true}
              value={values[credential.label] || ''}
            />
          </div>
        )
      })}

      <Button onClick={handleSubmit} style={styles.submitButton} type="submit" variant="primary">
        {isSubmitting ? `${__('Checking')}...` : __('Continue')}
      </Button>

      <AriaLive
        level="assertive"
        message={Object.values(errors)
          .map(msg => `${msg}, `)
          .join()}
      />
    </React.Fragment>
  )
}

const getStyles = tokens => {
  return {
    label: {
      marginBottom: tokens.Spacing.Large,
    },
    challengeLabel: {
      marginBottom: tokens.Spacing.Tiny,
    },
    metaData: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: `${tokens.Spacing.Medium}px 0px`,
    },
    mfaImage: {
      display: 'block',
      maxWidth: '100%',
      objectFit: 'contain',
      width: 'auto',
      height: 'auto',
      borderRadius: tokens.BorderRadius.Medium,
    },
    submitButton: {
      marginTop: tokens.Spacing.XLarge,
      width: '100%',
    },
  }
}

DefaultMFA.propTypes = {
  isSubmitting: PropTypes.bool,
  mfaCredentials: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
