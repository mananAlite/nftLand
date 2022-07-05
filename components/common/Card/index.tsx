import { useRouter } from 'next/router';
import React, { SyntheticEvent, useEffect } from 'react';
import Image from 'next/image';

import { Card, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import Gray from '../../../assets/images/gray.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { MuiTypography, MuiButton } from '../../common';

import { pxToRem } from '../../../utils/font';
import { useAppSelector } from '../../../hooks/redux';
import axios from 'axios';

interface CardProps {
  data?: {
    image_ipfs_uri: string;
    name: string;
    tokenAmount: number;
    isForSale: boolean;
    _id: string;
  };
  collectionData?: {
    name: string;
  };
}

const CardContainer = styled(Card)({
  maxWidth: pxToRem(350)
});

const ImageContainer = styled(Box)({
  maxHeight: pxToRem(350),
  width: pxToRem(350)
});

const PriceContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: pxToRem(10)
});

function MuiCard({ data, collectionData }: CardProps): JSX.Element {
  const { address, userID } = useAppSelector((state) => state.master);
  const [isLiked, setLike] = React.useState<boolean>(false);
  const [likeCount, setLikeCount] = React.useState<number>();
  const router = useRouter();
  const handleLike = (event: SyntheticEvent) => {
    event.stopPropagation();
    axios
      .put(`/api/nft/like`, { userId: userID, nftId: data?._id })
      .then((res) => setLike(!isLiked))
      .catch((err) => err);
  };

  useEffect(() => {
    axios
      .get(`/api/nft/${data?._id}`)
      .then((res) => {
        setLikeCount(res?.data?.data?.likes.length);
        res?.data?.data?.likes.map((item: string) => {
          if (item === userID) {
            setLike(true);
          }
        });
      })
      .catch((err) => err);
  }, [data?._id, userID, isLiked]);

  const handleRedirectToNFTPage = () => {
    router.push(`/nft/${data?._id}`);
  };

  return (
    <CardContainer onClick={handleRedirectToNFTPage}>
      <ImageContainer>
        <Image
          src={data!.image_ipfs_uri || Gray}
          height={350}
          width={350}
          objectFit="cover"
          alt="Card Image"
          priority
        />
      </ImageContainer>
      <Box sx={{ p: 2 }}>
        <Box sx={{ marginBlock: pxToRem(10) }}>
          <MuiTypography variant="h3">{data!.name || 'NFT'}</MuiTypography>
          <MuiTypography variant="body1">{collectionData?.name || 'NFT Collection'}</MuiTypography>
        </Box>

        <Box>
          <MuiTypography>Price</MuiTypography>
          <MuiTypography>{data!.tokenAmount || '0.0'} ETH</MuiTypography>
        </Box>

        <PriceContainer>
          <MuiButton variant="text" color="primary">
            {data!.isForSale && <MuiTypography variant="button">Buy Now </MuiTypography>}
          </MuiButton>

          {address && (
            <IconButton onClick={(event) => handleLike(event)}>
              {isLiked && <FavoriteIcon color={'error'} />}
              {!isLiked && <FavoriteBorderIcon />}
              &nbsp;{likeCount}
            </IconButton>
          )}
        </PriceContainer>
      </Box>
    </CardContainer>
  );
}

export default MuiCard;
