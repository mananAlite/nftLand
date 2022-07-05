import { Theme } from '@mui/material';
import { pxToRem } from '../../utils/font';

function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: pxToRem(20),
          margin: pxToRem(15),
          boxShadow: '0px 7px 30px 0px rgba(90, 114, 123, 0.11)',
          '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`,
            cursor: 'pointer'
          }
        }
      }
    }
  };
}

export default Card;
