//import * as GoalUtils from '../utils/Goal'
import { DetailLabels, GoalTypes } from '../constants/Goal'

const GoalSchema = {
  getSchema: (goalType = GoalTypes.SAVE) => {
    if (GoalUtils.isDebtType(goalType)) {
      return {
        name: {
          label: 'Name',
          required: true,
          minLength: 1,
        },
        monthly_payment: {
          label: 'Monthly payment',
          pattern: 'number',
          min: 0,
          required: true,
        },
        interest_rate: {
          label: 'Interest rate',
          pattern: 'number',
          min: 0,
          max: 100,
        },
        initial_amount: {
          label: 'Original Balance',
          pattern: 'number',
          min: 0,
          max: Math.pow(10, 12) - 1,
        },
      }
    }

    return {
      account_guid: {
        label: DetailLabels.ACCOUNT,
        required: true,
      },
      amount: {
        label: DetailLabels.AMOUNT_TO_SAVE,
        required: true,
        min: 1,
      },
      name: {
        label: 'Name',
        required: true,
        minLength: 1,
      },
      minimum_payment: {
        label: 'Minimum payment',
        pattern: 'number',
        min: 0,
      },
      interest_rate: {
        label: 'Interest rate',
        required: false,
        pattern: 'number',
        min: 0,
        max: 100,
      },
    }
  },
}

export default GoalSchema
