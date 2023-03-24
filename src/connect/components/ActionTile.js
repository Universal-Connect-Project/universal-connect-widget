import React from 'react'
import PropTypes from 'prop-types'

import { css } from '@mxenabled/cssinjs'

import { useTokens } from '@kyper/tokenprovider'
import { ChevronRight } from '@kyper/icon/ChevronRight'
import { Text } from '@kyper/text'

export const ActionTile = props => {
  const { icon, onSelectAction, subTitle, title } = props
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div>
      <button className={css(styles.container)} onClick={onSelectAction} type="button">
        <div style={styles.body}>
          <div style={styles.iconColumn}>
            <div style={styles.iconBackground}>{icon}</div>
          </div>

          <div style={styles.textColumn}>
            <Text as="Body" bold={true} style={styles.title}>
              {title}
            </Text>
            <Text as="ParagraphSmall" style={styles.subtitle}>
              {subTitle}
            </Text>
          </div>

          <div style={styles.caretContainer}>
            <ChevronRight color={tokens.TextColor.Default} height={16} width={16} />
          </div>
        </div>
      </button>
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    // Because we are having to account for border size too, tokens doesnt contain the right size
    padding: '11px 11px 9px 11px',
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    borderRadius: tokens.BorderRadius.Large,
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
      boxShadow: 'none',
      outline: 'none',
    },
    '&:active': {
      border: `1px solid ${tokens.BorderColor.InputFocus}`,
    },
  },
  body: {
    width: '100%',
    alignSelf: 'center,',
    display: 'flex',
    alignItems: 'center',
  },
  iconColumn: {
    alignSelf: 'start',
    marginRight: tokens.Spacing.Small,
    display: 'flex',
    flexDirection: 'column',
  },
  iconBackground: {
    background: `linear-gradient(to bottom right, ${tokens.Color.Brand400}, ${tokens.Color.Brand200}`,
    boxSizing: 'border-box',
    padding: 6,
    borderRadius: tokens.Spacing.Tiny,
    height: tokens.Spacing.XLarge,
    width: tokens.Spacing.XLarge,
  },
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 3,
    overflow: 'hidden',
  },
  title: {
    textAlign: 'start',
  },
  subtitle: {
    textAlign: 'start',
  },
  caretContainer: {
    alignSelf: 'start',
    marginLeft: tokens.Spacing.Small,
    marginTop: tokens.Spacing.Small,
  },
})

ActionTile.propTypes = {
  icon: PropTypes.PropTypes.object,
  onSelectAction: PropTypes.func.isRequired,
  subTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
