import PropTypes from 'prop-types'
import { __ } from '../utils/Intl'

export const CategoryShape = PropTypes.shape({
  guid: PropTypes.string.isRequired,
})

export const ParentCategoryShape = PropTypes.shape({
  guid: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(CategoryShape).isRequired,
})

export const Guid = {
  AUTO_TRANSPORT: 'CAT-7829f71c-2e8c-afa5-2f55-fa3634b89874',
  BILLS_UTILITIES: 'CAT-79b02f2f-2adc-88f0-ac2b-4e71ead9cfc8',
  BUSINESS: 'CAT-94b11142-e97b-941a-f67f-6e18d246a23f',
  EDUCATION: 'CAT-bf5c9cca-c96b-b50d-440d-38d9adfda5b0',
  ENTERTAINMENT: 'CAT-e04e9d1e-e041-c315-2e50-094143ab3f73',
  FEES_CHARGES: 'CAT-d73ee74b-13a4-ac3e-4015-fc4ba9a62b2a',
  FINANCIAL: 'CAT-6c7de3f8-de6c-7061-1dd2-b093044014bf',
  FOOD_DINING: 'CAT-bd56d35a-a9a7-6e10-66c1-5b9cc1b6c81a',
  GIFTS_DONATIONS: 'CAT-8edf9663-623e-4735-490e-31288f0a70b0',
  HEALTH_FITNESS: 'CAT-52fa4693-c088-afb2-2a99-7bc39bb23a0f',
  HOME: 'CAT-b709172b-4eb7-318e-3b5d-e0f0500b32ac',
  INCOME: 'CAT-bf9f3294-4c40-1677-d269-54fbc189faf3',
  INVESTMENTS: 'CAT-ccd42390-9e8c-3fb6-a5d9-6c31182d9c5c',
  KIDS: 'CAT-0cb1d99d-f558-99e3-2282-b31f359b411a',
  PERSONAL_CARE: 'CAT-e5154228-fe45-790d-a280-f6bf5ae5ac9f',
  PETS: 'CAT-7cccbafa-87d7-c9a6-661b-8b3402fe9e78',
  SHOPPING: 'CAT-aad51b46-d6f7-3da5-fd6e-492328b3023f',
  TAXES: 'CAT-d00fc539-aa14-009b-4ffb-7e8c7b839954',
  TRANSFER: 'CAT-bce48142-fea4-ff45-20d9-0a642d44de83',
  TRAVEL: 'CAT-ea23d844-cbd1-eb10-f6ac-0df9610e59ae',
  UNCATEGORIZED: 'CAT-d7851c65-3353-e490-1953-fb9235e681e4',
}

export const Name = {
  'CAT-7829f71c-2e8c-afa5-2f55-fa3634b89874': 'AUTO_TRANSPORT',
  'CAT-79b02f2f-2adc-88f0-ac2b-4e71ead9cfc8': 'BILLS_UTILITIES',
  'CAT-94b11142-e97b-941a-f67f-6e18d246a23f': 'BUSINESS',
  'CAT-bf5c9cca-c96b-b50d-440d-38d9adfda5b0': 'EDUCATION',
  'CAT-e04e9d1e-e041-c315-2e50-094143ab3f73': 'ENTERTAINMENT',
  'CAT-d73ee74b-13a4-ac3e-4015-fc4ba9a62b2a': 'FEES',
  'CAT-6c7de3f8-de6c-7061-1dd2-b093044014bf': 'FINANCIAL',
  'CAT-bd56d35a-a9a7-6e10-66c1-5b9cc1b6c81a': 'FOOD_DINING',
  'CAT-8edf9663-623e-4735-490e-31288f0a70b0': 'GIFTS_CHARITY',
  'CAT-52fa4693-c088-afb2-2a99-7bc39bb23a0f': 'HEALTH_FITNESS',
  'CAT-b709172b-4eb7-318e-3b5d-e0f0500b32ac': 'HOME',
  'CAT-bf9f3294-4c40-1677-d269-54fbc189faf3': 'INCOME',
  'CAT-ccd42390-9e8c-3fb6-a5d9-6c31182d9c5c': 'INVESTMENTS',
  'CAT-0cb1d99d-f558-99e3-2282-b31f359b411a': 'KIDS',
  'CAT-e5154228-fe45-790d-a280-f6bf5ae5ac9f': 'PERSONAL_CARE',
  'CAT-7cccbafa-87d7-c9a6-661b-8b3402fe9e78': 'PETS',
  'CAT-aad51b46-d6f7-3da5-fd6e-492328b3023f': 'SHOPPING',
  'CAT-d00fc539-aa14-009b-4ffb-7e8c7b839954': 'TAXES',
  'CAT-bce48142-fea4-ff45-20d9-0a642d44de83': 'TRANSFER',
  'CAT-ea23d844-cbd1-eb10-f6ac-0df9610e59ae': 'TRAVEL',
  'CAT-d7851c65-3353-e490-1953-fb9235e681e4': 'UNCATEGORIZED',
}

export const ThemeName = {
  'Auto & Transport': 'AUTO_TRANSPORT',
  'Bills & Utilities': 'BILLS_UTILITIES',
  'Business Services': 'BUSINESS',
  Education: 'EDUCATION',
  Entertainment: 'ENTERTAINMENT',
  'Fees & Charges': 'FEES',
  Financial: 'FINANCIAL',
  'Food & Dining': 'FOOD_DINING',
  'Gifts & Donations': 'GIFTS_CHARITY',
  'Health & Fitness': 'HEALTH_FITNESS',
  Home: 'HOME',
  Income: 'INCOME',
  Investments: 'INVESTMENTS',
  Kids: 'KIDS',
  Other: 'OTHER',
  'Personal Care': 'PERSONAL_CARE',
  Pets: 'PETS',
  Shopping: 'SHOPPING',
  Taxes: 'TAXES',
  Transfer: 'TRANSFER',
  Travel: 'TRAVEL',
  Uncategorized: 'UNCATEGORIZED',
}

export const TranslatedBudgetMap = {
  ['CAT-7829f71c-2e8c-afa5-2f55-fa3634b89874']: () => __('Auto & Transport'),
  ['CAT-79b02f2f-2adc-88f0-ac2b-4e71ead9cfc8']: () => __('Bills & Utilities'),
  ['CAT-94b11142-e97b-941a-f67f-6e18d246a23f']: () => __('Business Services'),
  ['CAT-e04e9d1e-e041-c315-2e50-094143ab3f73']: () => __('Entertainment'),
  ['CAT-d73ee74b-13a4-ac3e-4015-fc4ba9a62b2a']: () => __('Fees & Charges'),
  ['CAT-6c7de3f8-de6c-7061-1dd2-b093044014bf']: () => __('Financial'),
  ['CAT-bd56d35a-a9a7-6e10-66c1-5b9cc1b6c81a']: () => __('Food & Dining'),
  ['CAT-8edf9663-623e-4735-490e-31288f0a70b0']: () => __('Gifts & Donations'),
  ['CAT-52fa4693-c088-afb2-2a99-7bc39bb23a0f']: () => __('Health & Fitness'),
  ['CAT-b709172b-4eb7-318e-3b5d-e0f0500b32ac']: () => __('Home'),
  ['CAT-bf9f3294-4c40-1677-d269-54fbc189faf3']: () => __('Income'),
  ['CAT-ccd42390-9e8c-3fb6-a5d9-6c31182d9c5c']: () => __('Investments'),
  ['CAT-0cb1d99d-f558-99e3-2282-b31f359b411a']: () => __('Kids'),
  ['CAT-e5154228-fe45-790d-a280-f6bf5ae5ac9f']: () => __('Personal Care'),
  ['CAT-7cccbafa-87d7-c9a6-661b-8b3402fe9e78']: () => __('Pets'),
  ['CAT-aad51b46-d6f7-3da5-fd6e-492328b3023f']: () => __('Shopping'),
  ['CAT-d00fc539-aa14-009b-4ffb-7e8c7b839954']: () => __('Taxes'),
  ['CAT-bce48142-fea4-ff45-20d9-0a642d44de83']: () => __('Transfer'),
  ['CAT-ea23d844-cbd1-eb10-f6ac-0df9610e59ae']: () => __('Travel'),
  ['CAT-d7851c65-3353-e490-1953-fb9235e681e4']: () => __('Uncategorized'),
}

// Inverse ThemeName
export const ReadableNames = Object.keys(ThemeName).reduce(
  (obj, key) => ({ ...obj, [ThemeName[key]]: key }),
  {},
)

export const DateRangeTypes = {
  DEFAULT: 'DEFAULT',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  YTD: 'YTD',
}

export const DateRangeTypesMap = {
  'This Month': DateRangeTypes.MONTHLY,
  'Last Month': DateRangeTypes.MONTHLY,
  'Year To Date': DateRangeTypes.YTD,
  'Last Year': DateRangeTypes.YEARLY,
  [DateRangeTypes.MONTHLY]: DateRangeTypes.MONTHLY,
  [DateRangeTypes.YEARLY]: DateRangeTypes.YEARLY,
  [DateRangeTypes.YTD]: DateRangeTypes.YTD,
}

export const Icon = {
  [Guid.AUTO_TRANSPORT]: 'auto',
  [Guid.BILLS_UTILITIES]: 'utilities',
  [Guid.BUSINESS]: 'business',
  [Guid.EDUCATION]: 'education',
  [Guid.ENTERTAINMENT]: 'entertainment',
  [Guid.FEES_CHARGES]: 'attention',
  [Guid.FINANCIAL]: 'cash',
  [Guid.FOOD_DINING]: 'food',
  [Guid.GIFTS_DONATIONS]: 'gifts',
  [Guid.HEALTH_FITNESS]: 'health',
  [Guid.HOME]: 'home',
  [Guid.INCOME]: 'money-banknote',
  [Guid.INVESTMENTS]: 'net-worth',
  [Guid.KIDS]: 'kids',
  [Guid.PERSONAL_CARE]: 'personal-care',
  [Guid.PETS]: 'pets',
  [Guid.SHOPPING]: 'shopping',
  [Guid.TAXES]: 'taxes',
  [Guid.TRANSFER]: 'transfer',
  [Guid.TRAVEL]: 'travel',
  [Guid.UNCATEGORIZED]: 'help',
  edit: 'edit',
  add: 'plus',
}

export const CategoryTypesTabValues = {
  SPENDING: 1,
  INCOME: 2,
  OTHER: 3,
}

export const CategoryTypesTabValueByIndex = {
  1: 'SPENDING',
  2: 'INCOME',
  3: 'TRANSFER',
}

export const CategoryTypes = {
  SPENDING: 'SPENDING',
  INCOME: 'INCOME',
  TRANSFER: 'TRANSFER',
}

export const CategoryTypeZeroStateMessage = {
  1: 'No Spending',
  2: 'No Income',
  3: 'No Transfers',
}

export const CategoryListTabPanelId = {
  1: 'mx-spending-category-list',
  2: 'mx-income-category-list',
  3: 'mx-other-category-list',
}

export const CategoryListLabels = {
  1: 'Spending Categories',
  2: 'Income Categories',
  3: 'Other Categories',
}
