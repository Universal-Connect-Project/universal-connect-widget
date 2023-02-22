import { handlePollingResponse, DEFAULT_POLLING_STATE, CONNECTING_MESSAGES } from '../pollers'
import { ErrorStatuses, ProcessingStatuses, ReadableStatuses } from '../../../connect/const/Statuses'

describe('handlePollingResponse', () => {
  test('it should stop polling and update the message', () => {
    testStatus(ReadableStatuses.CHALLENGED, true, CONNECTING_MESSAGES.MFA)
  })

  test('it should keep polling and update the message', () => {
    ProcessingStatuses.forEach(status => testStatus(status, false, CONNECTING_MESSAGES.VERIFYING))
  })

  test('should keep polling if is_being_aggregated is true', () => {
    const pollingState = {
      ...DEFAULT_POLLING_STATE,
      currentResponse: {
        is_being_aggregated: true,
        connection_status: ReadableStatuses.CONNECTED,
      },
      previousResponse: {
        is_being_aggregated: true,
        connection_status: ReadableStatuses.CONNECTED,
      },
    }

    const [stopPolling, message] = handlePollingResponse(pollingState)

    expect(stopPolling).toEqual(false)
    expect(message).toEqual(CONNECTING_MESSAGES.SYNCING)
  })

  test('should stop polling if is_being_aggregated turns to false', () => {
    const pollingState = {
      ...DEFAULT_POLLING_STATE,
      currentResponse: {
        is_being_aggregated: false,
        connection_status: ReadableStatuses.CONNECTED,
      },
      previousResponse: {
        is_being_aggregated: true,
        connection_status: ReadableStatuses.CONNECTED,
      },
    }

    const [stopPolling, message] = handlePollingResponse(pollingState)

    expect(stopPolling).toEqual(true)
    expect(message).toEqual(CONNECTING_MESSAGES.FINISHING)
  })

  describe('Error states', () => {
    it('should stop polling and show a message', () => {
      ErrorStatuses.forEach(status => {
        // CHALLENGED state is an error state, but has specific logic
        if (status !== ReadableStatuses.CHALLENGED) {
          testStatus(status, true, CONNECTING_MESSAGES.ERROR)
        }
      })
    })

    it('should wait for aggregation to be done for error states', () => {
      ErrorStatuses.forEach(status => {
        const pollingState = {
          ...DEFAULT_POLLING_STATE,
          currentResponse: {
            is_being_aggregated: true,
            connection_status: status,
          },
        }

        // CHALLENGED state is an error state, but has specific logic
        if (status !== ReadableStatuses.CHALLENGED) {
          const [stopPolling, message] = handlePollingResponse(pollingState)

          expect(stopPolling).toEqual(false)
          expect(message).toEqual(CONNECTING_MESSAGES.VERIFYING)
        }
      })
    })

    it('should stop polling if in error and is_being_aggregated is false twice in a row', () => {
      const pollingState = {
        ...DEFAULT_POLLING_STATE,
        previousResponse: {
          connection_status: ReadableStatuses.PREVENTED,
          is_oauth: true,
          is_being_aggregated: false,
        },
        currentResponse: {
          connection_status: ReadableStatuses.PREVENTED,
          is_oauth: true,
          is_being_aggregated: false,
        },
      }

      const [stopPolling, message] = handlePollingResponse(pollingState)

      expect(stopPolling).toEqual(true)
      expect(message).toEqual(CONNECTING_MESSAGES.ERROR)
    })
  })

  describe('OAuth status', () => {
    it('should keep polling and show the OAuth message if in error, but not finished agging', () => {
      ErrorStatuses.forEach(status => {
        const pollingState = {
          ...DEFAULT_POLLING_STATE,
          currentResponse: {
            connection_status: status,
            is_oauth: true,
            is_being_aggregated: false,
          },
        }

        if (status !== ReadableStatuses.CHALLENGED) {
          const [stopPolling, message] = handlePollingResponse(pollingState)

          expect(message).toEqual(CONNECTING_MESSAGES.OAUTH)
          expect(stopPolling).toEqual(false)
        }
      })
    })

    it('should go to error view if we are done aggregating', () => {
      ErrorStatuses.forEach(status => {
        const pollingState = {
          ...DEFAULT_POLLING_STATE,
          currentResponse: {
            connection_status: status,
            is_oauth: true,
            is_being_aggregated: false,
          },
          previousResponse: {
            connection_status: status,
            is_oauth: true,
            is_being_aggregated: true,
          },
        }

        if (status !== ReadableStatuses.CHALLENGED) {
          const [stopPolling, message] = handlePollingResponse(pollingState)

          expect(message).toEqual(CONNECTING_MESSAGES.ERROR)
          expect(stopPolling).toEqual(true)
        }
      })
    })
  })
})

function testStatus(status, shouldStopPolling, expectedMessage) {
  const pollingState = {
    ...DEFAULT_POLLING_STATE,
    currentResponse: { connection_status: status },
  }

  const [stopPolling, message] = handlePollingResponse(pollingState)

  expect(message).toEqual(expectedMessage)
  expect(stopPolling).toEqual(shouldStopPolling)
}
