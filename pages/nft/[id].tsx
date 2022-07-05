import { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Container, Grid, IconButton, Typography, Card } from '@mui/material';
import Image from 'next/image';
import { ethers } from 'ethers';
import gray from '../../assets/images/gray.png';
import { MuiButton } from '../../components/common';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import eth from '../../assets/images/eth.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  approveUser,
  buyNFT,
  getBidWinner,
  getTokenDetails,
  getUserBidDetails,
  listNFT,
  makeBid,
  nftWinner,
  refundEthAfterAuction,
  shortenAddress,
  stopAuction,
  takeBackBidAmount,
  unlistTokenFromSale,
  updateAuctionTiming
} from '../../utils/web3';
import Bid from '../../components/common/DialogBox/Bid';
import EditAuction from '../../components/common/DialogBox/EditAuction';
import ListNFTForSale from '../../components/common/DialogBox/ListNFT';
import CountdownComponent from '../../components/common/Countdown/Countdown';
import { setLoaderOpen } from '../../reducers/masterSlice';
import { toast } from 'react-toastify';
import { is } from 'immer/dist/internal';

const ABI = require('../../utils/abi/ERC721.json') as any;

export default function NftDetail() {
  const { address, signer, userID } = useAppSelector((state) => state.master);
  const [newERC721, setNewERC721] = useState<any>();
  const [collectionDetails, setCollectionDetails] = useState<any>();
  const [nftDetails, setNftDetails] = useState<any>();
  const [nftDetailsFromContract, setNftDetailsFromContract] = useState<any>();
  const [listNFTModel, setListNFTMdoel] = useState<boolean>(false);
  const [isEditModelTrue, setEditModelTrue] = useState<boolean>(false);
  const [isMakeOfferModelOpen, setMakeOfferOpen] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>('');
  const [getBiddersDetails, setBiddersDetails] = useState<any>();
  const [isLiked, setLike] = useState<boolean>(false);
  const [likeCountIs, setLikeCount] = useState<number>(0);
  const dispatch = useAppDispatch();

  const {
    query: { id }
  } = useRouter();

  useEffect(() => {
    id && getDetails();
  }, [id]);

  useEffect(() => {
    nftDetails?.likes.map((array: string) => {
      if (array === userID) {
        setLike(true);
      }
    });
  }, [nftDetails, userID]);

  useEffect(() => {
    id &&
      getTokenDetails(newERC721, nftDetails?.token_id - 1)
        .then((res) => setNftDetailsFromContract(res))
        .catch((err) => err);
    newERC721 &&
      getUserBidDetails(newERC721, nftDetails?.token_id - 1)
        .then((res) => setBiddersDetails(res))
        .catch((err) => err);
  }, [address, id, newERC721]);

  useEffect(() => {
    nftDetails?.bidEndTime < Math.floor(Date.now() / 1000) &&
      nftDetails?.bidEndTime < Math.floor(Date.now() / 1000) &&
      getBidWinner(newERC721, nftDetails?.token_id - 1)
        .then((res) => setWinner(res?.[1]))
        .catch((err) => err);
  }, [getBiddersDetails]);

  const handleLike = () => {
    setLike(!isLiked);
    axios
      .put('/api/nft/like', { userId: userID, nftId: nftDetails?._id })
      .then((res) =>
        axios
          .get(`/api/nft/${id}`)
          .then((res1) => {
            setLikeCount(res1?.data?.data?.likes?.length);
          })
          .catch((err) => err)
      )
      .catch((err) => err);
  };

  const getDetails = () => {
    dispatch(setLoaderOpen(true));
    axios
      .get(`/api/nft/${id}`)
      .then((res) => {
        setNftDetails(res?.data?.data);
        setLikeCount(res?.data?.data?.likes?.length);
        axios
          .get(`/api/collection/${res?.data?.data?.collection_id}`)
          .then((res1) => {
            dispatch(setLoaderOpen(false));
            setCollectionDetails(res1?.data?.data?.[0]);
            if (res1?.data?.data?.[0]?.contract_address) {
              setNewERC721(
                new ethers.Contract(
                  res1?.data?.data?.[0]?.contract_address,
                  ABI,
                  new ethers.providers.Web3Provider(window?.ethereum)
                )
              );
            }
          })
          .catch((err) => dispatch(setLoaderOpen(false)));
      })
      .catch((err) => dispatch(setLoaderOpen(false)));
  };

  const BuyNFT = () => {
    dispatch(setLoaderOpen(true));
    approveUser(newERC721, signer, nftDetails?.token_id - 1, address)
      .then(async (res) => {
        await res.wait();
        buyNFT(newERC721, signer, nftDetails?.token_id - 1, String(nftDetails?.tokenAmount))
          .then(async (res1) => {
            await res1.wait();
            const body = {
              isForSale: false,
              isForAuction: false,
              bidStartTime: 0,
              bidEndTime: 0,
              user_id: userID
            };
            axios
              .put(`/api/nft/${id}`, body)
              .then((res) => {
                dispatch(setLoaderOpen(false));
              })
              .catch((err) => dispatch(setLoaderOpen(false)));
          })
          .catch((err) => dispatch(setLoaderOpen(false)));
      })
      .catch((err) => dispatch(setLoaderOpen(false)));
  };

  const openNFTModel = () => {
    setListNFTMdoel(!listNFTModel);
  };
  const editAuctionModel = () => {
    setEditModelTrue(!isEditModelTrue);
  };

  const bidModel = () => {
    setMakeOfferOpen(!isMakeOfferModelOpen);
  };

  const ListNFT = (actionForAuction: boolean, startTime: number, endTime: number) => {
    setListNFTMdoel(false);
    dispatch(setLoaderOpen(true));
    listNFT(newERC721, signer, nftDetails?.token_id - 1, actionForAuction, startTime, endTime)
      .then(async (res) => {
        await res.wait();
        toast.success('NFT Listed :)');
        const body = {
          isForSale: true,
          isForAuction: actionForAuction,
          bidStartTime: startTime,
          bidEndTime: endTime
        };
        axios
          .put(`/api/nft/${id}`, body)
          .then((res) => {
            getTokenDetails(newERC721, nftDetails?.token_id - 1)
              .then((res) => setNftDetailsFromContract(res))
              .catch((err) => err);
            dispatch(setLoaderOpen(false));
            setListNFTMdoel(false);
            toast.success('NFT Details updated');
          })
          .catch((err) => {
            toast.error('Network Error');
            dispatch(setLoaderOpen(false));
          });
      })
      .catch((err) => {
        toast.error('Something went wrong');
        dispatch(setLoaderOpen(false));
      });
  };

  const editAuctionFunc = (startTime: number, endTime: number) => {
    dispatch(setLoaderOpen(true));
    setEditModelTrue(false);

    updateAuctionTiming(newERC721, signer, nftDetails?.token_id - 1, startTime, endTime)
      .then(async (res1) => {
        await res1.wait();
        const body = {
          isForSale: true,
          isForAuction: true,
          bidStartTime: startTime,
          bidEndTime: endTime
        };
        axios
          .put(`/api/nft/${id}`, body)
          .then((res2) => {
            getTokenDetails(newERC721, nftDetails?.token_id - 1)
              .then((res3) => setNftDetailsFromContract(res3))
              .catch((err) => err);
            dispatch(setLoaderOpen(false));
            toast.success('Auction details updated');
          })
          .catch((err) => {
            dispatch(setLoaderOpen(false));
            toast.error('Network Error');
          });
      })
      .catch((err) => {
        dispatch(setLoaderOpen(false));
        toast.error('Something went wrong');
      });
  };

  const Makebid = (amount: string) => {
    dispatch(setLoaderOpen(true));
    makeBid(newERC721, signer, nftDetails?.token_id - 1, amount)
      .then(async (res) => {
        await res.wait();
        toast.success('Bid is submited');
        setMakeOfferOpen(false);
        getUserBidDetails(newERC721, nftDetails?.token_id - 1)
          .then((res) => {
            setBiddersDetails(res);
            dispatch(setLoaderOpen(false));
          })
          .catch((err) => dispatch(setLoaderOpen(false)));
      })
      .catch((err) => {
        toast.error('Something went wrong');
        dispatch(setLoaderOpen(false));
      });
  };

  const NftWinner = () => {
    dispatch(setLoaderOpen(true));
    approveUser(newERC721, signer, nftDetails?.token_id - 1, address)
      .then(async (res) => {
        await res.wait();
        nftWinner(newERC721, signer, nftDetails?.token_id - 1)
          .then(async (res) => {
            await res.wait();
            toast.success('NFT claimed');
            const Body = {
              user_id: userID,
              bidEndTime: 0,
              bidStartTime: 0,
              isForAuction: false,
              isForSale: false
            };
            axios
              .put(`/api/nft/${nftDetails?._id}`, Body)
              .then((res) => dispatch(setLoaderOpen(false)))
              .catch((err) => {
                dispatch(setLoaderOpen(false));
                toast.error('Network Error');
              });
          })
          .catch((err) => {
            dispatch(setLoaderOpen(false));
            toast.error('Something went wrong');
          });
      })
      .catch((err) => {
        toast.error('Something went wrong');
        dispatch(setLoaderOpen(false));
      });
  };

  const cancelAuction = () => {
    dispatch(setLoaderOpen(true));
    stopAuction(newERC721, signer, nftDetails?.token_id - 1)
      .then(async (res) => {
        await res.wait();
        toast.success('Auction is canceled');
        getUserBidDetails(newERC721, nftDetails?.token_id - 1)
          .then((res) => setBiddersDetails(res))
          .catch((err) => err);
        const Body = {
          bidEndTime: 0,
          bidStartTime: 0,
          isForAuction: false
        };
        axios
          .put(`/api/nft/${nftDetails?._id}`, Body)
          .then((res) => {
            toast.success('NFT details updated');
            dispatch(setLoaderOpen(false));
          })
          .catch((err) => {
            toast.error('Network Error');
            dispatch(setLoaderOpen(false));
          });
      })
      .catch((err) => {
        toast.error('Something went wrong');
        dispatch(setLoaderOpen(false));
      });
  };

  const unlistFromSale = () => {
    dispatch(setLoaderOpen(true));
    unlistTokenFromSale(newERC721, signer, nftDetails?.token_id - 1)
      .then(async (res) => {
        await res.wait();
        toast.success('Unlisted for sale');
        const Body = {
          bidEndTime: 0,
          bidStartTime: 0,
          isForAuction: false,
          isForSale: false
        };
        axios
          .put(`/api/nft/${nftDetails?._id}`, Body)
          .then((res) => {
            toast.success('Details updated');
            dispatch(setLoaderOpen(false));
          })
          .catch((err) => {
            toast.error('Network Error');
            dispatch(setLoaderOpen(false));
          });
      })
      .catch((err) => {
        toast.error('Something went wrong');
        dispatch(setLoaderOpen(false));
      });
  };

  const refundBidAmount = () => {
    dispatch(setLoaderOpen(true));
    takeBackBidAmount(newERC721, signer, nftDetails?.token_id - 1)
      .then(async (res) => await res.wait())
      .catch((err) => dispatch(setLoaderOpen(false)));
  };

  const refundAmount = () => {
    dispatch(setLoaderOpen(true));
    refundEthAfterAuction(newERC721, signer, nftDetails?.token_id - 1)
      .then(async (res) => {
        await res.wait();
        toast.success('Amount is refunded');
        dispatch(setLoaderOpen(false));
      })
      .catch((err) => {
        toast.error('Something went wrong');
        dispatch(setLoaderOpen(false));
      });
  };

  return (
    <>
      <Container>
        <Grid container sx={{ my: 3, justifyContent: 'space-around' }}>
          <Grid item lg={5} xs={12}>
            <Box
              sx={{
                border: '1px solid black',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              <Box>
                <Image
                  width={500}
                  height={400}
                  src={nftDetails?.image_ipfs_uri || gray}
                  alt={nftDetails?.image_ipfs_uri ? 'IPFS Image' : 'Grey Image'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">{nftDetails?.tokenAmount} ETH</Typography>
                  <Image width={50} height={50} src={eth} objectFit="contain" alt="Ethereum" />
                </Box>
                {address && (
                  <IconButton onClick={handleLike}>
                    {isLiked && <FavoriteIcon color={'error'} />}
                    {!isLiked && <FavoriteBorderIcon />}
                    &nbsp;{likeCountIs}
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item lg={5} xs={12} sx={{ justifyContent: '' }}>
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h1">{nftDetails?.name}</Typography>
              {address && address === collectionDetails?.owner_address && !nftDetails?.isForAuction && (
                <MuiButton variant={'outlined'} onClick={openNFTModel}>
                  List NFT
                </MuiButton>
              )}
              <ListNFTForSale openModel={listNFTModel} closeModel={openNFTModel} txnFunc={ListNFT} />
              {address && address === collectionDetails?.owner_address && nftDetails?.isForAuction && (
                <>
                  <MuiButton variant={'outlined'} onClick={() => setEditModelTrue(!isEditModelTrue)}>
                    Edit Auction
                  </MuiButton>
                </>
              )}
              <EditAuction openModel={isEditModelTrue} closeModel={editAuctionModel} txnFunc={editAuctionFunc} />
            </Box>
            <Box>
              {nftDetailsFromContract &&
                nftDetailsFromContract[1] &&
                nftDetailsFromContract[2] &&
                nftDetailsFromContract[4]._hex &&
                nftDetailsFromContract[5]._hex && (
                  <CountdownComponent
                    startTime={nftDetailsFromContract && nftDetailsFromContract[4]._hex}
                    endTime={nftDetailsFromContract && nftDetailsFromContract[5]._hex}
                  />
                )}
            </Box>
            <Box sx={{ my: 3 }}>
              {address &&
                address === collectionDetails?.owner_address &&
                nftDetails?.isForSale &&
                nftDetails?.isForAuction && (
                  <MuiButton fullWidth style={{ backgroundColor: 'red', color: 'white' }} onClick={cancelAuction}>
                    Stop Auction
                  </MuiButton>
                )}
            </Box>
            <Box sx={{ my: 3 }}>
              {address &&
                address === collectionDetails?.owner_address &&
                nftDetails?.isForSale &&
                !nftDetails?.isForAuction && (
                  <MuiButton fullWidth style={{ backgroundColor: 'red', color: 'white' }} onClick={unlistFromSale}>
                    Unlist Token
                  </MuiButton>
                )}
            </Box>
            <Box sx={{ my: 3 }}>
              {address &&
                address !== collectionDetails?.owner_address &&
                nftDetails?.isForSale &&
                nftDetails?.isForAuction &&
                nftDetails?.bidEndTime != 0 &&
                nftDetails?.bidEndTime > Math.floor(Date.now() / 1000) && (
                  <MuiButton fullWidth variant={'contained'} onClick={() => setMakeOfferOpen(!isMakeOfferModelOpen)}>
                    Make Offers
                  </MuiButton>
                )}
              <Bid openModel={isMakeOfferModelOpen} closeModel={bidModel} txnFunc={Makebid} />
            </Box>
            <Box sx={{ my: 3 }}>
              {address &&
                address !== collectionDetails?.owner_address &&
                nftDetails?.isForSale &&
                !nftDetails?.isForAuction && (
                  <MuiButton fullWidth variant={'contained'} onClick={BuyNFT}>
                    Buy
                  </MuiButton>
                )}
            </Box>
            <Box sx={{ my: 3 }}>
              {address &&
                winner &&
                address.toLowerCase() === winner.toLowerCase() &&
                nftDetails?.isForAuction &&
                nftDetails?.bidEndTime != 0 &&
                nftDetails?.bidEndTime < Math.floor(Date.now() / 1000) && (
                  <MuiButton fullWidth variant={'contained'} onClick={NftWinner}>
                    Claim NFT
                  </MuiButton>
                )}
            </Box>
            <Box sx={{ my: 3 }}>
              {getBiddersDetails &&
                getBiddersDetails.map(
                  (item: any) =>
                    address.toLowerCase() === item?.[1].toLowerCase() &&
                    winner &&
                    address.toLowerCase() !== winner.toLowerCase() &&
                    nftDetails?.bidEndTime < Math.floor(Date.now() / 1000) && (
                      <MuiButton fullWidth variant={'contained'} onClick={refundAmount}>
                        Claim bid amount
                      </MuiButton>
                    )
                )}
            </Box>
            <Box sx={{ my: 3 }}>
              {getBiddersDetails &&
                getBiddersDetails.map(
                  (item: any) =>
                    address.toLowerCase() === item?.[1].toLowerCase() &&
                    nftDetails?.bidEndTime !== 0 &&
                    nftDetails?.bidEndTime > Math.floor(Date.now() / 1000) && (
                      <MuiButton fullWidth style={{ background: 'red', color: 'white' }} onClick={refundBidAmount}>
                        Refund bid amount
                      </MuiButton>
                    )
                )}
            </Box>
            <Card sx={{ width: '100%', m: 0 }}>
              <Box sx={{ my: 2, p: 1 }}>
                <Typography variant="h4">Bid history</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2, my: 1 }}>
                <Typography variant="subtitle1">Amount</Typography>
                <Typography variant="subtitle1">Address</Typography>
              </Box>
              {getBiddersDetails?.length <= 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2, my: 1 }}>
                  <Typography variant="subtitle2">No Details available</Typography>
                </Box>
              )}
              {getBiddersDetails?.length > 0 && (
                <Box sx={{ height: '180px', overflowY: 'scroll' }}>
                  {getBiddersDetails.map((item: any) => (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 1, my: 1 }}>
                        <Typography variant="subtitle2">{parseInt(item?.[0]) / 1000000000000000000}</Typography>
                        <Typography variant="subtitle2">{shortenAddress(item?.[1]).toLowerCase()}</Typography>
                      </Box>
                    </>
                  ))}
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
