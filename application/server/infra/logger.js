const config = require('../config');

const levels = {
  debug: -1,
  trace: 0,
  info: 1,
  warning: 2,
  error: 3,
};

function startDoc() {
  return {
    Level: 'trace',
    Component: config.Component,
    Env: config.Env || 'development',
    Request: {},
    '@timestamp': new Date().toISOString(),
  };
}

function logDoc(doc) {
  if (levels[config.LogLevel.toLowerCase()] > levels[doc.Level.toLowerCase()]) {
    return;
  }
  if (
    config.Env === 'dev' ||
    config.Env === 'local' ||
    config.Env === 'mocked'
  ) {
    console.log(doc);
  } else {
    console.log(JSON.stringify(doc));
  }
}

function logMessage(message, level, data, isError) {
  const doc = startDoc();
  doc.Level = level || doc.Level;
  doc.Message = message;
  if (isError && data) {
    doc.Error = { message: data.message || data, stack: data.stack };
  } else {
    doc.Data = data;
  }
  logDoc(doc);
}

exports.error = (message, error) => logMessage(message, 'error', error, true);
exports.info = (message, data) => logMessage(message, 'info', data);
exports.warning = (message, data) => logMessage(message, 'warning', data);
exports.trace = (message, data) => logMessage(message, 'trace', data);
exports.debug = (message, data) => logMessage(message, 'debug', data);
