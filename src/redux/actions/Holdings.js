export const ActionTypes = {
  HOLDING_SAVED: 'holdings/holding_saved',
  HOLDINGS_LOADED: 'holdings/holdings_loaded',
  HOLDINGS_LOADING: 'holdings/holdings_loading',
}

import FireflyAPIUtils from '../../utils/FireflyAPI'

const setupAction = (type, payload) => ({ type, payload })
const itemsAction = (type, items) => setupAction(type, { items })
const detailsAction = (type, details) => setupAction(type, { details })
const initiateRequest = type => dispatch => dispatch({ type })

const fetchHoldings = () => dispatch => {
  dispatch(initiateRequest(ActionTypes.HOLDINGS_LOADING))
  return FireflyAPIUtils.loadHoldings().then(({ holdings }) =>
    dispatch(itemsAction(ActionTypes.HOLDINGS_LOADED, holdings)),
  )
}

export const saveHolding = holding => dispatch => {
  return FireflyAPIUtils.saveHolding(holding).then(({ holding }) =>
    dispatch(detailsAction(ActionTypes.HOLDING_SAVED, holding)),
  )
}

export const dispatcher = dispatch => ({
  loadHoldings: () => dispatch(fetchHoldings()),
  saveHolding: holding => dispatch(saveHolding(holding)),
})
