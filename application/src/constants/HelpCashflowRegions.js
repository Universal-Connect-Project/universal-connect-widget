import React from 'react'

export const cashflowRegionsHelpContent = [
  {
    icon: 'calendar',
    title: 'Cash Flow Overview',
    sections: [
      {
        content: [
          {
            text:
              'The Cash Flow tab combs through your transactions to help you understand your historical spending and predict future spending. It allows you to easily identify and add recurring bills and payments, as well as one-time or annual payments such as property tax. It helps you see the impact of upcoming payments and plan ahead.',
          },
        ],
      },
      {
        subtitle: 'Data Visualization',
        content: [
          {
            text:
              'For convenient data visualization, we provide several options: a Chart (over time), a Calendar (monthly view), and a linear view of Cash Events.',

            ullist: [
              'In Online Banking: For the best viewing experience of Cash Flow “Chart” and Cash Flow “Calendar,” go to these tabs in Online Banking.',
              'In the mobile app: For the best viewing experience, we provide the “Track Spending > Cash Events” tab with a linear view of your data. To see a calendar or flow chart, go to Online Banking. Note: You may add or edit Cash Events that appear as one-time or recurring income or expenses. Any edits you make in the mobile app will also appear in Online Banking. ',
            ],
          },
        ],
      },
      {
        subtitle: 'Cash Flow',
        image_url:
          'https://content.moneydesktop.com/storage/MD_Assets/help/Cash Flow/cashflow-mainscreen-1-11-2018.png',
        content: [
          {
            text: (
              <span>
                When you first open Cash Flow, you&rsquo;ll be prompted to add regular deposits and
                payments as &ldquo;Cash Events.&rdquo; The software will make suggestions based on
                recurring transactions.
              </span>
            ),
          },
          {
            text: (
              <span>
                Select the green checkmark to accept a suggested event, or the red &ldquo;X&rdquo;
                to reject it. When you add an event, select the appropriate frequency and save.
              </span>
            ),
          },
          {
            text: (
              <span>
                When you&rsquo;re finished adding events, you&rsquo;ll be able to see currently
                available cash based on all asset accounts and an estimate of your available balance
                in the near future.
              </span>
            ),
          },
          {
            text:
              'The main screen provides a forecast visualization of the current cash available across the selected date range. It includes all checking and savings accounts.',
          },
          {
            text:
              'Hover over any point on the graph to see the income, expenses, and the ending balance for a particular day.',
          },
          {
            text:
              'To the right of the chart/calendar toggle, you can choose which accounts you want to focus on. All checking and savings accounts are included by default.',
          },
        ],
      },

      {
        subtitle: 'Cash Events',
        image_url:
          'https://content.moneydesktop.com/storage/MD_Assets/help/Cash Flow/cashflow-cashevents-1-11-2018.png',
        content: [
          {
            text:
              'Cash events are recurring or one-time events that will be represented in your Cash Flow forecast. Events can be income or expenses — but they will always include the following:',
            ullist: [
              <span key="1">
                Payee: Enter the name of the cash event, for example, &ldquo;Paycheck&rdquo; or
                &ldquo;Mortgage Payment.&rdquo;
              </span>,
              'Average Amount: Amount of the recurring transaction.',
              'Type: Specifies whether the event is income or an expense.',
              'Account: Specifies the account in which the event occurs.',
              'Frequency: Select the date and repeating schedule for the event.',
              'Category (optional): Choose the appropriate category for the transaction.',
            ],
          },
          {
            text:
              'The timeline on the right displays upcoming cash events. Paid events will have check marks, and overdue events will have a red exclamation mark.',
          },
          {
            text: <span>To add an event, click on &ldquo;Add an Event&rdquo;.</span>,
          },
          {
            text: (
              <span>
                The software will suggest recurring events that it has identified. You can also
                click &ldquo;Create your own&rdquo; to create an event from a list of past
                transactions or create an event entirely from scratch for transactions that occur
                outside the software — or for anticipated future payments.
              </span>
            ),
          },
          {
            text: 'To edit an event:',
            list: [
              'Click on the event name from the list on the right.',
              <span key="1">Click the &ldquo;...&rdquo; button.</span>,
              <span key="2">Click &ldquo;Edit Event.&rdquo;</span>,
            ],
          },
          {
            text: 'To delete an event:',
            list: [
              'Click on the event name from the list on the right.',
              <span key="3">Click the &ldquo;...&rdquo; button.</span>,
              <span key="4">Click &ldquo;Delete.&rdquo;</span>,
            ],
          },
          {
            text:
              'You have the option to delete either this and all future events or the entire series, including past events.',
          },
        ],
      },
      {
        subtitle: 'Calendar View',
        image_url:
          'https://content.moneydesktop.com/storage/MD_Assets/help/Cash Flow/cashflow-calendar-1-11-2018.png',
        content: [
          {
            text: (
              <span>
                In Online Banking, you can choose a Cash Flow Calendar view. Expenses and income are
                represented by red down arrows and green up arrows, respectively.
              </span>
            ),
          },
        ],
      },
      {
        subtitle: 'Mark as paid',
        content: [
          {
            text: (
              <span>
                The software will automatically match transactions to Cash Events when it is able,
                but you may sometimes need to do this manually. To do this, click on the appropriate
                cash event, then click &ldquo;Mark as Paid.&rdquo;
              </span>
            ),
          },
          {
            text: (
              <span>
                Click on &ldquo;Link to Transaction&rdquo; to bring up a list of recent
                transactions.
              </span>
            ),
          },
          {
            text: 'You can click on any transaction to link it to the cash event.',
          },
          {
            text:
              'By using the linking tool, you can find a specific transaction to match to the selected cash event. Linking transactions will improve forecasting over time.',
          },
        ],
      },
    ],
  },
]
