const BLACK = '#000000';
const WHITE = '#ffffff';

const PRIMARY = {
  main: '#03c9d7',
  light: '#e5fafb',
  dark: '#05b2bd'
};

const SECONDARY = {
  main: '#fb9678',
  light: '#fcf1ed',
  dark: '#e67e5f'
};

const SUCCESS = {
  main: '#00c292',
  dark: '#00964b'
};

const DANGER = {
  main: '#e46a76',
  light: '#fdf3f5'
};

const INFO = {
  main: '#0bb2fb',
  light: '#a7e3f4'
};

const ERROR = {
  main: '#e45a68',
  dark: '#e46a76'
};

const WARNING = {
  main: '#fec90f',
  dark: '#dcb014'
};

const TEXT = {
  primary: BLACK,
  secondary: '#777e89',
  danger: '#fc4b6c'
};

const GREY = {
  A100: '#ecf0f2',
  A200: '#99abb4',
  A400: '#767e89',
  A700: '#e6f4ff'
};

const BACKGROUND_COLOR = {
  default: '#fafbfb',
  paper: '#fafbfb'
};

const COMMON = {
  common: { black: BLACK, white: WHITE },
  primary: { ...PRIMARY, contrastText: WHITE },
  secondary: { ...SECONDARY, contrastText: WHITE },
  success: { ...SUCCESS, contrastText: WHITE },
  danger: { ...DANGER },
  info: { ...INFO },
  error: { ...ERROR },
  warning: { ...WARNING, contrastText: WHITE },
  grey: { ...GREY }
};

export const palette = {
  ...COMMON,
  text: { ...TEXT },
  background: { ...BACKGROUND_COLOR }
};
