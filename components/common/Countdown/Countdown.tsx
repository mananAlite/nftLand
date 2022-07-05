import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import Countdown from 'react-countdown';

type Props = {
  startTime: number;
  endTime: number;
};

export default function CountdownComponent({ startTime, endTime }: Props) {
  return (
    <>
      {Number(startTime) > 0 && Number(endTime) > 0 && (
        <Box sx={{ my: 2 }}>
          {Number(startTime) > Math.floor(Date.now() / 1000) && 'Auction will start soon'}
          {Number(startTime) < Math.floor(Date.now() / 1000) && Number(endTime) > Math.floor(Date.now() / 1000) && (
            <Countdown date={new Date(Number(endTime) * 1000)} />
          )}
          {Number(endTime) < Math.floor(Date.now() / 1000) && 'Auction is ended,Winner will be decleared soon'}
        </Box>
      )}
    </>
  );
}
