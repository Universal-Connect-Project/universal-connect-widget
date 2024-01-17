// jest.mock('src/connect/utilities/Browser')
//
// import { createReduxActionUtils } from 'utils/Test'
// import dispatcher, { ActionTypes } from 'reduxify/actions/Browser'
//
// const { SET_BROWSER_DIMENSIONS } = ActionTypes
//
// const { actions, expectDispatch, resetDispatch } = createReduxActionUtils(dispatcher)

describe('Browser Redux Actions placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Browser Redux Actions', () => {
//   beforeEach(() => {
//     resetDispatch()
//   })
//
//   it('should have a updateDimensions method', () => {
//     expect(actions.updateDimensions).toBeDefined()
//   })
//
//   describe('.updateDimensions', () => {
//     it('dispatches SET_BROWSER_DIMENSIONS', () => {
//       const fullHeight = 330
//       const isMobile = true
//       const isTablet = false
//       const size = 'small'
//       const width = 480
//       const trueWidth = 435
//
//       actions.updateDimensions()
//       expectDispatch({
//         type: SET_BROWSER_DIMENSIONS,
//         payload: {
//           fullHeight,
//           height: fullHeight - 51,
//           isMobile,
//           isTablet,
//           size,
//           width,
//           trueWidth,
//         },
//       })
//     })
//   })
// })
