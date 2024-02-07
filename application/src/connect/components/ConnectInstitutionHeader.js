import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
//import { InstitutionLogo } from '@kyper/institutionlogo'
import { InstitutionLogo } from './InstitutionLogo'
import { useTokens } from '@kyper/tokenprovider'

import { COLOR_SCHEME } from '../const/Connect'
import HeaderDevice from '../images/header/HeaderDevice.svg'
import HeaderDefaultInstitution from '../images/header/HeaderDefaultInstitution.svg'
import HeaderBackdropDark from '../images/header/HeaderBackdropDark.svg'
import HeaderBackdropLight from '../images/header/HeaderBackdropLight.svg'

const propTypes = {
  institution: PropTypes.object,
}

export const ConnectInstitutionHeader = props => {
  const colorScheme = useSelector(state => state.initializedClientConfig.color_scheme)
  const tokens = useTokens()
  const styles = getStyles(colorScheme, tokens)
  const backdropImage =
    colorScheme === COLOR_SCHEME.LIGHT ? HeaderBackdropLight : HeaderBackdropDark

  return (
    <div style={styles.container}>
      <SVGImage image={HeaderDevice} size={64} styles={styles.device} />
      <div style={styles.backdropImage}>
        <SVGImage image={backdropImage} />
      </div>
      <div style={styles.institutionLogo}>
        {props.institution ? (
          <InstitutionLogo alt="" institution={props.institution} size={64} 
            style={{
              position: 'relative',
              top: '50%',
              transform: 'translateY(-50%)'
            }} 
          />
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
  size: PropTypes.number,
  styles: PropTypes.object,
}

const SVGImage = props => {
  const styles = {
    zIndex: 20,
    ...props.styles,
  }
  const {size} = props;
  // return <div dangerouslySetInnerHTML={{ __html: props.image }} style={styles} />
  return (<div style={styles}>
    <img alt='svg' height={size} src={props.image} width={size} />
  </div>)
}

SVGImage.propTypes = SVGImagePropTypes
ConnectInstitutionHeader.propTypes = propTypes
