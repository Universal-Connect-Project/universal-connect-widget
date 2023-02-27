import { FireflyDataSource } from '../../../connect/services/FireflyDataSource'
import { ConnectAPIService } from '../../../connect/services/ConnectAPIService'

// FireflyDataSource expects an axios instance, so lets mock it and test the function signatures
jest.mock('../../../actions/connect/services/FireflyDataSource')

let api = null
beforeEach(() => {
  api = new ConnectAPIService(new FireflyDataSource(null))
  FireflyDataSource.mockClear()
})

describe('ConnectAPIService tests', () => {
  it('Can addMember', () => {
    const memberData = {}
    const connectConfig = {}
    const appConfig = {}
    const isHuman = false

    api.addMember(memberData, connectConfig, appConfig, isHuman)

    expect(api.dataSource.addMember).toHaveBeenCalledWith(
      memberData,
      connectConfig,
      appConfig,
      false,
    )
  })
})
