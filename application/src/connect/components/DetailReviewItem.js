import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Text as ProtectedText } from 'src/privacy/components'
import { Edit } from '@kyper/icon/Edit'

export const DetailReviewItem = props => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.infoRow}>
      <div style={styles.textGroup}>
        <Text
          as="Small"
          data-test={`${props.label.replace(/\s+/g, '-')}-row`}
          style={styles.rowHeader}
        >
          {props.label}
        </Text>
        <ProtectedText
          as="Body"
          data-test={`${props.value.replace(/\s+/g, '-')}-row`}
          style={styles.bold}
        >
          {props.value}
        </ProtectedText>
      </div>
      <button
        aria-label={props.ariaButtonLabel}
        disabled={props.isEditable}
        onClick={props.onEditClick}
      >
        <Edit
          color={props.isEditable ? tokens.TextColor.ButtonPrimaryDisabled : tokens.Color.Brand300}
          data-test={`${props.label.replace(/\s+/g, '-')}-edit-button`}
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
