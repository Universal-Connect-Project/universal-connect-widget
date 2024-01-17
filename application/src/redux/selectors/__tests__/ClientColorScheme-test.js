// jest.mock('reduxify/Store')
// import { getTokenProviderValues } from 'reduxify/selectors/ClientColorScheme'
// import Store from 'reduxify/Store'

describe('ClientcolorScheme Redux Selectors placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('ClientcolorScheme Selectors', () => {
//   let state = {}
//   let updatedState = {}
//
//   describe('getTokenProviderValues', () => {
//     beforeEach(() => {
//       updatedState = {
//         theme: {
//           Colors: {
//             PRIMARY: '#999999',
//           },
//         },
//       }
//       state = Store.__withUpdatedState(updatedState).getState()
//     })
//
//     it('should return the theme primary color if there is no client color scheme', () => {
//       const res = getTokenProviderValues(state)
//
//       expect(res.tokenOverrides.Color.Brand300).toEqual(updatedState.theme.Colors.PRIMARY)
//     })
//
//     it('should have five different colors based on PRIMARY', () => {
//       const res = getTokenProviderValues(state)
//       const colors = [
//         res.tokenOverrides.Color.Brand100,
//         res.tokenOverrides.Color.Brand200,
//         res.tokenOverrides.Color.Brand300,
//         res.tokenOverrides.Color.Brand400,
//         res.tokenOverrides.Color.Brand500,
//       ]
//       const distinctColors = [...new Set(colors)]
//
//       expect(distinctColors).toHaveLength(5)
//     })
//
//     it('should use the client color scheme if it exist', () => {
//       state = Store.__withUpdatedState({
//         clientColorScheme: {
//           primary_100: '100',
//           primary_200: '200',
//           primary_300: '300',
//           primary_400: '400',
//           primary_500: '500',
//         },
//       }).getState()
//
//       const res = getTokenProviderValues(state)
//
//       expect(res.tokenOverrides.Color.Brand100).toEqual(state.clientColorScheme.primary_100)
//       expect(res.tokenOverrides.Color.Brand200).toEqual(state.clientColorScheme.primary_200)
//       expect(res.tokenOverrides.Color.Brand300).toEqual(state.clientColorScheme.primary_300)
//       expect(res.tokenOverrides.Color.Brand400).toEqual(state.clientColorScheme.primary_400)
//       expect(res.tokenOverrides.Color.Brand500).toEqual(state.clientColorScheme.primary_500)
//     })
//   })
// })
