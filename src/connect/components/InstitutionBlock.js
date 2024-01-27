import React from 'react'
import PropTypes from 'prop-types'
import { __ } from '../../utils/Intl'

import { useTokens } from '@kyper/tokenprovider'
//import { InstitutionLogo } from '@kyper/institutionlogo'
import { InstitutionLogo } from './InstitutionLogo'

export const InstitutionBlock = ({ institution, style }) => {
  const { guid, name, url } = institution

  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={{ ...styles.institutionBlock, ...style, justifyContent:'center' }}>
      <InstitutionLogo alt="" institution={institution} size={64} />
      {institution.logo_url ? null : <div style={styles.institutionInfo}>
        <div style={styles.institutionName}>
          {guid.startsWith('INS-MANUAL') ? __('Manual Institution') : name}
        </div>

        <div style={styles.institutionUrl}>{url}</div>
      </div> } 
    </div>
  )
}

const getStyles = tokens => {
  return {
    institutionBlock: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.Spacing.XLarge,
      borderRadius: tokens.BorderRadius.Container,
    },
    institutionInfo: {
      flexDirection: 'column',
      marginLeft: '12px',
      overflow: 'hidden',
    },
    institutionName: {
      color: tokens.TextColor.Default,
      fontSize: tokens.FontSize.Body,
      fontWeight: tokens.FontWeight.Bold,
      lineHeight: tokens.LineHeight.Body,
      paddingBottom: '2px',
    },
    institutionUrl: {
      color: tokens.TextColor.Secondary,
      fontWeight: tokens.FontWeight.Normal,
      fontSize: tokens.FontSize.ButtonLinkSmall,
      lineHeight: tokens.LineHeight.Body,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  }
}

InstitutionBlock.propTypes = {
  institution: PropTypes.object.isRequired,
  style: PropTypes.object,
}
