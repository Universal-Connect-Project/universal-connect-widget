import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'

export const DataCluster = props => {
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const dataCluster = props.dataCluster

  return (
    <Fragment>
      <Text as="Body" data-test={`${dataCluster.dataTest}-title`} style={styles.subTitle}>
        {dataCluster.name}
      </Text>
      <Text as="Body" data-test={`${dataCluster.dataTest}-subtitle`} style={styles.body} tag="p">
        {dataCluster.description}
      </Text>
    </Fragment>
  )
}

const getStyles = tokens => ({
  subTitle: {
    fontSize: tokens.FontSize.Body,
    fontWeight: tokens.FontWeight.Semibold,
    marginBottom: tokens.Spacing.Tiny,
  },
  body: {
    fontSize: tokens.FontSize.ParagraphSmall,
    fontWeight: tokens.FontWeight.Regular,
    marginBottom: tokens.Spacing.Medium,
  },
})

DataCluster.propTypes = {
  dataCluster: PropTypes.object.isRequired,
}
