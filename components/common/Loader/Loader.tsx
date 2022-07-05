import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setLoaderOpen } from '../../../reducers/masterSlice';

type Props = {};

const LoaderContainer = styled(Box)({
  display: 'grid',
  placeItems: 'center',
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0
  //   background: 'rgba(0,0,0,0.6)'
});

export default function Loader({}: Props) {
  const { isLoaderOpen } = useAppSelector((state) => state.master);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(setLoaderOpen(false));
  };

  return (
    <>
      {isLoaderOpen && (
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoaderOpen}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
    </>
  );
}
