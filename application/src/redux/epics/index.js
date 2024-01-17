import { combineEpics } from 'redux-observable'

import {
  createFeatureVisit,
  initializeSession,
  sendAnalyticsEvent,
  sendAnalyticPageview,
  initializePostHog,
} from './Analytics'
import { loadMasterData } from './App'
import { loadAgreement } from './Agreement'
import * as connectEpics from 'src/connect/epics/Connect'
import { loadConnections, updateAccountsAfterConnecting } from './Connections'
import { postMessages } from './PostMessage'
import { postMessages as postMessagesConnect } from './PostMessage'
import { loadUserFeatures } from './UserFeatures'
import { updateUserProfile } from './UserProfile'
import { updateUser } from './User'

export const rootEpic = combineEpics(
  createFeatureVisit,
  connectEpics.loadConnect,
  connectEpics.selectInstitution,
  initializePostHog,
  initializeSession,
  loadAgreement,
  loadConnections,
  loadMasterData,
  loadUserFeatures,
  postMessages,
  postMessagesConnect,
  sendAnalyticPageview,
  sendAnalyticsEvent,
  updateAccountsAfterConnecting,
  updateUserProfile,
  updateUser,
)
