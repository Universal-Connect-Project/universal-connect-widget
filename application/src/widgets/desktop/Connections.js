import PropTypes from 'prop-types'
import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'

import { Button } from '@kyper/button'
import { TokenContext } from '@kyper/tokenprovider'

import Connect from 'widgets/desktop/Connect'
import { __ } from 'src/connect/utilities/Intl'

import { DeleteMemberSurvey } from 'src/connect/components/DeleteMemberSurvey'
import { DeleteMemberSuccess } from 'src/connect/views/deleteMemberSuccess/DeleteMemberSuccess'

import { ConnectionStatusMap } from 'src/connect/const/Statuses'
import { EventCategories, EventLabels, EventActions } from 'src/connect/const/Analytics'

import {
  addAnalyticPath,
  removeAnalyticPath,
  sendAnalyticsEvent,
  ActionTypes as AnalyticsActionTypes,
} from 'reduxify/actions/Analytics'
import { ActionTypes, dispatcher as connectionsDispatcher } from 'reduxify/actions/Connections'
import * as connectActions from 'reduxify/actions/Connect'
import { ActionTypes as PostMessageActionTypes } from 'src/connect/redux/actions/PostMessage'

import { getMembersForConnectionsList } from 'src/connect/redux/selectors/Connections'

import { getSize } from 'reduxify/selectors/Browser'

import * as BrowserUtils from 'src/connect/utilities/Browser'
import { focusElement } from 'src/connect/utilities/Accessibility'
import { combineDispatchers } from 'src/connect/utilities/reduxHelpers'
import { isRunningE2ETests } from 'src/connect/utilities/e2e'
import { ReadableStatuses } from 'src/connect/const/Statuses'
import connectAPI from 'src/connect/services/api'

import { Container } from 'src/connect/components/Container'
import { LoadingSpinner } from 'src/connect/components/LoadingSpinner'
import { ConnectionDetails } from 'src/connections/ConnectionDetails'
import { ConnectedMembersList } from 'src/connections/ConnectedMembersList'
import { ConnectionsHeader } from 'src/connections/ConnectionsHeader'
import { AccountDetails } from 'src/connections/AccountDetails'
import { BackButton } from 'src/connections/BackButton'
import { BACK_TO_CONNECTIONS } from 'src/connections/consts'
import { DeleteManualMember } from 'src/connections/components/DeleteManualMember'
import { PageviewInfo } from 'src/connect/const/Analytics'
import { ConnectionsResponsiveLayout } from 'src/connections/ConnectionsResponsiveLayout'

export const VIEWS = {
  CONNECT: 'connect',
  MEMBER_DETAILS: 'member-details',
  MEMBER_LIST: 'member-list',
  ACCOUNT_DETAILS: 'account-details',
  DELETE_MEMBER_SUCCESS: 'delete-member-success',
  DELETE_MEMBER_SURVEY: 'delete-member-survey',
}

class Connections extends Component {
  constructor(props) {
    super(props)

    const [name, path] = PageviewInfo.CONNECTIONS

    props.addAnalyticPath({ name, path })

    this.state = {
      accountForAccountDetails: {},
      currentView: VIEWS.CONNECT,
      selectedInstitutionGuid: props.selectedInstitutionGuid,
      selectedMemberGuid: props.selectedMemberGuid,
      memberToDelete: {},
      size: 'small',
      updateCredentials: props.updateCredentials,
    }

    this.mobileConnectNavRef = React.createRef()
  }

  componentDidMount() {
    this.props.loadConnections(this.props.selectedMemberGuid)

    focusElement(this._backButton)

    this._handleSizeAndViewChange()

    if (!isRunningE2ETests()) {
      this.props.initializePosthog()
    }
  }

  componentDidUpdate() {
    this._handleSizeAndViewChange()
  }

  componentWillUnmount() {
    this.props.connectionsUnmounted()
    this.props.removeAnalyticPath(PageviewInfo.CONNECTIONS[1])
  }
  /**
   * When the size of the app changes, we potentiall need to switch from the
   * left/right view mode to a single view. This logic mostly gets it right but
   * there are still some issues here. However, I don't think user is going
   * back and for all that much so I don't think it is a priority right now.
   */
  _handleSizeAndViewChange = () => {
    const width = (this.container && this.container.clientWidth) || 0
    const size =
      width < BrowserUtils.breakpointNumberOnly(this.context.MediaQuery.Med) ? 'small' : 'large'
    let startingView

    if (this.state.selectedMemberGuid && !this.state.updateCredentials) {
      startingView = VIEWS.MEMBER_DETAILS
    } else if (
      this.state.selectedInstitutionGuid ||
      (this.state.selectedMemberGuid && this.state.updateCredentials)
    ) {
      startingView = VIEWS.CONNECT
    } else if (size === 'small') {
      startingView = VIEWS.MEMBER_LIST
    } else {
      startingView = this.state.currentView
    }

    if (this.state.size !== size || this.state.width !== width) {
      this.setState({
        currentView: startingView,
        size,
        width,
      })
    }
  }

  _handleViewAccountDetails = () => {
    this.setState({ currentView: VIEWS.ACCOUNT_DETAILS })
  }

  _handleSetAccountForAccountDetails = account => {
    this.setState({ accountForAccountDetails: account })
  }

  _handleMemberClick = member => {
    if (
      member.connection_status === ReadableStatuses.CONNECTED ||
      member.connection_status === null ||
      member.is_manual
    ) {
      this.setState(
        {
          selectedMemberGuid: member.guid,
          currentView: VIEWS.MEMBER_DETAILS,
        },
        () => {
          focusElement(this._backButton)
        },
      )
    } else {
      this.setState({
        selectedMemberGuid: member.guid,
        currentView: VIEWS.MEMBER_DETAILS,
        updateCredentials: false,
      })
    }
  }

  _toggleAccountHidden = account => {
    const label = EventLabels.ACCOUNT_OPTIONS
    const action = account.is_hidden
      ? `${label} - ${EventActions.UNHIDE_ACCOUNT}`
      : `${label} - ${EventActions.HIDE_ACCOUNT}`

    this.props.sendAnalyticsEvent({
      category: EventCategories.CONNECTIONS,
      label,
      action,
    })

    connectAPI.saveAccount({ ...account, is_hidden: !account.is_hidden }).then(updatedAccount => {
      this.props.updateAccount(updatedAccount)
      this.setState({ accountForAccountDetails: { ...account, ...updatedAccount } })
    })
  }

  _handleMemberDelete = member =>
    this.setState({
      memberToDelete: member,
      currentView: VIEWS.DELETE_MEMBER_SURVEY,
    })

  _handleCancelClick = () => this.setState({ memberToDelete: {} })

  // Make a specific survey related analytic event and then use the same delete
  // path as usual
  _handleManualMemberDeleteSuccess = deletedMember => {
    this.props.deleteMemberSuccess(deletedMember.guid)
    this._clearData()

    this.props.sendPostMessage('connections/memberDeleted', {
      member_guid: deletedMember.guid,
    })
  }

  _handleMemberDeleteSuccess = (deletedMember, reason) => {
    const connection_status = deletedMember.connection_status
    const connection_status_name = ConnectionStatusMap[connection_status]

    this.props.sendAnalyticsEvent({
      category: EventCategories.CONNECTIONS,
      label: EventLabels.DELETE_SURVEY,
      action: `${EventLabels.DELETE_SURVEY} - (${connection_status})${connection_status_name} - ${reason}`,
    })
    this.props.sendPostMessage('connections/memberDeleted', {
      member_guid: deletedMember.guid,
    })

    this.props.deleteMemberSuccess(deletedMember.guid)

    this.setState({ currentView: VIEWS.DELETE_MEMBER_SUCCESS })
  }

  /**
   * When "clearing" the data we basically set everything to default values,
   * except for the currentView. If we are small, we go to the member list,
   * otherwise we load connect in an unconfigured state.
   */
  _clearData = () => {
    this.setState({
      memberToDelete: {},
      currentView: this.state.size === 'small' ? VIEWS.MEMBER_LIST : VIEWS.CONNECT,
      updateCredentials: false,
      selectedMemberGuid: null,
      selectedInstitutionGuid: null,
    })
  }
  /**
   * Render connect simply renders the connect widget with some surrounding
   * markup. Connect is configured with whatever the configuration on state
   * currently is.
   */
  _renderConnect = () => {
    const styles = this.styles()
    const connectWrapperBackground = {
      backgroundColor: this.context.BackgroundColor.Container,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }

    return (
      <div style={connectWrapperBackground}>
        {this.state.size !== 'large' && (
          <div
            ref={this.mobileConnectNavRef}
            style={{ ...styles.connectionDetailsWrapper, ...styles.connectWrapperNav }}
          >
            <Button
              aria-label={__('Close')}
              data-test="connect-wrapper-close-button"
              onClick={() => {
                const label = EventLabels.CONNECTION_DETAILS

                this.props.sendAnalyticsEvent({
                  category: EventCategories.CONNECTIONS,
                  label,
                  action: `${label} - ${EventActions.BACK_TO_CONNECTION_DETAILS}`,
                })
                this.setState({
                  currentView: this.state.selectedMemberGuid
                    ? VIEWS.MEMBER_DETAILS
                    : VIEWS.MEMBER_LIST,
                })
              }}
              variant="transparent-tertiary"
            >
              {__('Close')}
            </Button>
          </div>
        )}
        <div style={styles.connectHeight}>
          {/**
           * flexGrow makes this div take up "the rest" of the available height
           * within the flex enabled parent.  Essentially giving the height
           * over to Connect when it loads.
           *
           * Connect's LoadingSpinner will use that height to center itself vertically
           *
           * Need this empty div here to prevent some unwanted scrolling in the
           * connections widget. Since the Connect widget has 100% * height,
           * it becomes too tall when bumped down by the button above.
           * This wrapping div is essentially 'auto' which, by extention, makes
           * the Connect component auto while in Connections.
           *
           * However, we can't change Connect's height right now because that
           * will actually break other widgets that relied on it being 100%
           * height and not supplying the grey background color.
           *
           * Really we need to re-evaluate Connect's height and background
           * color choice, since it is running into lots of edge cases.
           */}
          <Connect
            connectConfig={{
              update_credentials: this.state.updateCredentials,
              current_member_guid: this.state.selectedMemberGuid,
              current_institution_guid: this.state.selectedInstitutionGuid,
              // Connections overrides the `connectConfig` options above, but we
              // will want to use `mode` from the connect config.
              mode: this.props.connectMode,
            }}
            onManualAccountAdded={() => this._clearData()}
            onMemberDeleted={() => this._clearData()}
          />
        </div>
      </div>
    )
  }

  _renderConnectionDetails = () => {
    const styles = this.styles()
    const label = EventLabels.CONNECTION_DETAILS

    return (
      <div style={styles.connectionDetails}>
        <div id="connection-details-wrapper" style={styles.connectionDetailsWrapper}>
          <ConnectionDetails
            accounts={this.props.accounts}
            currentMemberGuid={this.state.selectedMemberGuid}
            defaultInstitutionGuid={this.props.defaultInstitutionGuid}
            isDisplayFullExternalAccountNumberEnabled={
              this.props.isDisplayFullExternalAccountNumberEnabled
            }
            mode={this.props.connectMode}
            onMemberDelete={this._handleMemberDelete}
            onSetAccountForAccountDetails={account =>
              this._handleSetAccountForAccountDetails(account)
            }
            onViewAccountDetails={this._handleViewAccountDetails}
            renderConnect={() => {
              this.setState({
                currentView: VIEWS.CONNECT,
              })
            }}
            sendAnalyticsEvent={this.props.sendAnalyticsEvent}
            showExternalLinkPopup={this.props.showExternalLinkPopup}
            size={this.state.size}
          >
            {/* Render a back button only at the proper screen sizes */}
            {this.state.size === 'large' ? null : (
              <div style={styles.connectionsDetailsBackButton}>
                <BackButton
                  ariaLabel={BACK_TO_CONNECTIONS}
                  onClick={() => {
                    this.props.sendAnalyticsEvent({
                      category: EventCategories.CONNECTIONS,
                      label,
                      action: `${label} - ${EventActions.BACK_TO_CONNECTIONS}`,
                    })
                    this._clearData()
                  }}
                />
              </div>
            )}
          </ConnectionDetails>
        </div>
      </div>
    )
  }

  _renderAccountDetails = () => {
    const account = this.state.accountForAccountDetails

    /* A user can merge any two accounts (for now, even manual ones).
     * In the future we may adjust this behavior.
     * We're just removing the currently selected account from the list
     */
    const mergableAccounts = this.props.accounts.filter(acct => acct.guid !== account.guid)

    return (
      <AccountDetails
        account={account}
        enableMarkAccountClosedForHeldAccounts={this.props.enableMarkAccountClosedForHeldAccounts}
        enableMarkAccountDuplicateForHeldAccounts={
          this.props.enableMarkAccountDuplicateForHeldAccounts
        }
        isDisplayFullExternalAccountNumberEnabled={
          this.props.isDisplayFullExternalAccountNumberEnabled
        }
        mergableAccounts={mergableAccounts}
        onAccountClose={account =>
          connectAPI.saveAccount({ ...account, is_closed: true }).then(updatedAccount => {
            this.props.updateAccount(updatedAccount)
            // Get the account updates into our component state on sucess
            // Helps maintain the memberName property
            this.setState({
              accountForAccountDetails: {
                ...account,
                ...updatedAccount,
              },
            })
          })
        }
        onAccountMerge={accountGuids => {
          connectAPI.mergeAccounts(accountGuids).then(() => {
            connectAPI.loadAccounts().then(accounts => {
              this.props.mergeAccounts(accounts)
              this.setState({ currentView: VIEWS.MEMBER_DETAILS })
            })
          })
        }}
        onAccountOpen={account => {
          connectAPI.saveAccount({ ...account, is_closed: false }).then(updatedAccount => {
            this.props.updateAccount(updatedAccount)
            this.props.syncMember(this.state.selectedMemberGuid)
            // Get the account updates into our component state on sucess
            // Helps maintain the memberName property
            this.setState({
              accountForAccountDetails: {
                ...account,
                ...updatedAccount,
              },
            })
          })
        }}
        onAccountToggle={this._toggleAccountHidden}
        onBackToConnectionDetails={() => {
          this.setState({ currentView: VIEWS.MEMBER_DETAILS })
        }}
        sendAnalyticsEvent={this.props.sendAnalyticsEvent}
        size={this.props.size}
      />
    )
  }

  _showCorrectStep = () => {
    if (
      this.state.currentView === VIEWS.MEMBER_DETAILS ||
      this.state.currentView === VIEWS.DELETE_MEMBER_SURVEY
    ) {
      return this._renderConnectionDetails()
    } else if (this.state.currentView === VIEWS.ACCOUNT_DETAILS) {
      return this._renderAccountDetails()
    } else if (this.state.currentView === VIEWS.DELETE_MEMBER_SUCCESS) {
      return (
        <Container>
          <DeleteMemberSuccess
            institution={{ name: this.state.memberToDelete.name }}
            isInstitutionSearchEnabled={this.props.isInstitutionSearchEnabled}
            onContinueClick={this._clearData}
          />
        </Container>
      )
    } else {
      return this._renderConnect()
    }
  }
  static contextType = TokenContext

  render() {
    const styles = this.styles()
    const isLargeViewport = this.state.size === 'large'
    const memberToDelete = this.state.memberToDelete.guid
    const isManual = this.state.memberToDelete.is_manual
    const showDeleteMemberSurvey =
      memberToDelete && !isManual && this.state.currentView === VIEWS.DELETE_MEMBER_SURVEY

    if (this.props.isConnectionsLoading) {
      return <LoadingSpinner showText={true} />
    }

    const sendAddAccountAnalytic = () => {
      this.props.sendAnalyticsEvent({
        category: EventCategories.CONNECTIONS,
        label: EventLabels.INSTITUTION_LIST,
        action: `${EventLabels.INSTITUTION_LIST} - ${EventActions.ADD_ACCOUNT}`,
      })
    }

    if (memberToDelete && isManual) {
      return (
        <DeleteManualMember
          handleDeleteSuccess={this._handleManualMemberDeleteSuccess}
          handleGoBack={this._handleCancelClick}
          memberToDelete={this.state.memberToDelete}
        />
      )
    }

    return (
      <div ref={ref => (this.container = ref)} style={styles.container}>
        <ConnectionsResponsiveLayout
          detailPanel={
            <div style={styles.detailsWrapper}>
              {showDeleteMemberSurvey ? (
                <DeleteMemberSurvey
                  member={this.state.memberToDelete}
                  onCancel={this._handleCancelClick}
                  onDeleteSuccess={this._handleMemberDeleteSuccess}
                />
              ) : null}
              {this._showCorrectStep()}
            </div>
          }
          focusOnList={this.state.currentView === VIEWS.MEMBER_LIST}
          listPanel={
            <div>
              <ConnectionsHeader
                mode={this.props.connectMode}
                onAddConnectionClick={() => {
                  this.setState({
                    memberToDelete: {},
                    updateCredentials: false,
                    selectedMemberGuid: null,
                    selectedInstitutionGuid: null,
                    currentView: VIEWS.CONNECT,
                  })
                  this.props.resetWidgetConnections()
                  sendAddAccountAnalytic()
                }}
                showZeroState={this.props.connectionsMembers.length === 0}
              />

              <ConnectedMembersList
                accounts={this.props.accounts}
                connectedMembers={this.props.connectionsMembers}
                defaultInstitutionGuid={this.props.defaultInstitutionGuid}
                hidePartnerManagedMembers={this.props.hidePartnerManagedMembers}
                mode={this.props.connectMode}
                onMemberSelect={this._handleMemberClick}
                sendAnalyticsEvent={this.props.sendAnalyticsEvent}
              />
            </div>
          }
          showBothPanels={isLargeViewport}
        />
      </div>
    )
  }

  styles = () => {
    const size = this.props.size
    const wrapperStyles = {
      backgroundColor: this.context.BackgroundColor.Container,
      boxSizing: 'border-box',
      flex: 1,
      height: '100%',
      overflowY: 'auto',
      /**
       * Absolute positioned so that contents are placed above institution
       * list at mobile resolutions. The reason we do this is for a11y. If you
       * open up connect or connections details, we have to return focus to
       * member list item that was clicked to get there.
       */
      position: 'absolute',
      top: 0,
      left: 0,
      // -1 so it doesn't fight with other drawer content.
      zIndex: this.context.ZIndex.Overlay - 1,
      width: '100%',
    }

    const mobileNavOffset = this.mobileConnectNavRef.current?.offsetHeight || 0

    return {
      container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'auto',
      },
      detailsWrapper: {
        ...wrapperStyles,
        padding: `0px ${this.context.Spacing.XLarge}`,
      },
      connectWrapperNav: {
        background: this.context.BackgroundColor.Body,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        marginLeft: 0,
        marginRight: 0,
        height: 48,
      },
      connectionDetails: {
        backgroundColor: this.context.BackgroundColor.Container,
        paddingTop: size === 'small' ? 0 : this.context.Spacing.XLarge,
        paddingBottom: size === 'small' ? 0 : this.context.Spacing.LARGE,
        paddingLeft: 0,
        paddingRight: 0,
        height: '100%',
        boxSizing: 'border-box',
      },
      connectionDetailsWrapper: {
        boxSizing: 'border-box',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '400px',
        minWidth: '270px', // Our min content width (does not include side margin)
      },
      // For the Connect wrapper, maxHeight is conditional for mobile screens
      // If the navigation bar is present, we'd like to prevent a scrollbar by
      // shrinking the connect area accordingly
      connectHeight: {
        flexGrow: '1',
        maxHeight: `calc(100% - ${mobileNavOffset}px)`,
      },
      connectionsDetailsBackButton: {
        marginBottom: this.context.Spacing.XSmall,
      },
    }
  }
}

Connections.propTypes = {
  accounts: PropTypes.array.isRequired,
  addAnalyticPath: PropTypes.func.isRequired,
  connectionsMembers: PropTypes.array.isRequired,
  connectionsUnmounted: PropTypes.func.isRequired,
  connectMode: PropTypes.string,
  defaultInstitutionGuid: PropTypes.string,
  deleteMemberSuccess: PropTypes.func.isRequired,
  enableMarkAccountClosedForHeldAccounts: PropTypes.bool.isRequired,
  enableMarkAccountDuplicateForHeldAccounts: PropTypes.bool.isRequired,
  hidePartnerManagedMembers: PropTypes.bool,
  initializePosthog: PropTypes.func.isRequired,
  isConnectionsLoading: PropTypes.bool,
  isDisplayFullExternalAccountNumberEnabled: PropTypes.bool,
  isInstitutionSearchEnabled: PropTypes.bool,
  loadConnections: PropTypes.func.isRequired,
  mergeAccounts: PropTypes.func.isRequired,
  removeAnalyticPath: PropTypes.func.isRequired,
  resetWidgetConnections: PropTypes.func.isRequired,
  selectedInstitutionGuid: PropTypes.string,
  selectedMemberGuid: PropTypes.string,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
  showExternalLinkPopup: PropTypes.bool,
  size: PropTypes.string.isRequired,
  syncMember: PropTypes.func.isRequired,
  updateAccount: PropTypes.func.isRequired,
  updateCredentials: PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => {
  const initializedClientConfig = state.initializedClientConfig || {}
  const connectionsConfig = initializedClientConfig.connections || {}

  return {
    accounts: state.connections.accounts,
    connectMode: state.initializedClientConfig.connect?.mode,
    defaultInstitutionGuid: state.client.default_institution_guid,
    hidePartnerManagedMembers: connectionsConfig.hide_partner_managed_members || false,
    isDisplayFullExternalAccountNumberEnabled:
      state.connect.widgetProfile.display_full_external_account_number,
    connectionsMembers: getMembersForConnectionsList(state),
    selectedInstitutionGuid:
      ownProps.selectedInstitutionGuid || connectionsConfig.selected_institution_guid || null,
    selectedMemberGuid: connectionsConfig.selected_member_guid || null,
    enableMarkAccountDuplicateForHeldAccounts:
      state.connect.widgetProfile.enable_mark_account_duplicate_for_held_accounts,
    enableMarkAccountClosedForHeldAccounts:
      state.connect.widgetProfile.enable_mark_account_closed_for_held_accounts,
    showExternalLinkPopup: state.clientProfile.show_external_link_popup,
    size: getSize(state),
    updateCredentials: connectionsConfig.update_credentials || false,
    isConnectionsLoading: state.connections.isConnectionsLoading,
    isInstitutionSearchEnabled:
      !state.initializedClientConfig.connect?.disable_institution_search ?? true,
  }
}

const mapDispatchToProps = combineDispatchers(dispatch => ({
  addAnalyticPath: path => dispatch(addAnalyticPath(path)),
  deleteMemberSuccess: memberGuid => dispatch(connectActions.deleteMemberSuccess(memberGuid)),
  initializePosthog: () => dispatch({ type: AnalyticsActionTypes.INITIALIZE_POSTHOG }),
  mergeAccounts: accountGuids =>
    dispatch({ type: ActionTypes.MERGE_ACCOUNTS, payload: accountGuids }),
  removeAnalyticPath: path => dispatch(removeAnalyticPath(path)),
  resetWidgetConnections: () =>
    dispatch({ type: connectActions.ActionTypes.RESET_WIDGET_CONNECTIONS }),
  sendAnalyticsEvent: eventData => dispatch(sendAnalyticsEvent(eventData)),
  sendPostMessage: (event, data) =>
    dispatch({ type: PostMessageActionTypes.SEND_POST_MESSAGE, payload: { event, data } }),
  updateAccount: account => dispatch({ type: ActionTypes.UPDATE_ACCOUNT, payload: account }),
  ...connectionsDispatcher(dispatch),
}))

export default connect(mapStateToProps, mapDispatchToProps)(Connections)
export { Connections }
