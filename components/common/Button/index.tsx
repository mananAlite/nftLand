import Button, { ButtonProps } from '@mui/material/Button';

function MuiButton({ children, disabled, variant, ...props }: ButtonProps): JSX.Element {
  return (
    <Button disabled={disabled} variant={variant} {...props}>
      {children}
    </Button>
  );
}

export default MuiButton;
