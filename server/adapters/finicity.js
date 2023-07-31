
const addressParser = require('parse-address'); 
const parseFullName = require('parse-full-name').parseFullName;

module.exports = {
  mapTransaction(t, accountId){
    // Deposit Transaction
    let key = 'depositTransaction'
    switch(t.type){
      // depositTransaction
      // loanTransaction
      // locTransaction
      // investmentTransaction
      // insuranceTransaction
    }
    return {
      [key]: {
        amount: t.amount,
        accountId,
        transactionId: t.id,
        postedTimestamp: t.postedDate,
        transactionTimestamp: new Date(t.transactionDate),
        description: t.description,
        memo: t.memo,
        category: t.Category,
        status: t.Status,
        payee: t.categorization?.normalizedPayeeName,
        checkNumber: t.checkNum,
        transactionType: t.type,
      }
    }
  },

  mapAccount(a){
    let key = 'depositAccount'
    let accountCategory = 'DEPOSIT_ACCOUNT'
    
    switch(a.type){
      case 'brokerageAccount':
      case 'mortgage':
      case 'loan':
      case 'studentLoan':
      case 'studentLoanGroup':
      case 'studentLoanAccount':
        key = 'loanAccount'
        accountCategory = 'LOAN_ACCOUNT'
        break;
      case 'lineOfCredit':
      case 'crediCard':
        key = 'locAcount'
        accountCategory = 'LOC_ACCOUNT'
        break;
      case 'moneyMarket':
      case 'investment':
      case 'investmentTaxDeferred':
      case 'employeeStockPurchasePlan':
      case 'ira':
      case '401k': 
      case 'roth':
      case '403b': 
      case '529plan': 
      case '529':
      case 'rollover': 
      case 'ugma':
      case 'utma': 
      case 'keogh': 
      case '457plan': 
      case '457': 
      case '401a':
      case 'pension': 
      case 'profitSharingPlan':
      case 'roth401k':
      case 'sepIRA': 
      case 'simpleIRA': 
        key = 'investmentAccount'
        accountCategory = 'INVESTMENT_ACCOUNT'
        break;
      case 'variableAnnuity':
        key = 'annuityAcount'
        accountCategory = 'ANNUITY_ACCOUNT'
        break;
      // case '':
      //   key = 'insuranceAcount'
      //   accountCategory = 'INSURANCE_ACCOUNT'
      //   break;
      case 'checking':
      case 'saving':
      case 'cd':
      case 'cryptocurrency':
      case 'educationSavings':
      case 'healthSavingsAccount': 
      case 'thriftSavingsPlan':
      default: 
        key = 'depositAccount'
        accountCategory = 'DEPOSIT_ACCOUNT'
        break;
    }
    
    return {
      [key] : {
        accountId: a.id,
        accountCategory,
        accountType: a.type,
        accountNumber: a.number,
        accountNumberDisplay: a.realAccountNumberLast4,
        status: a.status,
        currency: {currencyCode: a.currency},
        // https://api.finicity.com/aggregation/v1/customers/1005061234/accounts/5011648377/details
        // {
        //   'routingNumber': '123456789',
        //   'realAccountNumber': 2345678901
        // }
        //routingTransitNumber: a.RoutingNumber, // institutionId?Get
        balanceType: key === 'locAccount' ? 'LIABILITY': 'ASSET',
        // transferIn: true,
        // transferOut: true,
        nickname: a.name,
        currentBalance: a.balance,
        availableBalnace: a.detail?.availableBalanceAmount,
        balanceAsOf: new Date(a.balanceDate),
      }
    };
  },

  mapIdentity(customerId, accountOwnerDetail){
    let addresses = [];
    for(let add of accountOwnerDetail.addresses){
      try{
        let parsedAddress = addressParser.parseAddress(add.ownerAddress);
        addresses.push({
          line1: [parsedAddress.prefix, parsedAddress.number, parsedAddress.street, parsedAddress.type].filter(p => p).join(' '),
          city: parsedAddress.city,
          state: parsedAddress.state,
          postalCode: parsedAddress.zip,
          country: 'USA',
        });
      }catch(Error){
        addresses.push({
          line1 : add
        });
      }
    }
    let parsedName = parseFullName(accountOwnerDetail.ownerName);
    if(parsedName.error.length > 0){
      parsedName = {first: accountOwnerDetail.OwnerName}
    }
    let ret = {
      customerId,
      name: {
        prefix: parsedName.title,
        first: parsedName.first,
        middle: parsedName.middle,
        last: parsedName.last,
        suffix: parsedName.suffix,
        //prefix: accountOwnerDetail.title,
        // first: accountOwnerDetail.firstName,
        // middle: accountOwnerDetail.middleName,
        // last: accountOwnerDetail.lastName,
        //suffix: accountOwnerDetail.suffix,
      },
      addresses,
      email: accountOwnerDetail.emails?.map(e => e.email),
      telephones: accountOwnerDetail.phone?.map(p => ({
        type: p.type,
        country: p.country,
        number: p.phone
      })),
    };
    return ret;
  },
  mapFiAttributes(fi){
    return [
      {
        name: 'name',
        value: fi.name
      },
      // {
      //   name: 'logo',
      //   value: ins.Logo?.trim().replace('../../', '')
      // }
    ];
  }
}
// transaction type
// 'atm'
// 'cash'
// 'check'
// 'credit'
// 'debit'
// 'deposit'
// 'directDebit'
// 'directDeposit'
// 'dividend'
// 'fee'
// 'interest'
// 'other'
// 'payment'
// 'pointOfSale'
// 'repeatPayment'
// 'serviceCharge'
// 'transfer'

// transaction: 
// {
//   'id': 21284820852,
//   'amount': -828.9,
//   'accountId': 5011648377,
//   'customerId': 1005061234,
//   'status': 'active',
//   'description': 'Buy Stock',
//   'memo': 'UWM HOLDINGS CORPORATION - CLASS A COMMON STOCK',
//   'type': 'atm',
//   'transactionDate': 1607450357,
//   'postedDate': 1607450357,
//   'createdDate': 1607450357,
//   'firstEffectiveDate': 1607450357,
//   'effectiveDate': 1607450357,
//   'optionExpireDate': 1607450357,
//   'checkNum': 299,
//   'escrowAmount': 2534,
//   'feeAmount': 0.51,
//   'suspenseAmount': 0.25,
//   'interestAmount': 132,
//   'principalAmount': 32560,
//   'optionStrikePrice': 32560,
//   'unitQuantity': 150,
//   'unitPrice': 5.53,
//   'categorization': {
//     'normalizedPayeeName': 'Mad Science Research',
//     'category': 'ATM Fee',
//     'city': 'Murray',
//     'state': 'UT',
//     'postalCode': '84123',
//     'country': 'USA',
//     'bestRepresentation': 'VERIZON WIRELESS PAYMENTS'
//   },
//   'runningBalanceAmount': 1000,
//   'subaccountSecurityType': 'MARGIN',
//   'commissionAmount': 0,
//   'ticker': 'UWMC',
//   'investmentTransactionType': 'transfer',
//   'taxesAmount': 0,
//   'currencySymbol': 'USD',
//   'incomeType': 'DIV',
//   'splitDenominator': 152,
//   'splitNumerator': 20,
//   'sharesPerContract': 100,
//   'subAccountFund': 'MARGIN',
//   'securityId': '91823B109',
//   'securityIdType': 'CUSIP'
// }

// account
// {
//   'id': '5011648377',
//   'number': '2000004444',
//   'realAccountNumberLast4': '5678',
//   'name': 'Super Checking',
//   'balance': 401.26,
//   'type': 'checking',
//   'status': 'active',
//   'customerId': '1005061234',
//   'institutionId': '4222',
//   'balanceDate': 1607450357,
//   'aggregationSuccessDate': 1607450357,
//   'aggregationAttemptDate': 1607450357,
//   'createdDate': 1607450357,
//   'currency': 'USD',
//   'lastTransactionDate': 1607450357,
//   'oldestTransactionDate': 1607450357,
//   'institutionLoginId': 1007302745,
//   'detail': {
//     'dateAsOf': 1607450357,
//     'availableBalanceAmount': 5678.78,
//     'openDate': 1607450357,
//     'periodStartDate': 1607450357,
//     'periodEndDate': 1607450357,
//     'periodInterestRate': 13.245,
//     'periodDepositAmount': 2356.56,
//     'periodInterestAmount': 1234.56,
//     'interestYtdAmount': 1056.67,
//     'interestPriorYtdAmount': 3056.79,
//     'maturityDate': 1607450357,
//     'interestRate': '15.789',
//     'creditAvailableAmount': 3000,
//     'creditMaxAmount': 7000,
//     'cashAdvanceAvailableAmount': 2000,
//     'cashAdvanceMaxAmount': 3000,
//     'cashAdvanceBalance': 1000,
//     'cashAdvanceInterestRate': 21.5,
//     'currentBalance': 5789.34,
//     'paymentMinAmount': 456.78,
//     'paymentDueDate': 1607450357,
//     'previousBalance': 1234.56,
//     'statementStartDate': 1607450357,
//     'statementEndDate': 1607450357,
//     'statementPurchaseAmount': 2345.9,
//     'statementFinanceAmount': 156.78,
//     'statementCreditAmount': 345,
//     'rewardEarnedBalance': 500,
//     'pastDueAmount': 3688.99,
//     'lastPaymentAmount': 567.89,
//     'lastPaymentDate': 1607450357,
//     'statementCloseBalance': 2456.69,
//     'termOfMl': '36',
//     'mlHolderName': 'John Smith',
//     'description': 'a description',
//     'lateFeeAmount': 35,
//     'payoffAmount': 45567.98,
//     'payoffAmountDate': 1607450357,
//     'originalMaturityDate': 1607450357,
//     'principalBalance': 45056.7,
//     'escrowBalance': 2345.01,
//     'interestPeriod': 'monthly',
//     'initialMlAmount': 65000,
//     'initialMlDate': 1607450357,
//     'nextPaymentPrincipalAmount': 1256.67,
//     'nextPaymentInterestAmount': 234.56,
//     'nextPayment': 1578,
//     'nextPaymentDate': 1607450357,
//     'lastPaymentDueDate': 1607450357,
//     'lastPaymentReceiveDate': 1607450357,
//     'lastPaymentPrincipalAmount': 1256.67,
//     'lastPaymentInterestAmount': 234.56,
//     'lastPaymentEscrowAmount': 456.78,
//     'lastPaymentLastFeeAmount': 150,
//     'lastPaymentLateCharge': 50,
//     'ytdPrincipalPaid': 5432.01,
//     'ytdInterestPaid': 3948.56,
//     'ytdInsurancePaid': 1345.89,
//     'ytdTaxPaid': 1489,
//     'autoPayEnrolled': true,
//     'collateral': 'nissan sentra',
//     'currentSchool': 'utah valley university',
//     'firstPaymentDate': 1607450357,
//     'firstMortgage': true,
//     'loanPaymentFreq': 'monthly',
//     'originalSchool': 'brigham young university',
//     'recurringPaymentAmount': 456.23,
//     'lender': 'utah community credit union',
//     'endingBalanceAmount': 234789.45,
//     'loanTermType': 'fixed',
//     'paymentsMade': 14,
//     'balloonAmount': 1678.56,
//     'projectedInterest': 10456.78,
//     'interestPaidLtd': 56789.34,
//     'interestRateType': 'variable',
//     'loanPaymentType': 'principle',
//     'repaymentPlan': 'Standard, Graduated, Extended, Pay As You Earn, and more.',
//     'paymentsRemaining': 45,
//     'marginBalance': 456,
//     'shortBalance': 12456.89,
//     'availableCashBalance': 3456.78,
//     'maturityValueAmount': 34067.78,
//     'vestedBalance': 45000,
//     'empMatchAmount': 256.99,
//     'empPretaxContribAmount': 450,
//     'empPretaxContribAmountYtd': 700,
//     'contribTotalYtd': 2045,
//     'cashBalanceAmount': 2000,
//     'preTaxAmount': 78564.99,
//     'afterTaxAmount': 68564.99,
//     'matchAmount': 378,
//     'profitSharingAmount': 34678.89,
//     'rolloverAmount': 101234.67,
//     'otherVestAmount': 34000,
//     'otherNonvestAmount': 26000,
//     'currentLoanBalance': 345789.23,
//     'loanRate': 3.275,
//     'buyPower': 34567.89,
//     'rolloverLtd': 23456.78,
//     'loanAwardId': '1234568',
//     'originalInterestRate': 12,
//     'guarantor': 'FinBank',
//     'owner': 'FinBank',
//     'interestSubsidyType': 'Subsidy type',
//     'interestBalance': 2000,
//     'remainingTermOfMl': 2,
//     'initialInterestRate': 34567.89,
//     'feesBalance': 150,
//     'loanYtdInterestPaid': 5623.23,
//     'loanYtdFeesPaid': 5621.23,
//     'loanYtdPrincipalPaid': 5621.23,
//     'loanStatus': 'Deferment',
//     'loanStatusStartDate': 1607450357,
//     'loanStatusEndDate': 1607450357,
//     'weightedInterestRate': 12,
//     'repaymentPlanStartDate': 1607450357,
//     'repaymentPlanEndDate': 1607450357,
//     'expectedPayoffDate': 1607450357,
//     'outOfSchoolDate': 1607450357,
//     'convertToRepayment': 1607450357,
//     'daysDelinquent': 5,
//     'totalPrincipalPaid': 15000,
//     'totalInterestPaid': 1125,
//     'totalAmountPaid': 16125
//   },
//   'position': [
//     {
//       'id': 454678080,
//       'description': 'DELTA AIR LINES INC',
//       'symbol': 'DAL',
//       'units': 6.537,
//       'currentPrice': 41.585,
//       'securityName': 'DELTA AIR LINES INC',
//       'transactionType': 'Margin',
//       'marketValue': 271.84,
//       'costBasis': 190.01,
//       'status': 'A',
//       'currentPriceDate': 1607450357,
//       'securityType': 'Stock',
//       'mfType': 'OPENEND',
//       'posType': 'Long',
//       'totalGLDollar': 162742.9,
//       'totalGLPercent': 68.89,
//       'optionStrikePrice': 50,
//       'optionType': 'PUT',
//       'optionSharesPerContract': 100,
//       'optionExpireDate': '1644994800',
//       'fiAssetClass': 'COMNEQTY',
//       'assetClass': 'INTLSTOCK',
//       'currencyRate': 1,
//       'securityId': '25400W102',
//       'securityIdType': 'CUSIP',
//       'costBasisPerShare': 13.38,
//       'subAccountType': 'CASH',
//       'securityCurrency': 'USD',
//       'todayGLDollar': 16272.9,
//       'todayGLPercent': 18.89
//     }
//   ],
//   'displayPosition': 2,
//   'parentAccount': '5011648377'
// }

// customer
// {
//   'id': '1005061234',
//   'username': 'customerusername1',
//   'firstName': 'John',
//   'lastName': 'Smith',
//   'type': 'active',
//   'createdDate': '1607450357',
//   'lastModifiedDate': '1607450357'
// }
// ownerInfo
//{
//   'ownerName': 'John Smith',
//   'ownerAddress': '434 W Ascension Way',
//   'asOfDate': 1607450357
// }
// owner details
// {
//   'holders': [
//     {
//       'relationship': 'AUTHORIZED_USER',
//       'ownerName': 'John Smith, PhD',
//       'firstName': 'John',
//       'middleName': 'L',
//       'lastName': 'Smith',
//       'suffix': 'PhD',
//       'nameClassification': 'person',
//       'nameClassificationconfidencescore': 100,
//       'addresses': [
//         {
//           'ownerAddress': '434 W Ascension Way',
//           'type': 'Home',
//           'line1': '434 W Ascension Way',
//           'line2': 'Suite #200',
//           'line3': 'UT 84123',
//           'city': 'Murray',
//           'state': 'UT',
//           'postalCode': '84123',
//           'country': 'USA'
//         }
//       ],
//       'emails': [
//         {
//           'isPrimary': true,
//           'email': 'myname@mycompany.com',
//           'emailType': 'Personal'
//         }
//       ],
//       'phones': [
//         {
//           'type': 'HOME',
//           'country': '61',
//           'phone': '1-801-984-4200'
//         }
//       ],
//       'documentations': [
//         {
//           'taxId': '123-45-7890',
//           'taxIdCountry': 'USA',
//           'governmentId': '123456789'
//         }
//       ],
//       'identityInsights': {
//         'isEmailValids': true,
//         'emailFirstSeenDays': 453,
//         'emailDomainCreationDate': '2011-06-29T00:00:00.000Z',
//         'emailToName': 'not found',
//         'ipRisk': true,
//         'ipRiskScore': 0.123,
//         'ipLastSeenDays': 15,
//         'ipGeolocationCountryCode': 'US',
//         'ipGeolocationSubdivision': 'Oregon',
//         'ipPhoneDistance': 200,
//         'ipAddressDistance': 210,
//         'isPhoneValid': true,
//         'phoneLineType': 'mobile',
//         'phoneCarrier': 'Vodafone UK ltd.',
//         'phoneCountryCode': 'UK',
//         'phoneLastSeenDays': 42,
//         'phoneEmailFirstSeenDays': 54,
//         'phoneToName': 'match',
//         'phoneToAddress': 'match',
//         'addressValidityLevel': 'valid',
//         'addressToName': 'match',
//         'identityNetworkScore': 0.574,
//         'addressIdentityRiskScore': 275,
//         'warnings': [
//           'Test warnings'
//         ]
//       }
//     }
//   ]
// }

// {
//   'id': 4222,
//   'name': 'FinBank',
//   'transAgg': true,
//   'ach': true,
//   'stateAgg': false,
//   'voi': true,
//   'voa': true,
//   'aha': false,
//   'availBalance': false,
//   'accountOwner': true,
//   'studentLoanData': true,
//   'loanPaymentDetails': true,
//   'accountTypeDescription': 'Workplace Retirement',
//   'phone': '1-801-984-4200',
//   'urlHomeApp': 'https://www.example.com/home',
//   'urlLogonApp': 'https://www.example.com/login',
//   'oauthEnabled': true,
//   'urlForgotPassword': 'https://www.example.com/forgotPassword.do',
//   'urlOnlineRegistration': 'https://www.example.com/signup',
//   'class': 'retirement',
//   'specialText': 'Please enter your Principal Financial - Retirement (Personal) Username and Password.',
//   'timeZone': 'America/Denver',
//   'specialInstructions': [
//     'Account details',
//     'Balances and transactions',
//     'Personal and account ownership info'
//   ],
//   'specialInstutionsTitle': 'Special OAuth Login Instructions',
//   'address': {
//     'city': 'Murray',
//     'state': 'UT',
//     'country': 'USA',
//     'postalCode': '84123',
//     'addressLine1': '434 W Ascension Way',
//     'addressLine2': 'Suite #200'
//   },
//   'currency': 'USD',
//   'email': 'myname@mycompany.com',
//   'status': 'online',
//   'newInstitutionId': 4222,
//   'branding': {
//     'logo': 'https://prod-carpintero-branding.s3.us-west-2.amazonaws.com/5/logo.svg',
//     'alternateLogo': 'https://prod-carpintero-branding.s3.us-west-2.amazonaws.com/5/alternateLogo.svg',
//     'icon': 'https://prod-carpintero-branding.s3.us-west-2.amazonaws.com/5/icon.svg',
//     'primaryColor': '#0167AE',
//     'tile': 'https://prod-carpintero-branding.s3.us-west-2.amazonaws.com/5/tile.svg'
//   },
//   'oauthInstitutionId': 4222
// }
