import Image from 'next/image';

import { Card, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { MuiTypography } from '../index';

import { pxToRem } from '../../../utils/font';

interface CollectionCardProps {
  data: {
    image_url: string;
    name: string;
    description: string;
  };
}

const CardContainer = styled(Card)({
  maxWidth: pxToRem(420),
  height: pxToRem(470)
});

const DetailsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexDirection: 'column'
});

function MuiCollectionCard({ data }: CollectionCardProps): JSX.Element {
  return (
    <CardContainer>
      <Image width={420} height={340} src={data.image_url} alt="img" />
      <DetailsContainer>
        <MuiTypography variant="h4" sx={{ p: 2 }}>
          {data.name || 'Collection Name'}
        </MuiTypography>
        <MuiTypography variant="body1">{data.description || 'Collection Description'}</MuiTypography>
      </DetailsContainer>
    </CardContainer>
  );
}

export default MuiCollectionCard;
