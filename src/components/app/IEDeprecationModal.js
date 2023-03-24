import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, FocusTrap } from 'mx-react-components'
import { AttentionFilled } from '@kyper/icon/AttentionFilled'
import { AttentionOutline } from '@kyper/icon/AttentionOutline'
import { ChevronDown } from '@kyper/icon/ChevronDown'
import { Close } from '@kyper/icon/Close'
import { ChevronUp } from '@kyper/icon/ChevronUp'
import { Text } from '@kyper/text'

import { __ } from '../../utils/Intl'
import BarebonesModal from '../shared/modals/BarebonesModal'

const IEDeprecationModal = props => {
  const [isExpanded, setIsExpanded] = useState(true)
  const { theme, size, height, width } = props
  const isSmall = size === 'small'
  const styles = Styles(theme, isSmall, width)
  // checks for the mini widgets that are smaller than text size supports
  // these values were arbitrary based on amount of text for this view
  const isSmallFrame = height < 360 || width < 250
  const toolsContent = __('We no longer provide')

  const ariaLabelContent = `${__('Please switch to a different internet browser')}. ${__(
    'We no longer provide',
  )} ${__(
    'support for Internet Explorer 11. Please switch to a compatible browser for a better experience.',
  )}
  ${__(
    '* Please note that clicking to download a browser will open a new window that takes you to a website we do not own or operate.',
  )}`

  return isSmall ? (
    <React.Fragment>
      {!isExpanded ? (
        <div style={{ ...styles.expandBody, height: '40px' }}>
          <div style={{ ...styles.expandHeader }}>
            <span>
              <AttentionOutline color="white" style={{ marginRight: '5px' }} /> {'Attention'}
            </span>
            <button
              aria-label={__('Click to expand')}
              onClick={() => setIsExpanded(true)}
              style={{ backgroundColor: 'transparent', border: 'none' }}
            >
              {<ChevronUp color="white" style={{ cursor: 'pointer' }} />}
            </button>
          </div>
        </div>
      ) : (
        <FocusTrap>
          <div aria-label={ariaLabelContent} style={{ ...styles.expandBody, height: '100%' }}>
            <div style={{ ...styles.expandHeader }}>
              <span>
                <AttentionOutline color="white" style={{ marginRight: '5px' }} /> Attention
              </span>
              <button
                aria-label={__('Click to minimize notice')}
                onClick={() => setIsExpanded(false)}
                style={{ backgroundColor: 'transparent', border: 'none' }}
              >
                {<ChevronDown color="white" style={{ cursor: 'pointer' }} />}
              </button>
            </div>
            <div style={styles.expandContent}>
              <p style={{ ...styles.upgradeBold, fontSize: !isSmallFrame ? '15px' : '14px' }}>
                {!isSmallFrame
                  ? __('Please switch to a different internet browser')
                  : __('Please switch browsers')}
              </p>
              <p
                style={{
                  ...styles.content,
                  marginBottom: theme.Spacing.SMALL,
                  fontSize: !isSmallFrame ? '14px' : '13px',
                }}
              >
                {!isSmallFrame
                  ? `${toolsContent} ${__(
                      'support for Internet Explorer 11. Please switch to a compatible browser for a better experience.',
                    )}`
                  : `${toolsContent} ${__(
                      'support for IE 11. Choose another browser for a better experience.',
                    )}`}
              </p>
              <ul style={{ marginBottom: theme.Spacing.SMALL, listStyle: 'none' }}>
                <li style={{ ...styles.miniLink, fontSize: !isSmallFrame ? '14px' : '13px' }}>
                  <span>Edge - </span>
                  <a
                    aria-label={__('Click to open %1 download page', 'Microsoft Edge')}
                    href="https://www.microsoft.com/edge"
                    onClick={() => props.onDownloadBrowser('Edge')}
                    rel="noreferrer noopener"
                    style={styles.link}
                    target="_blank"
                  >
                    {!isSmallFrame ? __('Click to download') : __('Download Here')}
                  </a>
                </li>
                <li style={{ ...styles.miniLink, fontSize: !isSmallFrame ? '14px' : '13px' }}>
                  <span>Chrome - </span>
                  <a
                    aria-label={__('Click to open %1 download page', 'Google Chrome')}
                    href="https://www.google.com/chrome/"
                    onClick={() => props.onDownloadBrowser('Chrome')}
                    rel="noreferrer noopener"
                    style={styles.link}
                    target="_blank"
                  >
                    {!isSmallFrame ? __('Click to download') : __('Download Here')}
                  </a>
                </li>
                <li style={{ ...styles.miniLink, fontSize: !isSmallFrame ? '14px' : '13px' }}>
                  <span>Firefox - </span>
                  <a
                    aria-label={__('Click to open %1 download page', 'Mozilla Firefox')}
                    href="https://www.mozilla.org/firefox/"
                    onClick={() => props.onDownloadBrowser('Firefox')}
                    rel="noreferrer noopener"
                    style={styles.link}
                    target="_blank"
                  >
                    {!isSmallFrame ? __('Click to download') : __('Download Here')}
                  </a>
                </li>
              </ul>
              <p style={{ fontSize: !isSmallFrame ? '11px' : '10px', color: 'gray' }}>
                {__(
                  '* Please note that clicking to download a browser will open a new window that takes you to a website we do not own or operate.',
                )}
              </p>
            </div>
          </div>
        </FocusTrap>
      )}
    </React.Fragment>
  ) : (
    <BarebonesModal
      isRelative={true}
      modalStyles={styles.container}
      onClose={props.onClose}
      tabIndex={0}
    >
      <AttentionFilled color={theme.Colors.WARNING} style={styles.warningIcon} width={50} />
      <div style={styles.textRow}>
        <h3 color="primary" style={styles.upgradeBold}>
          {__('Please switch to a different internet browser')}
        </h3>
        <p style={styles.content}>
          {` ${toolsContent} ${__(
            'support for Internet Explorer 11. Please switch to a compatible browser for a better experience.',
          )}`}
        </p>
      </div>
      <div style={styles.linkRow}>
        <div
          style={{
            ...styles.iconContainer,
            ...styles.multipleIconsBorder,
          }}
        >
          <img
            alt="Google Chrome Logo"
            src={`${theme.MediaResourceBaseUrl}browser-icons/chrome-icon.png`}
            style={styles.browserIcon}
          />
          <div style={styles.browserName}>Google Chrome</div>
          <a
            aria-label={__('Click to open %1 download page', 'Google Chrome')}
            href="https://www.google.com/chrome/"
            onClick={() => props.onDownloadBrowser('Chrome')}
            rel="noreferrer noopener"
            style={styles.link}
            target="_blank"
          >
            {__('Click to download')}
          </a>
        </div>
        <div
          style={{
            ...styles.iconContainer,
            ...styles.multipleIconsBorder,
          }}
        >
          <img
            alt="Firefox Logo"
            src={`${theme.MediaResourceBaseUrl}browser-icons/firefox-icon.png`}
            style={styles.browserIcon}
          />
          <div style={styles.browserName}>Firefox</div>
          <a
            aria-label={__('Click to open %1 download page', 'Mozilla Firefox')}
            href="https://www.mozilla.org/firefox/"
            onClick={() => props.onDownloadBrowser('Firefox')}
            rel="noreferrer noopener"
            style={styles.link}
            target="_blank"
          >
            {__('Click to download')}
          </a>
        </div>
        <div style={styles.iconContainer}>
          <img
            alt="Edge Logo"
            src={`${theme.MediaResourceBaseUrl}browser-icons/edge-icon.png`}
            style={styles.browserIcon}
          />
          <div style={styles.browserName}>Microsoft Edge</div>
          <a
            aria-label={__('Click to open %1 download page', 'Microsoft Edge')}
            href="https://www.microsoft.com/edge"
            onClick={() => props.onDownloadBrowser('Edge')}
            rel="noreferrer noopener"
            style={styles.link}
            target="_blank"
          >
            {__('Click to download')}
          </a>
        </div>
      </div>
      <div style={{ padding: `0 ${theme.Spacing.LARGE}px` }}>
        <Text as="XSmall" color="secondary" tag="p">
          {__(
            '* Please note that clicking to download a browser will open a new window that takes you to a website we do not own or operate.',
          )}
        </Text>
      </div>
      <Button
        aria-hidden="false"
        aria-label="close modal"
        onClick={props.onClose}
        style={styles.closeModalButton}
        type="base"
      >
        <Close size={theme.FontSizes.XXLARGE} />
      </Button>
    </BarebonesModal>
  )
}

const Styles = (theme, isSmall, height, width) => ({
  expandBody: {
    backgroundColor: 'white',
    width: '100%',
    position: 'fixed',
    zIndex: 900,
    bottom: 0,
    left: 0,
    overflow: 'auto',
  },
  expandHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 20,
    backgroundColor: '#2F73DA',
    alignItems: 'center',
    padding: '5px',
    color: 'white',
  },
  expandContent: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  miniLink: {
    marginBottom: theme.Spacing.XSMALL,
  },
  linkRow: {
    margin: `${theme.Spacing.LARGE}px 0`,
    display: 'flex',
    textAlign: 'center',
  },
  link: {
    marginTop: theme.Spacing.SMALL,
    textDecoration: 'none',
    fontFamily: theme.Fonts.SEMIBOLD,
    fontSize: `${theme.FontSizes.MEDIUM}px`,
    color: theme.Colors.PRIMARY,
  },
  browserIcon: {
    width: 50,
    margin: theme.Spacing.SMALL,
  },
  browserName: {
    color: theme.Colors.GRAY_900,
    marginBottom: theme.Spacing.XSMALL,
    fontFamily: theme.Fonts.SEMIBOLD,
    fontSize: `${theme.FontSizes.LARGE}px`,
  },
  browserDownload: {
    color: theme.Colors.BLUE_500,
    marginTop: theme.Spacing.XSMALL,
  },
  container: {
    textAlign: 'left',
    position: 'fixed',
    backgroundColor: theme.Colors.WHITE,
    boxShadow: theme.ShadowLow,
    borderRadius: 3,
    width: isSmall ? width : '550px',
    maxWidth: isSmall ? width : null,
    height: isSmall ? height : null,
    top: '50%',
    left: isSmall ? 0 : '50%',
    transform: !isSmall ? 'translate(-50%, -50%)' : null,
    padding: !isSmall ? `${theme.Spacing.LARGE}px ${theme.Spacing.MEDIUM}px` : null,
  },
  content: {
    marginBottom: theme.Spacing.SMALL,
  },
  textRow: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.Spacing.XLARGE - theme.Spacing.XSMALL,
  },
  warningIcon: {
    position: 'absolute',
    top: theme.Spacing.LARGE,
    left: theme.Spacing.MEDIUM,
    width: theme.Spacing.MEDIUM,
  },
  iconContainer: {
    flex: '1',
    width: `115px`,
  },
  closeModalButton: {
    padding: 0,
    position: 'absolute',
    top: theme.Spacing.XSMALL,
    right: theme.Spacing.XSMALL,
  },
  closeModalIcon: {
    fill: theme.Colors.GRAY_900,
  },
  singleBrowserCard: {
    width: 'fit-content',
    margin: `${theme.Spacing.LARGE}px auto`,
    padding: `${theme.Spacing.XSMALL}px`,
    display: 'flex',
    alignItems: 'center',
  },
  singleBrowserTextContainer: {
    display: 'inline-block',
    margin: `${theme.Spacing.XSMALL}px`,
  },
  upgradeBold: {
    fontSize: theme.FontSizes.XLARGE,
    fontFamily: theme.Fonts.SEMIBOLD,
    marginBottom: theme.Spacing.SMALL,
  },
  multipleIconsBorder: {
    borderRight: theme.DefaultBorder,
    borderBottom: 'none',
  },
})

IEDeprecationModal.propTypes = {
  height: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onDownloadBrowser: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  width: PropTypes.number,
}

const mapStateToProps = state => {
  return {
    size: state.browser.size,
    theme: state.theme,
    height: state.browser.fullHeight,
    width: state.browser.trueWidth,
  }
}

export default connect(mapStateToProps)(IEDeprecationModal)
