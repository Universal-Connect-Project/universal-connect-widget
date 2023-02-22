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
import numeral from 'numeral'

import { __ } from '../../utils/Intl'

const messages = {
  VALIDATION_REQUIRED: props => __('%1 is required', props.value),
  VALIDATION_MIN: props =>
    __('%1 must be greater than or equal to %2', props.value, props.expectation),
  VALIDATION_MAX: props =>
    __('%1 must be less than or equal to %2', props.value, props.expectation),
  VALIDATION_RANGE: props =>
    __('%1 must be between %2 and %3', props.value, props.lower, props.upper),
  VALIDATION_LENGTH: props => __('%1 must be %2 characters', props.value, props.length),
  VALIDATION_MINLENGTH: props => __('%1 must be at least %2 characters', props.value, props.length),
  VALIDATION_MAXLENGTH: props => __('%1 must be at most %2 characters', props.value, props.length),
  VALIDATION_RANGELENGTH: props =>
    __('%1 must be between %2 and %3 characters', props.value, props.lower, props.upper),
  VALIDATION_ONEOF: props => __('%1 must be one of: %2', props.value, props.list),
  VALIDATION_NUMBER: props => __('%1 must be a number', props.value),
  VALIDATION_DIGITS: props => __('%1 must only contain digits', props.value),
  VALIDATION_EMAIL: props => __('%1 must be a valid email', props.value),
  VALIDATION_URL: props => __('%1 must be a valid url', props.value),
  VALIDATION_INLINEPATTERN: props => __('%1 is invalid', props.value),
  VALIDATION_EQUALTO: props => __('%1 must be the same as %2', props.value, props.expectation),
}

const patternMessages = {
  number: props => messages.VALIDATION_NUMBER(props),
  digits: props => messages.VALIDATION_DIGITS(props),
  email: props => messages.VALIDATION_EMAIL(props),
  url: props => messages.VALIDATION_URL(props),
}

const validation = {
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
  _hasValue(value) {
    return (
      _isFinite(value) ||
      !(_isNil(value) || _isEmpty(value) || (_isString(value) && _trim(value) === ''))
    )
  },

  // FORMAT HELPERS:
  _formatLabel(key, schema) {
    return schema[key].label || key
  },
  _formatNumber(numberToFormat, formatToUse, fallback) {
    const formattedNumber = numeral(numberToFormat).format(formatToUse)

    // Infinity would return '$NaN' so we specifically handle that case here
    if (numberToFormat === Infinity) {
      return fallback ? fallback : 'NA'
    }
    // if numeral returns zero, but is not given zero, it is likely there was
    // some malformed data and should return the fallback string instead
    if (
      numberToFormat !== '0' &&
      numberToFormat !== 0 &&
      formattedNumber === numeral(0).format(formatToUse)
    ) {
      return fallback ? fallback : 'NA'
    }
    return formattedNumber
  },

  // VALIDATORS:
  _defaultValidators: {
    required(key, value, isRequired, schema) {
      if (!this._hasValue(value) && !isRequired) {
        return false
      }
      if (!this._hasValue(value) && isRequired) {
        return messages.VALIDATION_REQUIRED({ value: this._formatLabel(key, schema) })
      }
      return ''
    },

    min(key, value, minValue, schema) {
      const errorMessage = messages.VALIDATION_MIN({
        value: this._formatLabel(key, schema),
        expectation: this._formatNumber(minValue, '0.0[.]00', minValue),
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

    max(key, value, maxValue, schema) {
      const parsedValue = parseFloat(value)

      if (!_isFinite(parsedValue) || parsedValue > maxValue) {
        return messages.VALIDATION_MAX({
          value: this._formatLabel(key, schema),
          expectation: this._formatNumber(maxValue, '0,0[.]00', maxValue),
        })
      }
      return ''
    },

    range(key, value, range, schema) {
      const parsedValue = parseFloat(value)

      if (!_isFinite(parsedValue) || parsedValue < range[0] || parsedValue > range[1]) {
        return messages.VALIDATION_RANGE({
          value: this._formatLabel(key, schema),
          lower: range[0],
          upper: range[1],
        })
      }
      return ''
    },

    length(key, value, length, schema) {
      if (!_isString(value) || value.length !== length) {
        return messages.VALIDATION_LENGTH({
          value: this._formatLabel(key, schema),
          length,
        })
      }
      return ''
    },

    minLength(key, value, minLength, schema) {
      if (!_isString(value) || value.length < minLength) {
        return messages.VALIDATION_MINLENGTH({
          value: this._formatLabel(key, schema),
          length: minLength,
        })
      }
      return ''
    },

    maxLength(key, value, maxLength, schema) {
      if (!_isString(value) || value.length > maxLength) {
        return messages.VALIDATION_MAXLENGTH({
          value: this._formatLabel(key, schema),
          length: maxLength,
        })
      }
      return ''
    },

    rangeLength(key, value, range, schema) {
      if (!_isString(value) || value.length < range[0] || value.length > range[1]) {
        return messages.VALIDATION_RANGELENGTH({
          value: this._formatLabel(key, schema),
          lower: range[0],
          upper: range[1],
        })
      }
      return ''
    },

    oneOf(key, value, values, schema) {
      if (!_includes(values, value)) {
        return messages.VALIDATION_ONEOF({
          value: this._formatLabel(key, schema),
          list: values.join(', '),
        })
      }
      return ''
    },

    pattern(key, value, pattern, schema) {
      if (
        !this._hasValue(value) ||
        !value.toString().match(this.DEFAULT_PATTERNS[pattern] || pattern)
      ) {
        const messageDescriptor = patternMessages[pattern]
          ? patternMessages[pattern]({
              value: this._formatLabel(key, schema),
            })
          : messages.VALIDATION_INLINEPATTERN({
              value: this._formatLabel(key, schema),
            })

        return messageDescriptor
      }
      return ''
    },

    equalTo(key, value, attribute, schema, data) {
      if (value !== data[attribute]) {
        return messages.VALIDATION_EQUALTO({
          value: this._formatLabel(key, schema),
          expectation: this._formatLabel(attribute, schema),
        })
      }
      return ''
    },
  },

  _getValidatorsFromSchema(schema, key) {
    const defaultValidatorKeys = _keys(this._defaultValidators)

    return _keys(schema[key]).filter(value => {
      return defaultValidatorKeys.indexOf(value) !== -1
    })
  },

  _validateKey(schema, key, value, data) {
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
  validate(schema, data) {
    const invalidKeys = {}

    _each(data, (val, key) => {
      const error = this._validateKey(schema, key, val, data)

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
   * @returns {Object} validation errors
   */
  validateFields(schema, fieldNames, data, currentErrors) {
    const newErrors = fieldNames.reduce((errors, field) => {
      const error =
        validation.validate(schema, {
          // ensure there is a key so the field is validated
          [field]: null,
          ...data,
        }) || {}

      return {
        ...errors,
        [field]: error[field] || null,
      }
    }, {})

    return _pickBy({ ...currentErrors, ...newErrors })
  },
}

export default validation
