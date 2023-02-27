import { IntlProvider } from 'react-intl'

import _each from 'lodash/each'
import _hasKey from 'lodash/has'
import _includes from 'lodash/includes'
import _isEmpty from 'lodash/isEmpty'
import _isFunction from 'lodash/isFunction'
import _isNil from 'lodash/isNil'
import _isFinite from 'lodash/isFinite'
import _isString from 'lodash/isString'
import _keys from 'lodash/keys'
import _trim from 'lodash/trim'

import _pickBy from 'lodash/pickBy'

import { convertToMessages } from './Localization'
import { formatNumber } from './Formatting'

// HACK: this is temporary for backward compatibility until everywhere that uses Validation.validate() can be updated
const getTemporaryIntlContext = () => {
  logger.warn(`Deprecated, please provide a valid instance of intl`)

  const intlProvider = new IntlProvider({ locale: 'en', messages: {} }, {})

  return intlProvider.getChildContext().intl
}

const messages = convertToMessages({
  VALIDATION_REQUIRED: `{value} is required`,
  VALIDATION_MIN: `{value} must be greater than or equal to {expectation}`,
  VALIDATION_MAX: `{value} must be less than or equal to {expectation}`,
  VALIDATION_RANGE: `{value} must be between {lower} and {upper}`,
  VALIDATION_LENGTH: `{value} must be {length} characters`,
  VALIDATION_MINLENGTH: `{value} must be at least {length} characters`,
  VALIDATION_MAXLENGTH: `{value} must be at most {length} characters`,
  VALIDATION_RANGELENGTH: `{value} must be between {lower} and {upper} characters`,
  VALIDATION_ONEOF: `{value} must be one of: {list}`,
  VALIDATION_NUMBER: `{value} must be a number`,
  VALIDATION_DIGITS: `{value} must only contain digits`,
  VALIDATION_EMAIL: `{value} must be a valid email`,
  VALIDATION_URL: `{value} must be a valid url`,
  VALIDATION_INLINEPATTERN: `{value} is invalid`,
  VALIDATION_EQUALTO: `{value} must be the same as {expectation}`,
})

const patternMessages = {
  number: messages.VALIDATION_NUMBER,
  digits: messages.VALIDATION_DIGITS,
  email: messages.VALIDATION_EMAIL,
  url: messages.VALIDATION_URL,
}

const Validation = {
  DEFAULT_PATTERNS: {
    // Integer, no decimal
    digits: /^\d+$/,
    // Float
    number: /^-?\.?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
    money: /^-?\.?(?:(0|[1-9][0-9]*)|\d{1,3}(?:,\d{3})+)(?:\.\d{2})?$/,
    email: /^\S+@\S+\.\S+$/,
    url: /(.+)\.(.{2,})/g,
  },

  _isInt(n) {
    return n % 1 === 0
  },

  _isFloat(n) {
    return Number(n) === n && n % 1 !== 0
  },

  _defaultValidators: {
    required(key, value, isRequired, schema, intl) {
      if (!this._hasValue(value) && !isRequired) {
        return false
      }
      if (!this._hasValue(value) && isRequired) {
        return intl.formatMessage(messages.VALIDATION_REQUIRED, {
          value: this._formatLabel(key, schema),
        })
      }
      return ''
    },

    min(key, value, minValue, schema, intl) {
      const errorMessage = intl.formatMessage(messages.VALIDATION_MIN, {
        value: this._formatLabel(key, schema),
        expectation: formatNumber(minValue, '0,0[.]00'),
      })

      if (!this._hasValue(value) || !value.toString().match(this.DEFAULT_PATTERNS.number)) {
        return errorMessage
      }

      const newValue = Number(value)

      if (this._isInt(newValue) && parseInt(value, 0) < minValue) {
        return errorMessage
      }

      if (this._isFloat(newValue) && parseFloat(value) < minValue) {
        return errorMessage
      }
      return ''
    },

    max(key, value, maxValue, schema, intl) {
      const parsedValue = parseFloat(value)

      if (!_isFinite(parsedValue) || parsedValue > maxValue) {
        return intl.formatMessage(messages.VALIDATION_MAX, {
          value: this._formatLabel(key, schema),
          expectation: formatNumber(maxValue, '0,0[.]00'),
        })
      }
      return ''
    },

    range(key, value, range, schema, intl) {
      const parsedValue = parseFloat(value)

      if (!_isFinite(parsedValue) || parsedValue < range[0] || parsedValue > range[1]) {
        return intl.formatMessage(messages.VALIDATION_RANGE, {
          value: this._formatLabel(key, schema),
          lower: range[0],
          upper: range[1],
        })
      }
      return ''
    },

    length(key, value, length, schema, intl) {
      if (!_isString(value) || value.length !== length) {
        return intl.formatMessage(messages.VALIDATION_LENGTH, {
          value: this._formatLabel(key, schema),
          length,
        })
      }
      return ''
    },

    minLength(key, value, minLength, schema, intl) {
      if (!_isString(value) || value.length < minLength) {
        return intl.formatMessage(messages.VALIDATION_MINLENGTH, {
          value: this._formatLabel(key, schema),
          length: minLength,
        })
      }
      return ''
    },

    maxLength(key, value, maxLength, schema, intl) {
      if (!_isString(value) || value.length > maxLength) {
        return intl.formatMessage(messages.VALIDATION_MAXLENGTH, {
          value: this._formatLabel(key, schema),
          length: maxLength,
        })
      }
      return ''
    },

    rangeLength(key, value, range, schema, intl) {
      if (!_isString(value) || value.length < range[0] || value.length > range[1]) {
        return intl.formatMessage(messages.VALIDATION_RANGELENGTH, {
          value: this._formatLabel(key, schema),
          lower: range[0],
          upper: range[1],
        })
      }
      return ''
    },

    oneOf(key, value, values, schema, intl) {
      if (!_includes(values, value)) {
        return intl.formatMessage(messages.VALIDATION_ONEOF, {
          value: this._formatLabel(key, schema),
          list: values.join(', '),
        })
      }
      return ''
    },

    pattern(key, value, pattern, schema, intl) {
      if (
        !this._hasValue(value) ||
        !value.toString().match(this.DEFAULT_PATTERNS[pattern] || pattern)
      ) {
        const messageDescriptor = patternMessages[pattern]
          ? patternMessages[pattern]
          : messages.VALIDATION_INLINEPATTERN

        return intl.formatMessage(messageDescriptor, {
          value: this._formatLabel(key, schema),
        })
      }
      return ''
    },

    equalTo(key, value, attribute, schema, intl, data) {
      if (value !== data[attribute]) {
        return intl.formatMessage(messages.VALIDATION_EQUALTO, {
          value: this._formatLabel(key, schema),
          expectation: this._formatLabel(attribute, schema),
        })
      }
      return ''
    },
  },

  _formatLabel(key, schema) {
    return schema[key].label || key
  },

  _getValidatorsFromSchema(schema, key) {
    const defaultValidatorKeys = _keys(this._defaultValidators)

    return _keys(schema[key]).filter(value => {
      return defaultValidatorKeys.indexOf(value) !== -1
    })
  },

  _hasValue(value) {
    return (
      _isFinite(value) ||
      !(_isNil(value) || _isEmpty(value) || (_isString(value) && _trim(value) === ''))
    )
  },

  _validateKey(schema, key, value, data, intl) {
    let errorMessage = ''

    if (_hasKey(schema, key)) {
      if (_isFunction(schema[key])) {
        errorMessage = schema[key](value)
      } else {
        const validators = this._getValidatorsFromSchema(schema, key)

        errorMessage = validators.reduce((message, validator) => {
          const result = this._defaultValidators[validator].call(
            this,
            key,
            value,
            schema[key][validator],
            schema,
            intl || getTemporaryIntlContext(),
            data,
          )

          if ((!value && result === false) || message === false) {
            return false
          }

          if (result && !message) {
            return result
          }

          return message
        }, '')
      }
    }

    return errorMessage
  },

  /**
   * Validate `data` against a `schema`.
   *
   * WARNING: only keys present in `data` are validated, even if they're required in the `schema`.
   */
  validate(schema, data, intl) {
    const invalidKeys = {}

    _each(data, (val, key) => {
      const error = this._validateKey(schema, key, val, data, intl)

      if (error) {
        invalidKeys[key] = error
      }
    })

    return _isEmpty(invalidKeys) ? null : invalidKeys
  },

  /**
   * This helps to manage validating an array of fields.
   * currentErrors are combined with any new errors and resolved errors are removed.
   *
   * @param {Object} schema - schema for validation
   * @param {Object[]} fieldNames - an array of all the field names to be validated
   * @param {Object} data - the object to validate against the schema
   * @param {Object} currentErrors - errors from previously running this function
   * @param {Object} intl - intl object
   * @returns {Object} validation errors
   */
  validateFields(schema, fieldNames, data, currentErrors, intl) {
    const newErrors = fieldNames.reduce((errors, field) => {
      const error =
        Validation.validate(
          schema,
          {
            // ensure there is a key so the field is validated
            [field]: null,
            ...data,
          },
          intl,
        ) || {}

      return {
        ...errors,
        [field]: error[field] || null,
      }
    }, {})

    return _pickBy({ ...currentErrors, ...newErrors })
  },
}

export default Validation
