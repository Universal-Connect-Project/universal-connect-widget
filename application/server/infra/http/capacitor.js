const logger = require('../logger');
const {Http} = require('@capacitor-community/http');

async function wget(url) {
  logger.debug(`wget request: ${url}`);
  const options = {
    url,
    webFetchExtra: { mode: 'no-cors' },
    responseType: 'text',
  }
  const res = await Http.get(options).catch((error) => {
    logger.error(`error from ${url}`, error);
    throw error;
  });
  logger.debug(`Received wget response from ${url}`);
  return res.data;
}

async function get(url, headers, returnFullResObject) {
  logger.debug(`get request: ${url}`);
  const options = {
    url,
    headers,
    webFetchExtra: { mode: 'no-cors' },
    responseType: 'text',
  }
  const res = await Http.get(options).catch((error) => {
    logger.error(`error from ${url}`, error);
    throw error;
  });
  logger.debug(`Received get response from ${url}`);
  return returnFullResObject ? res : res.data;
}

async function post(url, data, headers, returnFullResObject) {
  logger.debug(`post request: ${url}`);
  const options = {
    url,
    headers: { 'content-type': 'application/json', ...headers},
    webFetchExtra: { mode: 'no-cors' },
    responseType: 'text',
    data: data || {},
  }
  // console.log(data)
  //logger.debug('posting: ' + options.url);
  const res = await Http.post(options).catch((error) => {
    logger.error(`error from ${url}`, error);
    throw error;
  });
  // console.log(res)
  logger.debug(`Received post response from ${url}`);
  return returnFullResObject ? res : res.data;
}

module.exports = {
  get,
  wget,
  post
};
