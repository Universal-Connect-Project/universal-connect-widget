export const ActionTypes = {
  SELECT_HELP_CATEGORY: 'help/select_help_category',
}

import { setupAction } from '../../utils/ActionHelpers'

const selectHelpCategory = (selectedCategory, selectedTopicsOverride) => dispatch =>
  dispatch(
    setupAction(ActionTypes.SELECT_HELP_CATEGORY, {
      selectedCategory,
      selectedTopicsOverride,
    }),
  )

export const dispatcher = dispatch => ({
  selectHelpCategory: (selectedCategory, selectedTopicsOverride) =>
    dispatch(selectHelpCategory(selectedCategory, selectedTopicsOverride)),
})
