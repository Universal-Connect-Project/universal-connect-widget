import { buildSearchQuery } from '../../../../connect/views/search/Search'
import { VERIFY_MODE, TAX_MODE, AGG_MODE } from '../../../../connect/const/Connect'

describe('Search View', () => {
  describe('buildSearchQuery function', () => {
    let searchTermResults
    let routingNumberResults

    it('in verify mode.', () => {
      searchTermResults = buildSearchQuery('searchTerm', VERIFY_MODE, {})
      routingNumberResults = buildSearchQuery('123456780', VERIFY_MODE, {})

      expect(searchTermResults).toEqual({
        search_name: 'searchTerm',
        account_verification_is_enabled: true,
      })
      expect(routingNumberResults).toEqual({
        routing_number: '123456780',
        account_verification_is_enabled: true,
      })
    })

    it('in tax mode.', () => {
      searchTermResults = buildSearchQuery('searchTerm', TAX_MODE, {})
      routingNumberResults = buildSearchQuery('123456780', TAX_MODE, {})

      expect(searchTermResults).toEqual({
        search_name: 'searchTerm',
        tax_statement_is_enabled: true,
      })
      expect(routingNumberResults).toEqual({
        routing_number: '123456780',
        tax_statement_is_enabled: true,
      })
    })

    it('with include_identity', () => {
      const aggResults = buildSearchQuery('searchTerm', AGG_MODE, { include_identity: true })
      const verifyResults = buildSearchQuery('searchTerm', VERIFY_MODE, { include_identity: true })
      const taxResults = buildSearchQuery('searchTerm', TAX_MODE, { include_identity: true })
      const identityFalseResults = buildSearchQuery('searchTerm', AGG_MODE, {
        include_identity: false,
      })

      expect(aggResults).toEqual({
        search_name: 'searchTerm',
        account_identification_is_enabled: true,
      })
      expect(verifyResults).toEqual({
        search_name: 'searchTerm',
        account_verification_is_enabled: true,
        account_identification_is_enabled: true,
      })
      expect(taxResults).toEqual({
        search_name: 'searchTerm',
        tax_statement_is_enabled: true,
        account_identification_is_enabled: true,
      })
      expect(identityFalseResults).toEqual({
        search_name: 'searchTerm',
        account_identification_is_enabled: false,
      })
    })

    it('in all other modes.', () => {
      searchTermResults = buildSearchQuery('searchTerm', AGG_MODE, {})
      routingNumberResults = buildSearchQuery('123456780', AGG_MODE, {})

      expect(searchTermResults).toEqual({ search_name: 'searchTerm' })
      expect(routingNumberResults).toEqual({ routing_number: '123456780' })
    })
  })
})
