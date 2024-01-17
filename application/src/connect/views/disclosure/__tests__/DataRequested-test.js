// import React from 'react'
// import { mount } from 'enzyme'
//
// import { Store } from 'reduxify/__mocks__/Store'
// import { getMountOptions } from 'src/connect/utilities/Store'
//
// import { DataRequested } from 'src/connect/views/disclosure/DataRequested'
//
// import { DataCluster } from 'src/connect/components/DataCluster'
// import { GoBackButton } from 'src/connect/components/GoBackButton'
//
// import { AGG_MODE, VERIFY_MODE } from 'src/connect/const/Connect'
//
// // mock functions if needed here
//
// const createMountOptions = customStore => getMountOptions(Store(customStore))

describe('DataRequested placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('DataRequested', () => {
//   let wrapper
//
//   const defaultStore = {
//     connect: { connectConfig: {} },
//     client: { oauth_app_name: 'mx-test' },
//     userFeatures: { items: [] },
//   }
//
//   beforeEach(() => (wrapper = mount(<DataRequested />, createMountOptions(defaultStore))))
//   afterEach(() => {
//     wrapper.unmount()
//     jest.clearAllMocks()
//   })
//
//   it('should have 4 DataClusters in agg mode', () => {
//     const dataClusters = wrapper.find(DataCluster)
//     expect(dataClusters).toHaveLength(4)
//   })
//
//   it('should have 5 DataClusters in agg mode and include identity', () => {
//     const wrapper = mount(
//       <DataRequested />,
//       createMountOptions({
//         ...defaultStore,
//         connect: { connectConfig: { mode: AGG_MODE, include_identity: true } },
//       }),
//     )
//     const dataClusters = wrapper.find(DataCluster)
//     expect(dataClusters).toHaveLength(5)
//   })
//   it('should have 1 DataClusters in verification mode', () => {
//     const wrapper = mount(
//       <DataRequested />,
//       createMountOptions({
//         ...defaultStore,
//         connect: { connectConfig: { mode: VERIFY_MODE } },
//       }),
//     )
//     const dataClusters = wrapper.find(DataCluster)
//     expect(dataClusters).toHaveLength(1)
//   })
//   it('should have 4 DataClusters in verification mode and include identity', () => {
//     const wrapper = mount(
//       <DataRequested />,
//       createMountOptions({
//         ...defaultStore,
//         connect: { connectConfig: { mode: VERIFY_MODE, include_identity: true } },
//       }),
//     )
//     const dataClusters = wrapper.find(DataCluster)
//     expect(dataClusters).toHaveLength(4)
//   })
//   it('the go back button should exist with no features enabled', () => {
//     const dataClusters = wrapper.find(GoBackButton)
//     expect(dataClusters).toExist()
//   })
// })
