/*
 * Initialize the global js-logger `logger` instance.
 * The log level can be changed a couple of different ways:
 *
 * Browser console:
 *   window.Logger.setLevel(window.Logger.DEBUG)
 *
 * Node environment variable:
 *   LOG_LEVEL=debug npm run dev
 */
import Logger from 'js-logger';

/* eslint-disable react-hooks/rules-of-hooks */
// Logger.useDefaults({ defaultLevel: Logger[process.env.LOG_LEVEL.toUpperCase()] }) // eslint-disable-line no-process-env
// Let developers change the log level in a browser console
window.Logger = Logger
