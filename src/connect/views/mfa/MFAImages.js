import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

import { css } from '@mxenabled/cssinjs'
import { __ } from '../../../utils/Intl'

import { focusElement } from '../../utilities/Accessibility'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { CheckmarkFilled } from '@kyper/icon/CheckmarkFilled'
import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

export const MFAImages = props => {
  const { isSubmitting, mfaCredentials, onSubmit } = props
  useAnalyticsPath(...PageviewInfo.CONNECT_MFA_IMAGE_OPTIONS)
  const buttonRef = useCallback(button => {
    focusElement(button)
  }, [])
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const [selectedOption, setSelectedOption] = useState({})

  const [credentialsToSubmit, setCredentials] = useState(
    mfaCredentials.map(cred => ({ guid: cred.guid, value: null })),
  )

  const mfaLabel = mfaCredentials.map(credential => credential.label)

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleOnSubmit = () => {
    setIsSubmitted(true)

    if (_isEmpty(selectedOption)) {
      return false
    }

    return onSubmit(credentialsToSubmit)
  }

  return (
    <React.Fragment>
      <Text style={styles.label} tag="p">
        {mfaLabel}
      </Text>
      <div style={styles.imageWrapper}>
        {mfaCredentials.map(credential => {
          return credential.options.map((option, i) => {
            const isSelected = selectedOption.guid === option.guid

            const imageStyle =
              _isEmpty(selectedOption) && isSubmitted
                ? css(styles.imageButton, styles.errored)
                : css(styles.imageButton)

            return (
              <button
                className={imageStyle}
                disabled={isSubmitting}
                key={option.guid}
                onClick={() => {
                  setSelectedOption({ guid: option.guid })
                  setCredentials(
                    credentialsToSubmit.map(cred =>
                      credential.guid === option.credential_guid
                        ? { guid: option.credential_guid, value: option.guid }
                        : cred,
                    ),
                  )
                }}
                ref={i === 0 ? buttonRef : null}
                type="button"
              >
                <img
                  alt={`${credential.label} - ${option.label}`}
                  className={css(styles.mfaImage, isSelected && styles.selected)}
                  key={option.label}
                  src={option.data_uri}
                />
                {isSelected ? (
                  <CheckmarkFilled
                    aria-label={__('%1 Selected', option.label)}
                    color={tokens.Color.Primary300}
                    role="status"
                    size={16}
                    style={styles.checkMark}
                  />
                ) : null}
              </button>
            )
          })
        })}
      </div>
      {isSubmitted && _isEmpty(selectedOption) && (
        <section role="alert" style={styles.errorContent}>
          <AttentionFilled color={tokens.Color.Error300} />
          <p style={styles.errorMessage}>{__('Choose an image')}</p>
        </section>
      )}
      <Button onClick={handleOnSubmit} style={styles.submitButton} variant="primary">
        {isSubmitting ? `${__('Checking')}...` : __('Continue')}
      </Button>
    </React.Fragment>
  )
}

const getStyles = tokens => {
  return {
    label: {
      marginBottom: tokens.Spacing.Medium,
    },
    imageWrapper: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2 , 1fr)',
      gridRowGap: tokens.Spacing.Small,
      gridColumnGap: tokens.Spacing.Small,
    },
    imageButton: {
      position: 'relative',
      borderRadius: tokens.BorderRadius.Medium,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      backgroundColor: 'transparent',
      ':focus': {
        borderRadius: tokens.BorderRadius.Medium,
        border: `2px solid ${tokens.BorderColor.InputFocus}`,
        boxShadow: 'none',
      },
    },
    selected: {
      opacity: '70%',
    },
    errored: {
      border: `2px solid ${tokens.BorderColor.InputError}`,
      borderRadius: tokens.BorderRadius.Medium,
    },
    mfaImage: {
      borderRadius: tokens.BorderRadius.Medium,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      ':hover': {
        opacity: '70%',
      },
    },
    checkMark: {
      backgroundColor: tokens.Color.NeutralWhite,
      borderRadius: '50%',
      border: `2px solid ${tokens.Color.NeutralWhite}`,
      position: 'absolute',
      top: tokens.Spacing.XSmall,
      right: tokens.Spacing.XSmall,
    },
    errorContent: {
      marginTop: tokens.Spacing.XSmall,
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

MFAImages.propTypes = {
  isSubmitting: PropTypes.bool,
  mfaCredentials: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
