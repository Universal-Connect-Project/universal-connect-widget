import { useState } from 'react'

import validation from '../utilities/validation'

/**
 * Simple form hook to manage values, form errors and submit
 *
 * @param {func}   submitCallback Callback for your submit handler
 * @param {object} formSchema     Validation object (see src/connect/utilities/validation.js)
 *
 * const formSchema = {
 *   username: {
 *     label: 'Username',
 *     required: true,
 *   },
 *   password: {
 *     label: 'Password',
 *     required: true,
 *   }
 *   email: {
 *     label: 'Email',
 *     required: false, <-- For optional fields explicitly false to prevent patterns from running
 *     pattern: 'url'
 *   }
 * }
 *
 * @param {object} initialValues  Sets our starting values
 *
 * const initialValues = {
 *   username: 'My Username',
 *   password: '',
 *   email: ''
 * }
 *
 * This is needed so that we get translated error messages since we
 * Utilize the Validation.js library for all our form messages
 *
 */
export const useForm = (submitCallback, formSchema, initialValues) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleSubmit = event => {
    if (!event) {
      throw new Error('handleSubmit event not found')
    }

    event.preventDefault()
    event.stopPropagation()

    const resultBag = validation.validate(formSchema, values)

    if (resultBag) {
      setErrors(resultBag)
    } else {
      setErrors({})
      submitCallback()
    }
  }

  const handleTextInputChange = event => {
    if (event.persist) {
      event.persist()
    }

    setValues(values => ({ ...values, [event.target.name]: event.target.value }))
  }

  return {
    // Function to handle your form input onChange event
    handleTextInputChange,

    // Function to handle your submit callback
    handleSubmit,

    // Object of key value pairs, based on input changed
    values,

    // Object of key value pairs, based on formScheme and any field error strings returned from Validation
    errors,
  }
}
