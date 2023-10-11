import { itemAction, setupAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  OFFER_DISMISSED: 'offers/offer_dismissed',
  OFFER_LOADED: 'offers/offer_loaded',
}

import FireflyAPI from '../../utils/FireflyAPI'

const loadOffer = offerType => dispatch =>
  FireflyAPI.loadOffer(offerType).then(offer =>
    dispatch(setupAction(ActionTypes.OFFER_LOADED, { offer, offerType })),
  )

const dismissOffer = guid => dispatch =>
  FireflyAPI.dismissOffer(guid).then(offer =>
    dispatch(itemAction(ActionTypes.OFFER_DISMISSED, offer)),
  )

export const dispatcher = dispatch => ({
  loadOffer: offerType => dispatch(loadOffer(offerType)),
  dismissOffer: guid => dispatch(dismissOffer(guid)),
})
