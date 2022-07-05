import React from 'react';
import { Box, FormControl, FormHelperText, FormLabel, OutlinedInput } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MuiButton from '../Button';

type Props = {
  openModel: boolean;
  closeModel: () => void;
  txnFunc: (amount: string) => void;
};

export default function Bid({ openModel, closeModel, txnFunc }: Props) {
  const Formik = useFormik({
    initialValues: {
      amount: ''
    },
    validationSchema: Yup.object().shape({
      amount: Yup.string().required('Please fill amount')
    }),
    onSubmit: async (values) => {
      txnFunc(values?.amount);
    }
  });

  return (
    <>
      <Dialog open={openModel} onClose={closeModel}>
        <DialogTitle>Bidding </DialogTitle>
        <DialogContent>
          <form onSubmit={Formik.handleSubmit}>
            <FormControl
              variant="standard"
              fullWidth
              error={Formik.errors.amount && Formik.touched.amount ? true : false}
            >
              <FormLabel>Bid amount</FormLabel>
              <OutlinedInput
                color="primary"
                autoComplete="off"
                name="amount"
                value={Formik.values.amount}
                onChange={(e) => Formik.setFieldValue('amount', e.target.value.trim())}
                type="text"
                placeholder="Enter bid amount"
              />
              <FormHelperText>{Formik.touched.amount && Formik.errors.amount}</FormHelperText>
            </FormControl>
            <MuiButton sx={{ width: '100%', mt: 1 }} type="submit" variant="contained">
              Bid
            </MuiButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
