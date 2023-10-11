import React from 'react'
import PropTypes from 'prop-types'
import { css } from '@mxenabled/cssinjs'
import { useTokens } from '@kyper/tokenprovider'

export const InstitutionLogo = ({
  alt = 'Institution logo image',
  className,
  institution,
  size = 32,
  style = {},
  ...rest
}) => {
  const tokens = useTokens()
  const backUpSrc =
    'https://content.moneydesktop.com/storage/MD_Assets/serenity/default_institution_logo.png'
  const src = institution.logo_url || `https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/${institution.guid}_100x100.png`
  return (
    <img
      alt={alt}
      className={`${css({
        borderRadius: tokens.BorderRadius.Medium,
      })} kyper-institutionlogo ${className}`}
      onError={e => (e.target.src = backUpSrc)}
      src={src}
      style={{
        ...style, 
        maxHeight:size, 
        maxWidth:size}}
      {...rest}
    />
  )
}

InstitutionLogo.propTypes = {
  /**
   * Image alt text for when an image doesn't load
   */
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  /**
   * The guid to the institution logo you want to load
   */
  institution: PropTypes.object,
  /**
   * The image width and height both get the value from the size prop
   */
  size: PropTypes.number,
  style: PropTypes.object,
}

InstitutionLogo.displayName = 'InstitutionLogo'
