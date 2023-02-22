import numeral from 'numeral'

export const ChartRanges = {
  MAX_NUMBER_MONTHS: 13,
}

export const ChartTypes = {
  LINE: 1,
  BAR: 2,
  DONUT: 3,
}

export const ChartFormatters = {
  MEMBER_NAME_REGEX: /\[(.*?)\]/g,
  CURRENCY_REGEX: /^\$([0-9,]+)?/,
  PERCENT_REGEX: /([0-9,]+?\.?[0-9,]+)%$/,
  DECIMAL_REGEX: /^([\d])([\d,]+)?\.([\d,]+)/,

  DATE: ['', 'YYYY', '[Q]Q YYYY', 'MMM YYYY', '[W]w MMM YYYY', 'MM/DD/YYYY'],

  CURRENCY(num) {
    return numeral(num).format('($0.0a)')
  },

  PERCENT(num) {
    return numeral(num).format('(0.00%)')
  },

  DECIMAL(num) {
    return numeral(num).format('(0.00)')
  },

  NONE(num) {
    return numeral(num).format('(0,0)')
  },
}

export const ChartColors = ['#359bcf', '#f7b148', '#54cf6e', '#6bcbdd', '#6e7ddf']

export const AllocationColors = {
  allocations_cash: '#AEDCCC',
  allocations_convertible: '#80CAD0',
  allocations_foreign_bond: '#51B9D4',
  allocations_foreign_stock: '#3DA0C9',
  allocations_other: '#3583B8',
  allocations_preferred: '#2D66A7',
  allocations_unknown: '#161D6A',
  allocations_us_bond: '#254995',
  allocations_us_stock: '#1E2D84',
}

export const CategoryColors = {
  'Auto & Transport': '#4B9DBC',
  'Bills & Utilities': '#EF9B2C',
  'Business Services': '#B3DE8C',
  Education: '#F8AB3A',
  Entertainment: '#AB5B89',
  'Fees & Charges': '#FF9696',
  Financial: '#6BCDDB',
  'Food & Dining': '#58AC7B',
  'Gifts & Donations': '#347AA5',
  'Health & Fitness': '#5C446E',
  Home: '#FFD84D',
  Income: '#133F49',
  Investments: '#FF7070',
  Kids: '#82D196',
  Other: '#ACB0B3',
  Pets: '#85507B',
  'Personal Care': '#338B7A',
  Shopping: '#CF5F84',
  Taxes: '#32588D',
  Travel: '#e37434',
  Uncategorized: '#FA5555',
}

export const ChartDataSetColors = {
  All: '#6e7ddf',
  Mobile: '#6bcbdd',
  'Top Performer': '#f7b148',
  Web: '#54cf6e',
  'Your Institution': '#359bcf',
}

export const ChartDataTypes = {
  INTEREST_RATE: 'INTEREST_RATE',
  NON_TIME: 'NON_TIME',
  TIME: 'TIME',
}
