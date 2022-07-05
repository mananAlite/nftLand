import TextField, { TextFieldProps } from '@mui/material/TextField';

function MuiTextField({ color, disabled, variant, onChange, ...props }: TextFieldProps): JSX.Element {
  return <TextField color={color} disabled={disabled} onChange={onChange} variant={variant} {...props} />;
}

export default MuiTextField;
