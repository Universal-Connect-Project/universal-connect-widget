import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _memoize from 'lodash/memoize'
import _some from 'lodash/some'

import { TransactionStatuses, TransactionTypes } from '../constants/Transaction'
import * as CategoryConstants from '../constants/Category'
import moment from 'moment'

// The keys of this object are used to test our search term when
// matching transaction parent categories to children.
const ParentCategoryKeys = Object.keys(CategoryConstants.ThemeName)

//returns new array with parent equal to originalTransactionAmount - updated sum of children amounts
//with edited child updated with amount
//and other children as is
export const updateSplitValues = (
  originalTransactionAmount,
  splits,
  indexOfEditedSplit,
  updatedSplitAmount,
) => {
  const [parent, ...children] = splits
  const { updatedParent, updatedChildren } = children.reduce(
    ({ updatedParent, updatedChildren }, currentSplit, indexOfChild) => {
      //index plus one because reduce begins with first child
      if (indexOfEditedSplit === indexOfChild + 1) {
        const parsedUpdatedSplitAmount = parseFloat(updatedSplitAmount)

        return {
          //this is the split being edited, update value of child and parent
          updatedParent: {
            ...updatedParent,
            amount: updatedParent.amount - parsedUpdatedSplitAmount,
          },
          updatedChildren: [
            ...updatedChildren,
            { ...currentSplit, amount: parsedUpdatedSplitAmount },
          ],
        }
      } else {
        return {
          //this is a split not being edited, only update parent
          updatedParent: { ...updatedParent, amount: updatedParent.amount - currentSplit.amount },
          updatedChildren: [...updatedChildren, currentSplit],
        }
      }
    },
    //start with parent amount set to this.props.transaction.amount and empty array for updatedChildren
    { updatedParent: { ...parent, amount: originalTransactionAmount }, updatedChildren: [] },
  )

  return [updatedParent, ...updatedChildren]
}

export const buildTransactionDetails = (transaction, accounts, categories) => {
  const account =
    _find(accounts, account => {
      return account.guid === transaction.account_guid
    }) || {}

  const category =
    _find(categories, category => {
      return category.guid === transaction.category_guid
    }) || {}

  return Object.assign({}, transaction, {
    account: account.user_name || 'Unknown',
    accountIsClosed: account.is_closed,
    accountIsHidden: account.is_hidden,
    category: category.name || 'Uncategorized',
    dateAsMoment: moment.unix(transaction.date).utc(),
    isIncome: transaction.top_level_category_guid === CategoryConstants.Guid.INCOME,
    isPending: transaction.feed_status === TransactionStatuses.PENDING,
    number: account.account_number || '',
    payee: transaction.description,
  })
}

export const buildTransactionDetailsFromParent = ({
  account,
  accountIsClosed,
  accountIsHidden,
  isIncome,
  isPending,
  payee,
}) => child => {
  return Object.assign({}, child, {
    account,
    accountIsClosed,
    accountIsHidden,
    childTransactions: [],
    dateAsMoment: moment.unix(child.date).utc(),
    isIncome,
    isPending,
    payee,
  })
}

export const buildSplits = transactions => {
  return groupChildrenOfSplitsWithParents(transactions)
}

export const filterOutChildrenOfSplits = transactions => {
  return _filter(transactions, transaction => {
    return !isASplit(transaction)
  })
}

export const isParentOfSplit = transaction => {
  return transaction.has_been_split
}

export const filterOutParentsOfSplits = transactions => {
  return _filter(transactions, transaction => {
    return !isParentOfSplit(transaction)
  })
}

export const getDescriptionForCSV = transaction => {
  if (isASplit(transaction)) {
    return `Split: ${transaction.description}`
  }

  if (transaction.is_hidden) {
    return `(Excluded) ${transaction.description}`
  }

  return transaction.description
}

export const getFormattedTransactionsForCSVDownload = (transactions, tags, taggings) => {
  const getNameFromTags = tags => tagging => {
    const tag = tags.filter(tag => tag.guid === tagging.tag_guid)[0]

    return tag ? tag.name : ''
  }

  // Get split transactions from parent if the parent is available (Transactions widget)
  // Don't get repeat child transactions if parent is opened (Transactions widget)
  // Get all transactions (split and nonsplit) when exporting from TransactionDetailDrawer
  const updateTransactions = transactions.reduce((acc, transaction) => {
    if (isParentOfSplit(transaction)) {
      const children = transaction.childTransactions.filter(
        child => !acc.find(updateTransactions => child.guid === updateTransactions.guid),
      )

      return [...acc, ...children]
    } else if (
      !isASplit(transaction) ||
      !acc.find(udpateTransaction => transaction.guid === udpateTransaction.guid)
    ) {
      return acc.concat(transaction)
    }
    return acc
  }, [])

  return updateTransactions.map(transaction => {
    const parentCategoryKey = CategoryConstants.Name[transaction.top_level_category_guid]

    return {
      Date: moment.unix(transaction.date).format('M/D/YY'),
      Description: getDescriptionForCSV(transaction),
      'Original Description': transaction.feed_description,
      Amount: transaction.amount,
      Type: TransactionTypes.CREDIT === transaction.transaction_type ? 'Credit' : 'Debit',
      'Parent Category': CategoryConstants.ReadableNames[parentCategoryKey],
      Category: transaction.category,
      Account: transaction.account,
      Tags: taggings
        .filter(tagging => tagging.transaction_guid === transaction.guid)
        .map(getNameFromTags(tags))
        .join(', '),
      Memo: transaction.memo,
      Pending: transaction.isPending,
    }
  })
}

export const groupChildrenOfSplitsWithParents = transactions => {
  if (!transactions || !transactions.length) return []

  return transactions.map(transaction => {
    if (isParentOfSplit(transaction)) {
      const childTransactions =
        _filter(transactions, item => {
          return item.parent_guid === transaction.guid
        }) || []

      return { ...transaction, childTransactions }
    }

    return transaction
  })
}

export const isASplit = transaction => {
  return !!transaction.parent_guid
}

export const includeTransactionInFilter = (filter, taggings, tags, transaction) => {
  if (filter === 'uncategorized' && transaction.has_been_split === true) {
    return false
  }

  // Split check
  const splitPattern = /^spl/i
  const splitSearchMatch =
    splitPattern.test(filter) && (isParentOfSplit(transaction) || isASplit(transaction))

  if (splitSearchMatch) {
    return true
  }

  const lowerCasedFilter = filter.toLowerCase()
  const filterTerms = lowerCasedFilter.split(' ')

  const _isIncluded = (terms, value) => {
    if (value) {
      return terms.every(term => value.toLowerCase().indexOf(term) > -1)
    }

    return false
  }

  // Check tag names for match
  const taggingsForTransaction = _filter(
    taggings,
    tagging => tagging.transaction_guid === transaction.guid,
  )
  let includeForTagMatch = false

  if (taggingsForTransaction.length) {
    taggingsForTransaction.forEach(tagging => {
      const tag = _find(tags, tag => tag.guid === tagging.tag_guid)

      if (_isIncluded(filterTerms, tag.name)) {
        includeForTagMatch = true
      }
    })
  }

  // Recursively check for match in children of a split
  const { childTransactions } = transaction

  const includeForChildOfSplitMatch =
    childTransactions && childTransactions.length
      ? _some(childTransactions, child => {
          return includeTransactionInFilter(filter, taggings, tags, child)
        })
      : false

  // Parent Category check
  const checkForParentCategoryMatch = filter => {
    return (
      !!transaction.top_level_category_guid &&
      getMatchingParentCategoryGuids(filter).includes(transaction.top_level_category_guid)
    )
  }

  return (
    _isIncluded(filterTerms, transaction.dateAsMoment.format('MMM DD, YYYY')) ||
    _isIncluded(filterTerms, transaction.payee) ||
    _isIncluded(filterTerms, transaction.feed_description) ||
    _isIncluded(filterTerms, transaction.category) ||
    _isIncluded(filterTerms, transaction.account) ||
    _isIncluded(filterTerms, transaction.amount.toFixed(2).toString()) ||
    _isIncluded(filterTerms, transaction.memo) ||
    includeForTagMatch ||
    includeForChildOfSplitMatch ||
    checkForParentCategoryMatch(filter)
  )
}

/**
 * This will match any of our top level categories with a regex on the category label
 *
 * @param {String} filter - the search term to filter our parent categories by.
 * @returns an Array of matching parent category GUIDs
 */
// With there being 22 top level categories to test with a regex and this potentially
// running for every single transactions, I felt it best to cache calls to it
export const getMatchingParentCategoryGuids = _memoize(filter => {
  const cache = getMatchingParentCategoryGuids.cache

  // clear its own cache.
  if (cache && cache.size > 1) {
    cache.clear()
  }
  // sanitize user input when passing to regex.
  const regexEscape = str => {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  const regex = new RegExp(regexEscape(filter), 'i')
  const matches = ParentCategoryKeys.filter(key => {
    return regex.test(key)
  })

  return matches.map(key => {
    const guidKey = CategoryConstants.ThemeName[key]

    return CategoryConstants.Guid[guidKey]
  })
})

export const getPostMessagePayload = transaction => {
  return {
    account_guid: transaction.account_guid,
    amount: transaction.amount,
    category_guid: transaction.category_guid,
    date: transaction.date,
    guid: transaction.guid,
    has_been_split: transaction.has_been_split,
    memo: transaction.memo,
    parent_guid: transaction.parent_guid,
    transaction_type: transaction.transaction_type,
    type: 'transaction',
    description: transaction.description,
    metadata: transaction.metadata,
  }
}

// Selected Account Guid from client config will trump applied filters
export const filterTransactionsBySelectedFilters = (
  transactions = [],
  appliedFilters = [],
  selectedAccountGuid,
) => {
  return transactions.filter(transaction => {
    return selectedAccountGuid
      ? transaction.account_guid === selectedAccountGuid
      : appliedFilters.includes(transaction.account_guid)
  })
}

/**
 * Returns an object containing the current and
 * previous transaction if the given collection
 * based upon the supplied index.
 *
 * If the index is zero then both current and
 * previous transactions will be the first transaction
 * in the collection.
 */
export const getCurrentAndPreviousTransactionFromCollection = (index, transactions) => {
  return {
    currentTransaction: transactions[index],
    previousTransaction: transactions[index - 1 >= 0 ? index - 1 : 0],
  }
}

/**
 * Helper function to determine if a date section header
 * will be rendered for the current row if mobile and we've
 * transitioned from one date group to the next. The order
 * of these checks matter so move with caution.
 */
export const shouldShowDateSectionHeaderInList = ({
  index,
  previousTransaction,
  currentTransaction,
  isMobile,
}) => {
  /**
   * If this is NOT mobile then we never show the new
   * date section header.
   */
  if (!isMobile) {
    return false
  }

  /**
   * If this is the very first transaction then we show the
   * first date section header. Usually the pending section header
   * if pending transactions exist.
   */
  if (index === 0) {
    return true
  }

  /**
   * We have to group pending transactions together in one section.
   * The default date sort also sorts by pending so that pending
   * transactions are pinned to the top of the colleciton. This
   * check says we're done with the pending section so we need to
   * show the next date section header.
   */
  if (previousTransaction.isPending === true && currentTransaction.isPending === false) {
    return true
  }

  /**
   * This is the standard change from one date to the next. If the
   * previous transactions date doesn't match this one then we know
   * we need to show the next date section header.
   */

  const prevDate = previousTransaction.dateAsMoment
  const currDate = currentTransaction.dateAsMoment

  if (!prevDate.isSame(currDate) && !currentTransaction.isPending) {
    return true
  }

  // No matches. Don't show a date section header.
  return false
}

// Turn an array of transactions into an object whose keys are a formatted date
// string and whose values are an array of transactions for that date
// Our transaction time stamps are in secs, converted to ms for moment

export const groupTransactionsByDate = (transactions, dateFormatString = 'dddd, MMMM DD YYYY') => {
  const dictionary = {}

  transactions.forEach(txn => {
    if (moment(txn.date * 1000).format(dateFormatString) in dictionary) {
      dictionary[moment(txn.date * 1000).format(dateFormatString)].push(txn)
    } else {
      dictionary[moment(txn.date * 1000).format(dateFormatString)] = [txn]
    }
  })
  return dictionary
}

export const sortDateList = dates => dates.sort((a, b) => new Date(b) - new Date(a))
