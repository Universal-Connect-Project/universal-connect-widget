import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { from, of, zip, defer } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import _some from 'lodash/some'
import _startsWith from 'lodash/startsWith'

import { Button } from '@kyper/button'
import { Select } from '@kyper/select'
import { SelectionBox } from '@kyper/selectionbox'
import { Text } from '@kyper/text'
import { TextInput } from '@kyper/input'
import { MessageBox } from '@kyper/messagebox'
import { useTokens } from '@kyper/tokenprovider'

import _isEmpty from 'lodash/isEmpty'

import { __ } from '../../../utils/Intl'
import { fadeOut } from '../../utilities/Animation'
import FireflyAPI from '../../../utils/FireflyAPI'
import { useForm } from '../../hooks/useForm'
import { AccountTypeNames } from './constants'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { addManualAccountSuccess } from '../../../redux/actions/Connect'

import { getMembers } from '../../../redux/selectors/Connect'

import { getDelay } from '../../utilities/getDelay'
import { getFormFields } from './utils'
import { StyledAccountTypeIcon } from '../../components/StyledAccountTypeIcon'
import { DayOfMonthPicker } from '../../components/DayOfMonthPicker'
import { GoBackButton } from '../../components/GoBackButton'
import { SlideDown } from '../../components/SlideDown'
import { AriaLive } from '../../accessibility/AriaLive'

export const ManualAccountForm = props => {
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MANUAL_ACCOUNT_FORM)

  const members = useSelector(getMembers)
  const [saving, setSaving] = useState(false)
  const [isPersonal, setIsPersonal] = useState(true)
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [returnField, setReturnField] = useState(null)
  const [accountCreationError, setAccountCreationError] = useState(null)
  const dispatch = useDispatch()
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()
  const fields = getFormFields(props.accountType)
  const { handleTextInputChange, handleSubmit, values, errors } = useForm(
    () => setSaving(true),
    createSchema(),
    createInitialForm(),
  )

  function createInitialForm() {
    const initialForm = {}

    fields.forEach(field => {
      if (field.name !== 'is_personal') {
        initialForm[field.name] = ''
      }
    })

    return initialForm
  }

  function createSchema() {
    const schema = {}

    fields.forEach(field => {
      if (field.name !== 'is_personal') {
        schema[field.name] = {
          label: field.label,
          required: field.validation?.required ?? false,
        }

        if (field.validation?.pattern) schema[field.name].pattern = field.validation.pattern
        if (field.validation?.max) schema[field.name].max = field.validation.max
        if (field.validation?.min) schema[field.name].min = field.validation.min
      }
    })

    return schema
  }

  useEffect(() => {
    if (!saving) return () => {}
    const createManualAccount$ = defer(() =>
      FireflyAPI.createAccount({
        ...values,
        account_type: props.accountType,
        is_personal: isPersonal,
      }),
    )
      .pipe(
        mergeMap(savedAccount => {
          const alreadyHasManualMember = _some(members, member =>
            _startsWith(member.institution_guid, 'INS-MANUAL'),
          )

          // If we already have a manual account member just update the account
          if (alreadyHasManualMember) {
            return of(addManualAccountSuccess(savedAccount))
          }

          // Otherwise go get the newly created account's member and institution
          return zip(
            from(FireflyAPI.loadMemberByGuid(savedAccount.member_guid)),
            from(FireflyAPI.loadInstitutionByGuid(savedAccount.institution_guid)),
          ).pipe(
            map(([loadedMember, loadedInstitution]) => {
              return addManualAccountSuccess(savedAccount, loadedMember, loadedInstitution)
            }),
          )
        }),
        catchError(err => {
          throw err
        }),
      )
      .subscribe(
        action => {
          setSaving(false)
          dispatch(action)
          fadeOut(containerRef.current, 'up', 300).then(props.handleSuccess())
        },
        error => {
          setSaving(false)
          setAccountCreationError(error)
        },
      )
    return () => createManualAccount$.unsubscribe()
  }, [saving])

  // When opening the date picker, upon return the focus is back at the beginning of the
  // form. We set returnField to know which field to focus when we return. If there is no
  // return field, we focus on the first item in the form.
  const shouldFocus = (field, returnField, i) => (returnField ? returnField === field : i === 0)

  if (showDayPicker) {
    return (
      <DayOfMonthPicker
        handleClose={() => setShowDayPicker(false)}
        handleSelect={e => {
          handleTextInputChange(e)
          setShowDayPicker(false)
        }}
        name="day_payment_is_due"
      />
    )
  }

  return (
    <div ref={containerRef}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton
          handleGoBack={() => fadeOut(containerRef.current, 'up', 300).then(props.handleGoBack)}
        />
        <Text style={styles.title} tag="h2">
          <StyledAccountTypeIcon
            icon={props.accountType}
            iconSize={20}
            size={32}
            style={styles.icon}
          />
          {AccountTypeNames[props.accountType]}
        </Text>
      </SlideDown>
      <SlideDown delay={getNextDelay()}>
        {fields.map((field, i) => {
          if (field.type === 'SelectionBox') {
            return (
              <div key={i} style={styles.selectBoxes}>
                <SelectionBox
                  checked={isPersonal}
                  id={'personal'}
                  label={__('Personal')}
                  name="accountType"
                  onChange={() => setIsPersonal(true)}
                  style={styles.selectBox}
                  value={'personal'}
                />
                <SelectionBox
                  checked={!isPersonal}
                  id={'business'}
                  label={__('Business')}
                  name="accountType"
                  onChange={() => setIsPersonal(false)}
                  style={styles.selectBox}
                  value={'business'}
                />
              </div>
            )
          } else if (field.type === 'DateInput') {
            return (
              <div key={i} style={styles.dateInput}>
                <TextInput
                  autoFocus={shouldFocus(field.name, returnField, i)}
                  errorText={errors[field.name]}
                  label={field.label}
                  name={field.name}
                  onChange={() => {
                    setReturnField(field.name)
                    setShowDayPicker(true)
                  }}
                  onClick={() => {
                    setReturnField(field.name)
                    setShowDayPicker(true)
                  }}
                  value={values[field.name]}
                />
              </div>
            )
          } else if (field.type === 'Select') {
            return (
              <div key={i} style={styles.selectInput}>
                <Select
                  errorText={errors[field.name]}
                  items={field.options}
                  label={field.label}
                  name={field.name}
                  onChange={handleTextInputChange}
                  placeholder={__('Select a value')}
                />
              </div>
            )
          } else {
            return (
              <div key={i} style={styles.textInput}>
                <TextInput
                  autoFocus={shouldFocus(field.name, returnField, i)}
                  errorText={errors[field.name]}
                  label={field.label}
                  name={field.name}
                  onChange={handleTextInputChange}
                  value={values[field.name]}
                />
              </div>
            )
          }
        })}
      </SlideDown>
      {accountCreationError && (
        <SlideDown delay={getNextDelay()}>
          <MessageBox title={__('Something went wrong')} variant="error">
            <Text as="Paragraph" role="alert" tag="p">
              {__('Please try saving your account again.')}
            </Text>
          </MessageBox>
        </SlideDown>
      )}
      <SlideDown delay={getNextDelay()}>
        <Button
          disabled={saving}
          onClick={handleSubmit}
          style={styles.saveButton}
          variant="primary"
        >
          {__('Save')}
        </Button>
      </SlideDown>
      {!_isEmpty(errors) && (
        <AriaLive
          level="assertive"
          message={Object.values(errors)
            .map(msg => `${msg}, `)
            .join()}
        />
      )}
    </div>
  )
}

const getStyles = tokens => ({
  title: {
    display: 'flex',
    marginBottom: tokens.Spacing.Large,
    marginTop: tokens.Spacing.XSmall,
  },
  icon: {
    borderRadius: tokens.BorderRadius.Medium,
    marginRight: tokens.Spacing.Small,
  },
  selectBoxes: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: `${tokens.Spacing.XLarge}px 0`,
  },
  selectBox: {
    width: '48%',
  },
  dateInput: {
    marginTop: tokens.Spacing.XLarge,
  },
  selectInput: {
    marginTop: tokens.Spacing.XLarge,
  },
  textInput: {
    marginTop: tokens.Spacing.XLarge,
  },
  saveButton: {
    marginTop: tokens.Spacing.Medium,
    width: '100%',
  },
})

ManualAccountForm.propTypes = {
  accountType: PropTypes.number,
  handleGoBack: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
}
