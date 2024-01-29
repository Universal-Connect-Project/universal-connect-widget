import React from 'react'
import PropTypes from 'prop-types'
import { css } from '@mxenabled/cssinjs'

import { __ } from '../../utils/Intl'

import { useTokens } from '@kyper/tokenprovider'
//import { InstitutionLogo } from '@kyper/institutionlogo'
import { InstitutionLogo } from './InstitutionLogo'
import { ChevronRight } from '@kyper/icon/ChevronRight'

export const InstitutionTile = props => {
  const { institution, selectInstitution, size } = props

  const tokens = useTokens()
  const styles = getStyles(tokens)
  return (
    <button
      aria-label={__('Add account with %1', institution.name)}
      className={css(styles.container)}
      data-test="institution-tile"
      onClick={selectInstitution}
      type="button"
    >
      <div style={styles.institutionBodyContainer}>
        <div style={styles.iconColumn}>
          <InstitutionLogo alt={Object.keys(institution.providers || {}).join(',')} institution={institution} size={size} />
        </div>

        <div style={styles.textColumn}>
          <div style={styles.name}>{institution.name}</div>
          <div style={styles.url}>{institution.url}</div>
        </div>

        <div className={'iconContainer ' + css(styles.caretContainer)}>
          <ChevronRight color={tokens.TextColor.Default} height={16} width={16} />
        </div>
      </div>
    </button>
  )
}

const getStyles = tokens => {
  return {
    container: {
      maxHeight: '72px',
      // Because we are having to account for border size too, tokens doesnt contain the right size
      padding: '12px',
      display: 'flex',
      position: 'relative',
      flexDirection: 'row',
      borderRadius: tokens.BorderRadius.CardRounded,
      boxSizing: 'border-box',
      alignItems: 'center',
      width: '100%',
      // We provide a transparent border here to ensure our box sizing is the
      // same with or without our focus border applied.
      border: '1px solid transparent',
      zIndex: 1,
      '&:hover': {
        background: tokens.BackgroundColor.ButtonTransparentHover,
        cursor: 'pointer',
        zIndex: 100,
      },
      '&:focus': {
        border: `1px solid ${tokens.BorderColor.InputFocus}`,
        outline: 'none',
        boxShadow: 'none',
      },
      '&:active': {
        border: `1px solid ${tokens.BorderColor.InputFocus}`,
      },
      '&:hover .iconContainer': {
        visibility: 'visible',
      },
    },
    institutionBodyContainer: {
      width: '100%',
      alignSelf: 'center,',
      display: 'flex',
      alignItems: 'center',
    },
    textColumn: {
      width: '70%',
      overflow: 'hidden',
      alignSelf: 'center',
    },
    iconColumn: {
      marginRight: tokens.Spacing.Small,
      display: 'flex',
      flexDirection: 'column',
    },
    name: {
      textAlign: 'left',
      color: tokens.TextColor.Default,
      fontSize: tokens.FontSize.Button,
      lineHeight: tokens.LineHeight.ParagraphSmall,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      fontWeight: tokens.FontWeight.Bold,
      marginBottom: tokens.Spacing.Tiny,
    },
    url: {
      textAlign: 'left',
      color: tokens.TextColor.Secondary,
      fontWeight: tokens.FontWeight.Normal,
      fontSize: tokens.FontSize.ButtonLinkSmall,
      lineHeight: tokens.LineHeight.Small,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    caretContainer: {
      visibility: 'hidden',
      marginLeft: 'auto',
      width: '25px',
      overflow: 'hidden',
      alignSelf: 'center',
    },
  }
}

InstitutionTile.propTypes = {
  institution: PropTypes.object.isRequired,
  selectInstitution: PropTypes.func.isRequired,
  size: PropTypes.number,
}
