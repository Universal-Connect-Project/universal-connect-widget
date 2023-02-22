/**
supplant("Hello, {name}!", {name: 'world'})
**/
const supplant = (str, obj) =>
  str.replace(/\{([^{}]*)\}/g, (a, b) => {
    const r = obj[b]
    return typeof r === 'string' || typeof r === 'number' ? r : a
  })

export function buildClientSessionTimeoutURL(url, widgetType) {
  if (url == null || url.length === 0) {
    return null
  }

  return supplant(url, { widgetType })
}
