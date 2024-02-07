import { itemAction } from '../../utils/ActionHelpers'
import FireflyAPI from '../../utils/FireflyAPI'

export const ActionTypes = {
  CAMPAIGN_LOADED: 'banner/campaign_loaded',
}

const fetchCampaignBanner = (bullseye, userGuid) => dispatch =>
  FireflyAPI.checkForCampaignBanner(bullseye, userGuid).then(({ banner }) =>
    dispatch(itemAction(ActionTypes.CAMPAIGN_LOADED, banner)),
  )

export const dispatcher = dispatch => ({
  loadCampaignBanner: (bullseye, userGuid) => dispatch(fetchCampaignBanner(bullseye, userGuid)),
})
