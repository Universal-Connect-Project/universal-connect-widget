const crypto = require('crypto');
const axios = require('axios');
const logger = require('../logger');
const capacitor = require('./capacitor')
const config = require('../../config')

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

function handleResponse(promise, url, method, returnFullResObject){
  return promise.then((res) => {
    logger.debug(`Received ${method} response from ${url}`);
    return returnFullResObject ? res : res.data;
  })
  .catch((error) => {
    logger.error(`error ${method} from ${url}`, error);
    throw error;
  });
}

function wget(url) {
  logger.debug(`wget request: ${url}`);
  return handleResponse(axios.get(url), url, 'wget')
}

function get(url, headers, returnFullResObject) {
  logger.debug(`get request: ${url}`);
  return handleResponse(axios.get(url, { headers }), url, 'get', returnFullResObject)
}

function del(url, headers, returnFullResObject) {
  logger.debug(`del request: ${url}`);
  return handleResponse(axios.delete(url, { headers }), url, 'del', returnFullResObject)
}

function put(url, data, headers, returnFullResObject) {
  logger.debug(`put request: ${url}`);
  return handleResponse(axios.put(url, data, { headers }), url, 'put', returnFullResObject)
}

function post(url, data, headers, returnFullResObject) {
  logger.debug(`post request: ${url}`);
  return handleResponse(axios.post(url, data, { headers }), url, 'post', returnFullResObject)
}

module.exports = {
  get: config.UseAxios ? get: capacitor.get,
  wget: config.UseAxios ? wget: capacitor.wget,
  post: config.UseAxios ? post: capacitor.post,
  put: config.UseAxios ? put: capacitor.put,
  del: config.UseAxios ? del: capacitor.del,
  stream
};
