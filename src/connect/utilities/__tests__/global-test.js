import { urlWithHttps } from '../../../connect/utilities/global'

describe('Global Util Tests', () => {
  describe('urlWithHttps', () => {
    it('should return the url if it already has https', () => {
      const url = 'https://www.mx.com'

      expect(urlWithHttps(url)).toEqual('https://www.mx.com/')
    })

    it('should return the url with secure protocol', () => {
      const url = 'http://www.mx.com'

      expect(urlWithHttps(url)).toEqual('https://www.mx.com/')
    })

    it('should return the url with https', () => {
      const url = 'www.mx.com'

      expect(urlWithHttps(url)).toEqual('https://www.mx.com')
    })

    it('should handle other protocols without adding https', () => {
      // In node/test environment, the url.protocol can only be changed to https
      // if the protocol is already a special protocol. In the browser this works
      // with all protocols. More info: https://nodejs.org/api/url.html#urlprotocol
      const fileUrl = 'file://etc/password'
      const ftpUrl = 'ftp://etc/password'
      const wsUrl = 'ws://etc/password'

      expect(urlWithHttps(fileUrl)).toEqual('https://etc/password')
      expect(urlWithHttps(ftpUrl)).toEqual('https://etc/password')
      expect(urlWithHttps(wsUrl)).toEqual('https://etc/password')
    })
  })
})
