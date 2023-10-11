import Bowser from 'bowser'

import StyleConstants from '../constants/Style'

const browser = Bowser.getParser(window.navigator.userAgent)
const browserName = browser.getBrowserName().toLowerCase()

export const getTrueWindowWidth = () => {
  return Math.min(window.innerWidth, window.outerWidth)
}

export const getWindowHeight = () => {
  if (isMobile()) {
    // Chrome mobile dev mode doesn't set the orientation
    const heightOrientations = [0, 180, undefined] // eslint-disable-line no-undefined

    return heightOrientations.indexOf(window.orientation) !== -1
      ? Math.min(window.innerHeight, window.outerHeight)
      : window.screen.availWidth
  }

  return Math.min(window.innerHeight, window.outerHeight)
}

export const isMobile = () => {
  if (browser.getPlatformType() === 'mobile') {
    return true
  }

  if (Math.min(window.innerWidth, window.outerWidth) <= StyleConstants.BreakPoints.medium) {
    return true
  }

  return false
}

export const isTablet = () => {
  if (browser.getPlatformType() === 'tablet') {
    return true
  }

  if (
    Math.min(window.innerWidth, window.outerWidth) <= StyleConstants.BreakPoints.large &&
    Math.min(window.innerWidth, window.outerWidth) > StyleConstants.BreakPoints.medium
  ) {
    return true
  }

  return false
}

export const isIE = () => {
  return browserName.includes('explorer')
}

export const isSafari = () => {
  return browserName.includes('safari')
}

export const isEdge = () => {
  return browserName.includes('edge')
}

export const isWindowsPhone = () => {
  return browserName.includes('windows phone')
}

export const getHostname = () => {
  return window.location.hostname
}

export const getScrollBarWidth = () => {
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

export const getWindowWidth = () => {
  const scrollBar = getScrollBarWidth()
  return getTrueWindowWidth() - scrollBar
}