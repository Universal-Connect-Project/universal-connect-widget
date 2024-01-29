import FireflyAPI from '../../utils/FireflyAPI'

export const ActionTypes = {
  ACCOUNTS_INSTITUTION_LOADED: 'institutions/accounts_institution_loaded',
  ACCOUNTS_INSTITUTION_LOADING: 'institutions/accounts_institution_loading',
  ACCOUNTS_INSTITUTIONS_LOADED: 'institutions/accounts_institutions_loaded',
  CONNECT_INSTITUTIONS_LOADING: 'institutions/connect_institutions_loading',
  CONNECT_INSTITUTIONS_LOADED: 'institutions/connect_institutions_loaded',
  CONNECT_INSTITUTIONS_RESET: 'institutions/connect_institutions_reset',
  ACCOUNTS_INSTITUTIONS_LOADING: 'institutions/accounts_institutions_loading',
  POPULAR_INSTITUTIONS_LOADED: 'institutions/popular_institutions_loaded',
  POPULAR_INSTITUTIONS_LOADING: 'institutions/popular_institutions_loading',
  RESET_ACCOUNTS_INSTITUTION: 'institutions/reset_accounts_institution',
  RESET_ACCOUNTS_INSTITUTIONS: 'institutions/reset_accounts_institutions',
  SELECT_ACCOUNTS_INSTITUTION: 'institutions/select_accounts_institution',
  DISCOVERED_INSTITUTIONS_LOADING: 'institutions/discovered_institutions_loading',
  DISCOVERED_INSTITUTIONS_LOADED: 'institutions/discovered_institutions_loaded',
}

export const dispatcher = dispatch => ({
  loadInstitutions: () => {
    dispatch({ type: ActionTypes.ACCOUNTS_INSTITUTIONS_LOADING })

    return FireflyAPI.loadInstitutions().then(accountsInstitutions =>
      dispatch({
        type: ActionTypes.ACCOUNTS_INSTITUTIONS_LOADED,
        payload: { accountsInstitutions },
      }),
    )
  },

  loadConnectInstitutions: query => {
    dispatch({ type: ActionTypes.CONNECT_INSTITUTIONS_LOADING })

    return FireflyAPI.loadInstitutions(query).then(connectInstitutions =>
      dispatch({
        type: ActionTypes.CONNECT_INSTITUTIONS_LOADED,
        payload: { connectInstitutions },
      }),
    )
  },

  loadInstitutionByGuid: guid => {
    dispatch({ type: ActionTypes.ACCOUNTS_INSTITUTION_LOADING })

    return FireflyAPI.loadInstitutionByGuid(guid).then(accountsInstitution => {
      dispatch({
        type: ActionTypes.ACCOUNTS_INSTITUTION_LOADED,
        payload: { item: accountsInstitution },
      })
      //TODO: This breaks unidirectional data flow and should be avoided. Remove once all data for institutions, members and accounts is in redux
      //Future developer: do not follow this pattern, return the dispatch instead
      return accountsInstitution
    })
  },

  loadInstitutionByCode: code => {
    dispatch({ type: ActionTypes.ACCOUNTS_INSTITUTION_LOADING })

    return FireflyAPI.loadInstitutionByCode(code).then(accountsInstitution =>
      dispatch({
        type: ActionTypes.ACCOUNTS_INSTITUTION_LOADED,
        payload: { item: accountsInstitution },
      }),
    )
  },

  loadPopularInstitutions: query => {
    dispatch({ type: ActionTypes.POPULAR_INSTITUTIONS_LOADING })

    return FireflyAPI.loadPopularInstitutions(query).then(popularInstitutions =>
      dispatch({ type: ActionTypes.POPULAR_INSTITUTIONS_LOADED, payload: { popularInstitutions } }),
    )
  },

  loadDiscoveredInstitutions: () => {
    dispatch({ type: ActionTypes.DISCOVERED_INSTITUTIONS_LOADING })

    return FireflyAPI.loadDiscoveredInstitutions().then(discoveredInstitutions => {
      dispatch({
        type: ActionTypes.DISCOVERED_INSTITUTIONS_LOADED,
        payload: { discoveredInstitutions },
      })
    })
  },

  resetInstitution: () => dispatch({ type: ActionTypes.RESET_ACCOUNTS_INSTITUTION }),

  resetConnectInstitutions: () => dispatch({ type: ActionTypes.CONNECT_INSTITUTIONS_RESET }),

  resetInstitutions: () => dispatch({ type: ActionTypes.RESET_ACCOUNTS_INSTITUTIONS }),

  selectInstitution: accountsInstitution =>
    dispatch({
      type: ActionTypes.SELECT_ACCOUNTS_INSTITUTION,
      payload: { item: accountsInstitution },
    }),

  setConnectInstitutionsLoading: () => dispatch({ type: ActionTypes.CONNECT_INSTITUTIONS_LOADING }),
})
