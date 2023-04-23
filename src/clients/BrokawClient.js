/* eslint-disable no-unused-vars */
// import * as Phoenix from 'phoenix'

import { PostMessages$, EventsToDispatch$ } from '../streams'
import { WSEventSubject$ } from '../streams/Subjects'

import PostMessage from '../utils/PostMessage'

let socket
let channel
let postMessageSub
let eventsToDispatchSub

/**
 * Welcome to the Brokaw client. It receives all of our websocket events from
 * the Brokaw service and sends the raw event to WSEventSubject. It also
 * subscribes to our post message and redux action streams. It might be the
 * wrong place to do that last part, but it also isn't the worst.
 */
const BrokawClient = {
  subscribe(dispatch, userGuid) {
    this.dispatch = dispatch

    if (channel) {
      logger.warn('already subscribed')
      return
    }
    if (window.app.options && !window.app.options.brokaw_websocket_url) {
      logger.warn('window.app.options is missing brokaw config')
      return
    }

    const { brokaw_websocket_url, brokaw_auth } = window.app.options
    const channelName = `user:${userGuid}`

    // try {
      // heartbeatIntervalMs is the number of milliseconds between sending a hearbeat to the server
      // 20sec seems to be fast enough to avoid getting the connection dropped because of an idle timeout
    //   socket = new Phoenix.Socket(brokaw_websocket_url, {
    //     heartbeatIntervalMs: 20000,
    //   })
    //   socket.connect()

    //   channel = socket.channel(channelName, brokaw_auth)

    //   channel
    //     .join()
    //     .receive('ok', () => {
    //       logger.log(`subscribed to event stream for ${userGuid}`)
    //     })
    //     .receive('error', msg => {
    //       logger.error('failed to subscribe', msg)
    //     })

    //   // subscribe to the postmessage streams and actually send each one out
    //   // via post message
    //   postMessageSub = PostMessages$.subscribe({
    //     next: ({ type, payload }) => PostMessage.send(type, payload),
    //     error: err => logger.error('PostMessages error: ', err),
    //     complete: () => logger.warn('PostMessages completed'),
    //   })

    //   // subscribe to the actions streams and actually dispatch each one out
    //   // to redux.
    //   eventsToDispatchSub = EventsToDispatch$.subscribe({
    //     next: action => dispatch(action),
    //     error: err => logger.error('Websocket dispatch error: ', err),
    //     completed: () => logger.warn('Websocket dispatch completed'),
    //   })

    //   channel.onMessage = BrokawClient.handleBrokawMessage.bind(this)
    // } catch (e) {
    //   socket = null
    //   channel = null
    //   postMessageSub = null
    //   eventsToDispatchSub = null
    //   logger.error('subscription error', { brokaw_websocket_url, brokaw_auth, channelName }, e)
    // }
  },

  unsubscribe() {
    if (!channel) {
      logger.log('not subscribed')
      return
    }

    postMessageSub.unsubscribe()
    eventsToDispatchSub.unsubscribe()
    channel.leave().receive('ok', () => {
      socket.disconnect(() => {
        socket = null
        channel = null
        logger.log('unsubscribed')
      })
    })
  },

  // For debugging
  // Add the BrokawClient to the window (AppWrapper) and call _pause to buffer
  // up messages to be played at a later time.
  _pause() {
    this.buffer = []
    this.paused = true
  },

  // For debugging
  // Dispatched all the buffered messages
  _resume() {
    this.paused = false
    this.buffer.forEach(msg => {
      this.handleBrokawMessage(msg.eventName, msg.payload)
    })
    this.buffer = []
  },

  // the `eventName` here will match the event names provided by dunaway (ie budgets/created, accounts/deleted, etc)
  // the `payload` will match the payloads provided by dunaway
  // the `ref` can be ignored, it is a unique ID for correlating a websocket request
  handleBrokawMessage(eventName, payload, _ref) {
    if (this.paused) {
      this.buffer.push({ eventName, payload })
      return payload
    }

    WSEventSubject$.next({ type: eventName, payload })
    return payload // required by Phoenix
  },
}

export default BrokawClient
