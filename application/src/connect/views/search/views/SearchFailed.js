import React from 'react'

import { useTokens } from '@kyper/tokenprovider'
import { AttentionFilled } from '@kyper/icon/AttentionFilled'

import { __ } from '../../../../utils/Intl'
import useAnalyticsPath from '../../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../../const/Analytics'

export const SearchFailed = () => {
  useAnalyticsPath(...PageviewInfo.CONNECT_SEARCH_FAILED)
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        <AttentionFilled color={tokens.Color.NeutralWhite} size={16} />
      </div>
      <div style={styles.textContainer}>
        <div style={styles.title}>{__('Search isn’t working')}</div>
        <div style={styles.subTitle}>
          {__('Something went wrong and we’re looking into it. Please try again later.')}
        </div>
      </div>
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: tokens.Spacing.ContainerSidePadding,
    },
    iconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '32px',
      minWidth: '32px',
      marginRight: tokens.Spacing.Small,
      borderRadius: tokens.BorderRadius.Medium,
      backgroundColor: tokens.BackgroundColor.ButtonDestructive,
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '-3px',
    },
    title: {
      color: tokens.TextColor.Default,
      fontSize: tokens.FontSize.Body,
      fontWeight: tokens.FontWeight.Bold,
      lineHeight: tokens.LineHeight.ParagraphSmall,
    },
    subTitle: {
      color: tokens.TextColor.Default,
      fontSize: tokens.FontSize.Small,
      lineHeight: tokens.LineHeight.ParagraphSmall,
    },
  }
}
