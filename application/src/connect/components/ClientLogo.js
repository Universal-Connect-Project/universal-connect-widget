import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { css } from '@mxenabled/cssinjs'

import { useTokens } from '@kyper/tokenprovider'

import { COLOR_SCHEME } from 'src/connect/const/Connect'
import ConnectHeaderRecipientLight from 'src/connect/images/header/ConnectHeaderRecipientLight.png'
import ConnectHeaderRecipientDark from 'src/connect/images/header/ConnectHeaderRecipientDark.png'

export const ClientLogo = props => {
  const colorScheme = useSelector(state => state.initializedClientConfig.color_scheme)
  const tokens = useTokens()
  const backUpSrc =
    colorScheme === COLOR_SCHEME.LIGHT ? ConnectHeaderRecipientLight : ConnectHeaderRecipientDark
  const src = `https://content.moneydesktop.com/storage/MD_Client/oauth_logos/${props.clientGuid}.png`

  return (
    <img
      alt={props.alt}
      className={`${css({
        borderRadius: tokens.BorderRadius.Large,
      })} ${props.className}`}
      height={props.size}
      onError={e => (e.target.src = backUpSrc)}
      src={src}
      style={props.style}
      width={props.size}
    />
  )
}

ClientLogo.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  clientGuid: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
}

ClientLogo.defaultProps = {
  alt: 'Client logo',
  size: 32,
  style: {},
}
