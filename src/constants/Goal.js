import { PropTypes } from 'prop-types'
import { convertToMessages } from '../utils/Localization'
import _values from 'lodash/values'

export const MAX_PROJECTED_YEARS = 50

export const GoalTypes = {
  SAVE: 1,
  PAY_OFF: 2,
  KEEP_BALANCE_ABOVE: 3,
  EVENT: 4,
}

export const TrackTypes = {
  DEBT_TRACK: 1,
  SAVINGS_TRACK: 2,
  RETIREMENT_TRACK: 3,
}

export const CreatedBy = {
  SYSTEM: 1,
  USER: 2,
}

export const MetaTypes = {
  AUTOMOBILE: 1,
  COLLEGE: 2,
  HOUSE: 3,
  RECREATIONAL_VEHICLE: 4,
  VACATION: 5,
  ELECTRONIC: 6,
  OTHER: 7,
  RETIREMENT: 8,
  EMERGENCY_FUND: 9,
  SETUP_BUDGETS: 10,
  START_MONEY_MANAGEMENT: 11,
  CREDIT_CARD: 12,
  LINE_OF_CREDIT: 13,
  LOANS: 14,
}

export const TrackTypeIcons = {
  [TrackTypes.DEBT_TRACK]: 'debts',
  [TrackTypes.SAVINGS_TRACK]: 'savings',
  [TrackTypes.RETIREMENT_TRACK]: 'retirement',
}

export const TrackTypeText = {
  [TrackTypes.DEBT_TRACK]: 'Debt Payoff',
  [TrackTypes.SAVINGS_TRACK]: 'Savings',
  [TrackTypes.RETIREMENT_TRACK]: 'Retirement',
}

export const MetaTypeNames = {
  [MetaTypes.AUTOMOBILE]: 'Automobile',
  [MetaTypes.COLLEGE]: 'College',
  [MetaTypes.HOUSE]: 'Home',
  [MetaTypes.RECREATIONAL_VEHICLE]: 'Recreational',
  [MetaTypes.VACATION]: 'Vacation',
  [MetaTypes.ELECTRONIC]: 'Electronic',
  [MetaTypes.OTHER]: 'Other',
  [MetaTypes.RETIREMENT]: 'Retirement',
  [MetaTypes.EMERGENCY_FUND]: 'Emergency Fund',
  [MetaTypes.SETUP_BUDGETS]: 'Budgets Created',
  [MetaTypes.START_MONEY_MANAGEMENT]: 'Account Created',
  [MetaTypes.CREDIT_CARD]: 'Credit Card',
  [MetaTypes.LINE_OF_CREDIT]: 'Line Of Credit',
  [MetaTypes.LOANS]: 'Loans',
}

export const MetaTypeIcons = {
  [MetaTypes.AUTOMOBILE]: 'auto',
  [MetaTypes.COLLEGE]: 'education',
  [MetaTypes.HOUSE]: 'home',
  [MetaTypes.RECREATIONAL_VEHICLE]: 'bike',
  [MetaTypes.VACATION]: 'map',
  [MetaTypes.ELECTRONIC]: 'desktop',
  [MetaTypes.OTHER]: 'money-banknote',
  [MetaTypes.RETIREMENT]: 'retirement',
  [MetaTypes.EMERGENCY_FUND]: 'health',
  [MetaTypes.CREDIT_CARD]: 'credit-card',
  [MetaTypes.LINE_OF_CREDIT]: 'line-of-credit',
  [MetaTypes.LOANS]: 'loans',
}

// For use with PropTypes
export const GoalShape = PropTypes.shape({
  account_guid: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  budget_guid: PropTypes.string,
  completed_at: PropTypes.number,
  created_at: PropTypes.number,
  current_amount: PropTypes.number,
  goal_type: PropTypes.oneOf(_values(GoalTypes)),
  guid: PropTypes.string,
  has_been_spent: PropTypes.bool,
  initial_amount: PropTypes.number,
  is_complete: PropTypes.bool,
  is_spendable: PropTypes.bool,
  meta_type: PropTypes.oneOf(_values(MetaTypes)),
  name: PropTypes.string,
  position: PropTypes.number,
  projected_to_complete_at: PropTypes.number,
  revision: PropTypes.number,
  updated_at: PropTypes.number,
  user_guid: PropTypes.string,
})

export const RetirementGoalShape = PropTypes.shape({
  completed_at: PropTypes.number,
  created_at: PropTypes.number,
  current_amount: PropTypes.number,
  guid: PropTypes.string,
  is_completed: PropTypes.bool,
  projected_amount: PropTypes.number,
  projected_growth_rate: PropTypes.number,
  retirement_age: PropTypes.number,
  revision: PropTypes.number,
  target_amount: PropTypes.number,
  updated_at: PropTypes.number,
  user_guid: PropTypes.string,
})

export const GoalColors = {
  [TrackTypes.DEBT_TRACK]: '#85BADC',
  [TrackTypes.SAVINGS_TRACK]: '#8DDDA3',
  [TrackTypes.RETIREMENT_TRACK]: '#B9A9D0',
}

export const AllocationAmounts = {
  [TrackTypes.DEBT_TRACK]: 'amount_allocated_for_debt_goals',
  [TrackTypes.SAVINGS_TRACK]: 'amount_allocated_for_savings_goals',
  [TrackTypes.RETIREMENT_TRACK]: 'amount_allocated_for_retirement_goals',
}

export const DetailLabels = {
  ACCOUNT: 'Account',
  AMOUNT_TO_SAVE: 'Amount to Save',
  DESIRED_SAVINGS: 'Desired Savings',
  NAME: 'Name',
  ORIGINAL_BALANCE: 'Original Balance',
  MONTHLY_PAYMENT: 'Monthly payment',
  INTEREST_RATE: 'Interest rate',
  PAYMENT_DUE: 'Payment due',
}

export const GoalsMessages = convertToMessages({
  ZERO_STATE_GOALS_MESSAGE: 'Set financial goals and plan for the future.',
  ZERO_STATE_GOALS_TITLE: 'Take control of your money.',
  ZERO_STATE_GOALS_BUTTON: 'Get Started',
})
