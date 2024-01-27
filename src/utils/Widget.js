import _capitalize from 'lodash/capitalize'
import _get from 'lodash/get'

export const convertWidgetTypeToFormattedName = type => {
  if (!type || typeof type !== 'string') return 'Unknown Widget'

  return type
    .split('-')
    .map(word => _capitalize(word))
    .join(' ')
}

export const updateTitleWithWidget = widgetType => {
  const title = document.querySelector('title')

  if (title && title.text) {
    const widgetDisplayName = _get(window, 'app.config.widgets_display_name', 'MoneyMap')
    const formattedWidgetName = convertWidgetTypeToFormattedName(widgetType)

    title.text = `${widgetDisplayName} - ${formattedWidgetName}`
  }
}
