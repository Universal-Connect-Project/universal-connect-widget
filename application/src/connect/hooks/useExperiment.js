import { useSelector } from 'react-redux'
import { getExperimentNamesToUserVariantMap } from '../../redux/selectors/Experiments'

/**
 *
 * @description Use this to determine what variant the user has been assigned
 * for the experiment.  Optionally, if you're using A/B tests with pageviews,
 * it can return what path to add on to the pageview.
 *
 * Example usage giving the name, and desired path map for each variant:
 *
 * import {
 *  CONNECT_EXPERIMENT,
 *  CONNECT_EXPERIMENT_VARIANT_A,
 *  CONNECT_EXPERIMENT_VARIANT_B,
 * } from '../../actions/connect/experiments'
 *
 * const { experimentVariant, variantPath } = useExperiment(CONNECT_EXPERIMENT, {
 *   [CONNECT_EXPERIMENT_VARIANT_A]: '/a-path',
 *   [CONNECT_EXPERIMENT_VARIANT_B]: '/b-path',
 * })
 *
 * @param {string} name of the experiment from Batcave
 * @param {Object} variantPathMap - object of user feature names (variants) to the desired path
 * @returns {Object} { experimentVariant: string, variantPath: string }
 */
export default function useExperiment(name, variantPathMap = {}) {
  const userExperimentAssignments = useSelector(getExperimentNamesToUserVariantMap)

  return getExperimentDetails(userExperimentAssignments, name, variantPathMap)
}

/**
 *
 * @description This is a util version of the useExperiment hook above for class components.
 * @returns {Object} { experimentVariant: string, variantPath: string }
 */
export const getExperimentDetails = (userExperimentAssignments, name, variantPathMap = {}) => {
  const experimentVariant = userExperimentAssignments[name]

  return {
    experimentVariant,
    variantPath: variantPathMap[experimentVariant] ?? '',
  }
}

/**
 *
 * @description Given all active experiments for this user, and all possible connect-specific A/B experiments,
 * this will return an single active Connect experiment's details, in 1 of two forms...
 * 1. The Connect specific A/B experiment's values.
 * 2. The same structure but with blank strings.
 *
 * @param {Object} userExperimentAssignments - An object containing all active experiments for the current user
 * @param {Object} connectABExperiments - An Object containing the Connect A/B experiments and variants
 * @returns {Object} { experimentVariant: string, variantPath: string }
 */
export const getActiveABExperimentDetails = (userExperimentAssignments, connectABExperiments) => {
  // Gather a list of Connect AB experiments that are active right now for the user
  const connectActiveExperimentNames = Object.keys(userExperimentAssignments).filter(key =>
    connectABExperiments.hasOwnProperty(key),
  )

  // For now, we only return details if a single Connect A/B experiment is active
  if (connectActiveExperimentNames.length === 1) {
    const activeABExperimentName = connectActiveExperimentNames[0]
    return getExperimentDetails(
      userExperimentAssignments,
      activeABExperimentName,
      connectABExperiments[activeABExperimentName],
    )
  }

  return {
    experimentVariant: '',
    variantPath: '',
  }
}
