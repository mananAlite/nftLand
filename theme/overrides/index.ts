import { Theme } from '@mui/material';
import Card from './Card';

const overrides = (theme: Theme) => {
  return Object.assign(Card(theme));
};

export default overrides;
