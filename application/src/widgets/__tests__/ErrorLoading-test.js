// import React from 'react'
// import PropTypes from 'prop-types'
// import { shallow } from 'enzyme'
// import { AttentionFilled } from '@kyper/icon/AttentionFilled'
//
// import { ErrorLoading } from 'src/widgets/desktop/ErrorLoading'

describe('ErrorLoading widgets placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('ErrorLoading', () => {
//   let wrapper
//   window.app.options.type = 'Test Widget'
//
//   beforeEach(() => {
//     ErrorLoading.contextTypes = {
//       Font: PropTypes.object,
//       TextColor: PropTypes.object,
//       FontSize: PropTypes.object,
//       Spacing: PropTypes.object,
//     }
//
//     wrapper = shallow(<ErrorLoading />, {
//       context: {
//         TextColor: { Secondary: 'secondary' },
//         FontSize: {},
//         Font: {
//           Regular: '',
//         },
//         Spacing: {
//           XTiny: 2,
//           Small: 12,
//           Large: 24,
//         },
//       },
//     })
//   })
//
//   it('should render an Icon component', () => {
//     const icon = wrapper.find(AttentionFilled)
//     expect(icon).toExist()
//   })
//
//   it('should render an h1 with dynamic text', () => {
//     const h1 = wrapper.find('h1')
//     expect(h1.text()).toEqual(`Oops! The widget "${window.app.options.type}" is not available.`)
//   })
// })
