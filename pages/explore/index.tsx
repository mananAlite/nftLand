import type { GetServerSideProps } from 'next';
import { Grid, Container } from '@mui/material';

import { MuiCard, MuiTypography } from '../../components/common';

import clientPromise from '../../utils/connect';
import { MONGODB_DB } from '../../constant/Mongo';

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);

  const findNFTS = await db.collection('nft-collection').find({}).toArray();
  console.log('🚀 ~ file: index.tsx ~ line 14 ~ constgetServerSideProps:GetServerSideProps= ~ findNFTS', findNFTS);

  return {
    props: {
      allNFTS: JSON.parse(JSON.stringify(findNFTS)) || {}
    }
  };
};

interface ExploreProps {
  allNFTS: any;
}

function Explore({ allNFTS }: ExploreProps): JSX.Element {
  return (
    <Container>
      <div style={{ textAlign: 'center' }}>
        <MuiTypography variant="h1">Explore all NFTs</MuiTypography>
      </div>
      {allNFTS ? (
        <Grid container spacing={2}>
          {allNFTS?.map((item: any) => (
            <Grid item xs={12} lg={4} md={4} sm={6} key={item?._id}>
              <MuiCard data={item} key={item?._id} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <MuiTypography>No NFTs found</MuiTypography>
        </div>
      )}
    </Container>
  );
}

export default Explore;
