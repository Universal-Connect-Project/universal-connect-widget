import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { css } from '@mxenabled/cssinjs'
import DOMPurify from 'dompurify';

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'

import { goToUrlLink } from '../utilities/global'

export const InstructionList = props => {
  const tokens = useTokens()
  const listRef = useRef(null)
  const styles = getStyles(tokens)

  const sanitizedItems = props.items.map(item =>
    DOMPurify.sanitize(item, {
      ALLOWED_TAGS: ['a'], // Only allow <a />
      ALLOWED_ATTR: ['href'], // Only allow href attribute
      ALLOWED_URI_REGEXP: new RegExp('^https?://.*'), // Only allow href to be http/https
    }),
  )

  const handlelinkClick = e => {
    e.preventDefault()
    e.stopPropagation()

    if (props.showExternalLinkPopup) {
      props.setIsLeavingUrl(e.target.href)
    } else {
      goToUrlLink(e.target.href)
    }
  }

  /**
   * This intercepts the link click in the instructional text steps to handle the leaving notice.
   */
  useEffect(() => {
    const instructionalList = listRef.current

    instructionalList.querySelectorAll('.step-link a').forEach(instructionLink => {
      Object.assign(instructionLink.style, styles.instructionalLink)
      // Adds EventListensers after initial render
      instructionLink.addEventListener('click', handlelinkClick)
    })

    // Clears EventListeners when unmounting
    return () => {
      instructionalList.querySelectorAll('.step-link a').forEach(instructionLink => {
        instructionLink.removeEventListener('click', handlelinkClick)
      })
    }
  }, [])

  return (
    <ol ref={listRef} style={styles.list}>
      {sanitizedItems.map(item => (
        <li className={`step-link ${css(styles.listItems)}`} key={item}>
          <Text as="Paragraph" dangerouslySetInnerHTML={{ __html: item }} tag="p" />
        </li>
      ))}
    </ol>
  )
}

const getStyles = tokens => ({
  list: {
    listStyleType: 'none',
    listStylePosition: 'outside',
    margin: `${tokens.Spacing.Medium}px 0`,
    paddingLeft: tokens.Spacing.XXLarge,
  },
  listItems: {
    counterIncrement: 'listCounter',
    marginBottom: tokens.Spacing.Small,
    position: 'relative',
    '&::before': {
      content: 'counter(listCounter)',
      color: tokens.TextColor.Default,
      background: tokens.BackgroundColor.TagNeutral,
      borderRadius: '50%',
      fontSize: '90%',
      fontWeight: tokens.FontWeight.Semibold,
      left: `-${tokens.Spacing.XXLarge}px`,
      lineHeight: `${tokens.Spacing.XLarge}px`,
      width: tokens.Spacing.XLarge,
      height: tokens.Spacing.XLarge,
      marginRight: tokens.Spacing.Small,
      position: 'absolute',
      textAlign: 'center',
    },
  },
  instructionalLink: {
    display: 'inline',
    whiteSpace: 'normal',
    height: 'auto',
    fontSize: tokens.FontSize.Small,
    textAlign: 'left',
    color: tokens.TextColor.ButtonLink,
  },
})

InstructionList.propTypes = {
  items: PropTypes.array.isRequired,
  setIsLeavingUrl: PropTypes.func.isRequired,
  showExternalLinkPopup: PropTypes.bool.isRequired,
}
