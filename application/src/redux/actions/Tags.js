import FireflyAPI from '../../utils/FireflyAPI'

export const ActionTypes = {
  CREATE_TAGGING: 'tags/create_tagging',
  CREATE_TAGGING_ERROR: 'tags/create_tagging_error',
  SELECTED_TAG_NAME_UPDATED: 'tags/selected_tag_name_updated',
  SET_SELECTED_TAG: 'tags/set_selected_tag',
  TAGGINGS_LOADED: 'tags/taggings_loaded',
  TAGGING_CREATED: 'tags/tagging_created',
  TAGGING_DELETED: 'tags/tagging_deleted',
  TAG_CREATED: 'tags/tag_created',
  TAG_DELETED: 'tags/tag_deleted',
  TAG_UPDATED: 'tags/tag_updated',
  TAGS_LOADED: 'tags/tags_loaded',
}
const receiveTaggings = items => ({ type: ActionTypes.TAGGINGS_LOADED, payload: { items } })
const taggingCreated = item => ({ type: ActionTypes.TAGGING_CREATED, payload: { item } })
const taggingDeleted = guid => ({ type: ActionTypes.TAGGING_DELETED, payload: { guid } })
const tagCreated = item => ({ type: ActionTypes.TAG_CREATED, payload: { item } })
const tagDeleted = guid => ({ type: ActionTypes.TAG_DELETED, payload: { guid } })
const tagUpdated = item => ({ type: ActionTypes.TAG_UPDATED, payload: { item } })
const receiveTags = items => ({ type: ActionTypes.TAGS_LOADED, payload: { items } })

export const createTag = (tag, transactionGuid) => dispatch => {
  return FireflyAPI.createTag(tag).then(tag => {
    dispatch(tagCreated(tag))

    if (transactionGuid) {
      FireflyAPI.createTagging({
        tag_guid: tag.guid,
        transaction_guid: transactionGuid,
      }).then(tagging => dispatch(taggingCreated(tagging)))
    }
  })
}

export const createTagging = tagging => dispatch => {
  return FireflyAPI.createTagging(tagging).then(tagging => dispatch(taggingCreated(tagging)))
}

export const deleteTag = tag => dispatch => {
  return FireflyAPI.deleteTag(tag).then(({ guid }) => dispatch(tagDeleted(guid)))
}

export const deleteTagging = tagging => dispatch => {
  return FireflyAPI.deleteTagging(tagging).then(({ guid }) => dispatch(taggingDeleted(guid)))
}

export const loadTaggings = () => dispatch => {
  return FireflyAPI.loadTaggings().then(taggings => dispatch(receiveTaggings(taggings)))
}
export const loadTags = () => dispatch => {
  return FireflyAPI.loadTags().then(tags => dispatch(receiveTags(tags)))
}

export const setSelectedTag = tag => ({
  type: ActionTypes.SET_SELECTED_TAG,
  payload: tag,
})

export const updateTag = tag => dispatch => {
  return FireflyAPI.updateTag(tag).then(tag => dispatch(tagUpdated(tag)))
}

export const updateSelectedTagName = name => ({
  type: ActionTypes.SELECTED_TAG_NAME_UPDATED,
  payload: name,
})

export default dispatch => ({
  createTag: tag => dispatch(createTag(tag)),
  createTagging: tagging => dispatch(createTagging(tagging)),
  deleteTagging: tagging => dispatch(deleteTagging(tagging)),
  deleteTag: tag => dispatch(deleteTag(tag)),
  loadTaggings: () => dispatch(loadTaggings()),
  loadTags: () => dispatch(loadTags()),
  loadTagsAndTaggings: () => dispatch(loadTags()).then(() => dispatch(loadTaggings())),
  setSelectedTag: tag => dispatch(setSelectedTag(tag)),
  updateSelectedTagName: name => dispatch(updateSelectedTagName(name)),
  updateTag: tag => dispatch(updateTag(tag)),
})
