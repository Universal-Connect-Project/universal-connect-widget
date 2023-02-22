import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Edit } from '@kyper/icon/Edit'

export const DetailReviewItem = props => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.infoRow}>
      <div style={styles.textGroup}>
        <Text as="Small" style={styles.rowHeader}>
          {props.label}
        </Text>
        <Text as="Body" style={styles.bold}>
          {props.value}
        </Text>
      </div>
      <button
        aria-label={props.ariaButtonLabel}
        disabled={props.isEditable}
        onClick={props.onEditClick}
      >
        <Edit
          color={props.isEditable ? tokens.TextColor.ButtonPrimaryDisabled : tokens.Color.Brand300}
          size={16}
          style={styles.editIcon}
        />
      </button>
    </div>
  )
}

const getStyles = tokens => ({
  infoRow: {
    alignItems: 'center',
    borderBottom: `1px solid ${tokens.Color.Neutral300}`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.Spacing.Small}px 0`,
  },
  textGroup: {
    display: 'flex',
    flowGrow: 1,
    flexDirection: 'column',
  },
  rowHeader: {
    color: tokens.TextColor.InputLabel,
  },
  bold: {
    fontWeight: tokens.FontWeight.Bold,
    overflowWrap: 'anywhere',
  },
  editIcon: {
    cursor: 'pointer',
  },
})

DetailReviewItem.propTypes = {
  ariaButtonLabel: PropTypes.string.isRequired,
  isEditable: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}
