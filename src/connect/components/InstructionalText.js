import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify';

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'

import { goToUrlLink } from '../utilities/global'

export const InstructionalText = ({
  instructionalText,
  setIsLeavingUrl,
  showExternalLinkPopup,
  style = {},
}) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const sanitizedInstructionalText = DOMPurify.sanitize(instructionalText, {
    ALLOWED_TAGS: ['a'], // Only allow <a />
    ALLOWED_ATTR: ['href', 'id'], // Only allow href and id attributes
    ALLOWED_URI_REGEXP: new RegExp('^https?://.*'), // Only allow href to be http/https
  })

  const handleInstructionalTextClick = e => {
    e.preventDefault()
    e.stopPropagation()

    if (showExternalLinkPopup) {
      setIsLeavingUrl(e.target.href)
    } else {
      goToUrlLink(e.target.href)
    }
  }

  /**
   * This intercepts the link click in the instructional text to handle the leaving notice.
   */
  useEffect(() => {
    const instructionalLink = document.getElementById('instructional_text')

    if (!instructionalLink) return () => {}

    Object.assign(instructionalLink.style, styles.instructionalLink)

    instructionalLink.addEventListener('click', handleInstructionalTextClick)

    return () => removeEventListener('click', handleInstructionalTextClick)
  }, [])

  return (
    <Text
      dangerouslySetInnerHTML={{ __html: sanitizedInstructionalText }}
      data-test="instructional_text"
      style={{ ...styles.instructionalText, ...style }}
      tag="p"
    />
  )
}

const getStyles = tokens => ({
  instructionalText: {
    marginBottom: tokens.Spacing.XSmall,
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

InstructionalText.propTypes = {
  instructionalText: PropTypes.string.isRequired,
  setIsLeavingUrl: PropTypes.func.isRequired,
  showExternalLinkPopup: PropTypes.bool.isRequired,
  style: PropTypes.object,
}
