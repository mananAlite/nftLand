import Image from 'next/image';

import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

import HeroRight from '../../assets/images/background/hero.png';

import { MuiTypography } from '../common';

import { NAVBAR_HEIGHT } from '../../layout/layout';
import { pxToRem } from '../../utils/font';

const HeroContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gap: pxToRem(80),
    gridTemplateColumns: '1fr 1fr',
    placeItems: 'center',
    minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
  },
  display: 'grid',
  placeItems: 'center',
  gap: pxToRem(40),
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
})) as typeof Box;

function Hero(): JSX.Element {
  return (
    <Container>
      <HeroContainer>
        <Box className="left-container">
          <Box>
            <MuiTypography variant="h1">Discover, collect, and sell NFTs</MuiTypography>
          </Box>
          <Box>
            <MuiTypography variant="body1">
              Discover the most outstanding NTFs in all topics of life. Creative your NTFs and sell them
            </MuiTypography>
          </Box>
        </Box>
        <Box className="right-container">
          <Box>
            <Image src={HeroRight} alt="hero" priority />
          </Box>
        </Box>
      </HeroContainer>
    </Container>
  );
}

export default Hero;
