import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

import { useTokens } from '@kyper/tokenprovider'
import { TextInput } from '@kyper/input'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'
import { TextArea } from '@kyper/textarea'

import { fadeOut } from '../../utilities/Animation'
import { __ } from '../../../utils/Intl'
import FireflyAPI from '../../../utils/FireflyAPI'
import { AriaLive } from '../../accessibility/AriaLive'

import { SlideDown } from '../SlideDown'
import { GoBackButton } from '../GoBackButton'
import { PrivateAndSecure } from '../PrivateAndSecure'
import { getDelay } from '../../utilities/getDelay'
import { useForm } from '../../hooks/useForm'

export const GeneralSupport = props => {
  const { handleClose, handleTicketSuccess, user } = props
  const containerRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const initialForm = {
    email: user.email ?? '',
    issueDescription: '',
    issueDetails: '',
  }
  const { handleTextInputChange, handleSubmit, values, errors } = useForm(
    () => setSubmitting(true),
    schema,
    initialForm,
  )

  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  useEffect(() => {
    if (submitting) {
      const ticket = {
        email: values.email,
        message: values.issueDetails,
        title: values.issueDescription,
      }

      FireflyAPI.createSupportTicket(ticket).then(() =>
        fadeOut(containerRef.current, 'up', 300).then(() => handleTicketSuccess(values.email)),
      )
    }
  }, [submitting])

  return (
    <div ref={containerRef} style={styles.container}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton
          handleGoBack={() => fadeOut(containerRef.current, 'up', 300).then(() => handleClose())}
        />

        <Text style={styles.title} tag="h2">
          {__('Request support')}
        </Text>

        <Text as="Paragraph" style={styles.paragraph} tag="p">
          {__(
            'Please use this form for technical issues about connecting your account. Do not include private or financial information, such as account number or password. For financial issues about transactions, bill pay, transfers, loans, rewards and so on, please contact the appropriate customer service department directly.',
          )}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        {!user.email && (
          <div style={styles.input}>
            <TextInput
              autoComplete="off"
              autoFocus={!user.email}
              disabled={submitting}
              errorText={errors.email}
              label={schema.email.label}
              name="email"
              onChange={handleTextInputChange}
              showErrorIcon={true}
              value={values.email}
            />
          </div>
        )}
        <div style={styles.input}>
          <TextInput
            autoComplete="off"
            autoFocus={user.email}
            disabled={submitting}
            errorText={errors.issueDescription}
            label={schema.issueDescription.label}
            name="issueDescription"
            onChange={handleTextInputChange}
            showErrorIcon={true}
            value={values.issueDescription}
          />
        </div>
        <div style={styles.input}>
          <TextArea
            autoComplete="off"
            disabled={submitting}
            errorText={errors.issueDetails}
            label={schema.issueDetails.label}
            name="issueDetails"
            onChange={handleTextInputChange}
            showErrorIcon={true}
            value={values.issueDetails}
          />
        </div>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <div style={styles.buttons}>
          <Button
            disabled={submitting}
            onClick={() => fadeOut(containerRef.current, 'up', 300).then(() => handleClose())}
            style={{ ...styles.firstButton, ...styles.button }}
            type="submit"
            variant="neutral"
          >
            {__('Cancel')}
          </Button>
          <Button
            disabled={submitting}
            onClick={handleSubmit}
            style={styles.button}
            type="submit"
            variant="primary"
          >
            {__('Continue')}
          </Button>
        </div>
        <PrivateAndSecure />
      </SlideDown>

      <AriaLive
        level="assertive"
        message={
          _isEmpty(errors)
            ? ''
            : `${errors.email ?? ''} ${errors.issueDescription ?? ''} ${errors.issueDetails ?? ''}`
        }
      />
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    margin: tokens.Spacing.Large,
  },
  title: {
    display: 'block',
    marginBottom: tokens.Spacing.XSmall,
  },
  paragraph: {
    display: 'block',
    marginBottom: tokens.Spacing.Medium,
  },
  input: {
    marginBottom: tokens.Spacing.Medium,
  },
  buttons: {
    display: 'flex',
    marginTop: tokens.Spacing.XSmall,
  },
  firstButton: {
    marginRight: tokens.Spacing.Small,
  },
  button: {
    flexGrow: 1,
  },
})

GeneralSupport.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleTicketSuccess: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

const schema = {
  email: {
    label: __('Your email address'),
    required: true,
    pattern: 'email',
  },
  issueDescription: {
    label: __('Brief description of the issue'),
    required: true,
  },
  issueDetails: {
    label: __('Details of the issue'),
    required: true,
  },
}
