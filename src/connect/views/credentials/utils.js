/**
 * Builds our useForm hooks initial values object
 *
 * Turns an array of objects like this
 * [
 *   {
 *     field_name: "username",
 *     field_type: 3,
 *     label: "username"
 *   },
 *   {
 *     field_name: "password",
 *     field_type: 1,
 *     label: "password"
 *   },
 * ]
 *
 * Into an object like this
 * {
 *    username: "",
 *    password: ""
 * }
 *
 * @param {array} loginFields
 * @returns {object}
 */
/* eslint-disable no-param-reassign */
export const buildInitialValues = loginFields => {
  // console.log('overriding loginFilds')
  // if(!loginFields.reduce){
  //   loginFields = loginFields.credentials;
  // }
  return loginFields.reduce((acc, currentField) => {
    return {
      ...acc,
      [currentField.field_name]: '',
    }
  }, {})
}

/**
 * Builds our useForm hooks form schema based on dynamic values
 *
 * Turns an array of objects like this
 * [
 *   {
 *     field_name: "username",
 *     field_type: 3,
 *     label: "username"
 *   },
 *   {
 *     field_name: "password",
 *     field_type: 1,
 *     label: "password"
 *   },
 * ]
 *
 * And turns it into an object like this
 * {
 *   username: {
 *     label: "username",
 *     required: true
 *   },
 *   password: {
 *     label: "password",
 *     required: true
 *   }
 * }
 *
 * @param {object} loginFields
 * @returns {object}
 */
export const buildFormSchema = loginFields => {
  // if(!loginFields.reduce){
  //   loginFields = loginFields.credentials;
  // }
  return loginFields.reduce((acc, currentField) => {
    return {
      ...acc,
      [currentField.field_name]: {
        label: currentField.label,
        required: true,
      },
    }
  }, {})
}
