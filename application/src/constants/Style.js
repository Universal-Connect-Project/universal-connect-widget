import _merge from 'lodash/merge'
import { Styles } from 'mx-react-components'

const Style = _merge({}, Styles, {
  actionBarHeight: 51, // Buttons 30px + 10px margin top + 10px margin bottom + 1px border bottom
  DrawerHeaderHeight: 50,
  MasterTopBarHeight: 51,
  MiniTopBarHeight: 40,
  BaseSpendingChartSize: 400,
  ListRowHeight: 48,

  MiniWidgetDimensions: {
    LANDSCAPE: 'LANDSCAPE',
    PORTRAIT: 'PORTRAIT',
    MINIPORTRAIT: 'MINIPORTRAIT',
    STANDARD: 'STANDARD',
    NOT_FOUND: 'NOT_FOUND',
  },

  //z-index values
  Zs: {
    TIMEOUTMODAL: 1100,
    MAX: 1000,
    SCRIM: 900,
    ACTION_BAR: 300,
    WRAPPER: 100,
    MINIMUM: 0,
  },

  BoxShadow: '0 30px 30px 10px rgba(0,0,0,0.1)',
  BoxShadowThin: '0 1px 5px 0 rgba(0,0,0,0.1)',
  DefaultBorder: '1px solid #E3E6E7',
  DefaultDoubleBorder: '3px double #E3E6E7',

  // Custom colors, please don't override colors from mx-react-components
  Colors: {
    // CATEGORY COLORS
    AUTO_TRANSPORT: '#4B9DBC',
    BILLS_UTILITIES: '#EF9B2C',
    BUSINESS: '#B3DE8C',
    EDUCATION: '#F8AB3A',
    ENTERTAINMENT: '#AB5B89',
    FEES: '#FF9696',
    FINANCIAL: '#6BCDDB',
    FOOD_DINING: '#58AC7B',
    GIFTS_CHARITY: '#347AA5',
    HEALTH_FITNESS: '#5C446E',
    HOME: '#FFD84D',
    INCOME: '#133F49',
    INVESTMENTS: '#FF7070',
    KIDS: '#82D196',
    OTHER: '#959CA6',
    PETS: '#85507B',
    PERSONAL_CARE: '#338B7A',
    SHOPPING: '#CF5F84',
    TAXES: '#32588D',
    TRAVEL: '#e37434',
    TRANSFER: '#959CA6',
    UNCATEGORIZED: '#FA5555',
    // NEUTRAL COLORS
    WHITE: '#FFFFFF',
    GRAY_100: '#FAFBFC',
    GRAY_300: '#EBEFF5',
    GRAY_500: '#576675',
    GRAY_700: '#2E353B',
    GRAY_900: '#2E353B', // need to overwrite OS styles for now, until next OS release where we will remove GRAY_900
  },

  EquityColors: {
    DARK: '#3B907A',
    MID: '#82D196',
    LIGHT: '#B9E1C3',
  },

  IncomeColors: {
    DARK: '#4082A4',
    MID: '#85BADC',
    LIGHT: '#C2DCED',
  },

  MediaResourceBaseUrl: 'https://content.moneydesktop.com/storage/MD_Assets/',

  TransactionsHeights: {
    SearchBar: 40,
    UncategorizedPrompt: {
      SMALL: 50,
      LARGE: 125,
    },
  },

  StandardInput: {
    InputHeight: 32,
    InputWidth: '70%',
    LabelMinWidth: 142,
    LabelWidth: '30%',
  },
})

export default Style
