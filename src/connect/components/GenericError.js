import React from 'react'
import PropTypes from 'prop-types'
import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'

export const GenericError = ({ subtitle, title }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.container}>
      <AttentionFilled
        color={tokens.TextColor.Default}
        height={48}
        styles={styles.icon}
        width={48}
      />
      <Text as="H2" tag="h1">
        {title}
      </Text>
      {subtitle && (
        <Text as="Paragraph" tag="h2">
          {subtitle}
        </Text>
      )}
    </div>
  )
}

function getStyles(tokens) {
  return {
    container: {
      backgroundColor: tokens.BackgroundColor.Container,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100%',
      padding: tokens.Spacing.XSMALL,
      textAlign: 'center',
    },
    icon: {
      marginBottom: tokens.Spacing.XLarge,
    },
  }
}

GenericError.propTypes = {
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
}
