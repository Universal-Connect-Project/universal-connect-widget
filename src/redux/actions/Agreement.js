const ActionTypes = {
  AGREEMENT_LOADING: 'agreement/agreement_loading',
  AGREEMENT_LOADED: 'agreement/agreement_loaded',
  AGREEMENT_ERROR: 'agreement/agreement_error',
}

const loadAgreement = () => ({
  type: ActionTypes.AGREEMENT_LOADING,
})

const dispatcher = dispatch => ({
  loadAgreement: () => dispatch(loadAgreement()),
})

export { ActionTypes, dispatcher }
