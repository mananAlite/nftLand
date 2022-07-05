import Image from 'next/image';

import { Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import NFTLogo from '../../assets/images/logo/nft.png';
import MintLogo from '../../assets/images/logo/mint.png';
import BlockchainLogo from '../../assets/images/logo/blockchain.png';
import WalletLogo from '../../assets/images/logo/wallet.png';

import { MuiTypography } from '../common';
import { pxToRem } from '../../utils/font';

const GuideSection = styled('section')(({ theme }) => ({
  display: 'grid',
  gap: pxToRem(24),
  margin: `${pxToRem(40)} 0 ${pxToRem(20)}`,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr'
  },
  [theme.breakpoints.between('sm', 1060)]: {
    gridTemplateColumns: '1fr 1fr'
  }
}));

const ImageContainer = styled(Box)({
  height: pxToRem(225),
  width: pxToRem(225),
  margin: 'auto'
}) as typeof Box;

function UserGuide(): JSX.Element {
  return (
    <Container maxWidth="xl" sx={{ paddingBlock: pxToRem(40) }}>
      <Box sx={{ textAlign: 'center' }}>
        <MuiTypography variant="h2">Create and sell your NFTs</MuiTypography>
      </Box>

      <GuideSection>
        {/* Connect Wallet step */}
        <Box>
          <ImageContainer>
            <Image src={WalletLogo} alt="Wallet Logo" />
          </ImageContainer>
          <MuiTypography variant="h3">Set up your wallet</MuiTypography>
          <MuiTypography variant="body1">
            Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right
            corner. Learn about the wallets we support.
          </MuiTypography>
        </Box>

        {/* Create Collection Step */}
        <Box>
          <ImageContainer>
            <Image src={BlockchainLogo} alt="Create Collection" />
          </ImageContainer>
          <MuiTypography variant="h3">Create your collection</MuiTypography>
          <MuiTypography variant="body1">
            Click My Collections and set up your collection. Add social links, a description, profile & banner images,
            and set a secondary sales fee.
          </MuiTypography>
        </Box>

        {/* Add NFT Step */}
        <Box>
          <ImageContainer>
            <Image src={NFTLogo} alt="NFT " />
          </ImageContainer>
          <MuiTypography variant="h3">Add your NFTs</MuiTypography>
          <MuiTypography variant="body1">
            Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with
            properties, stats, and unlockable content.
          </MuiTypography>
        </Box>
        {/* List NFT */}
        <Box>
          <ImageContainer>
            <Image src={MintLogo} alt="List NFT" />
          </ImageContainer>
          <MuiTypography variant="h3">List them for sale</MuiTypography>
          <MuiTypography variant="body1">
            Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell
            your NFTs, and we help you sell them!
          </MuiTypography>
        </Box>
      </GuideSection>
    </Container>
  );
}

export default UserGuide;
