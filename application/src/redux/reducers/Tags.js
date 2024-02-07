import { ActionTypes } from '../actions/Tags'
import { createReducer, updateObject } from '../../utils/Reducer'

export const defaultTaggingsState = {
  items: [],
}

export const defaultTagsState = {
  items: [],
  selectedTag: {},
}

const load = (state, action) => updateObject(state, { items: action.payload.items })
const create = (state, action) =>
  updateObject(state, { items: [...state.items, action.payload.item] })
const deleteBy = (stateKey = 'guid', actionKey = 'guid') => (state, action) =>
  updateObject(state, {
    items: state.items.filter(item => item[stateKey] !== action.payload[actionKey]),
  })
const update = (state, action) =>
  updateObject(state, {
    items: state.items.map(item =>
      item.guid === action.payload.item.guid ? action.payload.item : item,
    ),
  })
const setSelectedTag = (state, action) => ({
  ...state,
  selectedTag: action.payload,
})
const updateSelectedTagName = (state, action) => ({
  ...state,
  selectedTag: {
    ...state.selectedTag,
    name: action.payload,
  },
})

export const taggings = createReducer(defaultTaggingsState, {
  [ActionTypes.TAG_DELETED]: deleteBy('tag_guid', 'guid'),
  [ActionTypes.TAGGING_DELETED]: deleteBy(),
  [ActionTypes.TAGGING_CREATED]: create,
  [ActionTypes.TAGGINGS_LOADED]: load,
})
export const tags = createReducer(defaultTagsState, {
  [ActionTypes.SELECTED_TAG_NAME_UPDATED]: updateSelectedTagName,
  [ActionTypes.SET_SELECTED_TAG]: setSelectedTag,
  [ActionTypes.TAG_CREATED]: create,
  [ActionTypes.TAG_DELETED]: deleteBy(),
  [ActionTypes.TAGS_LOADED]: load,
  [ActionTypes.TAG_UPDATED]: update,
})
