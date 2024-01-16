import { light as tokens } from '@mxenabled/design-tokens'
import { getWindowSize } from 'src/connect/utilities/Browser'

describe('Browser', () => {
  it('returns "small" when window width is less than Med breakpoint', () => {
    window.innerWidth = tokens.MediaQuery.Small

    const windowSize = getWindowSize()

    expect(windowSize).toEqual('small')
  })

  it('returns "medium" when window width is greater than or equal to Med breakpoint', () => {
    window.innerWidth = tokens.MediaQuery.Med

    const windowSize = getWindowSize()

    expect(windowSize).toEqual('medium')
  })

  it('returns "large" when window width is greater than or equal to Large breakpoint', () => {
    window.innerWidth = tokens.MediaQuery.Large

    const windowSize = getWindowSize()

    expect(windowSize).toEqual('large')
  })
})
