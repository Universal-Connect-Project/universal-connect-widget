import Velocity from 'velocity-animate'

// required for RunSequence functionality in velocity
import 'velocity-animate/velocity.ui'

import StyleConstants from '../constants/Style'

// The key names for animations are dictated by Velocity.
// p = Properties for animation
// o = Options for animation
// e = HTML element to animate
export const getAnimationForSequence = sequence => {
  return () => {
    Velocity.RunSequence(sequence)
  }
}

export const scrollToRow = (container, element, selectedRow) => {
  const selectedOffsetTop = selectedRow.offsetTop
  const selectedOffsetBottom =
    selectedRow.offsetTop - container.offsetHeight + selectedRow.offsetHeight

  if (selectedOffsetTop < container.scrollTop || selectedOffsetBottom > container.scrollTop) {
    const offset =
      selectedOffsetTop < container.scrollTop ? selectedOffsetTop : selectedOffsetBottom

    Velocity(element, 'stop')
    Velocity(element, 'scroll', { container, offset })
  }
}

export const types = {
  elementBackgroundColor: {
    p: {
      backgroundColor: StyleConstants.Colors.PRIMARY,
      color: StyleConstants.Colors.WHITE,
    },
    o: {
      duration: 300,
      easing: 'ease-in',
    },
  },
  elementIn: {
    p: {
      opacity: 1,
    },
    o: {
      duration: 300,
      easing: 'ease-in',
      visibility: 'visible',
    },
  },
  elementOut: {
    p: {
      opacity: 0,
      scale: 0,
    },
    o: {
      delay: 1000,
      duration: 200,
      easing: 'ease-in',
    },
  },
}

export const fadeOut = (el, direction = 'up', duration = 500) => {
  return Velocity(
    el,
    {
      translateY: direction === 'up' ? '-25px' : '25px',
      opacity: 0,
    },
    {
      duration,
      easing: 'ease-in',
    },
  )
}

export const fadeIn = (el, direction = 'up') => {
  return Velocity(
    el,
    {
      translateY: direction === 'up' ? '-5px' : '5px',
      opacity: 1,
    },
    {
      duration: 500,
    },
  )
}

export const animateElement = (el, options, duration, progressCallback = () => {}) => {
  return Velocity(el, options, {
    duration,
    progress: (elements, complete) => {
      progressCallback(elements, complete)
    },
  })
}
