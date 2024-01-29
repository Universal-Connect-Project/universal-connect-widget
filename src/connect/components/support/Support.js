import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useTokens } from '@kyper/tokenprovider'

import { fadeOut } from '../../utilities/Animation'
import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'

import { SupportMenu } from './SupportMenu'
import { RequestInstitution } from './RequestInstitution'
import { GeneralSupport } from './GeneralSupport'
import { SupportSuccess } from './SupportSuccess'

export const VIEWS = {
  MENU: 'menu',
  REQ_INSTITUTION: 'reqInstitution',
  GENERAL_SUPPORT: 'generalSupport',
  SUCCESS: 'success',
}

export const Support = props => {
  const { loadToView, onClose } = props
  const [currentView, setCurrentView] = useState(loadToView)
  const [email, setEmail] = useState('')
  const user = useSelector(state => state.user.details)
  const containerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)
  const dispatch = useDispatch()

  const handleCloseSupport = () => fadeOut(containerRef.current, 'up', 300).then(() => onClose())
  const handleTicketSuccess = email => {
    setEmail(email)
    setCurrentView(VIEWS.SUCCESS)
  }

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.content}>
        {currentView === VIEWS.MENU && (
          <SupportMenu
            handleClose={handleCloseSupport}
            selectGeneralSupport={() => setCurrentView(VIEWS.GENERAL_SUPPORT)}
            selectRequestInstitution={() => setCurrentView(VIEWS.REQ_INSTITUTION)}
          />
        )}

        {currentView === VIEWS.REQ_INSTITUTION && (
          <RequestInstitution
            handleClose={() => (loadToView !== VIEWS.MENU ? onClose() : setCurrentView(VIEWS.MENU))}
            handleTicketSuccess={handleTicketSuccess}
            sendAnalyticsEvent={eventData => dispatch(sendAnalyticsEvent(eventData))}
            user={user}
          />
        )}

        {currentView === VIEWS.GENERAL_SUPPORT && (
          <GeneralSupport
            handleClose={() => (loadToView !== VIEWS.MENU ? onClose() : setCurrentView(VIEWS.MENU))}
            handleTicketSuccess={handleTicketSuccess}
            user={user}
          />
        )}

        {currentView === VIEWS.SUCCESS && (
          <SupportSuccess
            email={email}
            handleClose={() => (loadToView !== VIEWS.MENU ? onClose() : setCurrentView(VIEWS.MENU))}
          />
        )}
      </div>
    </div>
  )
}

const getStyles = tokens => ({
  container: {
    backgroundColor: tokens.BackgroundColor.Container,
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '400px', // Our max content width (does not include side margin)
    minWidth: '270px', // Our min content width (does not include side margin)
    width: '100%', // We want this container to shrink and grow between our min-max
    margin: '0 auto 0 auto',
  },
})

Support.propTypes = {
  loadToView: PropTypes.oneOf([VIEWS.MENU, VIEWS.REQ_INSTITUTION, VIEWS.GENERAL_SUPPORT]),
  onClose: PropTypes.func.isRequired,
}
Support.defaultPops = {
  loadToView: VIEWS.MENU,
}
