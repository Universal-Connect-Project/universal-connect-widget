import { formatUrl } from 'src/connect/utilities/FormatUrl'

describe('formatUrl', () => {
  it('returns the hostname if no protocol is present', () => {
    const url = 'gringotts.bank/goblins/wizards'
    expect(formatUrl(url)).toEqual('gringotts.bank')
  })

  it('returns the hostname if protocol is present', () => {
    const url = 'https://gringotts.bank/goblins/wizards'
    expect(formatUrl(url)).toEqual('gringotts.bank')
  })

  it('returns the hostname if www is present with protocol', () => {
    const url = 'https://www.gringotts.bank/goblins/wizards'
    expect(formatUrl(url)).toEqual('www.gringotts.bank')
  })

  it('returns the hostname if www is present without protocol', () => {
    const url = 'www.gringotts.bank/goblins/wizards'
    expect(formatUrl(url)).toEqual('www.gringotts.bank')
  })

  it('returns the hostname if protocol is http', () => {
    const url = 'http://www.gringotts.bank/goblins/wizards'
    expect(formatUrl(url)).toEqual('www.gringotts.bank')
  })

  it('returns an empty string if url is empty', () => {
    const url = ''
    expect(formatUrl(url)).toEqual('')
  })

  it('returns the url if the url is invalid', () => {
    const url = 'random string'

    expect(formatUrl(url)).toEqual(url)
  })
  it('returns an empty string if url is undefined', () => {
    const url = undefined
    expect(formatUrl(url)).toEqual('')
  })
})
