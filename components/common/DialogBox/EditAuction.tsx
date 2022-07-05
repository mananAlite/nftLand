import React from 'react';
import { FormControl, FormHelperText, FormLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MuiButton from '../Button';

type Props = {
  openModel: boolean;
  closeModel: () => void;
  txnFunc: (startTime: number, endTime: number) => void;
};

export default function EditAuction({ openModel, txnFunc, closeModel }: Props) {
  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required('Field required'),
    endTime: Yup.string().required('Field required')
  });

  const Formik = useFormik({
    initialValues: {
      startTime: '',
      endTime: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      txnFunc(new Date(values?.startTime).getTime() / 1000, new Date(values?.endTime).getTime() / 1000);
    }
  });

  return (
    <>
      <Dialog onClose={closeModel} open={openModel}>
        <DialogTitle>Edit auction time</DialogTitle>
        <DialogContent>
          <form onSubmit={Formik.handleSubmit}>
            <FormControl
              variant="standard"
              error={Formik.errors.startTime && Formik.touched.startTime ? true : false}
              fullWidth
              sx={{ my: 1 }}
            >
              <FormLabel>Start time</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField {...props} error={Formik.errors.startTime && Formik.touched.startTime ? true : false} />
                  )}
                  value={Formik.values.startTime}
                  onChange={(value) => Formik.setFieldValue('startTime', value)}
                />
              </LocalizationProvider>
              <FormHelperText>{Formik.touched.startTime && Formik.errors.startTime}</FormHelperText>
            </FormControl>
            <FormControl
              variant="standard"
              error={Formik.errors.endTime && Formik.touched.endTime ? true : false}
              fullWidth
              sx={{ my: 1 }}
            >
              <FormLabel>End time</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField {...props} error={Formik.errors.endTime && Formik.touched.endTime ? true : false} />
                  )}
                  value={Formik.values.endTime}
                  onChange={(value) => Formik.setFieldValue('endTime', value)}
                />
              </LocalizationProvider>
              <FormHelperText>{Formik.touched.endTime && Formik.errors.endTime}</FormHelperText>
            </FormControl>
            <MuiButton sx={{ width: '100%' }} type="submit" variant="contained">
              List
            </MuiButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
