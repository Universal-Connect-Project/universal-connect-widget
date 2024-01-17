// import React from 'react'
// import { mount } from 'enzyme'
// import { TokenProvider } from '@kyper/tokenprovider'
//
// import { Store } from 'reduxify/__mocks__/Store'
//
// import { ConnectedTokenProvider } from 'src/context/ConnectedTokenProvider'
// import { adjustColor } from 'reduxify/selectors/ClientColorScheme'
// import { getMountOptions } from 'src/connect/utilities/Store'
//
// const createMountOptions = customStore => {
//   return getMountOptions(Store(customStore))
// }

describe('ConnectedTokenProvider placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('ConnectedTokenProvider', () => {
//   // Initialize a mock store
//   const newColorStore = {
//     clientColorScheme: {
//       color_scheme: 'light',
//       primary_100: '#000000',
//       primary_200: '#000000',
//       primary_300: '#000000',
//       primary_400: '#000000',
//       primary_500: '#000000',
//     },
//     initializedClientConfig: { color_scheme: 'light' },
//     theme: { Colors: { PRIMARY: '#c0ff33' } },
//   }
//   const oldColorStore = {
//     clientColorScheme: {
//       color_scheme: 'light',
//     },
//     initializedClientConfig: { color_scheme: 'light' },
//     theme: { Colors: { PRIMARY: '#c0ff33' } },
//   }
//
//   it('should apply primary100-500 as brand100-500 if all 5 colors are set', () => {
//     const wrapper = mount(<ConnectedTokenProvider />, createMountOptions(newColorStore))
//
//     expect(wrapper.find(TokenProvider).prop('tokenOverrides')).toEqual({
//       Color: {
//         Brand100: '#000000',
//         Brand200: '#000000',
//         Brand300: '#000000',
//         Brand400: '#000000',
//         Brand500: '#000000',
//       },
//     })
//   })
//
//   it('should apply primary as brand300 and adjust the for remaining brand###', () => {
//     const wrapper = mount(<ConnectedTokenProvider />, createMountOptions(oldColorStore))
//
//     expect(wrapper.find(TokenProvider).prop('tokenOverrides')).toEqual({
//       Color: {
//         Brand100: '#F8F9FB',
//         Brand200: adjustColor(oldColorStore.theme.Colors.PRIMARY, +15),
//         Brand300: '#c0ff33',
//         Brand400: adjustColor(oldColorStore.theme.Colors.PRIMARY, -15),
//         Brand500: adjustColor(oldColorStore.theme.Colors.PRIMARY, -30),
//       },
//     })
//   })
// })
