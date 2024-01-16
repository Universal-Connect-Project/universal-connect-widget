import Bowser from 'bowser'
import { light as tokens } from '@mxenabled/design-tokens'

import { Style } from 'src/connect/const/Style'

const browser = Bowser.getParser(window.navigator.userAgent)
const browserName = browser.getBrowserName().toLowerCase()

export const isSafari = () => {
  return browserName.includes('safari')
}
export const isIE = () => {
  return browserName.includes('explorer')
}

export const getHostname = () => {
  return window.location.hostname
}

// Window Size
export const isMobile = () => {
  if (browser.getPlatformType() === 'mobile') {
    return true
  }

  if (window.innerWidth <= Style.MediaQuery.Med) {
    return true
  }

  return false
}
export const isTablet = () => {
  if (browser.getPlatformType() === 'tablet') {
    return true
  }

  if (window.innerWidth <= Style.MediaQuery.Large && window.innerWidth > Style.MediaQuery.Med) {
    return true
  }

  return false
}
export const getWindowHeight = () => {
  if (isMobile()) {
    // Chrome mobile dev mode doesn't set the orientation
    const heightOrientations = [0, 180, undefined] // eslint-disable-line no-undefined

    return heightOrientations.indexOf(window.orientation) !== -1
      ? window.innerHeight
      : window.screen.availWidth
  }

  return window.innerHeight
}
export const getWindowWidth = () => {
  const scrollBar = getScrollBarWidth()

  return window.innerWidth - scrollBar
}
export const getTrueWindowWidth = () => {
  return window.innerWidth
}

/**
 * Returns the window size as a string
 * @returns windowSize as string ('small', 'medium', 'large')
 */
export const getWindowSize = () => {
  const breakpoints = tokens.MediaQuery
  const width = window.innerWidth
  let windowSize = 'small'

  if (width >= breakpointNumberOnly(breakpoints.Large)) {
    windowSize = 'large'
  } else if (width >= breakpointNumberOnly(breakpoints.Med)) {
    windowSize = 'medium'
  }

  return windowSize
}

// Helper Functions
const getScrollBarWidth = () => {
  const inner = document.createElement('p')

  inner.style.width = '100%'
  inner.style.height = '200px'

  const outer = document.createElement('div')

  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)

  const w1 = inner.offsetWidth

  outer.style.overflow = 'scroll'

  let w2 = inner.offsetWidth

  if (w1 === w2) {
    w2 = outer.clientWidth
  }

  document.body.removeChild(outer)

  return w1 - w2
}

// Removes the px from the breakpoint (Ex. 576px -> 576)
export const breakpointNumberOnly = breakpoint =>
  breakpoint
    .split('')
    .splice(0, 3)
    .join('')
