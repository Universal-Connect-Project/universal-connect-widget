import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { InstitutionLogo } from '@kyper/institutionlogo'
import { useTokens } from '@kyper/tokenprovider'

import { COLOR_SCHEME } from 'src/connect/const/Connect'
import HeaderDevice from 'src/connect/images/header/HeaderDevice.svg'
import HeaderDefaultInstitution from 'src/connect/images/header/HeaderDefaultInstitution.svg'
import HeaderBackdropDark from 'src/connect/images/header/HeaderBackdropDark.svg'
import HeaderBackdropLight from 'src/connect/images/header/HeaderBackdropLight.svg'

const propTypes = {
  institutionGuid: PropTypes.string,
}

export const ConnectInstitutionHeader = props => {
  const colorScheme = useSelector(state => state.initializedClientConfig.color_scheme)
  const tokens = useTokens()
  const styles = getStyles(colorScheme, tokens)
  const backdropImage =
    colorScheme === COLOR_SCHEME.LIGHT ? HeaderBackdropLight : HeaderBackdropDark

  return (
    <div data-test="disclosure-svg-header" style={styles.container}>
      <div style={styles.backdropImage}>
        <SVGImage image={backdropImage} />
      </div>
      <SVGImage image={HeaderDevice} styles={styles.device} />
      <div style={styles.institutionLogo}>
        {props.institutionGuid ? (
          <InstitutionLogo alt="" institutionGuid={props.institutionGuid} size={64} />
        ) : (
          <SVGImage image={HeaderDefaultInstitution} />
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
      margin: '0 auto',
      height: maxHeight,
      width: maxWidth,
    },
    backdropImage: {
      width: maxWidth,
      position: 'absolute',
      height: '40px',
      zIndex: 10,
    },
    device: {
      height: maxHeight,
      width: maxHeight,
      marginLeft: '20px',
    },
    institutionLogo: {
      height: maxHeight,
      width: maxHeight,
      marginLeft: '72px',
      zIndex: 20,
    },
  }
}

const SVGImagePropTypes = {
  image: PropTypes.string.isRequired,
  styles: PropTypes.object,
}

const SVGImage = props => {
  const styles = {
    zIndex: 20,
    ...props.styles,
  }

  return <div dangerouslySetInnerHTML={{ __html: props.image }} style={styles} />
}

SVGImage.propTypes = SVGImagePropTypes
ConnectInstitutionHeader.propTypes = propTypes
