import { pxToRem } from '../utils/font';

import '@fontsource/raleway';
import '@fontsource/inter';

const typography = {
  body1: {
    fontWeight: 400,
    fontFamily: 'Inter, sans-serif'
  },
  h1: {
    fontWeight: 700,
    fontSize: pxToRem(40),
    lineHeight: '1.5',
    fontFamily: 'Raleway, sans-serif'
  },
  h2: {
    fontWeight: 600,
    fontSize: pxToRem(24),
    lineHeight: '1.5',
    fontFamily: 'Raleway, sans-serif'
  },
  h3: {
    fontWeight: 600,
    fontSize: pxToRem(21),
    lineHeight: '1.5',
    fontFamily: 'Raleway, sans-serif'
  },
  h4: {
    fontWeight: 500,
    fontSize: pxToRem(18),
    lineHeight: '1.5',
    fontFamily: 'Raleway, sans-serif'
  },
  h5: {
    fontWeight: 500,
    fontSize: pxToRem(16),
    lineHeight: '1.5',
    fontFamily: 'Raleway, sans-serif'
  },
  h6: {
    fontWeight: 700,
    fontSize: pxToRem(14),
    lineHeight: '1.5',
    fontFamily: 'Raleway, sans-serif'
  },
  button: {
    textTransform: 'none',
    fontWeight: 400,
    fontFamily: 'Inter, sans-serif'
  },
  subtitle1: {
    fontSize: pxToRem(16),
    fontWeight: 400,
    fontFamily: 'Inter, sans-serif'
  },
  subtitle2: {
    fontSize: pxToRem(14),
    fontWeight: 400,
    fontFamily: 'Inter, sans-serif'
  }
};

export default typography;
