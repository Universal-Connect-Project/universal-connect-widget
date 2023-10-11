import { setupAction } from '../../utils/ActionHelpers'

export const ActionTypes = {
  CATEGORIES_LOAD: 'categories/categories_load',
  CATEGORIES_LOADED: 'categories/categories_loaded',
  CATEGORY_DELETE: 'categories/category_delete',
  CATEGORY_DELETED: 'categories/category_deleted',
  CATEGORY_DELETED_ERROR: 'categories/category_deleted_error',
  CATEGORY_EDIT: 'categories/category_edit',
  CATEGORY_EDIT_SUCCESS: 'categories/category_edit_success',
  CATEGORY_EDIT_ERROR: 'categories/category_edit_error',
  CATEGORY_SAVE: 'categories/category_save',
  CATEGORY_SAVED: 'categories/category_saved',
  CATEGORY_SAVED_ERROR: 'categories/category_saved_error',
  CATEGORY_SELECTED: 'categories/category_selected',
  CATEGORY_UPDATED: 'categories/category_updated',
  CHILD_CATEGORY_SELECTED: 'categories/child_category_selected',
  FAYE_CATEGORIES_CREATED: 'categories/faye_categories_created',
  FAYE_CATEGORIES_UPDATED: 'categories/faye_categories_updated',
  FAYE_CATEGORIES_DELETED: 'categories/faye_categories_deleted',
  LOAD_CATEGORIES_ERROR: 'categories/load_categories_error',
  LOAD_CATEGORIES_NO_CHANGE: 'categories/load_categories_no_change',
  RESET_CHART: 'categories/reset_chart',
  SHOW_CHILDREN: 'categories/show_children',
}

export const resetChart = () => setupAction(ActionTypes.RESET_CHART)

export const selectCategory = (guid, type, shouldHideChildren) =>
  setupAction(ActionTypes.CATEGORY_SELECTED, { guid, type, shouldHideChildren })

export const selectChildCategory = (guid, type) =>
  setupAction(ActionTypes.CHILD_CATEGORY_SELECTED, { guid, type })

export const showChildren = shouldShowChildren =>
  setupAction(ActionTypes.SHOW_CHILDREN, { shouldShowChildren })

export const updateCategory = item => setupAction(ActionTypes.CATEGORY_UPDATED, { item })

export const loadCategories = () => ({ type: ActionTypes.CATEGORIES_LOAD })

export const deleteCategory = category => setupAction(ActionTypes.CATEGORY_DELETE, category)

export const saveCategory = category => setupAction(ActionTypes.CATEGORY_SAVE, category)

export const editCategory = category => setupAction(ActionTypes.CATEGORY_EDIT, category)

export default dispatch => ({
  loadCategories: () => dispatch(loadCategories()),
  deleteCategory: category => dispatch(deleteCategory(category)),
  saveCategory: category => dispatch(saveCategory(category)),
  selectCategory: (guid, type, shouldHideChildren) =>
    dispatch(selectCategory(guid, type, shouldHideChildren)),
  selectChildCategory: (guid, type) => dispatch(selectChildCategory(guid, type)),
  showChildren: shouldShowChildren => dispatch(showChildren(shouldShowChildren)),
  resetChart: () => dispatch(resetChart()),
  updateCategory: category => dispatch(updateCategory(category)),
  editCategory: category => dispatch(editCategory(category)),
})
