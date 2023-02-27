import { createSelector } from 'reselect'
import _find from 'lodash/find'
import _includes from 'lodash/includes'

import { OfferType } from '../../constants/Offers'

import { getLogoUrl } from '../../utils/Account'

export const getOffers = state => state.offers.items
const getAccounts = state => state.accounts.items

export const getDetailedOffers = createSelector(getOffers, getAccounts, (offers, accounts) =>
  offers.map(offer => {
    const account = _find(accounts, { guid: offer.account_guid }) || {}

    return {
      ...offer,
      account_interest_rate: account.interest_rate || account.apy || account.apr || 0,
      account_logo: getLogoUrl(account),
      account_name: account.user_name || account.name || 'Current Account',
    }
  }),
)

export const getActiveOffers = createSelector(getDetailedOffers, getAccounts, (offers, accounts) =>
  offers.filter(offer =>
    _includes(
      accounts.map(account => account.guid),
      offer.account_guid,
    ),
  ),
)

export const getFinSmartAccountsCreditCardOffer = createSelector(getActiveOffers, offers =>
  _find(offers, { campaign_type: OfferType.FINSMART_CREDIT_CARD }),
)

export const getFinSmartSpendingCreditCardOffer = createSelector(getActiveOffers, offers =>
  _find(offers, { campaign_type: OfferType.FINSMART_CREDIT_CARD_SPENDING_WIDGET }),
)

export const getFinSmartAccountsBalanceTransferOffer = createSelector(getActiveOffers, offers =>
  _find(offers, { campaign_type: OfferType.FINSMART_BALANCE_TRANSFER }),
)

export const getFinSmartSpendingBalanceTransferOffer = createSelector(getActiveOffers, offers =>
  _find(offers, { campaign_type: OfferType.FINSMART_BALANCE_TRANSFER_SPENDING_WIDGET }),
)

export const getFinSmartAccountsOffer = createSelector(
  getFinSmartAccountsCreditCardOffer,
  getFinSmartAccountsBalanceTransferOffer,
  (creditCardOffer, balanceTransferOffer) => creditCardOffer || balanceTransferOffer,
)

export const getFinSmartSpendingOffer = createSelector(
  getFinSmartSpendingCreditCardOffer,
  getFinSmartSpendingBalanceTransferOffer,
  (creditCardOffer, balanceTransferOffer) => creditCardOffer || balanceTransferOffer,
)

export const getMasterToastOffer = createSelector(getDetailedOffers, offers =>
  _find(offers, { campaign_type: OfferType.TOAST_MASTER }),
)

export const getMiniToastOffer = createSelector(getDetailedOffers, offers =>
  _find(offers, { campaign_type: OfferType.TOAST_MINI }),
)

export const getMobileToastOffer = createSelector(getDetailedOffers, offers =>
  _find(offers, { campaign_type: OfferType.TOAST_MOBILE }),
)
