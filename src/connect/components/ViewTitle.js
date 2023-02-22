import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@kyper/text'
import { useTokens } from '@kyper/tokenprovider'

export const ViewTitle = ({ title }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <Text style={styles} tag="h2">
      {title}
    </Text>
  )
}

const getStyles = tokens => {
  return {
    marginBottom: tokens.Spacing.XSmall,
  }
}

ViewTitle.propTypes = {
  title: PropTypes.string.isRequired,
}
