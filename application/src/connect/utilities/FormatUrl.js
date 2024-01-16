/**
 * A function that takes a url and returns a url that doesn't
 * have the protocol or any trailing information
 * @param {string} url
 * @returns {string} formated url with out protocol or trailing slashes
 */
export const formatUrl = url => {
  if (!url) return ''
  const httpString = 'http://'
  const httpsString = 'https://'

  let formattedUrl = url
  if (
    url.substring(0, httpString.length) !== httpString &&
    url.substring(0, httpsString.length) !== httpsString
  ) {
    formattedUrl = httpString + url
  }
  let newUrl

  try {
    newUrl = new URL(formattedUrl).hostname
  } catch {
    newUrl = url
  }
  return newUrl
}
