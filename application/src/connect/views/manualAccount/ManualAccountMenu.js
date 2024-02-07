import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { __ } from '../../../utils/Intl'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { UtilityRow } from '@kyper/utilityrow'
import { ChevronRight } from '@kyper/icon/ChevronRight'
import { Check } from '@kyper/icon/Check'
import { PiggyBankOutline } from '@kyper/icon/PiggyBankOutline'
import { Document } from '@kyper/icon/Document'
import { CreditCard } from '@kyper/icon/CreditCard'
import { Dollar } from '@kyper/icon/Dollar'
import { Growth } from '@kyper/icon/Growth'
import { Home } from '@kyper/icon/Home'
import { Notarized } from '@kyper/icon/Notarized'
import { Image } from '@kyper/icon/Image'
import { Health } from '@kyper/icon/Health'
import { Grid } from '@kyper/icon/Grid'

import { fadeOut } from '../../utilities/Animation'

import { GoBackButton } from '../../components/GoBackButton'
import { SlideDown } from '../../components/SlideDown'

import { getDelay } from '../../utilities/getDelay'
import { AccountTypeNames, AccountTypes } from './constants'
import { StyledAccountTypeIcon } from '../../components/StyledAccountTypeIcon'

export const ManualAccountMenu = props => {
  const containerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  const typeList =
    props.availableAccountTypes?.length !== 0
      ? props.availableAccountTypes
      : [
          AccountTypes.CHECKING,
          AccountTypes.SAVINGS,
          AccountTypes.LOAN,
          AccountTypes.CREDIT_CARD,
          AccountTypes.INVESTMENT,
          AccountTypes.LINE_OF_CREDIT,
          AccountTypes.MORTGAGE,
          AccountTypes.PROPERTY,
          AccountTypes.CASH,
          AccountTypes.INSURANCE,
          AccountTypes.PREPAID,
          AccountTypes.UNKNOWN,
        ]

  const getIcon = {
    [AccountTypes.CHECKING]: <Check color={tokens.TextColor.Default} />,
    [AccountTypes.SAVINGS]: <PiggyBankOutline color={tokens.TextColor.Default} />,
    [AccountTypes.LOAN]: <Document color={tokens.TextColor.Default} />,
    [AccountTypes.CREDIT_CARD]: <CreditCard color={tokens.TextColor.Default} />,
    [AccountTypes.INVESTMENT]: <Growth color={tokens.TextColor.Default} />,
    [AccountTypes.LINE_OF_CREDIT]: <Notarized color={tokens.TextColor.Default} />,
    [AccountTypes.MORTGAGE]: <Home color={tokens.TextColor.Default} />,
    [AccountTypes.PROPERTY]: <Image color={tokens.TextColor.Default} />,
    [AccountTypes.CASH]: <Dollar color={tokens.TextColor.Default} />,
    [AccountTypes.INSURANCE]: <Health color={tokens.TextColor.Default} />,
    [AccountTypes.PREPAID]: <CreditCard color={tokens.TextColor.Default} />,
    [AccountTypes.UNKNOWN]: <Grid color={tokens.TextColor.Default} />,
  }

  return (
    <div ref={containerRef}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton
          handleGoBack={() => fadeOut(containerRef.current, 'up', 300).then(props.handleGoBack)}
        />
      </SlideDown>
      <SlideDown delay={getNextDelay()}>
        <StyledAccountTypeIcon icon="accounts" iconSize={40} size={64} />
        <Text style={styles.title} tag="h2">
          {__('Add account manually')}
        </Text>
        <Text style={styles.body} tag="p">
          {__("Track accounts, assets, and other things that don't have a live connection.")}
        </Text>
      </SlideDown>
      <SlideDown delay={getNextDelay()}>
        {typeList.map((account_type, i) => (
          <UtilityRow
            autoFocus={i === 0}
            borderType="inset-left"
            key={i}
            leftChildren={getIcon[account_type]}
            onClick={() =>
              fadeOut(containerRef.current, 'up', 300).then(
                props.handleAccountTypeSelect(account_type),
              )
            }
            rightChildren={<ChevronRight />}
            title={AccountTypeNames[account_type]}
          />
        ))}
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  title: {
    marginBottom: tokens.Spacing.XSmall,
    marginTop: tokens.Spacing.Large,
  },
  body: {
    marginBottom: tokens.Spacing.XSmall,
  },
})

ManualAccountMenu.propTypes = {
  availableAccountTypes: PropTypes.array,
  handleAccountTypeSelect: PropTypes.func.isRequired,
  handleGoBack: PropTypes.func.isRequired,
}
