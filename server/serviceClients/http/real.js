const crypto = require('crypto');
const axios = require('axios');
const logger = require('../../infra/logger');

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

function wget(url) {
  logger.debug(`wget request: ${url}`);
  return axios
    .get(url)
    .then((res) => {
      logger.debug(`Received wget response from ${url}`);
      return res.data;
    })
    .catch((error) => {
      logger.error(`error from ${url}`, error);
      throw error;
    });
}

function get(url, headers, returnFullResObject) {
  logger.debug(`get request: ${url}`);
  return axios
    .get(url, { headers })
    .then((res) => {
      logger.debug(`Received get response from ${url}`);
      return returnFullResObject ? res : res.data;
    })
    .catch((error) => {
      logger.error(`error from ${url}`, error);
      throw error;
    });
}

function post(url, data, headers, returnFullResObject) {
  logger.debug(`post request: ${url}`);
  return axios
    .post(url, data, { headers })
    .then((res) => {
      logger.debug(`Received post response from ${url}`);
      return returnFullResObject ? res : res.data;
    })
    .catch((error) => {
      logger.error(`error from ${url}`, error);
      throw error;
    });
}

module.exports = {
  get,
  wget,
  post,
  stream
};
