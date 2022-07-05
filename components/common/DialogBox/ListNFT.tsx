import React, { useEffect, useState } from 'react';
import { FormControl, FormHelperText, FormLabel, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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
  txnFunc: (action: boolean, startTime: number, endTime: number) => void;
};

export default function ListNFTForSale({ closeModel, openModel, txnFunc }: Props) {
  const [isAuctionTrue, setAuctionTrue] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required('Field required'),
    endTime: Yup.string().required('Field required')
  });

  const formik = useFormik({
    initialValues: {
      startTime: '',
      endTime: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      txnFunc(true, new Date(values?.startTime).getTime() / 1000, new Date(values?.endTime).getTime() / 1000);
    }
  });

  return (
    <>
      <Dialog onClose={closeModel} open={openModel} sx={{ px: 2 }}>
        <DialogTitle>List NFT</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setAuctionTrue(e.target.checked);
                  }}
                />
              }
              label="Add for auction"
            />
          </FormGroup>
          {!isAuctionTrue && (
            <MuiButton sx={{ width: '100%' }} variant="contained" onClick={() => txnFunc(false, 0, 0)}>
              List
            </MuiButton>
          )}
          {isAuctionTrue && (
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                variant="standard"
                error={formik.errors.startTime && formik.touched.startTime ? true : false}
                fullWidth
                sx={{ my: 1 }}
              >
                <FormLabel>Start time</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        error={formik.errors.startTime && formik.touched.startTime ? true : false}
                      />
                    )}
                    value={formik.values.startTime}
                    onChange={(value) => formik.setFieldValue('startTime', value)}
                  />
                </LocalizationProvider>
                <FormHelperText>{formik.touched.startTime && formik.errors.startTime}</FormHelperText>
              </FormControl>
              <FormControl
                variant="standard"
                error={formik.errors.endTime && formik.touched.endTime ? true : false}
                fullWidth
                sx={{ my: 1 }}
              >
                <FormLabel>End time</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => (
                      <TextField {...props} error={formik.errors.endTime && formik.touched.endTime ? true : false} />
                    )}
                    value={formik.values.endTime}
                    onChange={(value) => formik.setFieldValue('endTime', value)}
                  />
                </LocalizationProvider>
                <FormHelperText>{formik.touched.endTime && formik.errors.endTime}</FormHelperText>
              </FormControl>
              <MuiButton sx={{ width: '100%' }} type="submit" variant="contained">
                List
              </MuiButton>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
