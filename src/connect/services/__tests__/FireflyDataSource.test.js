import { ApiEndpoints, FireflyDataSource } from '../../../connect/services/FireflyDataSource'
import mxAxios from '../../../connect/services/mxAxios'
import { AGG_MODE, VERIFY_MODE } from '../../../connect/const/Connect'

jest.mock('src/connect/services/mxAxios')

const connectAPI = new FireflyDataSource(mxAxios)

describe('FireflyDataSource.addMember', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const request = { foo: 'bar' }

  it('should call the correct URL with the request', () => {
    connectAPI.addMember(request)
    expect(mxAxios.post).toHaveBeenCalledWith(
      ApiEndpoints.MEMBERS,
      {
        ...request,
        client_redirect_url: null,
        include_transactions: null,
        background_aggregation_is_disabled: false,
        referral_source: 'BROWSER',
        skip_aggregation: true,
        ui_message_webview_url_scheme: 'mx',
      },
      { headers: { 'x-inter-hu': '0' } },
    )
  })

  it('should take client_redirect_url into account', () => {
    const connectConfig = { client_redirect_url: 'https://test.com/test/path' }

    connectAPI.addMember(request, connectConfig)

    expect(mxAxios.post).toHaveBeenCalledWith(
      ApiEndpoints.MEMBERS,
      {
        ...request,
        include_transactions: null,
        background_aggregation_is_disabled: false,
        referral_source: 'BROWSER',
        skip_aggregation: true,
        ui_message_webview_url_scheme: 'mx',
        client_redirect_url: 'https://test.com/test/path',
      },
      { headers: { 'x-inter-hu': '0' } },
    )
  })

  describe('.addMember Background Aggregation', () => {
    const defaultExpectedData = {
      ...request,
      client_redirect_url: null,
      include_transactions: null,
      background_aggregation_is_disabled: false,
      referral_source: 'BROWSER',
      skip_aggregation: true,
      ui_message_webview_url_scheme: 'mx',
    }

    it('enables background aggregation by default, when NOT in VERIFY MODE', () => {
      const connectConfig = {}

      connectAPI.addMember(request, connectConfig)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: false,
        },
        { headers: { 'x-inter-hu': '0' } },
      )
    })

    it('disables background aggregation by default in VERIFY_MODE', () => {
      // Providing VERIFY_MODE, and not specifying a value for `disable_background_agg`
      // will have background agg disabled by default
      const connectConfig = { mode: VERIFY_MODE }

      connectAPI.addMember(request, connectConfig)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: true,
        },
        { headers: { 'x-inter-hu': '0' } },
      )
    })

    it('should take disable_background_agg boolean of true into account', () => {
      const connectConfig = { disable_background_agg: true }

      connectAPI.addMember(request, connectConfig)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: true,
        },
        { headers: { 'x-inter-hu': '0' } },
      )
    })

    it('should take disable_background_agg boolean false into account', () => {
      const connectConfig = { disable_background_agg: false }

      connectAPI.addMember(request, connectConfig)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: false,
        },
        { headers: { 'x-inter-hu': '0' } },
      )
    })

    // A little more edge case... if something like a string is passed in
    it('should take a "truthy" disable_background_agg value into account', () => {
      const connectConfig = { disable_background_agg: 'false' }

      connectAPI.addMember(request, connectConfig)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: true,
        },
        { headers: { 'x-inter-hu': '0' } },
      )
    })

    it('should take a "falsy" disable_background_agg value into account', () => {
      const connectConfig = { disable_background_agg: '' }

      connectAPI.addMember(request, connectConfig)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: false,
        },
        { headers: { 'x-inter-hu': '0' } },
      )
    })

    it('if null is provided for disable_background_agg value, the mode will determine the value', () => {
      // Aggregation Mode defaults to enabled background aggregation
      const connectConfig = { disable_background_agg: null, mode: AGG_MODE }

      connectAPI.addMember(request, connectConfig)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: false,
        },
        { headers: { 'x-inter-hu': '0' } },
      )

      // Verification Mode defaults to disabled background aggregation
      const config = { disable_background_agg: null, mode: VERIFY_MODE }

      connectAPI.addMember(request, config)

      expect(mxAxios.post).toHaveBeenCalledWith(
        ApiEndpoints.MEMBERS,
        {
          ...defaultExpectedData,
          background_aggregation_is_disabled: true,
        },
        { headers: { 'x-inter-hu': '0' } },
      )
    })
  })
})
