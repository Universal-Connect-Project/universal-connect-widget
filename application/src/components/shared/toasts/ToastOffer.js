import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'mx-react-components'

import { dispatcher as offersDispatcher } from '../../../redux/actions/Offers'

import { OfferType } from '../../../constants/Offers'

import { getFullHeight, getIsMobile, getTrueWidth } from '../../../redux/selectors/Browser'
import {
  getMasterToastOffer,
  getMiniToastOffer,
  getMobileToastOffer,
} from '../../../redux/selectors/Offers'

import { combineDispatchers, filterDispatcher } from '../../../utils/ActionHelpers'

import StyleUtils from '../../../utils/Style'

export class ToastOffer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scrimColor: 'rgba(0,0,0,0)',
      offerTop: this.props.height,
    }
  }

  componentDidMount() {
    this.props.loadOffer(OfferType.TOAST_MINI)
    this.props.loadOffer(OfferType.TOAST_MOBILE)
    this.props.loadOffer(OfferType.TOAST_MASTER)
    this.timeoutId = setTimeout(() => {
      this.setState({
        scrimColor: this.props.theme.Colors.SCRIM,
        offerTop: 0,
      })
    }, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  _dismissOffer = offer => {
    this.setState({ scrimColor: 'rgba(0,0,0,0)', offerTop: this.props.height }, () => {
      this.timeoutId = setTimeout(() => this.props.dismissOffer(offer.guid), 2000)
    })
  }

  _getOffer = () => {
    const { isMobile, masterOffer, miniOffer, mobileOffer, widgetType } = this.props

    if (widgetType.includes('mini-')) return miniOffer

    if (isMobile) return mobileOffer

    return masterOffer
  }

  render() {
    const { height, theme, width } = this.props
    const offer = this._getOffer()

    if (!offer) return null

    const widgetDimension = StyleUtils.getMiniWidgetDimension({ height, width })
    const isMini = widgetDimension !== theme.MiniWidgetDimensions.NOT_FOUND
    const styles = {
      component: {
        alignItems: 'center',
        bottom: isMini ? 0 : theme.Spacing.LARGE,
        display: 'flex',
        justifyContent: 'center',
        left: isMini ? 0 : null,
        position: 'absolute',
        right: isMini ? 0 : theme.Spacing.LARGE,
        top: isMini ? 0 : null,
      },
      scrim: {
        backgroundColor: this.state.scrimColor,
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        transition: 'background-color 1s',
        zIndex: theme.Zs.SCRIM,
      },
      offer: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: theme.ShadowHigh,
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        padding: theme.Spacing.SMALL,
        position: 'relative',
        top: this.state.offerTop,
        transition: 'top 1s',
        width: 320,
        zIndex: theme.Zs.SCRIM,
      },
      dismiss: {
        alignItems: 'center',
        backgroundColor: theme.Colors.WHITE,
        borderRadius: '100%',
        display: 'flex',
        fill: theme.Colors.GRAY_700,
        justifyContent: 'center',
        position: 'absolute',
        right: theme.Spacing.MEDIUM,
        top: theme.Spacing.MEDIUM,
        zIndex: theme.Zs.ACTION_BAR,
      },
      image: {
        maxHeight: '100%',
        maxWidth: '100%',
      },
    }

    return (
      /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
      // This component is only used in mini spending widget which is not accessible, so this is just being commented out in the meantime.
      <div style={styles.component}>
        {isMini && <div style={styles.scrim} />}
        <div
          onClick={offer.redirect_url ? () => window.open(offer.redirect_url, '__blank') : null}
          style={styles.offer}
        >
          <div
            onClick={e => {
              e.stopPropagation()
              this._dismissOffer(offer)
            }}
            style={styles.dismiss}
          >
            <Icon size={16} type="close-skinny" />
          </div>
          <img alt="" src={offer.image.src} style={styles.image} />
        </div>
      </div>
    )
  }
}

ToastOffer.propTypes = {
  dismissOffer: PropTypes.func.isRequired,
  height: PropTypes.number,
  isMobile: PropTypes.bool,
  loadOffer: PropTypes.func.isRequired,
  masterOffer: PropTypes.object,
  miniOffer: PropTypes.object,
  mobileOffer: PropTypes.object,
  theme: PropTypes.object.isRequired,
  widgetType: PropTypes.string.isRequired,
  width: PropTypes.number,
}

const mapStateToProps = state => {
  return {
    height: getFullHeight(state),
    isMobile: getIsMobile(state),
    masterOffer: getMasterToastOffer(state),
    miniOffer: getMiniToastOffer(state),
    mobileOffer: getMobileToastOffer(state),
    theme: state.theme,
    width: getTrueWidth(state),
  }
}

const mapDispatchToProps = combineDispatchers(
  filterDispatcher(offersDispatcher, 'dismissOffer', 'loadOffer'),
)

export default connect(mapStateToProps, mapDispatchToProps)(ToastOffer)
