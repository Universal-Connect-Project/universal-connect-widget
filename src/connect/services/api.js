/*
  This file helps with our API Dependecy Injection

  This is the "dirty" file that ties concrete implementations together
  and returns the api to be used in Connect/Connections.

  ConnectAPIService is used to get remote data, and this file creates
  the correct/current dataSource(s).
*/

import { FireflyDataSource } from '../../connect/services/FireflyDataSource'
import { ConnectAPIService } from '../../connect/services/ConnectAPIService'

let axiosInstance

if (process.env.NODE_ENV === 'test') {
  // Tests don't need axios to run
  axiosInstance = null
} else {
  // Import the actual module if we're running in a non-test environment
  const mxAxios = require('../../actions/connect/services/mxAxios')
  axiosInstance = mxAxios.default
}

const api = new ConnectAPIService(new FireflyDataSource(axiosInstance))
export default api
