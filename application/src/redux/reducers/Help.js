import { createReducer } from '../../utils/Reducer'
import { HelpCategories, HelpTopics, SELECTED_TOPICS_OVERRIDE_CONTENT } from '../../constants/Help'
import { ActionTypes } from '../actions/Help'

const { SELECT_HELP_CATEGORY } = ActionTypes

export const defaultState = {
  categories: HelpCategories,
  selectedCategory: null,
  selectedTopics: null,
  topics: HelpTopics,
}

const selectHelpCategory = (state, action) => {
  const { selectedCategory, selectedTopicsOverride } = action.payload

  if (selectedTopicsOverride && SELECTED_TOPICS_OVERRIDE_CONTENT[selectedTopicsOverride]) {
    return {
      ...state,
      selectedCategory,
      selectedTopics: SELECTED_TOPICS_OVERRIDE_CONTENT[selectedTopicsOverride],
    }
  }

  const selectedTopics = selectedCategory ? HelpTopics[selectedCategory.guid] : null

  return {
    ...state,
    selectedCategory,
    selectedTopics,
  }
}

export const help = createReducer(defaultState, {
  [SELECT_HELP_CATEGORY]: selectHelpCategory,
})
