export const schema = {
  account_type: {
    label: 'Account Type',
    required: false,
  },
  apy: {
    label: 'Interest Rate',
    required: false,
    pattern: 'number',
  },
  apr: {
    label: 'Interest Rate',
    required: false,
    pattern: 'number',
  },
  interest_rate: {
    label: 'Interest Rate',
    required: false,
    pattern: 'number',
  },
  balance: {
    label: 'Balance',
    required: false,
    pattern: 'number',
  },
  credit_limit: {
    label: 'Credit Limit',
    required: false,
    pattern: 'number',
  },
  minimum_payment: {
    label: 'Minimum Payment',
    required: false,
    pattern: 'number',
  },
  original_balance: {
    label: 'Original Balance',
    required: false,
    pattern: 'number',
  },
  user_name: {
    label: 'Account Name',
    required: true,
  },
}
