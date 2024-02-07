import { Guid } from '../constants/Category'
export const getLabelFontSize = (widgetSize, theme) => {
  if (widgetSize === theme.MiniWidgetDimensions.STANDARD) {
    return theme.FontSizes.LARGE
  }
  if (widgetSize === theme.MiniWidgetDimensions.MINIPORTRAIT) {
    return theme.FontSizes.SMALL
  }

  return theme.FontSizes.MEDIUM
}

export const getTotalFontSize = (widgetSize, theme) => {
  if (widgetSize === theme.MiniWidgetDimensions.STANDARD) {
    return theme.FontSizes.JUMBO
  }
  if (widgetSize === theme.MiniWidgetDimensions.MINIPORTRAIT) {
    return theme.FontSizes.XLARGE
  }

  return theme.FontSizes.XXLARGE
}

export const getLinkFontSize = (widgetSize, theme) => {
  switch (widgetSize) {
    case theme.MiniWidgetDimensions.STANDARD:
      return theme.FontSizes.MEDIUM
    case theme.MiniWidgetDimensions.MINIPORTRAIT:
      return theme.FontSizes.XSMALL
    default:
      return theme.FontSizes.SMALL
  }
}

export const isSpending = (isIncome, categoryGuid) =>
  !isIncome && categoryGuid !== Guid.TRANSFER && categoryGuid !== Guid.INVESTMENTS

export const formatValue = (
  isIncome,
  { value, overallTotal, total },
  { spendingCredit, incomeDebit, defaultValue },
) => {
  if (!isIncome) return value < 0 ? spendingCredit : defaultValue
  if (isIncome && overallTotal) return overallTotal > 0 ? incomeDebit : defaultValue

  return total && total > 0 ? incomeDebit : defaultValue
}
