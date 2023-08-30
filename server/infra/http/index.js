const config = require('../../config');
const real = require('./real');
const mocked = require('./mock');

const mock = config.Env === 'mocked';

const http = mock ? mocked : real;

module.exports = http;
