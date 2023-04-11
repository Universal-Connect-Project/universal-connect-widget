/* eslint-disable */

import React, { useState, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import { zip, from, of } from 'rxjs'
import _unionBy from 'lodash/unionBy'
import _debounce from 'lodash/debounce'
import _find from 'lodash/find'
import { TextInput } from '@kyper/input'
import { Text } from '@kyper/text'
import { useTokens } from '@kyper/tokenprovider'
import { CloseOutline } from '@kyper/icon/CloseOutline'
import { Search as SearchIcon } from '@kyper/icon/Search'
import { Button } from '@kyper/button'

import FireflyAPI from '../../../utils/FireflyAPI'
import { __ } from '../../../utils/Intl'

import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { SEARCH_VIEWS, SEARCH_ACTIONS, INSTITUTION_TYPES } from './consts'

import { PopularInstitutionsList } from './views/PopularInstitutionsList'
import { SearchedInstitutionsList } from './views/SearchedInstitutionsList'
import { SearchNoResult } from './views/SearchNoResult'
import { SearchFailed } from './views/SearchFailed'
import { SearchTooManyResults } from './views/SearchTooManyResults'
import { Support, VIEWS as SUPPORT_VIEWS } from '../../components/support/Support'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { focusElement } from '../../../utils/Accessibility'
import { AriaLive } from '../../accessibility/AriaLive'
import { Container } from '../../components/Container'
import { VERIFY_MODE, TAX_MODE, AGG_MODE } from '../../const/Connect'

const initialState = {
  currentView: SEARCH_VIEWS.LOADING,
  popularInstitutions: [],
  discoveredInstitutions: [],
  showSupportView: false,
  searchedInstitutions: [],
  searchTerm: '',
  error: null, // Used to store the load or search failed related exceptions
}

const reducer = (state, action) => {
  switch (action.type) {
    case SEARCH_ACTIONS.LOAD_SUCCESS:
      return {
        ...state,
        currentView: SEARCH_VIEWS.POPULAR,
        popularInstitutions: action.payload.updatedPopularInstitutions,
        discoveredInstitutions: action.payload.updatedDiscoveredInstitutions,
      }

    case SEARCH_ACTIONS.POPULAR:
      return {
        ...state,
        currentView: SEARCH_VIEWS.POPULAR,
        searchTerm: '',
      }

    case SEARCH_ACTIONS.RESET_SEARCH:
      return {
        ...state,
        currentView: SEARCH_VIEWS.POPULAR,
        searchTerm: '',
      }

    case SEARCH_ACTIONS.LOAD_ERROR:
      return {
        ...state,
        error: action.payload,
        currentView: SEARCH_VIEWS.OOPS,
      }

    case SEARCH_ACTIONS.SEARCH_FAILED:
      return {
        ...state,
        error: action.payload,
        currentView: SEARCH_VIEWS.SEARCH_FAILED,
      }

    case SEARCH_ACTIONS.SEARCH_LOADING:
      return {
        ...state,
        currentView: SEARCH_VIEWS.SEARCH_LOADING,
        searchTerm: action.payload,
      }

    case SEARCH_ACTIONS.NO_RESULTS:
      return {
        ...state,
        currentView: SEARCH_VIEWS.NO_RESULTS,
      }

    case SEARCH_ACTIONS.SHOW_SEARCHED:
      return {
        ...state,
        currentView: SEARCH_VIEWS.SEARCHED,
        searchedInstitutions: action.payload,
      }

    case SEARCH_ACTIONS.TOO_MANY_RESULTS:
      return { ...state, currentView: SEARCH_VIEWS.TOO_MANY, searchTerm: action.payload }

    case SEARCH_ACTIONS.SHOW_SUPPORT:
      return { ...state, showSupportView: true }

    case SEARCH_ACTIONS.HIDE_SUPPORT:
      return { ...state, showSupportView: false }

    default:
      return state
  }
}

export const Search = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_SEARCH)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [ariaLiveRegionMessage, setAriaLiveRegionMessage] = useState('')
  const searchInput = useRef('')
  const searchForInstitution = useRef(null)

  const {
    connectConfig,
    connectedMembers,
    enableManualAccounts,
    enableSupportRequests,
    onAddManualAccountClick,
    onInstitutionSelect,
    usePopularOnly,
    sendAnalyticsEvent,
    sendPostMessage,
    isMicrodepositsEnabled,
    stepToMicrodeposits,
  } = props

  const MINIMUM_SEARCH_LENGTH = 2
  const mode = connectConfig.mode

  const IS_IN_AGG_MODE = mode === AGG_MODE
  const IS_IN_VERIFY_MODE = mode === VERIFY_MODE
  const IS_IN_TAX_MODE = mode === TAX_MODE

  useEffect(() => {
    const loadPopularInstitutions = () => {
      let params = {}

      if (IS_IN_TAX_MODE) {
        params = { tax_statement_is_enabled: true }
      }

      if (IS_IN_VERIFY_MODE) {
        params = { account_verification_is_enabled: true }
      }

      if (connectConfig.include_identity) {
        params.account_identification_is_enabled = true
      }

      // When in AGG_MODE or REWARD_MODE we dont need to pass anything specifc
      return FireflyAPI.loadPopularInstitutions(params)
    }

    const loadDiscoveredInstitutions = () => {
      if (IS_IN_AGG_MODE && !usePopularOnly) {
        return FireflyAPI.loadDiscoveredInstitutions()
      }

      // For all other modes and configs, return empty array
      return of([])
    }

    const loadInstitutionSearch = zip(
      loadPopularInstitutions(),
      loadDiscoveredInstitutions(),
    ).subscribe(
      ([popularInstitutions, discoveredInstitutions]) => {
        // Since there is no distinction of a 'popular' or 'discovered' on an institution
        // We need to add a type to key off of for our analytic events when selecting an institution
        const updatedPopularInstitutions = popularInstitutions.map(popular => {
          return {
            ...popular,
            analyticType: INSTITUTION_TYPES.POPULAR,
          }
        })
        const updatedDiscoveredInstitutions = discoveredInstitutions.map(discovered => {
          return {
            ...discovered,
            analyticType: INSTITUTION_TYPES.DISCOVERED,
          }
        })

        return dispatch({
          type: SEARCH_ACTIONS.LOAD_SUCCESS,
          payload: { updatedPopularInstitutions, updatedDiscoveredInstitutions },
        })
      },
      error => {
        return dispatch({
          type: SEARCH_ACTIONS.LOAD_ERROR,
          payload: error,
        })
      },
    )

    return () => {
      loadInstitutionSearch.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (state.searchTerm.length < MINIMUM_SEARCH_LENGTH) return () => {}

    const query = buildSearchQuery(state.searchTerm, mode, connectConfig)

    const institutionSearch = from(FireflyAPI.loadInstitutions(query)).subscribe(
      searchedInstitutions => {
        if (!searchedInstitutions.length) {
          return dispatch({ type: SEARCH_ACTIONS.NO_RESULTS })
        }

        return dispatch({
          type: SEARCH_ACTIONS.SHOW_SEARCHED,
          payload: searchedInstitutions,
        })
      },
      error => {
        return dispatch({
          type: SEARCH_ACTIONS.SEARCH_FAILED,
          payload: error,
        })
      },
    )

    return () => {
      institutionSearch.unsubscribe()
    }
  }, [state.searchTerm])

  useEffect(() => {
    focusElement(searchForInstitution.current)
  }, [])

  useEffect(() => {
    // Input is not a controlled input. When closing the support view the inputs value
    // wasn't retained but the search results were. This repopulates the inputs values
    if (state.showSupportView === false && state.searchTerm !== initialState.searchTerm) {
      searchInput.current.value = state.searchTerm
    }
  }, [state.showSupportView])

  const getEligibleInstitutions = () => {
    // usePopularOnly is a bool referencing (hasLimitedInstitutions and usesCustomPopularInstitutionList)
    if (usePopularOnly) {
      return state.popularInstitutions
    }
    // Combine and dedupe both our institution lists
    const dedupedList = _unionBy(state.popularInstitutions, state.discoveredInstitutions, 'guid')

    // Remove connected institutions from the list
    const filteredConnectedList = dedupedList.filter(
      popular => !_find(connectedMembers, ['institution_guid', popular.guid]),
    )

    // Sort list by popularity (highest to lowest)
    // Conditionally including above (filteredConnectedList) only when using discovered institutions
    const sortedList = usePopularOnly
      ? dedupedList.sort((a, b) => b.popularity - a.popularity)
      : filteredConnectedList.sort((a, b) => b.popularity - a.popularity)

    // Only return the first ten
    return sortedList.slice(0, 10)
  }

  const debounceSearch = _debounce(value => {
    if (value === '') {
      dispatch({ type: SEARCH_ACTIONS.POPULAR })
    } else if (value.length < MINIMUM_SEARCH_LENGTH) {
      dispatch({ type: SEARCH_ACTIONS.TOO_MANY_RESULTS, payload: value })
    } else if (value.length >= MINIMUM_SEARCH_LENGTH) {
      // If the searchTerm hasnt changed yet due to the debounce not having run
      // But the value is the same as the previous searchTerm, just
      // continue to show the previous search results
      if (value === state.searchTerm) {
        dispatch({
          type: SEARCH_ACTIONS.SHOW_SEARCHED,
          payload: state.searchedInstitutions,
        })

        return
      }

      sendPostMessage('connect/institutionSearch', { query: value })

      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label: EventLabels.INSTITUTION_SEARCH,
        action: `${EventLabels.INSTITUTION_SEARCH} - ${EventActions.START} (Value Entered)`,
        value,
      })

      dispatch({ type: SEARCH_ACTIONS.SEARCH_LOADING, payload: value })
    }
  }, 500)

  const tokens = useTokens()
  const styles = getStyles(tokens)

  // This allows us to bubble up the exception in the case of an endpoint failing
  // Which will show the GlobalErrorBoundary screen, while retaining the error
  if (state.currentView === SEARCH_VIEWS.OOPS) {
    throw state.error
  }

  if (state.showSupportView) {
    return (
      <Support
        loadToView={SUPPORT_VIEWS.REQ_INSTITUTION}
        onClose={() => dispatch({ type: SEARCH_ACTIONS.HIDE_SUPPORT })}
      />
    )
  }

  return (
    <div style={styles.container}>
      <Container column={true} flex={true}>
        <div style={{ marginBottom: tokens.Spacing.Small }}>
          <Text
            aria-label={__('Select your institution')}
            as="H3"
            ref={searchForInstitution}
            style={styles.headerText}
            tabIndex={-1}
          >
            {__('Select your institution')}
          </Text>
          <TextInput
            aria-label={__('Enter institution name')}
            autoComplete="off"
            autoFocus={false}
            iconLeft={<SearchIcon color={tokens.TextColor.Default} />}
            iconRight={
              state.searchTerm ? (
                <Button
                  aria-label={__('Reset Search')}
                  onClick={() => {
                    sendAnalyticsEvent({
                      category: EventCategories.CONNECT,
                      label: EventLabels.INSTITUTION_SEARCH,
                      action: `${EventLabels.INSTITUTION_SEARCH} - ${EventActions.CLEAR}`,
                    })

                    dispatch({ type: SEARCH_ACTIONS.RESET_SEARCH })

                    searchInput.current.value = '' // Thinking about changing this to a controlled component to manage the value
                    searchInput.current.focus()
                  }}
                  style={styles.resetButton}
                  variant="transparent"
                >
                  <CloseOutline />
                </Button>
              ) : null
            }
            // neustar looks for this id for automated tests
            // DO NOT change without first also changing neustar
            id="mx-connect-search"
            label="" // To fix our design of no label, this is a required prop
            name="Search"
            onChange={e => debounceSearch(e.currentTarget.value)}
            placeholder={__('Search')}
            ref={searchInput}
          />
        </div>
        {state.currentView === SEARCH_VIEWS.LOADING && (
          <div style={styles.spinner}>
            <LoadingSpinner />
          </div>
        )}
        {state.currentView === SEARCH_VIEWS.TOO_MANY && (
          <SearchTooManyResults
            searchTerm={state.searchTerm}
            setAriaLiveRegionMessage={setAriaLiveRegionMessage}
          />
        )}
        {state.currentView === SEARCH_VIEWS.SEARCH_FAILED && <SearchFailed />}
        {state.currentView === SEARCH_VIEWS.NO_RESULTS && (
          <SearchNoResult
            enableManualAccounts={enableManualAccounts}
            enableSupportRequests={enableSupportRequests}
            isMicrodepositsEnabled={isMicrodepositsEnabled}
            onAddManualAccountClick={onAddManualAccountClick}
            onRequestInstitution={() => {
              const label = EventLabels.REQUEST_AN_INSTITUTION

              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label,
                action: label + ' - ' + EventActions.START,
              })

              dispatch({ type: SEARCH_ACTIONS.SHOW_SUPPORT })
            }}
            onVerifyWithMicrodeposits={stepToMicrodeposits}
            setAriaLiveRegionMessage={setAriaLiveRegionMessage}
          />
        )}
        {state.currentView === SEARCH_VIEWS.SEARCH_LOADING && (
          <div style={styles.spinner}>
            <LoadingSpinner />
          </div>
        )}
        {state.currentView === SEARCH_VIEWS.SEARCHED && (
          <SearchedInstitutionsList
            enableManualAccounts={enableManualAccounts}
            enableSupportRequests={enableSupportRequests}
            handleSelectInstitution={onInstitutionSelect}
            institutions={state.searchedInstitutions}
            isMicrodepositsEnabled={isMicrodepositsEnabled}
            onAddManualAccountClick={onAddManualAccountClick}
            onRequestInstitution={() => {
              const label = EventLabels.REQUEST_AN_INSTITUTION

              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label,
                action: label + ' - ' + EventActions.START,
              })

              dispatch({ type: SEARCH_ACTIONS.SHOW_SUPPORT })
            }}
            onVerifyWithMicrodeposits={stepToMicrodeposits}
            sendAnalyticsEvent={sendAnalyticsEvent}
            setAriaLiveRegionMessage={setAriaLiveRegionMessage}
          />
        )}
        {state.currentView === SEARCH_VIEWS.POPULAR && (
          <PopularInstitutionsList
            enableManualAccounts={enableManualAccounts}
            handleSelectInstitution={onInstitutionSelect}
            institutions={getEligibleInstitutions()}
            onAddManualAccountClick={onAddManualAccountClick}
            onSearchInstituionClick={() => searchInput.current.focus()}
            sendAnalyticsEvent={sendAnalyticsEvent}
          />
        )}
        <AriaLive level="assertive" message={ariaLiveRegionMessage} />
      </Container>
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    headerText: {
      display: 'block',
      fontWeight: tokens.FontWeight.Bold,
      marginBottom: tokens.Spacing.Medium,
    },
    resetButton: {
      height: 'auto',
      padding: tokens.Spacing.Tiny,
    },
    tooManyResults: {
      marginTop: tokens.Spacing.Large,
      color: tokens.TextColor.Default,
      fontSize: tokens.FontSize.Paragraph,
      fontWeight: tokens.FontWeight.Regular,
    },
    spinner: {
      marginTop: '24px',
    },
  }
}

Search.propTypes = {
  connectConfig: PropTypes.object.isRequired,
  connectedMembers: PropTypes.array.isRequired,
  enableManualAccounts: PropTypes.bool,
  enableSupportRequests: PropTypes.bool,
  isMicrodepositsEnabled: PropTypes.bool,
  onAddManualAccountClick: PropTypes.func.isRequired,
  onInstitutionSelect: PropTypes.func.isRequired,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
  stepToMicrodeposits: PropTypes.func.isRequired,
  usePopularOnly: PropTypes.bool,
}

/**
 * Creates the search query depending on:
 *  - Search term(routing number vs search term)
 *  - Mode(account_verification_is_enabled, tax_statement_is_enabled)
 *  - Connect config(include_identity)
 */
export const buildSearchQuery = (searchTerm, mode, connectConfig) => {
  const isFullRoutingNum = /^\d{9}$/.test(searchTerm) // 9 digits(0-9)
  const searchTermKey = isFullRoutingNum ? 'routing_number' : 'search_name'
  const IS_IN_VERIFY_MODE = mode === VERIFY_MODE
  const IS_IN_TAX_MODE = mode === TAX_MODE
  const query = { [searchTermKey]: searchTerm }

  if (IS_IN_VERIFY_MODE) {
    query.account_verification_is_enabled = true
  }

  if (IS_IN_TAX_MODE) {
    query.tax_statement_is_enabled = true
  }

  if (connectConfig.hasOwnProperty('include_identity')) {
    query.account_identification_is_enabled = connectConfig.include_identity
  }

  return query
}
