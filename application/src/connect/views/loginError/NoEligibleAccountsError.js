import React from 'react'
import { ActionTypes } from '../../../redux/actions/Connect'
import { sendPostMessage } from '../../../redux/actions/PostMessage'
import { getCurrentMember } from '../../../redux/selectors/Connect'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'

import { SlideDown } from '../../components/SlideDown'
import { getDelay } from '../../utilities/getDelay'

import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { __ } from '../../../utils/Intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@kyper/button'
import { AriaLive } from '../../accessibility/AriaLive'

export const NoEligibleAccounts = () => {
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const dispatch = useDispatch()

  const currentMember = useSelector(getCurrentMember)
  const searchDisabled = useSelector(
    state => state.connect.connectConfig.disable_institution_search,
  )
  const mode = useSelector(state => state.connect.connectConfig.mode)

  const getNextDelay = getDelay()

  return (
    <React.Fragment>
      <SlideDown delay={getNextDelay()}>
        <div style={styles.headerContianer}>
          <Text as="H2" style={styles.headerText} tag="h2">
            {__('No eligible accounts')}
          </Text>
          <AttentionFilled
            color={tokens.Color.Error300}
            height={tokens.Spacing.Large}
            styles={styles.icon}
            width={tokens.Spacing.Large}
          />
        </div>
      </SlideDown>
      <Text as={'Paragraph'} style={styles.paragraph} tag="p">
        {currentMember?.is_oauth
          ? __('No eligible checking or savings account was found. Please try a different account.')
          : __(
              'None of your accounts are eligible checking or savings accounts. Please try a different account.',
            )}
      </Text>

      <div>
        <Button
          aria-label={__('OK')}
          onClick={() => {
            dispatch(
              sendPostMessage('connect/invalidData/primaryAction', {
                memberGuid: currentMember.guid,
              }),
            )
            dispatch({ type: ActionTypes.RESET_CREDENTIALS })
          }}
          style={styles.okayButton}
        >
          {__('OK')}
        </Button>
      </div>

      {!searchDisabled && (
        <div>
          <Button
            aria-label={__('Try another institution')}
            onClick={() => {
              dispatch({ type: ActionTypes.RESET_STEP, payload: { mode } })
            }}
            style={styles.tryAnother}
            variant={'transparent'}
          >
            {__('Try another institution')}
          </Button>
        </div>
      )}
      <AriaLive
        level="assertive"
        message={
          currentMember?.is_oauth
            ? __(
                'No eligible checking or savings account was found. Please try a different account.',
              )
            : __(
                'None of your accounts are eligible checking or savings accounts. Please try a different account.',
              )
        }
        timeout={100}
      />
    </React.Fragment>
  )
}

const getStyles = tokens => {
  return {
    institutionBlock: {
      marginRight: tokens.Spacing.Large,
      marginTop: tokens.Spacing.Large,
    },
    headerText: {
      fontWeight: tokens.FontWeight.Bold,
    },
    headerContianer: {
      display: 'flex',
      marginTop: tokens.Spacing.Large,
      alignItems: 'center',
    },
    icon: {
      marginLeft: tokens.Spacing.Small,
    },
    paragraph: {
      fontWeight: tokens.FontWeight.Regular,
      fontSize: tokens.FontSize.Small,
      marginTop: tokens.Spacing.XSmall,
    },
    okayButton: {
      background: tokens.BackgroundColor.ButtonPrimary,
      color: tokens.Color.NeutralWhite,
      marginTop: tokens.Spacing.XLarge,
      borderRadius: tokens.BorderRadius.Medium,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 16px',
      gap: '10px',
      height: '44px',
      width: '100%',
    },
    tryAnother: {
      marginTop: tokens.Spacing.XSmall,
      color: tokens.Color.Brand300,
      borderRadius: tokens.BorderRadius.Medium,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 16px',
      gap: '10px',
      height: '44px',
      width: '100%',
    },
  }
}

NoEligibleAccounts.propTypes = {}

export default NoEligibleAccounts
