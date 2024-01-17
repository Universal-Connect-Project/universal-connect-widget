import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { InstitutionLogo } from '@kyper/institutionlogo'
import { useTokens } from '@kyper/tokenprovider'

import { COLOR_SCHEME } from 'src/connect/const/Connect'

import { ClientLogo } from 'src/connect/components/ClientLogo'

import ConnectHeaderInstitutionLight from 'src/connect/images/header/ConnectHeaderInstitutionLight.svg'
import ConnectHeaderInstitutionDark from 'src/connect/images/header/ConnectHeaderInstitutionDark.svg'

import ConnectHeaderBackdropDark from 'src/connect/images/header/ConnectHeaderBackdropDark.svg'
import ConnectHeaderBackdropLight from 'src/connect/images/header/ConnectHeaderBackdropLight.svg'

const propTypes = {
  institutionGuid: PropTypes.string,
}

export const ConnectLogoHeader = props => {
  const colorScheme = useSelector(state => state.initializedClientConfig.color_scheme)
  const clientGuid = useSelector(state => state.client.guid)
  const tokens = useTokens()
  const styles = getStyles()
  const backdropImage =
    colorScheme === COLOR_SCHEME.LIGHT ? ConnectHeaderBackdropLight : ConnectHeaderBackdropDark
  const defaultInstitutionImage =
    colorScheme === COLOR_SCHEME.LIGHT
      ? ConnectHeaderInstitutionLight
      : ConnectHeaderInstitutionDark

  return (
    <div aria-hidden={true} style={styles.container}>
      <div data-test="mxLogo" style={styles.backdropImage}>
        <SVGImage image={backdropImage} />
      </div>
      <div style={styles.clientLogo}>
        <ClientLogo clientGuid={clientGuid} size={64} />
      </div>
      <div style={styles.institutionLogo}>
        {props.institutionGuid ? (
          <InstitutionLogo
            alt="Institution logo"
            institutionGuid={props.institutionGuid}
            size={64}
            style={{ borderRadius: tokens.BorderRadius.Large }}
          />
        ) : (
          <SVGImage
            image={defaultInstitutionImage}
            styles={{ borderRadius: tokens.BorderRadius.Large }}
          />
        )}
      </div>
    </div>
  )
}

function getStyles() {
  const maxHeight = '64px'
  const maxWidth = '240px'

  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      height: maxHeight,
      width: maxWidth,
    },
    backdropImage: {
      width: '88px',
      position: 'absolute',
      height: '80px',
      zIndex: 10,
    },
    device: {
      height: maxHeight,
      width: maxHeight,
      marginLeft: '20px',
    },
    clientLogo: {
      height: maxHeight,
      width: maxHeight,
      zIndex: 20,
    },
    institutionLogo: {
      height: maxHeight,
      width: maxHeight,
      marginLeft: '80px',
      zIndex: 20,
    },
  }
}

const SVGImagePropTypes = {
  image: PropTypes.string.isRequired,
  styles: PropTypes.object,
}

export const SVGImage = props => {
  const styles = {
    zIndex: 20,
    ...props.styles,
  }

  return <div dangerouslySetInnerHTML={{ __html: props.image }} style={styles} />
}

SVGImage.propTypes = SVGImagePropTypes
ConnectLogoHeader.propTypes = propTypes
