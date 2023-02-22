import { fromEvent, race } from 'rxjs'
import { filter, pluck, map, share, retry } from 'rxjs/operators'
import _startsWith from 'lodash/startsWith'

/**
 * Filter for oauth postmessages
 *
 * Some SDKs (like ReactNative) send post messages as strings, so JSON parse
 * them first.
 */
const oAuthPostMessagePipeline = [
  pluck('data'),
  map(event => (typeof event === 'string' ? JSON.parse(event) : event)),
  filter(event => _startsWith(event.type, 'oauthComplete')),
  retry(), // retry infinite times. We don't want this to error or complete
]

const windowOAuthMessages$ = fromEvent(window, 'message').pipe(...oAuthPostMessagePipeline)
const documentOAuthMessages$ = fromEvent(document, 'message').pipe(...oAuthPostMessagePipeline)

/**
 * While most postmessages from OAuth come from the window, in ReactNative with
 * Android the messages are coming on the document instead. So race the window
 * and document, whichever wins is the one we will go with
 */
export const oauthCompletedMessages$ = race(windowOAuthMessages$, documentOAuthMessages$).pipe(
  share(), // share the execution for all subscribers
)
