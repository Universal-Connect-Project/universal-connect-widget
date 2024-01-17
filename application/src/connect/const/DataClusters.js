import { __ } from 'src/connect/utilities/Intl'
export const dataClusters = {
  contactInfo: {
    name: __('Contact information'),
    description: __('Name, email, address, phone on file with this institution.'),
    dataTest: 'data-cluster-contact-info',
  },
  personalInfo: {
    name: __('Personal information'),
    description: __(
      'Name, email, address, phone, date of birth, tax ID, SSN on file with this institution.',
    ),
    dataTest: 'data-cluster-personal-info',
  },
  basicAccountInfo: {
    name: __('Basic account information'),
    description: __('Account display name, masked account number, type, and description.'),
    dataTest: 'data-cluster-basic-account-info',
  },
  detailedAccountInfo: {
    name: __('Detailed account information'),
    description: __(
      'Account display name, masked account number, type, description, account balances, credit limits, due dates, interest rates, and rewards balances.',
    ),
    dataTest: 'data-cluster-detailed-account-info',
  },
  accountPaymentInfo: {
    name: __('Account payment information'),
    description: __('Full account number and bank routing number.'),
    dataTest: 'data-cluster-account-payment-info',
  },
  investments: {
    name: __('Investments'),
    description: __(
      'Details about individual underlying investments, contributions, investment loans, open orders, pension sources, vesting, holdings, and other relevant information about each holding.',
    ),
    dataTest: 'data-cluster-investments',
  },
  transactions: {
    name: __('Transactions'),
    description: __(
      'Historical and current transactions, transaction types, amounts, dates, and descriptions.',
    ),
    dataTest: 'data-cluster-transactions',
  },
  statements: {
    name: __('Statements'),
    description: __(
      'Periodic PDF statement showing personal information, account, and transaction details.',
    ),
    dataTest: 'data-cluster-statements',
  },
}

export const aggDataCluster = [
  dataClusters.basicAccountInfo,
  dataClusters.detailedAccountInfo,
  dataClusters.investments,
  dataClusters.transactions,
]

export const verificationDataCluster = [dataClusters.accountPaymentInfo]

export const verificationIdentityDataCluster = [
  dataClusters.contactInfo,
  dataClusters.basicAccountInfo,
  dataClusters.accountPaymentInfo,
  dataClusters.transactions,
]

export const aggIdentityDataCluster = [
  dataClusters.contactInfo,
  dataClusters.basicAccountInfo,
  dataClusters.detailedAccountInfo,
  dataClusters.investments,
  dataClusters.transactions,
]
