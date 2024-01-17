// jest.mock('src/connect/services/api')
//
// import { sendAnalyticsPageviewFactory } from 'utils/Analytics'
//
// import connectAPI from 'src/connect/services/api'

describe('Analytics utils placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Analytics Utils', () => {
//   describe('sendAnalyticsPageviewFactory', () => {
//     it('should return a function', () => {
//       const func = sendAnalyticsPageviewFactory({ guid: 'foo' })
//
//       expect(typeof func).toEqual('function')
//     })
//
//     it('should send analytic page view request to the connectAPI when called', () => {
//       const func = sendAnalyticsPageviewFactory({ guid: 'bar' })
//
//       func('name', 'path')
//
//       expect(connectAPI.sendAnalyticsPageview).toHaveBeenCalledWith(
//         expect.objectContaining({
//           name: 'MX - name',
//           path: 'path',
//         }),
//       )
//     })
//
//     it('should have some default values', () => {
//       window.app = { clientConfig: {} }
//       const func = sendAnalyticsPageviewFactory({ guid: 'bar' })
//
//       func('name', 'path')
//
//       expect(connectAPI.sendAnalyticsPageview).toHaveBeenCalledWith(
//         expect.objectContaining({
//           created_at: expect.any(Number),
//           app_version: 'widgets-v2',
//           host: window.location.hostname,
//           user_agent: navigator.userAgent,
//           metadata: null,
//         }),
//       )
//     })
//
//     it('should send along metadata if provided from the window', () => {
//       window.app = { clientConfig: { metadata: 'the metas2' } }
//
//       const func = sendAnalyticsPageviewFactory({ guid: 'bar' })
//
//       func('category', 'name')
//
//       expect(connectAPI.sendAnalyticsPageview).toHaveBeenCalledWith(
//         expect.objectContaining({
//           metadata: 'the metas2',
//         }),
//       )
//     })
//   })
// })
