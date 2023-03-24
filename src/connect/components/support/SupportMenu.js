import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { UtilityRow } from '@kyper/utilityrow'
import { ChevronRight } from '@kyper/icon/ChevronRight'
import { Text } from '@kyper/text'

import { __ } from '../../../utils/Intl'

import { SlideDown } from '../SlideDown'
import { GoBackButton } from '../GoBackButton'
import { getDelay } from '../../utilities/getDelay'

export const SupportMenu = props => {
  const { handleClose, selectGeneralSupport, selectRequestInstitution } = props
  const containerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const getNextDelay = getDelay()

  return (
    <div ref={containerRef}>
      <SlideDown delay={getNextDelay()}>
        <div style={styles.header}>
          <GoBackButton handleGoBack={handleClose} />

          <Text style={styles.title} tag="h2">
            {__('Get help')}
          </Text>
        </div>
      </SlideDown>

      <SlideDown delay={getNextDelay()}>
        <UtilityRow
          borderType="inset-left"
          onClick={selectRequestInstitution}
          rightChildren={<ChevronRight />}
          subTitle={__('Request to have it added')}
          title={__("Can't find your bank?")}
        />
        <UtilityRow
          borderType="inset-left"
          onClick={selectGeneralSupport}
          rightChildren={<ChevronRight />}
          subTitle={__('Get help connecting your account')}
          title={__('Request support')}
        />
      </SlideDown>
    </div>
  )
}

const getStyles = tokens => ({
  header: {
    marginTop: tokens.Spacing.Large,
    marginLeft: tokens.Spacing.Large,
  },
  title: {
    display: 'block',
    marginBottom: tokens.Spacing.XSmall,
  },
})

SupportMenu.propTypes = {
  handleClose: PropTypes.func.isRequired,
  selectGeneralSupport: PropTypes.func.isRequired,
  selectRequestInstitution: PropTypes.func.isRequired,
}
