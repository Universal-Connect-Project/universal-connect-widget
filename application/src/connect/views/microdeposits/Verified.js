import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import { __ } from '../../../utils/Intl'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { SlideDown } from '../../components/SlideDown'
import verifiedSVG from '../../images/VerifiedGraphic.svg'
import { fadeOut } from '../../utilities/Animation'

export const Verified = ({ microdeposit, onDone, sendPostMessage }) => {
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS_VERIFIED)
  const tokens = useTokens()
  const styles = getStyles(tokens)

  useEffect(() => {
    sendPostMessage('connect/microdeposits/verified', {
      microdeposit_guid: microdeposit.guid,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} style={styles.container}>
      <SlideDown>
        <div
          aria-hidden={true}
          dangerouslySetInnerHTML={{ __html: verifiedSVG }}
          style={styles.svg}
        />
      </SlideDown>

      <SlideDown delay={100}>
        <div style={styles.header}>
          <Text as="H2" style={styles.title}>
            {__('Deposits verified')}
          </Text>
          <Text as="Paragraph">
            {__("You're almost done setting things up. Continue to your institution.")}
          </Text>
        </div>
      </SlideDown>

      <SlideDown delay={200}>
        <Button
          onClick={() => {
            sendPostMessage('connect/microdeposits/verified/primaryAction')
            return fadeOut(containerRef.current, 'down').then(() => onDone())
          }}
          style={styles.button}
          variant="primary"
        >
          {__('Continue')}
        </Button>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    position: 'relative',
  },
  svg: {
    margin: '0 auto',
    width: 200,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: tokens.Spacing.XSmall,
  },
  textBold: {
    fontWeight: tokens.FontWeight.Bold,
  },
  button: {
    marginTop: tokens.Spacing.XLarge,
    width: '100%',
  },
})

Verified.propTypes = {
  microdeposit: PropTypes.object.isRequired,
  onDone: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
}
