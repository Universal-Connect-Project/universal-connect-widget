import _sumBy from 'lodash/sumBy'
import _times from 'lodash/times'
import * as d3 from 'd3'
import moment from 'moment'
import { ChartUtils } from 'mx-react-components'
import { ChartRanges } from '../constants/Chart'
import {
  AssetTypeNames,
  AccountAssetTypes,
  AccountIcons,
  AccountTypeNames,
} from '../constants/Account'

const { MAX_NUMBER_MONTHS } = ChartRanges

export const buildAssetsAndLiabilities = accounts => {
  //the index of the account type names corresponds to the account type enum value
  return AccountTypeNames.reduce(
    (acc, name, index) => {
      const assetType = AssetTypeNames[AccountAssetTypes[index]]
      const icon = AccountIcons[index]
      const accountsForType = accounts.filter(account => account.account_type === index)
      const total = _sumBy(accountsForType, 'balance')

      acc[assetType].total += total
      acc[assetType].accountTypes = [
        ...acc[assetType].accountTypes,
        { accounts: accountsForType, icon, name, id: index, total },
      ]
      return acc
    },
    {
      [AssetTypeNames[0]]: {
        accountTypes: [],
        total: 0,
      },
      [AssetTypeNames[1]]: {
        accountTypes: [],
        total: 0,
      },
    },
  )
}

export const getSegmentedLineData = lineData => {
  const segments = []
  let i = 0

  while (++i < lineData.length) {
    segments.push({
      key: lineData[i - 1].x.toString() + lineData[i].x.toString(),
      coords: [
        { x: lineData[i - 1].x, y: lineData[i - 1].y },
        { x: lineData[i].x, y: lineData[i].y },
      ],
    })
  }

  return segments
}

export const buildYScale = (data, chartHeight) => {
  const max = d3.max(data, d => d.y)
  const min = d3.min(data, d => d.y)
  const tickSpec = ChartUtils.getAxisTickSpecification(min, max)

  return d3
    .scaleLinear()
    .range([chartHeight, 0])
    .domain([tickSpec.min, tickSpec.max])
}

export const getSvgScale = numberOfMonths => {
  const monthScaleKey = {
    6: 2.8,
    9: 3.5,
    12: 4,
  }

  return monthScaleKey[numberOfMonths]
}

export const buildTimeScale = options => {
  const startDate = moment()
    .startOf('month')
    .subtract(options.numberOfMonths - 1, 'months')
    .unix()
  const endDate = moment()
    .endOf('month')
    .unix()
  const { left, right, svgScale } = options.margins
  const scaleMarginFactor = options.chartWidth / svgScale - left - right

  return d3
    .scaleTime()
    .range([0, options.chartWidth + scaleMarginFactor])
    .domain([startDate, endDate])
}

export const buildDateTicks = () => {
  return _times(MAX_NUMBER_MONTHS, count => {
    return moment()
      .subtract(count, 'months')
      .startOf('month')
      .unix()
  }).sort()
}

export const divideToGainsAndLosses = accounts => {
  return accounts.reduce(
    (result, account) => {
      if (account.change > 0)
        return {
          ...result,
          gainAmount: result.gainAmount + account.change,
          gains: [...result.gains, account],
        }
      if (account.change < 0)
        return {
          ...result,
          lossAmount: result.lossAmount + account.change,
          losses: [...result.losses, account],
        }
      return result
    },
    {
      gainAmount: 0,
      gains: [],
      lossAmount: 0,
      losses: [],
    },
  )
}
