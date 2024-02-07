import React from 'react'
// Feature Flag Selector
import { goalsContent } from './HelpGoals'
import { cashflowRegionsHelpContent } from './HelpCashflowRegions'

export const SELECTED_TOPICS_OVERRIDE_CONTENT = {
  GOALS_REDESIGN: goalsContent,
  REGIONS_HELP_TEXT: cashflowRegionsHelpContent,
}

export const SELECTED_TOPICS_OVERRIDE_TYPE_MAPPING = {
  goals: 'GOALS_REDESIGN',
  cashflow: 'REGIONS_HELP_TEXT',
}

/* eslint react/jsx-key: 0 */
// there are a ton of questionable key errors here, they fail lint, but don't
// show anything in the actual browser when ran
export const HelpCategories = [
  {
    flags: ['show_accounts_widget_in_master'],
    guid: 'accounts',
    icon: 'accounts',
    title: 'Accounts',
  },
  {
    flags: ['show_transactions_widget_in_master'],
    guid: 'transactions',
    icon: 'transactions',
    title: 'Transactions',
  },
  {
    flags: ['show_spending_widget_in_master'],
    guid: 'spending',
    icon: 'spending',
    title: 'Spending',
  },
  {
    flags: ['show_budgets_widget_in_master'],
    guid: 'budgets',
    icon: 'bubbles',
    title: 'Budgets',
  },
  {
    flags: ['show_trends_widget_in_master'],
    guid: 'trends',
    icon: 'clock',
    title: 'Trends',
  },
  {
    flags: ['show_debts_widget_in_master'],
    guid: 'debts',
    icon: 'debts',
    title: 'Debts',
  },
  {
    flags: ['show_net_worth_widget_in_master'],
    guid: 'networth',
    icon: 'net-worth2',
    title: 'Net Worth',
  },
  {
    flags: ['show_goals_widget_in_master'],
    guid: 'goals',
    icon: 'pointer',
    title: 'Goals',
  },
  {
    flags: ['show_cash_flow_widget_in_master'],
    guid: 'cashflow',
    icon: 'calendar',
    title: 'Cash Flow',
  },
  {
    flags: ['show_investments_widget_in_master'],
    guid: 'investments',
    icon: 'investment',
    title: 'Investments',
  },
  {
    flags: ['show_notifications_widget_in_master'],
    guid: 'alerts',
    icon: 'envelope',
    title: 'Alerts',
  },
  {
    guid: 'general',
    icon: 'info',
    title: 'General',
  },
  {
    flags: ['display_mobile_devices_in_settings'],
    guid: 'mobile',
    icon: 'mobile-phone',
    title: 'Mobile',
  },
]

export const HelpTopics = {
  accounts: [
    {
      icon: 'accounts',
      title: 'Accounts',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Accounts/accounts-overview1-10-2018.png',
          content: [
            {
              text: (
                <span>
                  On the left, you&rsquo;ll see a column with different account types like checking,
                  savings, and credit cards. Under each type is a a total balance that includes all
                  accounts of that type, with red representing debt. On the right is a list of every
                  account you&rsquo;ve added — grouped by type — along with balances for each.
                </span>
              ),
            },
            {
              text: (
                <span>
                  Click an account type on the left column to show accounts of the corresponding
                  type on the right. If you haven&rsquo;t added any accounts of a particular type,
                  clicking on that type will prompt you to add a new account.
                </span>
              ),
            },
            {
              text:
                'Click an account on the right to view details like transactions, debit/credit history, or to edit details.',
            },
            {
              text: (
                <span>
                  Click &ldquo;Add an Account&rdquo; to connect accounts from thousands of financial
                  institutions or to create manual accounts for things like your home or other
                  property.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: 'Edit An Account',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Accounts/edit-accounts-03-07-2018.png',
          content: [
            {
              text: 'Click any account listed on the right to open the Account Details window.',
            },
            {
              text: <span>Click &ldquo;DETAILS&rdquo; to edit the account.</span>,
            },
            {
              text: 'You can edit information such as:',
              ullist: [
                'Account Name;',
                'Account Type;',
                'Interest Rate (%);',
                'Credit Limit and Original Balance (debt accounts only);',
                'Account Balance (manual accounts only);',
                'Business account toggle.',
              ],
            },
            {
              text:
                'Note that some account details may not be editable. These will appear with a lock icon to the right.',
            },
            {
              text: (
                <span>
                  Click the &ldquo;...&rdquo; button on the top right to close, hide, or to mark
                  duplicate accounts.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: 'Add an Account',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Accounts/add-account-1-10-2018.png',
          content: [
            {
              list: [
                <span>
                  Click &ldquo;Add an Account&rdquo; on the right to open the &ldquo;Add
                  Account&rdquo; window.
                </span>,
                'Search for a financial institution by its name or URL.',
                'Select the institution from the list and enter the requested login credentials, like username and password.',
                'Answer any security questions that appear.',
              ],
            },
            {
              text: (
                <span>
                  You may click &ldquo;Add a Manual Account&rdquo; to create accounts for things
                  like your home, car, or other property.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: 'Hide an account',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Accounts/hide-account-03-18-2018.png',
          content: [
            {
              text: (
                <span>
                  If you don&rsquo;t want an account to be used in features like Spending and
                  Budgets, you can choose to hide the account. This way, no information or
                  transactions from that account will be factored into other tabs. The data related
                  to that account won&rsquo;t be deleted, however, and you can easily unhide an
                  account.
                </span>
              ),
            },
            {
              text: 'To hide an account:',
            },
            {
              list: [
                <span>
                  Bring up the &ldquo;Account Details&rdquo; window for the account you wish to
                  hide.
                </span>,
                <span>
                  Click the &ldquo;...&rdquo; button on the top right and choose &ldquo;Hide
                  Account&rdquo; from the dropdown menu. A warning message will appear asking if you
                  really want to hide the account.
                </span>,
                <span>
                  Click &ldquo;Hide&rdquo; to confirm, or click &ldquo;Cancel&rdquo; if you change
                  your mind.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  Your hidden accounts will still be visible on the Accounts tab. They&rsquo;ll be
                  at the bottom of the list of accounts on the right, with their icons grayed out
                  and marked &ldquo;Hidden.&rdquo;
                </span>
              ),
            },
            {
              text: 'To unhide an account:',
            },
            {
              list: [
                <span>
                  Click on the hidden account to bring up its &ldquo;Account Details&rdquo; window.
                </span>,
                <span>
                  Click the &ldquo;Unhide&rdquo; button. Your account data will appear immediately
                  and will now be included in other features in MoneyDesktop.
                </span>,
              ],
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Trouble adding an account?',
      sections: [
        {
          content: [
            {
              text: 'Here are some tips:',
              ullist: [
                <span>
                  Different kinds of accounts may be listed separately, even when they are with the
                  same financial institution. Try scrolling down further to see these connections.
                  You may also search for a specific kind of account, i.e., &ldquo;Bank of America
                  mortgage&rdquo; as opposed to just &ldquo;Bank of America.&rdquo;
                </span>,
                <span>
                  Check that you&rsquo;re using the right username and password. Try signing in at
                  your institution&rsquo;s website to verify they are working — this may unlock a
                  frozen connection. Just make sure to sign out of your institution&rsquo;s website
                  before trying to add the account again!
                </span>,
                <span>
                  If possible, turn off complicated security preferences (such as CAPTCHA or picture
                  passwords) on your institution&rsquo;s website.
                </span>,
                <span>
                  Change the preferences on your institution&rsquo;s website to allow third-party
                  connections.
                </span>,
                <span>
                  Make sure you aren&rsquo;t logged in to your institution&rsquo;s site on another
                  tab or browser while you&rsquo;re adding an account.
                </span>,
                <span>
                  Make sure the software isn&rsquo;t waiting for your response to a security
                  question.
                </span>,
                'If a connection breaks, you may have to enter your credentials again.',
                'Recently opened accounts may take several days to appear in the software. There is no need to add these new accounts more than once.',
              ],
            },
            {
              text: (
                <span>
                  If you&rsquo;ve tried everything above, please contact us. We&rsquo;ll be happy to
                  respond as soon as we can.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: <span>Need to fix a &ldquo;broken&rdquo; account?</span>,
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  Accounts with connection problems will have a yellow exclamation mark above the
                  institution&rsquo;s logo. To address those problems:
                </span>
              ),
              list: [
                'Select the account.',
                'Follow any instructions given. You may need to update your credentials, refresh the connection, or do something else. Sometimes, you may simply need to wait a day and try again.',
              ],
            },
            {
              text: 'If problems with the account continue:',
              list: [
                <span>
                  Log in to the financial institution&rsquo;s online banking website to verify that
                  your username and password are correct.
                </span>,
                'Make sure there are no holds on the account.',
                <span>
                  Don&rsquo;t try to add the same account twice - the system does not support this.
                  Instead, you may wish to delete the institution by selecting &ldquo;Manage
                  Connections,&rdquo; then choosing the institution you want to delete (like
                  &ldquo;Chase&rdquo; or &ldquo;Wells Fargo&rdquo;), then selecting &ldquo;Delete
                  Institution.&rdquo; Note that this will delete all accounts associated with the
                  chosen financial institution. Only after doing this should you try to re-add the
                  account.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  If a connection is persistently down for more than two days, please contact us.
                  We&rsquo;re happy to help.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Seeing outdated accounts or paid-off loans?',
      sections: [
        {
          content: [
            {
              text:
                'The data available may not always indicate that an account has been closed; paid-off loans or old, unused accounts may still appear.',
            },
            {
              text: (
                <span>
                  You may choose to hide an account that you don&rsquo;t want displayed. It will
                  then appear grayed out at the bottom of your list of accounts.
                </span>
              ),
            },
            {
              text: (
                <span>
                  If you want to completely remove an outdated account, let us know. We&rsquo;ll
                  happily remove it for you.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      title: 'Seeing duplicate accounts?',
      sections: [
        {
          content: [
            {
              text:
                'Duplicate accounts may appear when existing account connections are altered, such as when a financial institution changes the way they name accounts in their system or when a lost or stolen credit card is replaced. When the account is relayed under a different name or identity than in the past, it is created as a new account. This type of duplication can be fixed by merging the accounts.',
            },
            {
              text: <span>Warning: Merging two accounts can&rsquo;t be undone.</span>,
            },
            {
              text: 'To merge duplicate accounts:',
              list: [
                'Determine which account is the original - it should have a longer transaction history than the new account.',
                <span>
                  In the &ldquo;Account Details&rdquo; view of the original account, select the
                  &ldquo;...&rdquo; button on the top right and select &ldquo;Mark as
                  Duplicate&rdquo; from the dropdown.
                </span>,
                <span>
                  Choose the duplicate account from the list of accounts that appears. A message
                  will appear warning you that merging two accounts can&rsquo;t be undone.
                </span>,
                <span>Select &ldquo;Merge.&rdquo;</span>,
                <span>
                  Type the word &ldquo;MERGE&rdquo; (in capital letters) and select
                  &ldquo;Confirm&rdquo; to complete the process.
                </span>,
              ],
            },
          ],
        },
      ],
    },
  ],
  transactions: [
    {
      icon: 'transactions',
      title: 'Transactions Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Transactions/transactionsmainfeb152019.png',
          content: [
            {
              text:
                'The Transactions tab provides a consolidated list of your recent transactions from all accounts. They are automatically cleaned and categorized to make them easier for you to review and work with.',
            },
            {
              text: (
                <span>
                  New transactions are marked with a blue dot. If an amount is green, that means
                  it&rsquo;s a credit.
                </span>
              ),
            },
            {
              ullist: [
                'Select a transaction to bring up details about a transaction, to edit details, add tags, or create a split.',
                'Recategorize a transaction by selecting the pencil icon next to the listed category. The software will learn your preferences over time.',
                'Choose which accounts to display using the dropdown list on the top left.',
                'Search through your transactions using the button on the top right.',
                <span>
                  Add a transaction (only for manual accounts) by clicking the &ldquo;+&rdquo;
                  button on the top right.
                </span>,
                'Download a list of your transactions using the download button, also on the top right.',
              ],
            },
          ],
        },
        {
          subtitle: 'Edit transactions',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Transactions/transactiondetailsfeb182019.png',
          content: [
            {
              text: (
                <span>
                  You are not limited to editing the category of a transaction. Select a transaction
                  to open the &ldquo;Transaction Details&rdquo; window, where you can:
                </span>
              ),
              ullist: [
                'Customize the payee description;',
                'Edit the date;',
                'Add tags for custom searching;',
                'Add a memo to remind yourself of details about the purchase.',
              ],
            },
            {
              text: <span>Click the &ldquo;...&rdquo; button to:</span>,
              ullist: [
                'Flag a transaction with the flag icon to call it out in the transactions list;',
                'Split a transaction between multiple categories;',
                'Exclude a transaction from your spending reports.',
              ],
            },
          ],
        },
        {
          subtitle: 'Categorizing transactions',
          content: [
            {
              text:
                'When your transactions are pulled into the software, they will be automatically categorized. We encourage you to go through your transactions history and check that each transaction is categorized correctly. If you recategorize a transaction, the app will attempt to remember your preference the next time you post a similar transaction. Customizing your transactions will make the software more accurate in the future.',
            },
            {
              text: 'To change a category:',
              list: [
                'Find the transaction you want to edit;',
                <span>
                  Select the pencil icon next to the listed category or press on the
                  category&rsquo;s name;
                </span>,
                'Select the category into which you want to put the transaction;',
                <span>
                  Alternatively, press the &ldquo;+&rdquo; button on the right to select a
                  subcategory or to create a new subcategory.
                </span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Subscriptions',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Transactions/subscriptions_aug_2019.png',
          content: [
            {
              text:
                'The subscriptions feature is an easy way to see where your money goes every month with the help of a bar that features all your recurring transactions.',
            },
            {
              text: (
                <span>
                  You&rsquo;ll see this slider bar above the list of transactions. It shows your
                  monthly recurring subscriptions. These transactions — Netflix, a gym membership,
                  fruit-of-the-month club, whatever — will automatically be classified as
                  subscriptions and appear in the slider.
                </span>
              ),
            },
            {
              text:
                'If a subscription charge is predicted to occur within the next two weeks, it will appear individually in the slider bar. If it is due more than two weeks out, it will be grouped with all the subscriptions in a box on the right side of the slider bar. A static box on the left side of the slider bar shows uncategorized transactions.',
            },
            {
              text: 'To view your upcoming subscriptions:',
              list: ['Click the left or right arrow on either side of the slider.'],
            },
            {
              text: 'To view the details of a subscription:',
              list: [
                <span>
                  Click a subscription. You&rsquo;ll see information about how often you are
                  charged, which of your accounts the subscription is connected to, and the yearly
                  cost.
                </span>,
                <span>
                  Click &ldquo;More Details&rdquo; at the bottom to see the last payment date and
                  category of the subscription.
                </span>,
              ],
            },
            {
              text: 'To view all your subscriptions:',
              list: [
                <span>
                  Click the &ldquo;View All&rdquo; box on the right end of the slider bar.
                </span>,
                <span>Click an individual subscription to bring up more details.</span>,
              ],
            },
            {
              text:
                'This at-a-glance view makes it simple to understand where money is going, so you can decide whether to make changes, if necessary.',
            },
          ],
        },
        {
          subtitle: 'Transaction rules',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Transactions/categorizeallfeb152019.png',
          content: [
            {
              text: (
                <span>
                  Recategorizing dozens of transactions can be a bit time consuming. Fortunately,
                  you can create transaction rules to make this much easier. These rules will
                  automatically place all similar transactions — both past and future — into the
                  category of your choice.
                </span>
              ),
            },
            {
              text: 'To create a transaction rule:',
              list: [
                <span>
                  Manually categorize a transaction. When you categorize something, you'll see a
                  message asking if you'd like to put <i>all</i> similar transactions into the same
                  category.
                </span>,
                <span>
                  Click &ldquo;Yes. Apply to all.&rdquo; to create the new transaction rule.
                </span>,
              ],
            },
            {
              text: 'You can also edit or delete transaction rules.',
            },
            {
              text: 'To edit a transaction rule:',
              list: [
                <span>Click the &ldquo;Settings&rdquo; tab.</span>,
                <span>
                  Click the &ldquo;Transaction Rules&rdquo; tab. You&rsquo;ll see a list of the
                  rules you have created, named according to the payee.
                </span>,
                <span>Click a transaction rule.</span>,
                <span>Edit the payee or choose a new category.</span>,
                <span>
                  Click &ldquo;Save,&rdquo; or click &ldquo;Cancel&rdquo; if you change your mind.
                </span>,
              ],
            },
            {
              text: 'To delete a transaction rule:',
              list: [
                <span>Click the &ldquo;Settings&rdquo; tab.</span>,
                <span>
                  Click the &ldquo;Transaction Rules&rdquo; tab. You&rsquo;ll see a list of the
                  rules you have created, named according to the payee.
                </span>,
                <span>Click a transaction rule.</span>,
                <span>Click the trash can icon on the top right.</span>,
                <span>
                  Click &ldquo;Delete,&rdquo; or click &ldquo;Cancel&rdquo; if you change your mind.
                </span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Splitting transactions',
          content: [
            {
              text:
                'Some transactions encompass multiple categories in a single purchase. This is particularly common at big box stores like Costco or Walmart where you might buy groceries, home supplies, and a DVD all in one purchase. You can split a transaction between as many categories as needed to accurately account for your spending.',
            },
            {
              text: 'To split a transaction:',
              list: [
                <span>
                  Select the transaction to open the &ldquo;Transaction Details&rdquo; window;
                </span>,
                <span>
                  Press the &ldquo;...&rdquo; button on the top right to view additional options;
                </span>,
                <span>Select &ldquo;Split&rdquo;;</span>,
                'Enter the amount, category, tags, and flags for each line of the split;',
                <span>Select &ldquo;Save&rdquo; to confirm your changes.</span>,
              ],
            },
            {
              text: 'To delete a split:',
              ullist: [
                <span>
                  Select any line of the split transaction to open the &ldquo;Transaction
                  Details&rdquo; window;
                </span>,
                'Press the trash can icon to reunite all splits into a single transaction;',
                <span>Click &ldquo;Delete&rdquo; to confirm.</span>,
              ],
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Why am I seeing duplicate transactions?',
      flags: [],
      sections: [
        {
          content: [
            {
              text: 'There are a few reasons you might see duplicate transactions:',
            },
            {
              text:
                '1. One or more of your accounts may have been added twice. If you see the same account more than once under the Accounts tab, you can merge them with the following steps:',
              list: [
                'Determine which account is the original; it should have a longer transaction history than the new account.',
                <span>
                  In the &ldquo;Account Details&rdquo; view of the original account, select the
                  &ldquo;...&rdquo; button and choose &ldquo;Mark as Duplicate&rdquo; from the
                  dropdown.
                </span>,
                <span>
                  Select the duplicate account from the list of accounts that appears. A message
                  will appear warning you that merging two accounts into one can&rsquo;t be undone.
                </span>,
                <span>Select &ldquo;Merge.&rdquo;</span>,
                <span>
                  Type the word &ldquo;MERGE&rdquo; (in capital letters) and select
                  &ldquo;Confirm&rdquo; to complete the process.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  2. You may be seeing both the debit and the credit side of a single transfer.
                  Transactions categorized as transfers don&rsquo;t show up in your spending wheel
                  or budgets because they don&rsquo;t represent an increase or decrease in assets.
                </span>
              ),
            },
            {
              text: (
                <span>
                  3. Your institution may be duplicating certain transactions as it passes data to
                  the software. Contact us, and we&rsquo;ll try to resolve the issue.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Why am I missing some transactions?',
      flags: [],
      sections: [
        {
          content: [
            {
              text:
                'There are several reasons you might not see the transactions you expect to see.',
              list: [
                'Recent transactions (i.e., transactions less than about four days old) may not show up in the software. It may take several days for some transactions to be imported or to move from pending to posted.',
                'If you just started using the software, you might not see all your transactions. The software usually pulls in only about the last 90 days of your transaction history during your first login.',
                <span>
                  If it&rsquo;s been more than 30 days since you logged in, some transactions may
                  not show up, so we recommend using the software at least that often. After you
                  first set things up, the software generally only pulls in between 30 and 45 days
                  of your transaction history each time you log in.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  If the above reasons don&rsquo;t match your experience, let us know by contacting
                  support. We&rsquo;re happy to help.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'How do pending transactions work?',
      flags: [],
      sections: [
        {
          content: [
            {
              text:
                'Pending transactions may appear on your account, but they have not yet been fully posted or confirmed by your financial institution. They are visible at the top of the transaction list in italics. Pending transactions are editable, but changes will not be saved when the transaction moves from pending to posted.',
            },
            {
              text:
                'Note that the date, description, or even amount of a pending transaction may change when it fully posts.',
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'What is a business tag?',
      flags: [],
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  Transaction tags allow you to put your own searchable, custom label on any
                  transaction. You can create any tag you like, but there is only one default tag:
                  &ldquo;Business.&rdquo; The business tag may be applied to any transaction that is
                  related to your business enterprise. It&rsquo;s there to make it easier to keep
                  business and personal expenses separate. You can even set up an account to
                  automatically mark every transaction with the business tag.
                </span>
              ),
            },
            {
              text: 'To add a business tag to a single transaction:',
              list: [
                'Locate the transaction you want to tag and select it.',
                <span>Press the &ldquo;+&rdquo; button next to &ldquo;Tags.&rdquo;</span>,
                <span>
                  Select &ldquo;Business&rdquo; from the list labeled &ldquo;Your Tags.&rdquo; A
                  check mark should appear to the right.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  The tag will now appear on the &ldquo;Transaction Details&rdquo; window, and you
                  can display all transactions with this tag by searching for
                  &ldquo;Business.&rdquo;
                </span>
              ),
            },
            {
              text: 'To mark an entire account as business:',
              list: [
                'Locate the account under the Accounts tab.',
                <span>
                  Select the account to bring up the &ldquo;Account Details&rdquo; window.
                </span>,
                <span>Select the &ldquo;DETAILS&rdquo; tab.</span>,
                <span>Press the button labeled &ldquo;Business.&rdquo;</span>,
              ],
            },
            {
              text:
                'Every transaction for that account will now have the business tag automatically applied to it.',
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Can I export my transactions?',
      flags: [],
      sections: [
        {
          content: [
            {
              text:
                'The software allows you to export transactions as a CSV file that can be used with many different applications, including most accounting software. The exported file includes all transaction details.',
            },
            {
              text: 'To export transactions to a CSV file:',
              list: [
                'On the Transactions tab, filter your transactions to the set you wish to export.',
                'Click the export icon on the top right.',
                'Specify where you wish to save the file, name it, and save.',
              ],
            },
          ],
        },
      ],
    },
  ],
  spending: [
    {
      icon: 'spending',
      title: 'Spending Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/SpendingWheel/spending-wheel-03-07-2018.png',
          content: [
            {
              text:
                'The Spending tab shows you where your money is going, by category, so you can better understand your spending habits and stay on track.',
            },
            {
              text: (
                <span>
                  Click on the &ldquo;Account(s)&rdquo; dropdown on the top left to choose which
                  accounts to include in the spending wheel.
                </span>
              ),
            },
            {
              text: (
                <span>
                  Click on a section of the wheel to see how much you spent in each category. If
                  your spending in a category is below 3% of your overall spending, it will be
                  grouped in &ldquo;Other&rdquo; with other low-spending categories.
                </span>
              ),
            },
            {
              text:
                'Click on any category to see a breakdown of spending by subcategory, such as how much of your spending in Food & Dining is on groceries versus eating out.',
            },
            {
              text:
                'Click on any subcategory, or on the center of the spending wheel, to see the transactions associated with the selected subcategory. From this view, you can also edit the transaction details just like in the main transactions widget.',
            },
            {
              text: 'You have multiple options for adjusting the date range:',
              ullist: [
                'Use the back and forward arrows to navigate through time;',
                'Use the dropdown arrow to select from a list of preset date range options;',
                'Use the dropdown arrow to open the calendar view to select a custom date range.',
              ],
            },
            {
              text: (
                <span>
                  To view your income, click on &ldquo;Income&rdquo; on the top right. As with
                  spending, you can click on an income category to view your income by subcategory,
                  and drill down to the transaction level if desired.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: <span>Why can&rsquo;t I see all my spending categories?</span>,
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  The Spending wheel gives you a quick, easy-to-understand view of your overall
                  spending. In order to keep things simple, we put low-spending categories in a
                  catch-all group called &ldquo;Other.&rdquo; Any spending category that represents
                  less than 3% of your total spending will be placed in &ldquo;Other.&rdquo;
                  &ldquo;Other&rdquo; spending can be identified by its gray color on the spending
                  wheel.
                </span>
              ),
            },
            {
              text: (
                <span>
                  If you can&rsquo;t find a category and you&rsquo;re sure you spent money on it,
                  check the &ldquo;Other&rdquo; group.
                </span>
              ),
            },
            {
              text:
                'You should also be sure that your transactions were categorized correctly. The system does an exceptional job of categorizing things automatically, but it will make mistakes from time to time. Make sure to periodically go through your transactions and recategorize anything that appears to be incorrect. The system will learn your preferences as you manually recategorize things and will get better at making automatic decisions over time.',
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Why does one of my spending categories seem off?',
      sections: [
        {
          content: [
            {
              text:
                'If a spending category seems inaccurate to you, be sure that your transactions were all categorized correctly. The system does an exceptional job of categorizing things automatically, but it will make mistakes from time to time. Make sure to periodically go through your transactions and recategorize anything that appears to be incorrect. The system will learn your preferences as you manually recategorize things and will get better at making automatic decisions over time.',
            },
            {
              text:
                'Also remember that certain credit transactions (for instance, reimbursements) will be counted in your spending wheel, rather than the income wheel.',
            },
          ],
        },
      ],
    },
  ],
  budgets: [
    {
      icon: 'bubbles',
      title: 'Budgets Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Budgets/budgets_zero_state_jan_2019.png',
          content: [
            {
              text:
                'Budgets can help you set realistic monthly spending limits and avoid exceeding those limits. The Budgets tab draws your eye to the areas that need your attention the most: big bubbles represent a larger portion of your monthly budget, and red bubbles have exceeded their monthly allowance.',
            },
            {
              text: 'When you first use Budgets, you have two options:',
              ullist: [
                <span>
                  Click &ldquo;Auto-Generate Budgets&rdquo; to let the software budget for you, or;
                </span>,
                <span>Click &ldquo;Start from Scratch&rdquo; to create your own budgets.</span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Auto-generate budgets',
          content: [
            {
              text:
                'We encourage you to use the auto-generate budgets feature; it will create budgets based on your average spending in each category over the last two months for which there are complete data.',
            },
            {
              text: (
                <span>
                  <i>
                    &nbsp;&nbsp;&nbsp;&nbsp;Note: The auto-generate feature will be more helpful if
                    you have first added all your accounts and accurately categorized your
                    transactions.
                  </i>
                </span>
              ),
            },
            {
              text:
                'Review your generated budgets and adjust them if necessary. You can decide which categories you do and do not want included. If a category was added during auto-generation that you do not want in your budget, you can delete it.',
            },
            {
              text:
                'You may also automatically recalculate your budgets at any time, or delete all your budgets to start from scratch again.',
            },
          ],
        },
        {
          subtitle: 'Starting from scratch',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Budgets/budgets_start_from_scratch_jan_2019.png',
          content: [
            {
              text:
                'If you choose to start from scratch, the software will present a list of spending categories.',
            },
            {
              text: 'To create budgets from scratch:',
              list: [
                <span>
                  Select the &ldquo;+&rdquo; to the right of a category to create a budget for it. A
                  window will appear with a suggested amount for that category.
                </span>,
                <span>
                  Enter the amount you&rsquo;d like to allocate for that category, or simply leave
                  the suggested amount as-is.
                </span>,
                <span>
                  Click &ldquo;Save&rdquo; to create the budget for that category or
                  &ldquo;Cancel&rdquo; if you change your mind.
                </span>,
                'Repeat the steps above for all other desired categories.',
              ],
            },
          ],
        },
        {
          subtitle: 'Recalculate budgets',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Budgets/budgets_recalculate_jan_2019.png',
          content: [
            {
              text:
                'If your budgets seem a bit off or you want to take advantage of automatically created budgets, you can use the recalculate feature. In order to make these budgets as accurate as possible, recalculation is based on the last two months for which complete data are available.',
            },
            {
              text: 'To recalculate your budgets:',
              list: [
                <span>
                  Click on the &ldquo;Add New Budget&rdquo; link on the top right of the budgets
                  window.
                </span>,
                'Scroll to the bottom of the list that appears.',
                <span>
                  Click on &ldquo;Recalculate Budgets.&rdquo; You&rsquo;ll see a preview of each
                  newly created budget next to the previous budget amount.
                </span>,
                <span>
                  Click &ldquo;Save&rdquo; if you&rsquo;d like to keep these budgets. Click
                  &ldquo;Undo&rdquo; if you change your mind.
                </span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Viewing your budgets',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Budgets/Budgets_main_jan_2019.png',
          content: [
            {
              text: (
                <span>
                  Once you&rsquo;ve set up your budgets, you can view and edit them from the main
                  budgets screen where each budget is represented by colorful bubble. Each budget is
                  also available in a list view. By default, you&rsquo;ll see bubble budgets.
                </span>
              ),
            },
            {
              text: (
                <span>
                  The benefit of bubble budgets is that they allow you to see both the health and
                  the impact of your budget categories quickly. The larger the bubble, the more of
                  your income it takes up.
                </span>
              ),
            },
            {
              text: (
                <span>
                  For both views, the color of each budget indicates whether you are on track,
                  nearing your budget limit, or over limit:
                </span>
              ),
              ullist: ['Green: below 80%;', 'Yellow: between 80-100%;', 'Red: over 100%.'],
            },
            {
              text: 'To view details and transactions for a particular budget:',
              list: [
                'Click on your desired budget to bring up the budget details window.',
                <span>
                  Click on &ldquo;Transactions&rdquo; to bring up a list of transactions in that
                  category for the current month.
                </span>,
              ],
            },
          ],
        },
        {
          subtitle: 'List view',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Budgets/budgets_list_open_jan_2019.png',
          content: [
            {
              text: (
                <span>
                  The list view allows you to quickly navigate between budgets and sub-budgets to
                  help you get a clear idea of where your money is going. It is especially helpful
                  if you use a screen reader to navigate the software.
                </span>
              ),
            },
            {
              text: (
                <span>
                  Depending on the specific implementation of the software, the list view may appear
                  in several places: on the right side next to the bubble budgets, below the bubble
                  budgets, or hidden below the bubble budgets.
                </span>
              ),
            },
            {
              text: (
                <span>
                  If the list view is hidden, a list view button will appear on the bottom right.
                </span>
              ),
            },
            {
              text: <span>To bring up a hidden list view:</span>,
              list: [
                <span>
                  Click the list view icon on the bottom right. The list of budgets will rise up,
                  and the list icon will change to an &ldquo;X&rdquo;.
                </span>,
                <span>Click the &ldquo;X,&rdquo; to hide the list.</span>,
              ],
            },
            {
              text: (
                <span>
                  To view details, transactions, and sub-budgets for a category in list view:
                </span>
              ),
              list: [
                <span>Click on a main budget category.</span>,
                <span>
                  If you&rsquo;re looking for a sub-budget, click your desired sub-budget on the
                  details window.
                </span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Editing budgets',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Budgets/budgets_edit_budget_jan_2019.png',
          content: [
            {
              text:
                'You can change budget amounts, create new budgets, create sub-budgets within the main budget, create custom sub-budgets, and delete budgets.',
            },
            {
              text: (
                <span>
                  <i>
                    &nbsp;&nbsp;&nbsp;&nbsp;Note: If you increase a sub-budget to an amount greater
                    than the main budget, the main budget amount will automatically increase.
                    However, deleting or reducing a sub-budget will not affect the main budget.
                  </i>
                </span>
              ),
            },
            {
              text: <span>To change a budget&rsquo;s amount:</span>,
              list: [
                <span>
                  Click on your desired budget or sub-budget whether represented as a bubble or on
                  the list.
                </span>,
                <span>Click &ldquo;Edit Budget.&rdquo;</span>,
                <span>
                  Enter your desired budget amount. You&rsquo;ll see your available unbudgeted funds
                  above the budget amount.
                </span>,
                <span>
                  Click &ldquo;Save,&rdquo; or click &ldquo;Cancel&rdquo; if you change your mind.
                </span>,
              ],
            },
            {
              text: 'To create a sub-budget:',
              list: [
                <span>
                  Click on your chosen main budget to bring up the budget details window.
                </span>,
                <span>Click on &ldquo;Add a new Sub-Budget.&rdquo;</span>,
                <span>
                  Select your desired sub-budget from the list that appears; the sub-budget will
                  automatically be given an amount based on past spending.
                </span>,
              ],
            },
            {
              text: <span>Alternatively, you may create a custom sub-budget:</span>,
              list: [
                <span>
                  Click on your chosen main budget to bring up the budget details window.
                </span>,
                <span>Click on &ldquo;Add a new Sub-Budget.&rdquo;</span>,
                <span>
                  Select your desired sub-budget from the list that appears; the sub-budget will
                  automatically be given an amount based on past spending.
                </span>,
                <span>Click &ldquo;Add a Sub-category.&rdquo;</span>,
                <span>Enter a new name for the sub-budget.</span>,
                <span>Click &ldquo;Add.&rdquo;</span>,
              ],
            },
            {
              text: 'To delete a budget',
              list: [
                <span>Click on the budget to open the details window.</span>,
                <span>Click on &ldquo;Edit Budget.&rdquo;</span>,
                <span>Click &ldquo;Delete [budget name].&rdquo;</span>,
                <span>Click &ldquo;Delete&rdquo; again to confirm.</span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Projected income',
          content: [
            {
              text: (
                <span>
                  You can also view and edit your projected income within budgets. The projected
                  income helps you make budget decisions that fit within your income. Projected
                  income is calculated based on your past transaction history. You can edit this
                  number manually, however.
                </span>
              ),
            },
            {
              text: <span>Your projected income appears wherever the budget list appears.</span>,
            },
            {
              text: 'To edit projected income:',
              list: [
                <span>Click on the pencil icon below the green projected income.</span>,
                <span>Enter a new amount.</span>,
                <span>Click &ldquo;Save.&rdquo;</span>,
              ],
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Can I adjust my projected income?',
      sections: [
        {
          content: [
            {
              text:
                'The software will automatically calculate your projected income based on previous deposits into your connected accounts. If this calculation is incorrect, however, you can manually adjust your projected income.',
            },
            {
              text: <span>Your projected income appears wherever the budget list appears.</span>,
            },
            {
              text: 'To edit projected income:',
              list: [
                <span>Click on the pencil icon below the green projected income.</span>,
                <span>Enter a new amount.</span>,
                <span>Click &ldquo;Save.&rdquo;</span>,
              ],
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Can I create my own custom budget categories?',
      sections: [
        {
          content: [
            {
              text:
                'The software provides more than 100 default categories to help you budget effectively and track your spending.',
            },
            {
              text:
                'You can create as many subcategories as you like, but creating new top-level categories is not supported.',
            },
            {
              text: (
                <span>
                  For example, if you&rsquo;re learning how to bake, you may wish to create a custom
                  subcategory called &ldquo;Baking&rdquo; within a top-level category such as
                  &ldquo;Food & Dining,&rdquo; &ldquo;Hobbies,&rdquo; or &ldquo;Shopping.&rdquo; You
                  can put the new subcategory in whichever top-level category makes sense to you.
                </span>
              ),
            },
            {
              text: (
                <span>
                  You may not, however, create a new top-level category called &ldquo;Baking,&rdquo;
                  and then create subcategories for flour, pans, sugar, etc.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'How do I see my transactions within a specific budget?',
      sections: [
        {
          content: [
            {
              text:
                'In addition to tracking overall budgets and sub-budgets, you can view individual transactions within each budget.',
            },
            {
              text: 'To view details and transactions for a particular budget:',
              list: [
                'Click on your desired budget to bring up the budget details window.',
                <span>
                  Click on &ldquo;Transactions&rdquo; to bring up a list of transactions in that
                  category for the current month.
                </span>,
              ],
            },
          ],
        },
      ],
    },
  ],
  trends: [
    {
      icon: 'clock',
      title: 'Trends Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Trends/trends-overview-1-10-2018.png',
          content: [
            {
              text: (
                <span>
                  It&rsquo;s tough to know what to do with your money right now if you don&rsquo;t
                  know where you&rsquo;ve been and where you&rsquo;re going. The Trends tab can help
                  you with that.
                </span>
              ),
            },
            {
              text: (
                <span>
                  The Trends tab charts both your income and spending in every category over the
                  last 3, 6, 9, or 12 months, all in one simple visualization. In just a few
                  moments, you&rsquo;ll be able to see if you&rsquo;re living within your means and
                  identify areas you need to work on.
                </span>
              ),
            },
            {
              text:
                'The vertical axis represents your spending in dollars. The horizontal axis is a timeline. The black line represents your income.',
            },
            {
              text:
                'Each category is represented by a colorful section of the graph, with categories stacked on top of each other. The height of each colorful section represents the amount you spent that month. With all the categories stacked, you can easily see how much you spent overall.',
            },
            {
              text:
                'If you need more details about a specific category or specific month, they are just a few clicks away:',
              ullist: [
                'Hover over any category to see your spending history in that category.',
                'Hover over any dot on the chart to see how much you spent in that category that month.',
                'Click on any category to bring up a breakdown of your spending by subcategory. Click on a subcategory to see information about that subcategory by itself.',
                'Click on any dot on the chart to bring up a list of transactions in a category or subcategory for that month.',
              ],
            },
          ],
        },
        {
          subtitle: 'List view',
          content: [
            {
              text:
                'In addition to the chart, you also have a list view which displays the same data. This can be helpful for those who use screen readers to interact with their computer or for those who prefer to see raw data.',
              list: [
                'Click the list button on the top left to access the list view.',
                'Click a category on the left to see a list of subcategories.',
                'Click a figure on the right to bring up a list of transactions.',
              ],
            },
          ],
        },
      ],
    },
  ],
  debts: [
    {
      icon: 'debts',
      title: 'Debts Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Debts/debts-overview-1-10-2018.png',
          content: [
            {
              text: (
                <span>
                  The Debts tab is a powerful tool that allows you to see all of your debts in one
                  place and create an expedited payoff plan. The Debts tab teaches you how to use
                  the snowball method, a debt-payment strategy that can dramatically reduce both the
                  time it takes to pay off debt and the amount of interest you&rsquo;ll pay.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: 'The snowball method',
          content: [
            {
              text:
                'The snowball method is a common debt-reduction strategy. It allows you to pay debts off faster without increasing your monthly contribution toward debt.',
            },
            {
              text: (
                <span>
                  To use the snowball method, you should &ldquo;roll over&rdquo; your monthly
                  minimum payments as each debt is fully repaid. In other words, when you&rsquo;re
                  done paying off a debt, you&rsquo;ll take the monthly contribution to that debt
                  and put it toward another. The total amount you pay each month stays the same, but
                  the monthly contribution to each debt goes up progressively as they are paid off.
                  This can help users get out of debt without the need for painful budget cuts.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: 'Debt priority options',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Debts/debt-priority-06292918.png',
          content: [
            {
              text:
                'We recommend prioritizing your debts for the fastest possible payoff. However, there are four built-in prioritization options that you can choose from, based on your particular situation.',
              ullist: [
                'Fastest payoff first: Debts are ordered by which debt you will pay off soonest, based on balance, APR, and minimum payment. This ordering is considered the standard snowball method.',
                <span>
                  Highest interest first: Debts are ordered from the highest APR to the lowest APR.
                  This ordering is often referred to as the &ldquo;avalanche method&rdquo;; it can
                  save you more money over the life of the debt.
                </span>,
                'Lowest balance first: Debts are ordered by balance from lowest to highest.',
                'Highest balance first: Debts are ordered by balance from highest to lowest.',
              ],
            },
            {
              text: 'To change your debt priorities:',
              list: [
                'Select the dropdown menu on the top left.',
                'Select one of the four available options. The chart and all associated calculations will automatically update.',
              ],
            },
          ],
        },
        {
          subtitle: 'Debt chart',
          content: [
            {
              text: (
                <span>
                  On the main Debts window, you&rsquo;ll see a colorful chart and a timeline with a
                  list of your debt accounts below. The dotted line on the chart represents the
                  status quo, i.e., the time it will take to get out of debt by making minimum
                  payments without the snowball method.
                </span>
              ),
            },
            {
              text: (
                <span>
                  The colorful chart represents the expedited payoff for each debt which you can
                  achieve by using the snowball method and by paying more than the minimum. To the
                  right, you&rsquo;ll see an estimated payoff date, as well as an estimate of the
                  amount you&rsquo;ll save.
                </span>
              ),
            },
            {
              text: 'To see your estimated total debt at a future date:',
              ullist: ['Hover the mouse over a date on the timeline.'],
            },
          ],
        },
        {
          subtitle: 'Debt list',
          content: [
            {
              text: (
                <span>
                  On the bottom of the main screen you&rsquo;ll see a list of all your debts,
                  ordered by their priority. They are numbered and color-coded to match the chart
                  above. To the right, you&rsquo;ll see the balance, interest rate, estimated final
                  payment date, and minimum payment amount for each debt.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: 'Debt details',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Debts/debt-details-06192018.png',
          content: [
            {
              text: 'To view more details about a particular debt:',
              ullist: ['Click on a debt in the list.'],
            },
            {
              text: (
                <span>
                  Under the tab labeled &ldquo;SCHEDULE,&rdquo; you&rsquo;ll see a list of future
                  payment dates. For each date, there is an associated payment amount which is then
                  broken down by principal and interest. The projected balance is on the right. If
                  you don&rsquo;t see these details, you may need to manually enter information like
                  minimum payments and due dates.
                </span>
              ),
            },
            {
              text:
                'As you scroll through the future payment dates, you may see the payment amounts start to increase. This is a reflection of the snowball method at work.',
            },
            {
              text: 'To view or update your minimum payment or interest rate:',
              list: [
                'Select a debt from the debt list.',
                <span>Click the tab labeled &ldquo;DETAILS.&rdquo;</span>,
                'Click the figure for monthly payment or interest rate and enter a new number.',
              ],
            },
          ],
        },
        {
          subtitle: 'Hide from chart',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Debts/hide-debt-06192018.png',
          content: [
            {
              text:
                'Any account can be hidden from the Debts chart without being excluded from other reports. This is helpful for customizing the chart to reflect your specific debt-reduction goals. For example, a credit card that is paid off in full each month may not need to be included in the chart.',
            },
            {
              text: 'To hide an account from Debts:',
              list: [
                'Click on an account below the chart to open the details window.',
                <span>Click the &ldquo;...&rdquo; button on the top right.</span>,
                <span>Click &ldquo;Hide from debts.&rdquo;</span>,
              ],
            },
            {
              text:
                'The account will be moved to the end of the list, grayed out, and will not be calculated in the chart.',
            },
            {
              text: 'To re-include a debt:',
              list: [
                'Click on the hidden account at the bottom of the Debts list.',
                <span>Click &ldquo;Include Account.&rdquo;</span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Extra payment toward debt',
          content: [
            {
              text: 'If you want to see what will happen when you put more money toward your debt:',
              list: [
                <span>Click on &ldquo;Total Monthly Paydown.&rdquo;</span>,
                <span>
                  Enter in an additional amount in the &ldquo;Extra Payment Toward Debt&rdquo; box.
                  The graph will readjust and show you how much you could save by putting extra
                  money toward your debt.
                </span>,
              ],
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: 'How do I edit the APR or minimum payment of a debt?',
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  With some accounts, the APR and minimum payment of a debt may automatically
                  appear. If they don&rsquo;t, you can set them manually.
                </span>
              ),
            },
            {
              text: 'To view or update your minimum payment or interest rate:',
              list: [
                'Select a debt from the debts list.',
                <span>Click the tab labeled &ldquo;DETAILS.&rdquo;</span>,
                'Click the figure for monthly payment or interest rate and enter a new number.',
              ],
            },
          ],
        },
      ],
    },
  ],
  networth: [
    {
      icon: 'net-worth2',
      title: 'Net Worth Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Net Worth/ReactNetWorth.png',
          content: [
            {
              text:
                'The Net Worth tab tracks the sum of all your assets and liabilities. Property accounts can be added manually on the Accounts tab to make sure key assets — such as the value of your home or vehicle — are counted.',
            },
            {
              text:
                'You can choose to view the past 6, 9, or 12 months of net-worth history. If you just started using the software, you may not have accumulated enough data to to get an accurate historical picture of your net worth; however, the software will continue to save transaction data moving forward.',
            },
            {
              text: 'Each dot on the graph represents your net worth during a specific month.',
            },
          ],
        },
        {
          subtitle: 'Gains & Losses',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Net Worth/ReactNetWorthGainsAndLosses.png',
          content: [
            {
              text: 'To see details about your net worth during a specific month:',
            },
            {
              list: [
                'Click on a circle to see how your net worth increased or decreased.',
                'Click on the same circle again to bring up a list of gains and losses. A window will appear showing the gains and losses within each account during that month.',
              ],
            },
            {
              text:
                'Gains: When an asset increases in value or a liability decreases in value, your net worth will go up. For example, putting money in savings or making a car payment.',
            },
            {
              text:
                'Losses: When an asset decreases in value or a liability increases in value, your net worth will go down. For example, pulling money out of savings or spending more on a credit card than you can immediately pay off.',
            },
          ],
        },
        {
          subtitle: 'Assets & Liabilities',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Net Worth/ReactNetWorthAssetsAndLiabilities.png',
          content: [
            {
              text:
                'You can also use Net Worth to keep track of your total assets and liabilities displayed as a list by account type.',
            },
            {
              text: 'To view your assets and liabilities:',
            },
            {
              list: [
                <span>
                  Click &ldquo;Assets & Liabilities&rdquo; at the top to view these figures.
                </span>,
                'Click on an account type to view individual accounts. A window will appear showing the assets and liabilities within each account during that month.',
              ],
            },
            {
              text:
                'Assets: Positive values that count toward your net worth, such as money in checking accounts, the value of your home, etc.',
            },
            {
              text:
                'Liabilities: Negative values that count against your net worth, such as credit card debt, loans, or a mortgage.',
            },
          ],
        },
      ],
    },
  ],
  goals: goalsContent,
  cashflow: [
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
          subtitle: 'Main Screen',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Cash Flow/cashflow-mainscreen-1-11-2018.png',
          content: [
            {
              text: (
                <span>
                  When you first open Cash Flow, you&rsquo;ll be prompted to add regular deposits
                  and payments as &ldquo;Cash Events.&rdquo; The software will make suggestions
                  based on recurring transactions.
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
                  available cash based on all asset accounts and an estimate of your available
                  balance in the near future.
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
                <span>
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
              text: (
                <span>
                  To add an event, click on &ldquo;Add an Event&rdquo; in the top right corner.
                </span>
              ),
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
                <span>Click the &ldquo;...&rdquo; button.</span>,
                <span>Click &ldquo;Edit Event.&rdquo;</span>,
              ],
            },
            {
              text: 'To delete an event:',
              list: [
                'Click on the event name from the list on the right.',
                <span>Click the &ldquo;...&rdquo; button.</span>,
                <span>Click &ldquo;Delete.&rdquo;</span>,
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
                  On the top left of Cash Flow&rsquo;s main screen, you can choose a calendar view.
                  Expenses and income are represented by red down arrows and green up arrows,
                  respectively.
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
                  but you may sometimes need to do this manually. To do this, click on the
                  appropriate cash event, then click &ldquo;Mark as Paid.&rdquo;
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
  ],
  investments: [
    {
      icon: 'investment',
      title: 'Investments Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Investments/investments_main_dec_2018.png',
          content: [
            {
              text: (
                <span>
                  Whether you&rsquo;ve just got a 401(k) or you hold an extensive investment
                  portfolio, the Investments tab can help you track and analyze your portfolio
                  performance, adjust your strategy, and determine your allocation.
                </span>
              ),
            },
            {
              text: (
                <span>
                  You&rsquo;ll be able to quickly get a read on your total investment value and your
                  gains and losses. If you need more detailed information about a specific account
                  &mdash; or even a specific holding &mdash; you can dive in deeper with just a few
                  clicks.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: <span>But isn&rsquo;t investing hard? And risky?</span>,
          content: [
            {
              text: (
                <span>
                  For those new to investing, there can be a bit of a learning curve. Stocks versus
                  bonds? Cost basis? Convertible stocks? There are definitely a few things to learn,
                  but it&rsquo;s nothing to be afraid of. We&rsquo;ve designed the Investments tab
                  to be quite simple, and this guide will give you a primer on what you need to know
                  to use the tool.
                </span>
              ),
            },
            {
              text: (
                <span>
                  While there is some risk involved in investing, it&rsquo;s important to remember
                  that not investing your money is actually quite risky. Money that is just sitting
                  under your mattress &mdash; or even sitting in a standard savings account &mdash;
                  actually loses value over time.
                </span>
              ),
            },
            {
              text: (
                <span>
                  It&rsquo;s called <i>inflation</i>. A dollar today can buy fewer things than a
                  dollar could last year: In fact, your money will lose anywhere between 2% and 6%
                  of its value every year, and sometimes much more. Ask your grandparents how much
                  it cost to go out for dinner 40 years ago and you&rsquo;ll see inflation at work.
                </span>
              ),
            },
            {
              text: (
                <span>
                  Investing your money properly not only protects it from inflation, it actually
                  makes you more money than you had before, sometimes quite a bit more. It&rsquo;s
                  important to take a long-term view when investing; there will always be ups and
                  downs, but over the long term there will almost certainly be more ups.
                </span>
              ),
            },
            {
              text: (
                <span>
                  In fact, the average 20-year rolling return on investments in the stock market is
                  more than 11%. Some investments are safer than others, to be sure, and there is
                  always the risk of an economic downturn or a company going broke, but when you
                  look at things in terms of decades rather than days or weeks, you&rsquo;ll see
                  that investing your money is actually a very good idea. And sometimes an
                  aggressive &ldquo;risky&rdquo; strategy is actually the right move.
                </span>
              ),
            },
            {
              text: (
                <span>
                  A key tool for keeping your investments going over the long term is diversity
                  &mdash; in other words, investing in lots of different ways, with lots of
                  different investment types, in lots of different industries, etc.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: <span>Investment details</span>,
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Investments/investment_details_dec_2018.png',
          content: [
            {
              text: (
                <span>
                  The default Investments window is called &ldquo;Details.&rdquo; Here, you&rsquo;ll
                  see a list of the investment accounts you&rsquo;ve added to the software. Above,
                  you&rsquo;ll see the total value of all your investments. To the right,
                  you&rsquo;ll see the value of each individual account, as well as the gain or loss
                  on that account based on the cost basis.
                </span>
              ),
            },
            {
              text: (
                <span>
                  A cost basis may automatically appear, or you may need to enter it manually. The
                  cost basis for an individual security can often be found in the tax section of
                  your brokerage firm.
                </span>
              ),
            },
            {
              text: (
                <span>
                  The following types of investment accounts can be added to the software:
                </span>
              ),
              ullist: [
                'General Investment',
                'Plan 401(k)',
                'Plan Roth 401(k)',
                'Plan 403(b)',
                'Plan 529',
                'IRA',
                'Rollover IRA',
                'Roth IRA',
                'Taxable',
                'Non-taxable',
                'Brokerage',
                'Trust',
                'Uniform Gifts To Minors Act',
                'Plan 457',
                'Pension',
                'Employee Stock Ownership Plan',
                'Simplified Employee Pension',
                'Simple IRA',
                'Fixed Annuity',
                'Variable Annuity',
              ],
            },
            {
              text: (
                <span>
                  Within these account types, you may see one or more of the following types of
                  holdings:
                </span>
              ),
              ullist: [
                <span>
                  <i>Equity</i>: These represent an ownership stake in a company, usually in the
                  form of stock, but sometimes other types of securities.
                </span>,
                <span>
                  <i>ETF (exchange traded fund)</i>: These represent an ownership share of a fund
                  made up of other assets, which could be stocks, bonds, futures, gold, or any
                  number of other things. Shareholders don&rsquo;t own the underlying assets, just
                  the right to some of the profits generated from those assets.
                </span>,
                <span>
                  <i>Money market</i>: These are cash accounts which are like both a savings account
                  and a checking account combined. They return higher yields than savings or
                  checking accounts but may have restrictions on how often money can be withdrawn.
                  They may also require a minimum balance.
                </span>,
                <span>
                  <i>Mutual funds</i>: These are companies run by professional money managers whose
                  job is to invest the money of people who buy shares in the mutual fund company.
                  Managers may change their investments, buy, and sell the underlying assets in
                  order to meet performance goals. However, these shares are not traded on an
                  exchange, like ETFs above.
                </span>,
                <span>
                  <i>Hedge fund</i>: These are investment companies that aren&rsquo;t available to
                  the general public and are thus regulated differently than mutual funds or other
                  types of funds. They generally invest in relatively liquid assets and may have an
                  investment strategy aimed at getting a return whether markets go up or down, hence
                  the term &ldquo;hedge.&rdquo;
                </span>,
                <span>
                  <i>Annuity</i>: These financial products pay out money on a specified schedule
                  after a certain period of time, called annuitization. Money is invested during
                  this time (which can last from 2 to 10 years, or more), and then begins paying out
                  in a predictable stream. This is often used as retirement income or providing for
                  long-term care.
                </span>,
                <span>
                  <i>UIT (unit investment trust)</i>: These investment companies are much like
                  mutual funds, except they have fixed portfolios that allow investors to know what
                  securities are held from the date of deposit until maturity; this is generally two
                  years. UITs are not actively managed and should be considered a long-term
                  investment. They are not intended to be traded prior to maturity.
                </span>,
                <span>
                  <i>Cash</i>: These are the funds in your account that have not yet been invested
                  in a security.
                </span>,
                <span>
                  <i>Fixed income</i>: These holdings produce a specific, predictable, regular level
                  of income. They are generally predictable and stable. There are many kinds, but
                  bonds are the most common type of fixed-income holding.
                </span>,
                <span>
                  <i>Options</i>: These grant the holder the right to buy or sell a stock in the
                  future at a price specified at the time of purchase. If the market price differs
                  from the agreed-upon price, the option holder may earn a return.
                </span>,
                <span>
                  <i>Unknown</i>: Sometimes we are unable to determine the security type of a
                  particular holding. When this happens, you can manually set the security type.
                </span>,
              ],
            },
            {
              text: <span>To see details about the holdings within an account:</span>,
              ullist: ['Click an investment account.'],
            },
            {
              text: (
                <span>
                  A drop down menu will appear. The holding&rsquo;s symbol and name are to the left.
                  To the right, you&rsquo;ll see the quantity you own, the cost basis, the current
                  market value of the holding, and the gain or loss since it has been tracked. If
                  your investment includes a cash balance, it will be shown at the bottom of the
                  list.
                </span>
              ),
            },
            {
              text: (
                <span>
                  For the software to track your gains and losses accurately, you&rsquo;ll need to
                  know the cost basis of each holding. The cost basis is the original price you paid
                  for a given holding. It may be imported automatically, or you may need to enter it
                  manually.
                </span>
              ),
            },
            {
              text: <span>To edit the cost basis of a particular holding:</span>,
              list: [
                'Click an account to bring up holding details.',
                <span>
                  Click on the cost basis figure; as you hover over it, it will read &ldquo;Click to
                  edit.&rdquo;
                </span>,
                'Enter in the correct purchase price, including any commission paid. In the event you made multiple purchases of the same security, the cost basis for each purchase will need to be added together before entering it into the software.',
              ],
            },
          ],
        },
        {
          subtitle: 'Allocation',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Investments/investment_allocations_dec_2018.png',
          content: [
            {
              text: (
                <span>
                  No investment strategy will be perfect for everyone; we all have different lives,
                  plans, and goals. One important way you can adjust your investment strategy and
                  meet your goals is to adjust the allocation of your investment types. That&rsquo;s
                  why the Investments tab includes an allocation tool that gives you a simple
                  visualization of your current allocation, allowing you to understand your
                  investments and adjust them if necessary.
                </span>
              ),
            },
            {
              text: (
                <span>
                  The percentage of different kinds of investments you own can have a profound
                  effect on what kind of return you get in different economic conditions. Is it
                  better to have more stocks or more bonds? Should you invest in U.S. stock or
                  international stock? Should you have more or fewer cash investments like
                  certificates of deposit or money market accounts?
                </span>
              ),
            },
            {
              text: (
                <span>
                  Investment experts often break down allocations into three broad strategies:
                  conservative, moderate, and aggressive. A conservative approach is less risky, but
                  may not bring the highest returns. An aggressive approach may bring higher
                  returns, but is more risky.
                </span>
              ),
            },
            {
              text: (
                <span>
                  <i>
                    &nbsp;&nbsp;&nbsp;&nbsp;Note: In the allocations below, the &ldquo;other&rdquo;
                    group refers to investments like private equity funds, hedge funds, real estate
                    investment trusts, derivatives, or other less-common types of holdings.
                  </i>
                </span>
              ),
            },
            {
              text: <span>Conservative:</span>,
              ullist: [
                '19% U.S. stocks',
                '6% international stocks',
                '55% bonds',
                '7% cash investments',
                '13% other',
              ],
            },
            {
              text: <span>Moderate:</span>,
              ullist: [
                '38% U.S. stocks',
                '18% international stocks',
                '30% bonds',
                '2% cash investments',
                '12% other',
              ],
            },
            {
              text: <span>Aggressive:</span>,
              ullist: [
                '58% U.S. stocks',
                '30% international stocks',
                '0% bonds',
                '2% cash investments',
                '10% other',
              ],
            },
            {
              text: <span>To view your allocation:</span>,
              ullist: [
                <span>
                  Click on the &ldquo;Allocation&rdquo; button on the top left. The allocation wheel
                  will appear on the left, with a list of investment categories on the right.
                </span>,
              ],
            },
            {
              text: <span>To see a list of each holding in a given investment category:</span>,
              list: [
                <span>
                  Hover over a piece of the investment wheel to see the amount you have invested in
                  that category; alternatively, hover over the desired investment category on the
                  right.
                </span>,
                <span>
                  Click on a piece of the investment wheel to bring up a list of holdings in that
                  investment category; alternatively, click on an investment category on the right.
                </span>,
                <span>
                  Hover over a holding&rsquo;s symbol to see the size of that holding; this is also
                  listed on the right.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  You can view your allocated holdings in terms of dollar amounts or as a percentage
                  of your total investments. The default is dollars.
                </span>
              ),
            },
            {
              text: <span>To toggle between dollars and percentages:</span>,
              list: [
                <span>
                  Click the &ldquo;%&rdquo; button on the top right above the list of holdings
                  types.
                </span>,
                <span>Click the &ldquo;$&rdquo; button to return to dollars.</span>,
              ],
            },
            {
              text: (
                <span>
                  By default, all your connected investment accounts are included in the investment
                  wheel. You can, however, choose to display one account at a time.
                </span>
              ),
            },
            {
              text: <span>To change the account displayed in your investment wheel:</span>,
              list: [
                <span>
                  Click on the &ldquo;All Investment Accounts&rdquo; dropdown menu at the top.
                </span>,
                <span>
                  Choose the account you would like displayed in the investment wheel; all other
                  accounts will be excluded.
                </span>,
                <span>
                  Choose &ldquo;All Investment Accounts&rdquo; on the dropdown to display all your
                  accounts again.
                </span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Analysis',
          content: [
            {
              text: (
                <span>
                  You can take your investment strategizing one level deeper with the analysis tool.
                  This visualization takes your stocks and bonds and breaks them down into nine
                  different categories based on factors like quality and growth potential. These
                  categories are displayed as an easy-to-read grid so you can get a quick and
                  accurate read on what kinds of investments you have.
                </span>
              ),
            },
            {
              text: (
                <span>
                  In order to use the analysis tool properly, it&rsquo;s important to understand the
                  basic differences between stocks and bonds.
                </span>
              ),
            },
            {
              text: (
                <span>
                  <i>Stocks</i> are pieces of a company. When you buy a stock, you literally own a
                  tiny piece of the company that issued the stock. When that company is doing well,
                  the value of your piece of the company generally increases, and you can sell it
                  for more money than you paid, thus bringing in a return. If the company is doing
                  poorly, your piece of the company will generally be worth less, and you may lose
                  money by selling.
                </span>
              ),
            },
            {
              text: (
                <span>
                  Stocks range in terms of their risk, but they are, in general, considered to be
                  more risky than bonds. However, you shouldn&rsquo;t forget that in the long run, a
                  diversified portfolio of stocks is very likely to increase in value, which is why
                  they are among the most important investments.
                </span>
              ),
            },
            {
              text: (
                <span>
                  <i>Bonds</i> are not like stocks: bonds are like an I.O.U. When you buy a bond,
                  you are essentially loaning someone your money (often a government, but also
                  companies) with the promise that they will pay it all back, plus interest. You
                  could get that interest in a yearly or even quarterly payment, or in one lump sum
                  when the bond matures. When a bond matures, you get all your money back.
                </span>
              ),
            },
            {
              text: (
                <span>
                  Bonds are generally considered to be safer than stocks because of their long-term
                  nature, but they may not bring in the same high returns. Bonds are generally
                  predictable and steady. Because they return a specified interest, they are often
                  referred to as &ldquo;fixed-income&rdquo; investments. Though there is always a
                  small chance that a bankruptcy or default will happen, this is unlikely,
                  especially with high-quality, long-duration bonds.
                </span>
              ),
            },
          ],
        },
        {
          subtitle: 'Stocks',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Investments/investment_analysis_dec_2018.png',
          content: [
            {
              text: (
                <span>
                  By default, you&rsquo;ll see the &ldquo;Stocks&rdquo; tool. While we can&rsquo;t
                  say that one investment strategy is the best or that there is an ideal mix of
                  stocks in your portfolio, the stock analysis tool will help you understand and
                  visualize your particular situation.
                </span>
              ),
            },
            {
              text: (
                <span>
                  The horizontal axis of the stock analysis tool represents investment style:
                </span>
              ),
              list: [
                <span>
                  <i>Value</i>: These are stocks that are seen as being underpriced by the market,
                  or cheaper than they should be. Investing in these stocks may yield a return as
                  the price goes up.
                </span>,
                <span>
                  <i>Core</i>: These are stocks that seem to have characteristics of both value and
                  growth stocks.
                </span>,
                <span>
                  <i>Growth</i>: These are stocks for companies that have shown strong growth over
                  the last few years and are likely to continue growing at a fast clip. Investing in
                  these stocks may yield a return as the company&rsquo;s overall size and importance
                  increases.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  The vertical axis represents a company&rsquo;s <i>market capitalization</i> — that
                  is, the total market value of all the company&rsquo;s stock. The market
                  &ldquo;cap&rdquo; can give you an idea of how much a company is worth, as well as
                  an idea of how desirable its stock is to other investors. A balanced portfolio
                  will have stock from large-, medium-, and small-cap companies.
                </span>
              ),
              ullist: [
                <span>
                  <i>Large</i>: These companies are typically worth tens of billions of dollars.
                  More specifically, the analysis tool defines large-cap companies as those which
                  represent the top 70 percent of the total market capitalization in a given
                  geographic area.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  Large-cap companies are often the most important, most established, better-known,
                  most stable, or most dominant in a given industry. They are often considered less
                  risky by investors, but may not bring in the highest returns.
                </span>
              ),
              ullist: [
                <span>
                  <i>Mid</i>: These companies are typically worth a few billion dollars, but
                  probably less than $10 billion. More specifically, these companies represent the
                  middle 20 percent of total market capitalization in a given geographic area.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  Mid-cap companies are often thought of as more or less established and important
                  in their given industry. They may not be the most well-known, but they are
                  nevertheless important and are expected to increase their importance,
                  competitiveness, and dominance in the future. They are usually more risky than
                  large-cap stocks, but less risky than small-cap stocks.
                </span>
              ),
              ullist: [
                <span>
                  <i>Small</i>: These companies are typically worth less than a billion dollars.
                  More specifically, they represent the bottom 10 percent of total market
                  capitalization in a given geographic area.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  Small-cap companies are often either newcomers to a particular market or perhaps
                  serve a niche market in an industry. They may not be well-established, especially
                  stable, or important within a particular industry, but they may also be poised to
                  grow quickly or become much more established. While they offer an opportunity for
                  high returns, they are nevertheless considered risky by most investors.
                </span>
              ),
            },
            {
              text: <span>To view the stock analysis tool:</span>,
              list: [
                <span>
                  Click the &ldquo;Analysis&rdquo; button on the top left of the Investments tab.
                </span>,
                <span>Click the &ldquo;Stocks&rdquo; button on the right.</span>,
              ],
            },
          ],
        },
        {
          subtitle: 'Bonds',
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Investments/investment_analysis_bonds_dec_2018.png',
          content: [
            {
              text: <span>To access the bond analysis tool:</span>,
              list: [
                <span>
                  Click the &ldquo;Analysis&rdquo; button on the top left of the Investments tab.
                </span>,
                <span>Click the &ldquo;Bonds&rdquo; button on the right.</span>,
              ],
            },
            {
              text: (
                <span>
                  You&rsquo;ll see a grid similar to the stocks analysis tool. The vertical axis
                  represents the quality of the bond, i.e. the credit rating.
                </span>
              ),
              ullist: [
                <span>
                  <i>High</i>: These bonds have a credit rating that is AA- or higher.
                </span>,
                <span>
                  <i>Medium</i>: These bonds have credit ratings less than AA-, but greater or equal
                  to BBB-.
                </span>,
                <span>
                  <i>Low</i>: These bonds have credit ratings that are below BBB-.
                </span>,
              ],
            },
            {
              text: (
                <span>
                  Bond <i>quality</i> gives you an idea of how likely you are to be paid back by the
                  entity that loaned you money. Bond credit ratings range from AAA to C or sometimes
                  even D, with AA+ being lower than AAA, AA- being lower than AA, and so on. The
                  highest rating means you are almost certain to get your money back, plus interest.
                  A very low rating means there is a significant chance you won&rsquo;t get all your
                  money back.
                </span>
              ),
            },
            {
              text: (
                <span>
                  The horizontal axis measures the <i>duration</i> of the bond. Duration is quite
                  complicated, but what it&rsquo;s trying to measure is fairly simple to understand:{' '}
                  <i>risk</i>. Bonds with a short duration are generally less risky than bonds with
                  a longer duration.
                </span>
              ),
            },
            {
              text: (
                <span>
                  More specifically, longer-term bonds are more likely to be negatively affected by
                  changes in the interest rate set by the U.S. Federal Reserve. Higher interest
                  rates cause bonds to lose value, while lower interest rates will cause bonds to
                  lose less. So, a bond with a long duration is more likely to be negatively
                  affected by an increase in the interest rate.
                </span>
              ),
            },
            {
              text: (
                <span>
                  <i>
                    &nbsp;&nbsp;&nbsp;&nbsp;Note: The duration and maturity of a bond are not the
                    same thing. They are related, however. The details are complex, but just
                    remember that a bond&rsquo;s duration is always equal to or shorter than its
                    maturity.
                  </i>
                </span>
              ),
            },
            {
              text: (
                <span>
                  There are no exact numbers for what counts as a limited, moderate, or extensive
                  duration, as these levels are calculated on a floating basis according to market
                  conditions. However, a good general guide is this:
                </span>
              ),
              ullist: [
                <span>
                  <i>Limited</i>: The bond&rsquo;s duration is roughly 3 years or less.
                </span>,
                <span>
                  <i>Moderate</i>: The bond&rsquo;s duration is between roughly 4 and 7 years.
                </span>,
                <span>
                  <i>Extensive</i>: The bond&rsquo;s duration is longer than roughly 7 years.
                </span>,
              ],
            },
          ],
        },
      ],
    },
  ],
  alerts: [
    {
      icon: 'envelope',
      title: 'Alerts Overview',
      sections: [
        {
          image_url:
            'https://content.moneydesktop.com/storage/MD_Assets/help/Settings/settings-notifications-1-10-2018.png',
          content: [
            {
              text:
                'Notifications can help you stay on track by keeping you notified of important events in your finances. You must verify your email address and/or your mobile phone number before alerts can be sent to you.',
              ullist: [
                <span>
                  Click the settings gear on the top right, then click &ldquo;Notifications&rdquo;
                  to change notification settings.
                </span>,
                <span>
                  Click &ldquo;Edit&rdquo; to choose how to receive alerts, to choose which accounts
                  will be tracked, and to change the dollar amount at which an alert is triggered.
                </span>,
                'Click the checkbox on the left of an alert to enable or disable the alert.',
              ],
            },
            {
              text:
                'Notifications will be delivered nightly after account information has been updated. Budget alerts will be grouped into one email. Other alerts will appear in separate emails.',
            },
            {
              text:
                'General emails will be sent to unverified email addresses. Notifications that contain sensitive financial information will only be sent to users who have verified their email address.',
            },
            {
              text: (
                <span>
                  Verify your email by clicking &ldquo;Verify&rdquo; on the top right of the
                  notifications tab.
                </span>
              ),
            },
          ],
        },
      ],
    },
  ],
  general: [
    {
      icon: 'help',
      mobileFaq: true,
      title: 'Is my data private and secure?',
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  We&rsquo;re committed to keeping your information secure. As such, we implement
                  privacy standards to guard against identity theft and unauthorized access to your
                  information. We also regularly monitor and re-evaluate our privacy and security
                  policies and adapt them as necessary to deal with new conditions.
                </span>
              ),
            },
            {
              text:
                'We use industry-accepted standards, protocols and precautions to protect your personally identifiable information from loss, misuse, unauthorized access or disclosure, alteration, or destruction. We maintain physical, electronic, and procedural safeguards for your personally identifiable information, including using firewall barriers, encryption techniques, authentication procedures, SSL (secure socket layer) encryption, and physical safeguards. In addition, we do not sell your personally identifiable information.',
            },
            {
              text: (
                <span>
                  We will notify you of changes to our policies so that you&rsquo;ll always know
                  what information we gather, how we might use that information, and when we will
                  disclose that information to third parties, if at all. We may also inform you of
                  any changes to this policy by a prominent notice within the services or by email.
                  In addition, and at our discretion, in the event of an update or material change,
                  you may be required to agree to the new privacy policy as a condition precedent to
                  your continued use of the services.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      mobileFaq: true,
      title: <span>Why are some of my transactions &ldquo;uncategorized&rdquo;?</span>,
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  We try hard to make sure that transactions are automatically categorized, but if
                  we&rsquo;re not sure where it belongs, we leave it uncategorized. This usually
                  happens when you first begin to use the software.
                </span>
              ),
            },
            {
              text: (
                <span>
                  There are several reasons for this. Some things simply can&rsquo;t be categorized
                  automatically, like checks and ATM withdrawals. It&rsquo;s impossible to say where
                  that money was spent without your input, so you&rsquo;ll need to categorize these
                  transactions yourself.
                </span>
              ),
            },
            {
              text: (
                <span>
                  It&rsquo;s also possible that some transactions don&rsquo;t have enough
                  information for the system to even guess the correct category; a business may have
                  a generic name, or the data may not contain anything other than a dollar amount.
                  These transactions are also left uncategorized.
                </span>
              ),
            },
            {
              text: (
                <span>
                  Despite these issues, the software is always learning. As you manually place
                  transactions in a category, the system will learn your preferences and spending
                  patterns. The longer you use the software, the more accurate it will become — and
                  the fewer uncategorized transactions you&rsquo;ll see.
                </span>
              ),
            },
            {
              text: 'To put these transactions in their correct category, you should:',
              list: [
                'Click on the Transactions tab.',
                <span>
                  If you have uncategorized transactions, a message should appear asking if
                  you&rsquo;d like to categorize your uncategorized transactions. Click
                  &ldquo;Categorize.&rdquo;
                </span>,
                <span>
                  If you&rsquo;ve already clicked &ldquo;No Thanks&rdquo; or no message appears,
                  simply click on the search icon in the top right corner and type
                  &ldquo;uncategorized.&rdquo;
                </span>,
                'Hover over a transaction and click the pencil icon that appears.',
                <span>
                  Choose a category or click the &ldquo;+&rdquo; icon to choose a subcategory. You
                  can even add a new subcategory by clicking &ldquo;Add a Subcategory&rdquo; and
                  entering a name.
                </span>,
                'Repeat this process for each uncategorized transaction.',
              ],
            },
            {
              text: (
                <span>
                  Remember, your preferences will be saved, and similar transactions should be
                  automatically categorized in the future so you&rsquo;ll have to do this less and
                  less as time goes on.
                </span>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      title: <span>Why can&rsquo;t I see the software?</span>,
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  Make sure you&rsquo;re using a current browser, such as recent versions of Firefox
                  or Google Chrome.
                </span>
              ),
            },
            {
              text: 'Firefox: http://www.mozilla.org/en-US/firefox/new/',
            },
            {
              text: 'Google Chrome: https://www.google.com/intl/en/chrome/browser/',
            },
            {
              text:
                'Occasionally a browser tries to view a page through a previous mode. To fix this:',
              list: [
                'Press the F12 button. This will bring up developer options at the bottom of the browser.',
                <span>
                  In the developer window, go to the menu bar and click &ldquo;Browser Mode.&rdquo;
                </span>,
                'Choose the most recent version (but not compatibility mode).',
                <span>Click &ldquo;Document Mode.&rdquo;</span>,
                'Choose the most recent version.',
                'Refresh the page.',
              ],
            },
            {
              text: 'Now all screens should work.',
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      title: 'How do I log out of the software?',
      sections: [
        {
          content: [
            {
              text: 'Logging in and out of online banking logs you in and out of the software.',
            },
          ],
        },
      ],
    },
  ],
  mobile: [
    {
      icon: 'mobile-phone',
      title: 'Mobile Devices Overview',
      sections: [
        {
          content: [
            {
              text:
                'For your security, the mobile app requires that you link it to your web app. That way only you can access your data. Thankfully, you only have to do this once.',
            },
            {
              text: 'To link a mobile device:',
              list: [
                <span>Click the gear-shaped &ldquo;Settings&rdquo; button.</span>,
                <span>Click the &ldquo;Mobile Devices&rdquo; tab.</span>,
                <span>
                  Click &ldquo;Generate Access Code&rdquo; to create your 8-digit access code.
                </span>,
                'Download the app from the iOS or Android App Store.',
                'Enter your access code into your mobile device.',
              ],
            },
            {
              text: <span>Now you&rsquo;re connected!</span>,
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      title: 'How do I set up a mobile device?',
      sections: [
        {
          content: [
            {
              text:
                'For your security, the mobile app requires that you link it to your web app. That way, only you can access your data. Thankfully, you only have to do this once.',
            },
            {
              text: 'To link a mobile device:',
              list: [
                <span>Click the gear-shaped &ldquo;Settings&rdquo; button.</span>,
                <span>Click the &ldquo;Mobile Devices&rdquo; tab.</span>,
                <span>
                  Click &ldquo;Generate Access Code&rdquo; to create your 8-digit access code.
                </span>,
                'Download the app from the iOS or Android App Store.',
                'Enter your access code into your mobile device.',
              ],
            },
            {
              text: <span>Now you&rsquo;re connected!</span>,
            },
          ],
        },
      ],
    },
    {
      icon: 'help',
      title: 'How do I prevent the mobile app from crashing?',
      sections: [
        {
          content: [
            {
              text: (
                <span>
                  The amount of data crunching in our app means that it uses more processing power
                  than other apps on the market. That&rsquo;s why we take care to test it thoroughly
                  before each release.
                </span>
              ),
            },
            {
              text: 'It should be noted that crashes are usually device-specific.',
            },
            {
              text: 'Here are some tips to cut back on crashes:',
              ullist: [
                'Update to the latest operating system.',
                'Close any apps that may be running in the background.',
                'Restart your device.',
                'Delete the app and re-install it.',
              ],
            },
            {
              text: (
                <span>
                  If none of these options work, please let us know. We&rsquo;re always looking for
                  ways to make our app more stable and engaging.
                </span>
              ),
            },
          ],
        },
      ],
    },
  ],
}
