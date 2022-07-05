import { Snackbar, IconButton, Alert, AlertColor } from '@mui/material';
import Close from '@mui/icons-material/Close';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { closeAlert } from '../../../reducers/masterSlice';

function MuiAlert() {
  const { alertOpen, alertMessage, alertColor } = useAppSelector((state) => state.master);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeAlert());
  };

  return (
    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alertColor as AlertColor} variant="filled">
        {alertMessage}
      </Alert>
    </Snackbar>
  );
}

export default MuiAlert;
