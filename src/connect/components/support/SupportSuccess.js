import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'

import { fadeOut } from '../../../utils/Animation'
import { __ } from '../../../utils/Intl'

import { GoBackButton } from '../GoBackButton'
import { PrivateAndSecure } from '../PrivateAndSecure'
import { SlideDown } from '../SlideDown'
import { getDelay } from '../../utilities/getDelay'

export const SupportSuccess = props => {
  const { email, handleClose } = props
  const containerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  const onClose = () => fadeOut(containerRef.current, 'up', 300).then(() => handleClose())

  return (
    <div ref={containerRef} style={styles.container}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton handleGoBack={onClose} />

        <Text style={styles.title} tag="h2">
          {__('Request received')}
        </Text>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <Text as="Paragraph" style={styles.firstParagraph} tag="p">
          {__(
            'Thanks! Your request has been received. A reply will be sent to %1. Be sure to check your junk mail or spam folder, as replies sometimes end up there.',
            email,
          )}
        </Text>
        <Text as="Paragraph">{__('Our hours are Monday to Friday, 9 a.m. – 5 p.m. MST.')}</Text>

        <Button onClick={onClose} style={styles.button} type="submit" variant="primary">
          {__('Continue')}
        </Button>

        <PrivateAndSecure />
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    margin: tokens.Spacing.Large,
  },
  title: {
    display: 'block',
    marginBottom: tokens.Spacing.XSmall,
  },
  firstParagraph: {
    display: 'block',
    marginBottom: tokens.Spacing.Small,
  },
  button: {
    marginTop: tokens.Spacing.XLarge,
    width: '100%',
  },
})

SupportSuccess.propTypes = {
  email: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
}
