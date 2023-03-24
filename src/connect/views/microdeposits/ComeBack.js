import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import { __ } from '../../../utils/Intl'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { SlideDown } from '../../components/SlideDown'
import comeBackSVG from '../../images/ComeBackGraphic.svg'
import { fadeOut } from '../../utilities/Animation'

export const ComeBack = ({ microdeposit, onDone, sendPostMessage }) => {
  const containerRef = useRef(null)
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS_COME_BACK)
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div ref={containerRef}>
      <SlideDown delay={100}>
        <div
          aria-hidden={true}
          dangerouslySetInnerHTML={{ __html: comeBackSVG }}
          style={styles.svg}
        />
      </SlideDown>

      <SlideDown delay={100}>
        <div style={styles.header}>
          <Text as="H2" style={styles.title}>
            {__('Check back soon')}
          </Text>
          {/* eslint-disable-next-line jsx-a11y/aria-role */}
          <Text as="Paragraph" role="text">
            {/* --TR: Full string "Thanks for submitting your account info. Around {date}, check your {accountName} account for two small deposits less than a dollar each. When you see them, come back here and enter the amounts." */
            __(
              'Thanks for submitting your account info. Around %1, check your %2 account for two small deposits less than a dollar each. When you see them, come back here and enter the amounts.',
              format(parseISO(microdeposit.deposit_expected_at), 'MMMM d'),
              microdeposit.account_name,
            )}
          </Text>
        </div>
      </SlideDown>

      <SlideDown delay={100}>
        <Button
          onClick={() => {
            sendPostMessage('connect/microdeposits/comeBack/primaryAction')
            return fadeOut(containerRef.current, 'up', 300).then(() => onDone())
          }}
          style={styles.button}
          variant="primary"
        >
          {__('Done')}
        </Button>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  svg: {
    margin: '0 auto',
    width: 200,
  },
  title: {
    marginBottom: tokens.Spacing.XSmall,
  },
  button: {
    marginTop: tokens.Spacing.XLarge,
    width: '100%',
  },
})

ComeBack.propTypes = {
  microdeposit: PropTypes.object.isRequired,
  onDone: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
}
