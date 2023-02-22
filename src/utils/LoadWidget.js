function loadWidget(type) {
  return new Promise(resolve => {
    const map = {
      accounts: 'AccountsContainer',
      addaccounts: 'Connect',
      budgets: 'BudgetsContainer',
      cashflow: 'CashFlowContainer',
      cash_flow: 'CashFlowContainer',
      connect: 'Connect',
      connections: 'Connections',
      debts: 'DebtsContainer',
      finstrong: 'FinstrongContainer',
      goals: 'GoalsContainer',
      guide_me: 'GoalsContainer',
      help: 'HelpContainer',
      investments: 'InvestmentsContainer',
      master: 'Master',
      'mini-budgets': 'MiniBudgetsContainer',
      'mini-spending': 'MiniSpendingContainer',
      'mini-networth': 'MiniNetWorthContainer',
      'mini-finstrong': 'MiniFinstrongContainer',
      networth: 'NetWorthContainer',
      net_worth: 'NetWorthContainer',
      notifications: 'NotificationsContainer',
      notifications_settings: 'NotificationSettingsContainer',
      settings: 'SettingsContainer',
      spending: 'SpendingContainer',
      spending_plan: 'SpendingPlanContainer',
      transactions: 'TransactionsContainer',
      trends: 'TrendsContainer',
    }

    if (!map[type]) {
      import('../widgets/desktop/ErrorLoading').then(Widget =>
        Widget.default ? resolve(Widget.default) : resolve(Widget),
      )
    } else if (type.includes('mini')) {
      import(`src/widgets/mini/${map[type]}`).then(Widget =>
        Widget.default ? resolve(Widget.default) : resolve(Widget),
      )
    } else {
      import(`src/widgets/desktop/${map[type]}`).then(Widget =>
        Widget.default ? resolve(Widget.default) : resolve(Widget),
      )
    }
  })
}

export default loadWidget
