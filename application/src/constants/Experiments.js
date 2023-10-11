/*
    This is a list of names of the currently running experiments in MoneyMap.
    Experiments are guaranteed name uniqueness and the name should match
    across environment.

    Pattern should follow "EXP_[EXPERIMENT_NAME]".
    (i.e. export const EXP_EXPERIMENT_001 = "EXPERIMENT_001")

    These should be removed when the experiment is finished.
*/

export const EXP_USE_HISTORICAL_ACCOUNT_BALANCES = 'Historical account balances'
export const EXP_ADD_ACCOUNT_TEXT = 'Add Account Text'
export const EXP_FINSTRONG_LAYOUT_ORDER = 'Finstrong Layout Order'
export const EXP_HUGHES_HIDE_CREDIT_CARDS_FROM_ALERTS =
  "Hide Hughes' credit cards from notification center"

/*
    These are the variants that are associated with each experiment. The comment
    above each grouping explicitely shows which experiment is connect to the variants.

    Pattern should follow: "VARIANT_[FEATURE_NAME]".
    (i.e. export const VARIANT_FEATURE_001 = "FEATURE_001")

    Each group of variants should have a comment above indicating the experiment they are
    associated with.

    example:
    / * EXP_EXPERIMENT_001 * /
    export const VARIANT_FEATURE_001 = "FEATURE_001"

    These should be removed when the experiment is finished.
*/

/* EXP_ADD_ACCOUNT_TEXT */
export const VARIANT_ADD_ACCOUNT = 'ADD_ACCOUNT'
export const VARIANT_LINK_ACCOUNT = 'LINK_ACCOUNT'

/* EXP_FINSTRONG_LAYOUT_ORDER */
export const VARIANT_SHOW_FINSTRONG_SPEND_TOP = 'SHOW_FINSTRONG_SPEND_TOP'
export const VARIANT_SHOW_FINSTRONG_SAVINGS_TOP = 'SHOW_FINSTRONG_SAVINGS_TOP'

/* EXP_HUGHES_HIDE_CREDIT_CARDS_FROM_ALERTS */
export const VARIANT_HIDE_CARDS = 'HIDE_CARDS'
