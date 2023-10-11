import React, { Fragment, useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useDispatch, useSelector } from 'react-redux'

import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { MessageBox } from '@kyper/messagebox'
import { useTokens } from '@kyper/tokenprovider'
import { Export } from '@kyper/icon/Export'
import { ChevronRight } from '@kyper/icon/ChevronRight'
import { TextInput, PasswordInput } from '@kyper/input'
import { Spinner } from '@kyper/progressindicators'

import { __ } from '../../../utils/Intl'
import { getInstitutionLoginUrl } from '../../utilities/Institution'
import { fadeOut } from '../../utilities/Animation'
import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'
import { sendPostMessage } from '../../../redux/actions/PostMessage'

import { AGG_MODE } from '../../const/Connect'
import { ReadableStatuses } from '../../const/Statuses'

import { EventCategories, EventLabels, EventActions } from '../../const/Analytics'
import { AriaLive } from '../../accessibility/AriaLive'

import { MemberError } from '../../components/MemberError'
import { Container } from '../../components/Container'
import { SlideDown } from '../../components/SlideDown'
import { LeavingNoticeFlat } from '../../components/LeavingNoticeFlat'
import { InstitutionBlock } from '../../components/InstitutionBlock'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'
import { ActionableUtilityRow } from '../../components/ActionableUtilityRow'
import { InstructionalText } from '../../components/InstructionalText'
import { InstructionList } from '../../components/InstructionList'
import { Support, VIEWS as SUPPORT_VIEWS } from '../../components/support/Support'
import { getCurrentMember } from '../../../redux/selectors/Connect'

import { buildInitialValues, buildFormSchema } from './utils'
import { CREDENTIAL_FIELD_TYPES } from './consts'

import { useForm } from '../../hooks/useForm'
import { getDelay } from '../../utilities/getDelay'
import { goToUrlLink } from '../../utilities/global'
import {
  CONNECT_FORGOT_CREDENTIALS_EXPERIMENT,
  CONNECT_FORGOT_CREDENTIALS,
  CONNECT_GO_TO_INSTITUTION,
} from '../../experiments'

import { scrollToTop } from '../../utilities/ScrollToTop'

import PoweredByMX from '../disclosure/PoweredByMX'
import StickyComponentContainer from '../../components/StickyComponentContainer'
import useExperiment from '../../hooks/useExperiment'
import { CONNECT_HIDE_LIGHT_DISCLOSURE_EXPERIMENT } from '../../experiments'
import { DisclosureInterstitial } from '../disclosure/Interstitial'

export const Credentials = ({
  credentials,
  error,
  handleSubmitCredentials,
  isProcessingMember,
  onDeleteConnectionClick,
  onGoBackClick,
}) => {
  const { experimentVariant: hideLightDisclosure } = useExperiment(
    CONNECT_HIDE_LIGHT_DISCLOSURE_EXPERIMENT,
  )

  const containerRef = useRef(null)
  const interstitialRef = useRef(null)
  // Redux Selectors/Dispatch
  const connectConfig = useSelector(state => state.connect.connectConfig)
  const isSmall = useSelector(state => state.browser.size) === 'small'
  const institution = useSelector(state => state.connect.selectedInstitution)
  const showExternalLinkPopup = useSelector(state => state.clientProfile.show_external_link_popup)
  const showSupport = useSelector(
    state => state.connect.widgetProfile.enable_support_requests && connectConfig.mode === AGG_MODE,
  )
  const showDisclosureStep = useSelector(
    state => state.connect.widgetProfile.display_disclosure_in_connect,
  )
  const currentMember = useSelector(getCurrentMember)
  const isDeleteInstitutionOptionEnabled = useSelector(
    state => state.connect.widgetProfile?.display_delete_option_in_connect ?? true,
  )

  const dispatch = useDispatch()
  // Component state
  const [isLeavingUrl, setIsLeavingUrl] = useState(null)
  const [showSupportView, setShowSupportView] = useState(false)
  const [showInterstitialDisclosure, setShowInterstitialDisclosure] = useState(false)
  const [needToSendAnalyticEvent, setNeedToSendAnalyticEvent] = useState(true)
  const [needToSendPasswordAnalyticEvent, setPasswordAnalyticEvent] = useState(true)

  const { experimentVariant } = useExperiment(CONNECT_FORGOT_CREDENTIALS_EXPERIMENT, {
    [CONNECT_FORGOT_CREDENTIALS]: '/c',
    [CONNECT_GO_TO_INSTITUTION]: '/d',
  })

  const tokens = useTokens()
  const styles = getStyles(tokens, isSmall)
  const getNextDelay = getDelay(0, 100)
  const isInstitutionSearchEnabled = !connectConfig.disable_institution_search
  const initialValues = buildInitialValues(credentials)
  const formSchema = buildFormSchema(credentials)
  const loginFieldCount = credentials.length
  const showDisconnectOption =
    currentMember.is_managed_by_user &&
    !currentMember.is_being_aggreated &&
    isDeleteInstitutionOptionEnabled

  const recoveryUrls = [
    {
      url: institution.forgot_password_credential_recovery_url,
      recoveryText: __('Forgot your password?'),
    },
    {
      url: institution.forgot_username_credential_recovery_url,
      recoveryText: __('Forgot your username?'),
    },
    {
      url: institution.trouble_signing_credential_recovery_url,
      recoveryText: __('Trouble signing in?'),
    },
  ].filter(url => {
    return url.url
  })
  function credentialRecovery() {
    if (experimentVariant === CONNECT_FORGOT_CREDENTIALS && recoveryUrls.length) {
      return recoveryUrls.map((recoveryInstitution, i) => {
        return (
          <ActionableUtilityRow
            icon={<Export color={tokens.TextColor.ButtonLinkTertiary} size={16} />}
            key={i}
            onClick={() => {
              dispatch(
                sendAnalyticsEvent({
                  category: EventCategories.CONNECT,
                  label: EventLabels.CREDENTIALS_GO_TO_INSTITUTION,
                  action: `${EventLabels.CREDENTIALS_GO_TO_INSTITUTION} - ${EventActions.CREDENTIAL_RECOVERY} - c`,
                }),
              )

              if (showExternalLinkPopup) {
                setIsLeavingUrl(recoveryInstitution.url)
              } else {
                goToUrlLink(recoveryInstitution.url)
              }
            }}
            role="link"
            text={recoveryInstitution.recoveryText}
          />
        )
      })
    } else {
      return (
        <ActionableUtilityRow
          icon={<Export color={tokens.TextColor.ButtonLinkTertiary} size={16} />}
          onClick={() => {
            if (experimentVariant === CONNECT_GO_TO_INSTITUTION) {
              dispatch(
                sendAnalyticsEvent({
                  category: EventCategories.CONNECT,
                  label: EventLabels.CREDENTIALS_GO_TO_INSTITUTION,
                  action: `${EventLabels.CREDENTIALS_GO_TO_INSTITUTION} - ${EventActions.CREDENTIAL_RECOVERY} - d`,
                }),
              )
            }

            if (showExternalLinkPopup) {
              setIsLeavingUrl(getInstitutionLoginUrl(institution))
            } else {
              goToUrlLink(getInstitutionLoginUrl(institution))
            }
          }}
          role="link"
          text={__("Go to institution's website")}
        />
      )
    }
  }

  const handleUserNameTextChange = e => {
    if (needToSendAnalyticEvent) {
      dispatch(
        sendAnalyticsEvent({
          category: EventCategories.CONNECT,
          label: EventLabels.ENTER_CREDENTIALS,
          action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.USERNAME_ENTERED}`,
        }),
      )

      setNeedToSendAnalyticEvent(false)
    }

    handleTextInputChange(e)
  }

  const handlePasswordTextChange = e => {
    if (needToSendPasswordAnalyticEvent) {
      dispatch(
        sendAnalyticsEvent({
          category: EventCategories.CONNECT,
          label: EventLabels.ENTER_CREDENTIALS,
          action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.PASSWORD_ENTERED}`,
        }),
      )

      setPasswordAnalyticEvent(false)
    }

    handleTextInputChange(e)
  }
  // When working inside a form with a kyper/password input
  // When pressing enter it wants to toggle the hide/show button
  // This is a way to manually check for ENTER and attempt the submit
  const handlePasswordEnterChange = e => {
    // Enter key
    if (e.keyCode === 13) {
      handleSubmit(e)
    }
  }

  const { values, handleTextInputChange, handleSubmit, errors } = useForm(
    attemptConnect,
    formSchema,
    initialValues,
  )

  function attemptConnect() {
    const credentialsPayload = credentials.map(credential => {
      return {
        guid: credential.guid,
        value: values[credential.field_name],
      }
    })

    handleSubmitCredentials(credentialsPayload)

    dispatch(
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label: EventLabels.ENTER_CREDENTIALS,
        provider: institution.provider,
        institution: institution.name,
        action: EventLabels.ENTER_CREDENTIALS + ' - ' + EventActions.END + ' (Submitted)',
      }),
    )
  }

  useEffect(() => {
    if (currentMember.connection_status === ReadableStatuses.DENIED) {
      dispatch(
        sendPostMessage('connect/memberError', {
          member: {
            guid: currentMember.guid,
            connection_status: currentMember.connection_status,
          },
        }),
      )
    }
  }, [currentMember])

  if (showSupportView) {
    return <Support loadToView={SUPPORT_VIEWS.MENU} onClose={() => setShowSupportView(false)} />
  }

  const footer =
    !showDisclosureStep && !hideLightDisclosure ? (
      <PoweredByMX
        onClick={() => {
          scrollToTop(containerRef)
          setShowInterstitialDisclosure(true)
        }}
      />
    ) : null
  const selectedInstructionalData = {
    description:
      currentMember?.instructional_data?.description ?? institution.instructional_data.description,
    steps: currentMember?.instructional_data?.steps ?? institution.instructional_data.steps,
    title: currentMember?.instructional_data?.title ?? institution.instructional_data.title,
  }

  if (showInterstitialDisclosure) {
    return (
      <Container ref={interstitialRef}>
        <DisclosureInterstitial
          handleGoBack={() => setShowInterstitialDisclosure(false)}
          scrollToTop={() => {
            scrollToTop(interstitialRef)
          }}
        />
      </Container>
    )
  }

  return (
    <StickyComponentContainer footer={footer} ref={containerRef}>
      {isLeavingUrl ? (
        <SlideDown>
          <LeavingNoticeFlat
            onCancel={() => {
              dispatch(
                sendAnalyticsEvent({
                  category: EventCategories.CONNECT,
                  label: EventLabels.ENTER_CREDENTIALS,
                  action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.VISIT_BANK} - ${EventActions.CANCEL}`,
                }),
              )
              setIsLeavingUrl(null)
            }}
            onContinue={() => {
              dispatch(
                sendAnalyticsEvent({
                  category: EventCategories.CONNECT,
                  label: EventLabels.ENTER_CREDENTIALS,
                  action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.VISIT_BANK} - ${EventActions.END}`,
                }),
              )

              goToUrlLink(isLeavingUrl)
            }}
          />
        </SlideDown>
      ) : (
        <Fragment>
          <SlideDown delay={getNextDelay()}>
            <InstitutionBlock
              institution={institution}
              style={{ marginBottom: tokens.Spacing.Large }}
            />
          </SlideDown>

          <SlideDown delay={getNextDelay()}>
            <Text as="H2" color="primary" style={styles.headerText} tag="h2">
              {selectedInstructionalData.title ?? __('Enter your credentials')}
            </Text>
          </SlideDown>

          {selectedInstructionalData.description && (
            <SlideDown delay={getNextDelay()}>
              <InstructionalText
                instructionalText={selectedInstructionalData.description}
                setIsLeavingUrl={setIsLeavingUrl}
                showExternalLinkPopup={showExternalLinkPopup}
              />
            </SlideDown>
          )}

          {selectedInstructionalData.steps?.length > 0 && (
            <InstructionList
              items={selectedInstructionalData.steps}
              setIsLeavingUrl={setIsLeavingUrl}
              showExternalLinkPopup={showExternalLinkPopup}
            />
          )}

          {!_isEmpty(error) && (
            <SlideDown delay={getNextDelay()}>
              <MemberError error={error} institution={institution} />
            </SlideDown>
          )}

          {_isEmpty(error) && currentMember.connection_status === ReadableStatuses.DENIED && (
            <SlideDown delay={getNextDelay()}>
              <MessageBox
                style={styles.credentialsError}
                title={__('Incorrect Credentials')}
                variant="error"
              >
                <Text as="ParagraphSmall" data-test={'incorrect-credentials'} role="alert">
                  {__(
                    'The credentials entered do not match those at %1. Please correct them below to continue.',
                    institution.name,
                  )}
                </Text>
              </MessageBox>
            </SlideDown>
          )}

          {loginFieldCount > 0 ? (
            <form
              autoComplete="new-password"
              id="credentials_form"
              onSubmit={e => e.preventDefault()}
              style={styles.form}
            >
              {credentials.map((field, i) => (
                <SlideDown delay={getNextDelay()} key={field.guid}>
                  {field.field_type === CREDENTIAL_FIELD_TYPES.PASSWORD ? (
                    <div style={errors[field.field_name] ? styles.inputError : styles.input}>
                      <PasswordInput
                        allowToggle={true}
                        aria-label={field.label}
                        ariaHideLabel={__('Hide password')}
                        ariaShowLabel={__('Show password')}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        capsLockWarningText={__('Caps lock is on')}
                        disabled={isProcessingMember}
                        errorText={errors[field.field_name]}
                        label={field.label}
                        name={field.field_name}
                        onChange={handlePasswordTextChange}
                        onKeyDown={handlePasswordEnterChange}
                        showErrorIcon={true}
                        spellCheck="false"
                        value={values[field.field_name] || ''}
                      />
                    </div>
                  ) : (
                    <div style={errors[field.field_name] ? styles.inputError : styles.input}>
                      <TextInput
                        aria-label={field.label}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        autoFocus={i === 0}
                        disabled={isProcessingMember}
                        errorText={errors[field.field_name]}
                        label={field.label}
                        name={field.field_name}
                        onChange={handleUserNameTextChange}
                        showErrorIcon={true}
                        spellCheck="false"
                        value={values[field.field_name] || ''}
                      />
                    </div>
                  )}
                </SlideDown>
              ))}

              <SlideDown delay={getNextDelay()}>
                {isProcessingMember ? (
                  <div style={styles.loader}>
                    <Spinner bgColor={'transparent'} fgColor={tokens.Color.Brand300} />
                    <Text as="Paragraph" style={styles.loaderText} tag="p">
                      {__('Loading ...')}
                    </Text>
                  </div>
                ) : (
                  <Button
                    data-test="connect-credentials-button"
                    onClick={handleSubmit}
                    style={styles.button}
                    type="submit"
                    variant="primary"
                  >
                    {__('Continue')}
                  </Button>
                )}
              </SlideDown>

              {isInstitutionSearchEnabled && !isProcessingMember && (
                <SlideDown delay={getNextDelay()}>
                  <Button
                    onClick={() => {
                      fadeOut(containerRef.current, 'up', 500).then(() => {
                        onGoBackClick()
                      })
                    }}
                    style={styles.buttonBack}
                    variant="neutral"
                  >
                    {__('Back')}
                  </Button>
                </SlideDown>
              )}
              <AriaLive
                level="assertive"
                message={
                  _isEmpty(errors) && isProcessingMember
                    ? __('This process may take a while to finish') // Notify non-sighted users that creating a member process my take a while.
                    : Object.values(errors)
                        .map(msg => `${msg}, `)
                        .join()
                }
              />
            </form>
          ) : (
            <Fragment>
              <SlideDown delay={getNextDelay()}>
                <MessageBox title={__('Something went wrong')} variant="error">
                  {__('There was a problem with this institution, try again later.')}
                </MessageBox>
              </SlideDown>

              {isInstitutionSearchEnabled && (
                <SlideDown delay={getNextDelay()}>
                  <Button onClick={onGoBackClick} style={styles.buttonBack} variant="primary">
                    {__('Back')}
                  </Button>
                </SlideDown>
              )}
            </Fragment>
          )}

          <SlideDown delay={getNextDelay()}>
            <div style={styles.actionColumn}>
              {credentialRecovery()}
              {showDisconnectOption && (
                <ActionableUtilityRow
                  icon={<ChevronRight color={tokens.TextColor.ButtonLinkTertiary} size={16} />}
                  onClick={() => {
                    dispatch(
                      sendAnalyticsEvent({
                        category: EventCategories.CONNECT,
                        label: EventLabels.ENTER_CREDENTIALS,
                        action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.DELETE_MEMBER} - ${EventActions.START}`,
                      }),
                    )

                    onDeleteConnectionClick()
                  }}
                  text={__('Disconnect this institution')}
                />
              )}
              {showSupport && (
                <ActionableUtilityRow
                  icon={<ChevronRight color={tokens.TextColor.ButtonLinkTertiary} size={16} />}
                  onClick={() => {
                    dispatch(
                      sendAnalyticsEvent({
                        category: EventCategories.CONNECT,
                        label: EventLabels.ENTER_CREDENTIALS,
                        action: `${EventLabels.ENTER_CREDENTIALS} - ${EventActions.NEED_HELP}`,
                      }),
                    )

                    setShowSupportView(true)
                  }}
                  text={__('Get help')}
                />
              )}
            </div>
          </SlideDown>

          <SlideDown delay={getNextDelay()}>
            <PrivateAndSecure />
          </SlideDown>
        </Fragment>
      )}

      <AriaLive
        level="assertive"
        message={
          _isEmpty(errors) && isProcessingMember
            ? __('This process may take a while to finish') // Notify non-sighted users that creating a member process my take a while.
            : Object.values(errors)
                .map(msg => `${msg}, `)
                .join()
        }
      />
    </StickyComponentContainer>
  )
}

const getStyles = tokens => {
  return {
    headerText: {
      paddingBottom: tokens.Spacing.XSmall,
    },
    form: {
      paddingTop: tokens.Spacing.Medium,
    },
    input: {
      marginBottom: tokens.Spacing.Large,
    },
    inputError: {
      marginBottom: tokens.Spacing.Large,
      marginTop: tokens.Spacing.XSmall,
    },
    loader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    loaderText: {
      marginTop: tokens.Spacing.Medium,
    },
    button: {
      width: '100%',
    },
    buttonBack: {
      width: '100%',
      marginTop: tokens.Spacing.Medium,
      marginBottom: '12px',
    },
    actionColumn: {
      marginBottom: tokens.Spacing.Tiny,
    },
    text: {
      paddingLeft: tokens.Spacing.XSmall,
      color: tokens.Color.Primary300,
    },
    hr: {
      borderTop: `1px solid ${tokens.BackgroundColor.HrLight}`,
    },
    credentialsError: {
      marginTop: tokens.Spacing.Medium,
    },
  }
}

Credentials.propTypes = {
  credentials: PropTypes.array,
  error: PropTypes.object,
  handleSubmitCredentials: PropTypes.func.isRequired,
  isProcessingMember: PropTypes.bool,
  onDeleteConnectionClick: PropTypes.func,
  onGoBackClick: PropTypes.func.isRequired,
}

Credentials.defaultProps = {
  credentials: [],
}
