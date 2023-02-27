import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Accounts } from '@kyper/icon/Accounts'
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

import { AccountTypes } from '../views/manualAccount/constants'

export const StyledAccountTypeIcon = props => {
  const tokens = useTokens()
  const styles = getStyles(tokens, props.size, props.style)

  const getIcon = () => {
    switch (props.icon) {
      case AccountTypes.CHECKING:
        return <Check color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.SAVINGS:
        return <PiggyBankOutline color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.LOAN:
        return <Document color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.CREDIT_CARD:
        return <CreditCard color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.INVESTMENT:
        return <Growth color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.LINE_OF_CREDIT:
        return <Notarized color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.MORTGAGE:
        return <Home color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.PROPERTY:
        return <Image color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.CASH:
        return <Dollar color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.INSURANCE:
        return <Health color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.PREPAID:
        return <CreditCard color={tokens.TextColor.Default} size={props.iconSize} />
      case AccountTypes.UNKNOWN:
        return <Grid color={tokens.TextColor.Default} size={props.iconSize} />
      case 'accounts':
        return <Accounts color={tokens.TextColor.Default} size={props.iconSize} />
      default:
        return <Accounts color={tokens.TextColor.Default} size={props.iconSize} />
    }
  }
  return <div style={styles.wrapper}>{getIcon()}</div>
}

const getStyles = (tokens, size, style) => ({
  wrapper: {
    background: 'linear-gradient(to top right, rgba(77, 214, 214, 0.35), rgba(143, 69, 229, 0.35)',
    border: `1px solid rgba(18, 20, 23, 0.25)`,
    borderRadius: tokens.BorderRadius.Large,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: size,
    width: size,
    ...style,
  },
})

StyledAccountTypeIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconSize: PropTypes.number,
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
}
StyledAccountTypeIcon.defaultProps = {
  iconSize: 16,
  style: {},
}
