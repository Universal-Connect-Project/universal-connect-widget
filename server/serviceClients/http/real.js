const crypto = require('crypto');
const axios = require('axios');
const logger = require('../../infra/logger');
const {Http} = require('@capacitor-community/http');

function stream(url, data, target) {
  // logger.debug(`stream request: ${url}`);
  return axios({
    method: data ? 'post' : 'get',
    data,
    url,
    responseType: 'stream',
  })
    .then((res) => {
      // logger.debug(`Received stream response from ${url}`);
      return res;
    })
    .catch((error) => {
      if (error.response) {
        logger.error(`error from ${url}`, error.response.status);
        return error.response;
      }
      logger.error(`error from ${url}`, error);

      return undefined;
    })
    .then((res) => {
      if (res && res.headers) {
        if (res.headers['content-type']) {
          target.setHeader('content-type', res.headers['content-type']);
        }
        return res.data.pipe(target);
      }
      target.status(500).send('unexpected error');

      return undefined;
    });
}

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
    headers: {...headers, 'content-type': 'application/json'},
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
  post,
  stream
};
