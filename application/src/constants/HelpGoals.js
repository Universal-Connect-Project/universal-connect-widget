import React from 'react'

/******************
 *
 * OLD GOALS CONTENT
 *
 *******************/
/* eslint react/jsx-key: 0 */
// there are a ton of questionable key errors here, they fail lint, but don't
// show anything in the actual browser when ran

export const goalsContent = [
  {
    icon: 'pointer',
    title: 'Goals Overview',
    sections: [
      {
        image_url:
          'https://content.moneydesktop.com/storage/MD_Assets/help/Goals/goals-overview-1-11-2018.png',
        content: [
          {
            text: (
              <span>
                Whether it&rsquo;s saving for retirement, paying off a car loan, or just putting
                some money away for emergencies, we all have financial goals that require long-term
                planning. The Goals tab helps you make those plans and allows you to visualize them
                on a simple timeline.
              </span>
            ),
          },
          {
            text: (
              <span>
                Each goal you create will be tied to only one of the accounts you&rsquo;ve added —
                except retirement goals, which can be tied to multiple accounts. If you have
                multiple savings accounts, you may create multiple savings goals.
              </span>
            ),
          },
          {
            text: (
              <span>
                Your goals appear on the timeline as colorful circles. As you scroll to a savings or
                retirement goal, you&rsquo;ll see the amount you&rsquo;ve put aside for that goal as
                well as the total amount you hope to achieve. Goals will automatically update as you
                put money into a savings account or pay off a debt.
              </span>
            ),
          },
          {
            text: (
              <span>The first time you view the Goals tab, you&rsquo;ll see a welcome screen.</span>
            ),
            ullist: [<span>Click &ldquo;Get Started.&rdquo;</span>],
          },
          {
            text: (
              <span>
                This will bring up the tab&rsquo;s main screen. Here, you&rsquo;ll see the timeline
                with the future up at the top of the screen. On the left you&rsquo;ll see a slider,
                used to navigate back and forth on the timeline. You&rsquo;ll see &ldquo;Total
                Monthly Contribution&rdquo; on the top left and buttons to add and manage goals on
                the right.
              </span>
            ),
          },
        ],
      },
      {
        subtitle: 'Creating goals',
        content: [
          {
            text: (
              <span>
                It&rsquo;s time to start setting up your goals. You can create three types: savings,
                debt payoff, and retirement.
              </span>
            ),
          },
          {
            text: 'To set up a goal:',
            list: [
              <span>Click the &ldquo;+&rdquo; button at the top right.</span>,
              'Choose a goal type: savings, debt payoff, or retirement.',
            ],
          },
          {
            text:
              'Each type of goal is a little different and requires slightly different information.',
          },
        ],
      },
      {
        subtitle: 'Savings goals',
        image_url:
          'https://content.moneydesktop.com/storage/MD_Assets/help/Goals/goals-savings-1-11-2018.png',
        content: [
          {
            text:
              'We encourage you to start by setting up an emergency savings goal. Saving $1,000 in an emergency-only account is a good start, but working toward 3–6 months of living expenses is even better.',
          },
          {
            text: 'To create a savings goal:',
            list: [
              <span>Click the &ldquo;+&rdquo; button at the top right.</span>,
              <span>Click the &ldquo;Savings&rdquo; goal type.</span>,
              'Select a more specific type of savings goal. You can choose from: emergency fund, automobile, college, home, recreational, vacation, electronic, or other.',
              'Edit the details for the goal: give it a name and set an amount you would like to save for your goal.',
              <span>
                Click the &ldquo;Select an Account&rdquo; field. A window will appear listing all
                your non-checking, non-debt accounts.
              </span>,
              <span>Click the account you&rsquo;d like to use for this goal.</span>,
              <span>Click &ldquo;Save.&rdquo;</span>,
            ],
          },
          {
            text:
              'This goal will now appear on the main page of Goals - a green circle above the date when the savings goal is expected to be achieved.',
          },
          {
            text: 'To see details and make changes to a savings goal:',
            ullist: ['Click the green savings goal on the timeline.'],
          },
        ],
      },
      {
        subtitle: 'Debt payoff goals',
        content: [
          {
            text: (
              <span>
                If you&rsquo;ve already connected a debt account to the software, then Goals will
                automatically pull in the information it needs to create a debt goal - including
                balance, APR, and minimum payments. Goals will use your minimum payment information
                to automatically calculate the date the debt will be repaid, but you can add more to
                your monthly contribution to pay things off sooner.
              </span>
            ),
          },
          {
            text: 'To create a debt payoff goal:',
            list: [
              <span>Click the &ldquo;+&rdquo; button at the top right.</span>,
              <span>
                Click the &ldquo;Debt Payoff&rdquo; goal type. This will bring up a window that
                lists all of your debt accounts.
              </span>,
              'Check all the accounts you wish to track.',
              <span>Click &ldquo;Save.&rdquo;</span>,
            ],
          },
          {
            text:
              'Each debt account you selected will appear on the timeline as a blue circle above the date when they are expected to be paid off.',
          },
          {
            text: 'To see details and make changes to debt goals:',
            ullist: ['Click the blue debt on the timeline.'],
          },
        ],
      },
      {
        subtitle: 'Retirement goal',
        image_url:
          'https://content.moneydesktop.com/storage/MD_Assets/help/Goals/goals-retirement-1-11-2018.png',
        content: [
          {
            text: 'To add a retirement goal:',
            list: [
              <span>
                Click the &ldquo;+&rdquo; button on the top right of the main Goals window.
              </span>,
              <span>Choose the &ldquo;Retirement&rdquo; goal type.</span>,
              <span>
                If you&rsquo;ve already entered personal information in the Settings section, your
                birthday will automatically be imported. Otherwise, you can select the date of your
                birth by clicking the dropdown menu.
              </span>,
              <span>Choose the age at which you&rsquo;d like to retire. The default is 65.</span>,
              <span>Enter the amount of money you&rsquo;d like to have when you retire.</span>,
              <span>
                Click &ldquo;Current Savings.&rdquo; This will open a window from which you can
                choose a retirement account.
              </span>,
              <span>
                Check one or more retirement accounts. The total balance of selected accounts will
                be listed as your current savings. Click &ldquo;Add it Here&rdquo; if you need to
                connect another account to the software.
              </span>,
              <span>Click &ldquo;Save.&rdquo;</span>,
              <span>Click &ldquo;Save&rdquo; on the next window as well.</span>,
            ],
          },
          {
            text: (
              <span>
                This goal will appear on the timeline as a purple circle above the date you will
                reach your chosen retirement age. As you scroll to it, you&rsquo;ll see your current
                retirement savings and your desired savings side-by-side.
              </span>
            ),
          },
          {
            text: (
              <span>
                If you aren&rsquo;t projected to achieve your desired retirement savings by your
                selected age - based on a 6% average rate of return - a blue &ldquo;i&rdquo; symbol
                will appear.
              </span>
            ),
          },
          {
            text: 'To see details and make changes to your retirement goals:',
            ullist: ['Click the purple retirement goal on the timeline.'],
          },
          {
            text: <span>If you see a blue &ldquo;i&rdquo; appear over your retirement goal:</span>,
            ullist: [
              'Click the retirement goal to see what your projected retirement savings will be by your retirement age and how much less that is than your desired savings.',
            ],
          },
        ],
      },
      {
        subtitle: 'Manage goal contributions and priorities',
        content: [
          {
            text: (
              <span>
                Now that you&rsquo;ve created some goals, you should determine what kind of monthly
                contribution makes sense for each goal. This will affect when each goal will be
                achieved.
              </span>
            ),
          },
          {
            text:
              'With the manage goals feature, you can adjust the size of your contribution to each goal type and determine the priority of goals within a specific type.',
          },
          {
            text:
              'A contribution is the amount of money that you plan to allocate each month to an overall goal type. The priority is the order in which that contribution will be applied to each goal within a particular type.',
          },
          {
            text:
              'Your monthly contribution will be applied to whatever goal has the highest priority. When that goal is achieved, the contribution will be applied to the goal with the second-highest priority and so on.',
          },
          {
            text: 'To adjust your contribution and priority for savings goals:',
            list: [
              'Click on the manage goals button on the top right.',
              <span>Click &ldquo;Savings.&rdquo;</span>,
              'Click the pencil icon on the top left of the window that appears, and enter a monthly contribution.',
              <span>
                Click &ldquo;Reorder&rdquo; on the right to adjust the priority of multiple savings
                goals.
              </span>,
              'Click and drag the goals into the order you prefer.',
              <span>Click &ldquo;Done.&rdquo;</span>,
            ],
          },
          {
            text:
              'Debt goals are managed differently. Your contribution is an amount in addition to your minimum payments for each debt.',
          },
          {
            text: 'To adjust your contribution and priority for debt goals:',
            list: [
              'Click the manage goals button.',
              <span>Click On &ldquo;Debt Payoff.&rdquo;</span>,
              'Click the pencil icon on the top left, and enter a monthly contribution.',
              <span>
                Click the dropdown menu to the right to reorder debt priorities. This will default
                to &ldquo;Fastest Payoff First.&rdquo; You can also choose &ldquo;Highest Interest
                First,&rdquo; &ldquo;Lowest Balance First,&rdquo; and &ldquo;Highest Balance
                First.&rdquo;
              </span>,
            ],
          },
          {
            text: 'To adjust your contribution to your retirement goal:',
            list: [
              'Click the manage goals button.',
              <span>Click &ldquo;Retirement.&rdquo;</span>,
              'Click the pencil icon on the top left, and enter a monthly contribution.',
            ],
          },
          {
            text: (
              <span>
                You will have only one retirement goal, hence you won&rsquo;t need to determine a
                priority.
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
    title: 'How do savings goals work?',
    sections: [
      {
        content: [
          {
            text: (
              <span>
                We encourage you to start by setting up an emergency savings goal. Saving $1,000 in
                an emergency-only account is a good start, but working toward 3–6 months of living
                expenses is even better. Remember, however, that a savings goal can be tied to only
                one account. In order to have multiple savings goals, you&rsquo;ll need to have
                multiple savings accounts.
              </span>
            ),
          },
          {
            text: 'To create a savings goal:',
            list: [
              <span>Click the &ldquo;+&rdquo; button at the top right.</span>,
              <span>Click the &ldquo;Savings&rdquo; goal type.</span>,
              'Select a more specific type of savings goal. You can choose from: emergency fund, automobile, college, home, recreational, vacation, electronic, or other.',
              <span>
                Edit the details for the goal: give it a name and set an amount you&rsquo;d like to
                save for your goal.
              </span>,
              <span>
                Click the &ldquo;Select an Account&rdquo; field. A window will appear listing all
                your non-checking, non-debt accounts.
              </span>,
              <span>Click the account you&rsquo;d like to use for this goal.</span>,
              <span>Click &ldquo;Save.&rdquo;</span>,
            ],
          },
          {
            text:
              'This goal will now appear on the main page of Goals - a green circle above the date when the savings goal is expected to be achieved.',
          },
          {
            text: 'To see details and make changes to a savings goal:',
            ullist: ['Click the green savings goal on the timeline.'],
          },
          {
            text:
              'With the manage goals feature, you can adjust the priority among your savings goals and change the size of your monthly contribution to the highest-priority goal.',
          },
          {
            text:
              'A contribution is the amount of money that you plan to allocate each month to an overall goal type. The priority is the order in which that contribution will be applied to each goal within a particular type.',
          },
          {
            text:
              'Your monthly contribution will be applied to whatever goal has the highest priority. When that goal is achieved, the contribution will be applied to the goal with the second-highest priority and so on.',
          },
          {
            text: 'To adjust your contribution and priority for savings goals:',
            list: [
              'Click on the manage goals button on the top right.',
              <span>Click &ldquo;Savings.&rdquo;</span>,
              'Click the pencil icon on the top left of the window that appears, and enter a monthly contribution.',
              <span>
                Click &ldquo;Reorder&rdquo; on the right to adjust the priority of multiple savings
                goals.
              </span>,
              'Click and drag the goals into the order you prefer.',
              <span>Click &ldquo;Done.&rdquo;</span>,
            ],
          },
        ],
      },
    ],
  },
  {
    icon: 'help',
    mobileFaq: true,
    title: 'How do debt goals work?',
    sections: [
      {
        content: [
          {
            text: (
              <span>
                If you&rsquo;ve already connected a debt account to the software, then Goals will
                automatically pull in the information it needs to create a debt goal - including
                balance, APR, and minimum payments. Goals will use your minimum payment information
                to automatically calculate the date the debt will be repaid, but you can add more to
                your monthly contribution to pay things off sooner.
              </span>
            ),
          },
          {
            text: 'To create a debt payoff goal:',
            list: [
              <span>Click the &ldquo;+&rdquo; button at the top right.</span>,
              <span>
                Click the &ldquo;Debt Payoff&rdquo; goal type. This will bring up a window that
                lists all your debt accounts.
              </span>,
              'Check all the accounts you wish to track.',
              <span>Click &ldquo;Save.&rdquo;</span>,
            ],
          },
          {
            text:
              'Each debt account you selected will appear on the timeline as a blue circle above the date when they are expected to be paid off.',
          },
          {
            text: 'To see details and make changes to debt goals:',
            ullist: ['Click the blue debt on the timeline.'],
          },
          {
            text:
              'With the manage goals feature, you can adjust the priority among your debt goals and change the size of your monthly contribution to the highest-priority goal.',
          },
          {
            text:
              'A contribution is the amount of money that you plan to allocate each month to your debt in addition to your minimum debt payment. The priority is the order in which that contribution will be applied to each goal within a particular type.',
          },
          {
            text:
              'Your monthly contribution will be applied to whatever goal has the highest priority. When that goal is achieved, the contribution will be applied to the goal with the second-highest priority and so on.',
          },
          {
            text: 'To adjust your contribution and priority for debt goals:',
            list: [
              'Click the manage goals button.',
              <span>Click on &ldquo;Debt Payoff.&rdquo;</span>,
              'Click the pencil icon on the top left, and enter a monthly contribution.',
              <span>
                Click the dropdown menu to the right to reorder debt priorities. This will default
                to &ldquo;Fastest Payoff First.&rdquo; You can also choose &ldquo;Highest Interest
                First,&rdquo; &ldquo;Lowest Balance First,&rdquo; and &ldquo;Highest Balance
                First.&rdquo;
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
    title: 'How do retirement goals work?',
    sections: [
      {
        content: [
          {
            text: 'To add a retirement goal:',
            list: [
              <span>
                Click the &ldquo;+&rdquo; button on the top right of the main Goals window.
              </span>,
              <span>Choose the &ldquo;Retirement&rdquo; goal type.</span>,
              'If you have already entered personal information in the Settings section, your birthday will automatically be imported. Otherwise, you can select the date of your birth by clicking the dropdown menu.',
              <span>Choose the age at which you would like to retire. The default is 65.</span>,
              'Enter the amount of money you&rsquo;d like to have when you retire.',
              <span>
                Click &ldquo;Current Savings.&rdquo; This will open a window from which you can
                choose a retirement account.
              </span>,
              <span>
                Check one or more retirement accounts. The total balance of selected accounts will
                be listed as your current savings. Click &ldquo;Add it Here&rdquo; if you need to
                connect another account to the software.
              </span>,
              <span>Click &ldquo;Save.&rdquo;</span>,
              <span>Click &ldquo;Save&rdquo; on the next window as well.</span>,
            ],
          },
          {
            text: (
              <span>
                This goal will appear on the timeline as a purple circle above the date you&rsquo;ll
                reach your chosen retirement age. As you scroll to it, you&rsquo;ll see your current
                retirement savings and your desired savings side-by-side.
              </span>
            ),
          },
          {
            text: (
              <span>
                If you aren&rsquo;t projected to achieve your desired retirement savings by your
                selected age - based on a 6% average rate of return - a blue &ldquo;i&rdquo; symbol
                will appear.
              </span>
            ),
          },
          {
            text: 'To see details and make changes to your retirement goals:',
            ullist: ['Click the purple retirement goal on the timeline.'],
          },
          {
            text: <span>If you see a blue &ldquo;i&rdquo; appear over your retirement goal:</span>,
            ullist: [
              'Click the retirement goal to see what your projected retirement savings will be by your retirement age and how much less that is than your desired savings.',
            ],
          },
          {
            text:
              'With the manage goals feature, you can change the size of your monthly contribution to the retirement goal.',
          },
        ],
      },
    ],
  },
]
