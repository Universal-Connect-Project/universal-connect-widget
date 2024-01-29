/**
 * A simple function to use with our SlideDown components delay prop
 * to allow for the incrementing value to automatically be increased
 * regardless of the number of SlideDown components that actually get rendered
 *
 * @param {int} startingValue Value to start our delays at (Probably start at 0)
 * @param {int} incrementer   Amount to increase between each delay (We've generally used 100)
 */
export const getDelay = (startingValue = 0, increment = 100) => {
  // eslint-disable-next-line no-param-reassign
  const getNextDelay = () => (startingValue += increment)

  return getNextDelay
}
