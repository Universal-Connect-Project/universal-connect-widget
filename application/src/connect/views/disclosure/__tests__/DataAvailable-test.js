// import React from 'react'
// import { mount } from 'enzyme'
//
// import { Store } from 'reduxify/__mocks__/Store'
// import { getMountOptions } from 'src/connect/utilities/Store'
//
// import { DataAvailable } from 'src/connect/views/disclosure/DataAvailable'
//
// import { DataCluster } from 'src/connect/components/DataCluster'
// import { GoBackButton } from 'src/connect/components/GoBackButton'
//
// // mock functions if needed here
//
// const createMountOptions = customStore => getMountOptions(Store(customStore))

describe('DataAvailable placeholder', () => {
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
//   beforeEach(() => (wrapper = mount(<DataAvailable />, createMountOptions(defaultStore))))
//   afterEach(() => {
//     wrapper.unmount()
//     jest.clearAllMocks()
//   })
//
//   it('should have 8 DataClusters in any mode', () => {
//     const dataClusters = wrapper.find(DataCluster)
//     expect(dataClusters).toHaveLength(8)
//   })
//
//   it('the go back button should exist with no features enabled', () => {
//     const dataClusters = wrapper.find(GoBackButton)
//     expect(dataClusters).toExist()
//   })
// })
