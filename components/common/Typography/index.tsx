import Typography, { TypographyProps } from '@mui/material/Typography';

function MuiTypography({ children, variant, ...props }: TypographyProps): JSX.Element {
  return (
    <Typography variant={variant} {...props}>
      {children}
    </Typography>
  );
}

export default MuiTypography;
