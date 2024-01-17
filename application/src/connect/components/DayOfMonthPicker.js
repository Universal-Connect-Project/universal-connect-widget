import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import _range from 'lodash/range'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { Text } from '@kyper/text'

import { fadeOut } from 'src/connect/utilities/Animation'
import { __ } from 'src/connect/utilities/Intl'

import { GoBackButton } from 'src/connect/components/GoBackButton'
import { SlideDown } from 'src/connect/components/SlideDown'
import { getDelay } from 'src/connect/utilities/getDelay'

export const DayOfMonthPicker = props => {
  const containerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()
  const days = _range(1, 32)

  return (
    <div ref={containerRef}>
      <SlideDown delay={getNextDelay()}>
        <GoBackButton
          handleGoBack={() => fadeOut(containerRef.current, 'up', 300).then(props.handleClose)}
        />
      </SlideDown>
      <SlideDown delay={getNextDelay()}>
        <Text data-test="date-picker-header" style={styles.title} tag="h2">
          {__('Payment due day')}
        </Text>
        <Text data-test="date-picker-paragraph" style={styles.body} tag="p">
          {__('Choose what day of the month your payment is due.')}
        </Text>
      </SlideDown>
      <SlideDown delay={getNextDelay()}>
        <div data-test="date-picker-calendar" style={styles.buttons}>
          {days.map(day => (
            <Button
              autoFocus={day === 1}
              data-test={`date-picker-button-${day}`}
              key={day}
              name={props.name || day}
              onClick={e => {
                e.persist()

                fadeOut(containerRef.current, 'up', 300).then(() => props.handleSelect(e))
              }}
              style={styles.button}
              value={day}
              variant="transparent"
            >
              {day}
            </Button>
          ))}
        </div>
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  title: {
    marginBottom: tokens.Spacing.XSmall,
  },
  body: {
    marginBottom: tokens.Spacing.Large,
  },
  buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: tokens.Spacing.XSmall,
  },
  button: {
    width: '14.25%',
  },
})

DayOfMonthPicker.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  name: PropTypes.string,
}
