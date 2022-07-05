import type { GetServerSideProps } from 'next';
import { Box, Container, Grid } from '@mui/material';

import { ObjectId } from 'mongodb';

import { MuiCard, MuiTypography, NextLink } from '../../components/common';

import { useAppSelector } from '../../hooks/redux';

import clientPromise from '../../utils/connect';
import { MONGODB_DB } from '../../constant/Mongo';

type Props = {
  nftList: any;
  collection: any;
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const id = context.params.id;
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);

  const resCollections = await db.collection('collections').findOne({ _id: new ObjectId(id as string) });

  const resNFTS = await db
    .collection('nft-collection')
    .find({ collection_id: new ObjectId(id as string) })
    .toArray();
  return {
    props: {
      collection: JSON.parse(JSON.stringify(resCollections)),
      nftList: JSON.parse(JSON.stringify(resNFTS))
    }
  };
};

export default function CollectionDetails({ nftList, collection }: Props) {
  const { address } = useAppSelector((state) => state.master);

  return (
    <>
      <Container>
        <MuiTypography variant="h2" sx={{ my: 3 }}>
          {collection?.name}
        </MuiTypography>
        {address ? (
          <Box sx={{ my: 5 }}>
            <Grid container>
              {nftList.map((item: any) => (
                <Grid item xs={12} lg={4} key={item._id}>
                  <NextLink to={`/nft/${item._id}`}>
                    <MuiCard data={item} collectionData={collection} />
                  </NextLink>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <MuiTypography variant="h2">Please connect wallet</MuiTypography>
          </Box>
        )}
      </Container>
    </>
  );
}
