import Velocity from 'velocity-animate'

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
