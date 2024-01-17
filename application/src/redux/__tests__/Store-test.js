// import Store from 'reduxify/Store'

describe('Store placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Store', () => {
//   it('should have a .subscribe', () => {
//     expect(Store.subscribe).toBeDefined()
//   })
//
//   it('should have a .dispatch', () => {
//     expect(Store.dispatch).toBeDefined()
//   })
//
//   describe('.getState', () => {
//     const expectedKeys = [
//       'agreement',
//       'analytics',
//       'app',
//       'browser',
//       'client',
//       'clientColorScheme',
//       'clientProfile',
//       'componentStacks',
//       'connect',
//       'connections',
//       'experiments',
//       'initializedClientConfig',
//       'user',
//       'userFeatures',
//       'userProfile',
//       'widgetProfile',
//     ]
//
//     it('should exist', () => {
//       expect(Store.getState).toBeDefined()
//     })
//
//     it('should have all expected reducer results combined', () => {
//       const result = expectedKeys.map(key => key in Store.getState()).filter(present => !present)
//
//       expect(result).toEqual([])
//     })
//
//     it('should have no unexpected reducer results', () => {
//       const result = Object.keys(Store.getState())
//         .map(key => expectedKeys.indexOf(key) > -1)
//         .filter(present => !present)
//
//       expect(result).toEqual([])
//     })
//   })
// })
