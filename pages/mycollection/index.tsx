import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import axios from 'axios';

import { MuiButton, MuiCollectionCard, MuiTypography, NextLink } from '../../components/common';

import { NAVBAR_HEIGHT } from '../../layout/layout';
import { pxToRem } from '../../utils/font';

import { useAppSelector } from '../../hooks/redux';

const StyledSection = styled('section')({
  display: 'grid',
  placeItems: 'center',
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
});

const StyledBox = styled(Box)({
  maxWidth: pxToRem(270),
  padding: pxToRem(16),
  backgroundColor: 'white',
  textAlign: 'center',
  borderRadius: pxToRem(8),
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
});

export default function MyCollection(): JSX.Element {
  const { address } = useAppSelector((state) => state.master);

  const [collections, setCollections] = useState<[]>([]);
  const router = useRouter();

  useEffect(() => {
    getCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const goToCreatePage = () => {
    router.push('/create/collection');
  };

  const getCollections = async () => {
    if (address !== '' || undefined) {
      const res = await axios.post('/api/collection/usercollections', {
        owner_address: address
      });
      setCollections(res?.data?.data);
    }
  };

  return (
    <>
      <Head>
        <title>My Collections</title>
      </Head>
      <Box sx={{ my: 3, mx: 3 }}>
        <Typography variant="h1">My collections</Typography>
      </Box>
      {collections?.length > 0 ? (
        <Box sx={{ mx: 5, my: 3, p: 2 }}>
          <Grid container>
            {collections?.map((item: any) => (
              <Grid item xs={12} lg={4} key={item?._id}>
                <NextLink to={`/mycollection/${item?._id}`} key={item?._ids}>
                  <MuiCollectionCard data={item} />
                </NextLink>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <StyledSection>
          <StyledBox>
            <MuiTypography variant="h3">No Collections Found</MuiTypography>
            <MuiButton variant="contained" onClick={goToCreatePage} sx={{ marginBlock: pxToRem(16) }}>
              Create Collections
            </MuiButton>
          </StyledBox>
        </StyledSection>
      )}
    </>
  );
}
