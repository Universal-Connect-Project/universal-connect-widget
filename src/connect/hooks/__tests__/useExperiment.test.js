import useExperiment from '../../../connect/hooks/useExperiment'
import testHook from '../../../utils/testing/hooks/testHook'
import createSimpleStore from '../../../utils/testing/behaviors/createSimpleStore.js'
import { getActiveABExperimentDetails } from '../../../connect/hooks/useExperiment'

// This is a loose "mock" of connectABExperiments in src/connect/experiments.js
// TODO: The API/structure of experiment data should be improved
const connectABExperiments = {
  EXP_1: {
    A: '/a',
    B: '/b',
  },
  EXP_2: {
    C: '/c',
    D: '/d',
  },
}

// Testing experiments involves having a particular state, lets set up state to test with
const experimentName = 'TEST_EXPERIMENT'
const variantA = 'TEST_EXPERIMENT_A'
const variantB = 'TEST_EXPERIMENT_B'

const experimentPaths = {
  [variantA]: '/a',
  [variantB]: '/b',
}

/**
 *
 * @param {string} assignedFeatureGuid - use FTR-A or FTR-B
 * or, any listed guid from the "features" list
 * @returns
 */
const createMockedExperimentState = assignedFeatureGuid => ({
  experiments: {
    items: [
      {
        guid: 'EXP-TEST_A_B',
        name: experimentName,
        external_guid: experimentName,
        is_active: true,
        selected_variant: {
          user_feature: {
            guid: 'URF-1',
            feature_guid: assignedFeatureGuid,
            user_guid: 'USR-1',
            is_enabled: true,
            client_guid: 'CLT-1',
          },
        },
        features: [
          {
            guid: 'FTR-A',
            name: variantA,
            external_guid: variantA,
            experiment_guid: 'EXP-TEST_A_B',
          },
          {
            guid: 'FTR-B',
            name: variantB,
            external_guid: variantB,
            experiment_guid: 'EXP-TEST_A_B',
          },
        ],
      },
    ],
    loading: false,
  },
})

// This will run the actual hook, and helps assign results to be checked
let hookResults
const runHook = store => {
  testHook(() => {
    hookResults = useExperiment(experimentName, experimentPaths)
  }, store)
}

// Start the test suites
describe('useExperiment tests', () => {
  test('Feature A has been assigned', () => {
    const state = createMockedExperimentState('FTR-A')
    const store = createSimpleStore(state)

    runHook(store)

    // Check for hook values
    expect(hookResults.experimentVariant).toBe(variantA)
    expect(hookResults.variantPath).toBe('/a')
  })

  test('Feature B has been assigned', () => {
    const state = createMockedExperimentState('FTR-B')
    const store = createSimpleStore(state)

    runHook(store)

    // Check for hook values
    expect(hookResults.experimentVariant).toBe(variantB)
    expect(hookResults.variantPath).toBe('/b')
  })
})

// Unique A/B test suites
describe('getActiveABExperimentDetails tests', () => {
  test('1 Connect AB experiment is active and it is the only active Connect AB experiment', () => {
    const userExperimentAssignments = {
      EXP_1: 'A',
    }
    const experimentDetails = getActiveABExperimentDetails(
      userExperimentAssignments,
      connectABExperiments,
    )

    expect(experimentDetails.experimentVariant).toBe('A')
    expect(experimentDetails.variantPath).toBe(connectABExperiments.EXP_1.A)
  })

  test('2 Connect AB experiments are active, no details should be returned', () => {
    const userExperimentAssignments = {
      EXP_1: 'A',
      EXP_2: 'C',
    }
    const experimentDetails = getActiveABExperimentDetails(
      userExperimentAssignments,
      connectABExperiments,
    )

    expect(experimentDetails.experimentVariant).toBe('')
    expect(experimentDetails.variantPath).toBe('')
  })

  test('No Connect AB experiment is active, but another experiment is', () => {
    const userExperimentAssignments = {
      FIREFLY_EXPERIMENT: 'SUPER_SECRET_EXPERIMENT',
    }
    const experimentDetails = getActiveABExperimentDetails(
      userExperimentAssignments,
      connectABExperiments,
    )

    expect(experimentDetails.experimentVariant).toBe('')
    expect(experimentDetails.variantPath).toBe('')
  })

  test('No Connect AB experiment is active, but a few others are', () => {
    const userExperimentAssignments = {
      FIREFLY_EXPERIMENT: 'SUPER_SECRET_EXPERIMENT',
      OTHER_EXPERIMENT: 'OTHER',
    }
    const experimentDetails = getActiveABExperimentDetails(
      userExperimentAssignments,
      connectABExperiments,
    )

    expect(experimentDetails.experimentVariant).toBe('')
    expect(experimentDetails.variantPath).toBe('')
  })

  test('1 Connect AB experiment is active and a non-connect experiment is active', () => {
    const userExperimentAssignments = {
      EXP_1: 'A',
      FIREFLY_EXPERIMENT: 'SUPER_SECRET_EXPERIMENT',
    }
    const experimentDetails = getActiveABExperimentDetails(
      userExperimentAssignments,
      connectABExperiments,
    )

    expect(experimentDetails.experimentVariant).toBe('A')
    expect(experimentDetails.variantPath).toBe(connectABExperiments.EXP_1.A)
  })
})
