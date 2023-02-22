import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { InstitutionLogo } from '@kyper/institutionlogo'
import { useTokens } from '@kyper/tokenprovider'

import { COLOR_SCHEME } from '../../connect/const/Connect'
import CenterGraphicMxDark from '../../connect/images/header/CenterGraphicMxDark.svg'
import CenterGraphicMxLight from '../../connect/images/header/CenterGraphicMxLight.svg'
import DefaultDataProviderLogoDark from '../../connect/images/header/DefaultDataProviderLogoDark.svg'
import DefaultDataProviderLogoLight from '../../connect/images/header/DefaultDataProviderLogoLight.svg'
import DefaultDataRecipientLogoDark from '../../connect/images/header/DefaultDataRecipientLogoDark.svg'
import DefaultDataRecipientLogoLight from '../../connect/images/header/DefaultDataRecipientLogoLight.svg'

export const DisclosureInstitutionHeader = () => {
  const colorScheme = useSelector(state => state.initializedClientConfig.color_scheme)
  const institution = useSelector(state => state.connect.selectedInstitution)
  const [defaultImage, setDefaultImage] = useState(false)
  const tokens = useTokens()
  const styles = getStyles(colorScheme, tokens)
  const recipientLogo =
    colorScheme === COLOR_SCHEME.DARK ? DefaultDataRecipientLogoDark : DefaultDataRecipientLogoLight

  const providerLogo =
    colorScheme === COLOR_SCHEME.DARK ? DefaultDataProviderLogoDark : DefaultDataProviderLogoLight

  const mxLogo = colorScheme === COLOR_SCHEME.DARK ? CenterGraphicMxDark : CenterGraphicMxLight

  return (
    <div style={styles.container}>
      <div style={styles.MXLogo}>
        <SVGImage image={mxLogo} />
      </div>
      <div style={styles.recipentLogo}>
        <SVGImage image={recipientLogo} styles={styles.Logo} />
      </div>
      <div style={styles.providerLogo}>
        {institution.guid && !defaultImage ? (
          <InstitutionLogo
            alt=""
            institutionGuid={institution.guid}
            onError={() => setDefaultImage(true)}
            size={64}
          />
        ) : (
          <SVGImage image={providerLogo} styles={styles.Logo} />
        )}
      </div>
    </div>
  )
}

function getStyles() {
  const maxHeight = '64px'
  const maxWidth = '208px'
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      width: maxWidth,
      height: '88px',
      left: ' calc(50% - 208px/2)',
      top: '60px',
    },
    recipentLogo: {
      position: 'absolute',
      width: maxHeight,
      height: maxHeight,
      left: 'calc(50% - 64px/2 - 72px)',
      top: '12px',
      borderRadius: '12px',
    },
    providerLogo: {
      position: 'absolute',
      width: maxHeight,
      height: maxHeight,
      left: 'calc(50% - 64px/2 + 72px)',
      top: '12px',
    },
    MXLogo: {
      position: 'absolute',
      width: '88px',
      height: '88px',
      left: 'calc(50% - 88px/2)',
      top: '0px',
    },
    Logo: {
      height: maxHeight,
      width: maxHeight,
      borderRadius: '12px',
      overflow: 'hidden',
      //helps the borderRadius apply properly
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
