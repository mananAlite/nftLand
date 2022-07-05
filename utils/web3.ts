import { ethers } from 'ethers';

export const APP_NETWORK: number = 80001;

export const factoryAddress: string =
  '0x8B784dB1FF1AF7599CDD91f625e35C63f96C946b'; /* '0xEe642530F3ABf80301F47A32db0BcFa55C6F5106' */

export const depolyERC721Contract = async (
  minterAddress: string,
  name: string,
  symbol: string,
  isTransferable: boolean,
  hardcap: number,
  FactoryContract: any,
  signer: any
) => {
  try {
    const deployfunc = await FactoryContract.connect(signer).createNewERC721NFTContract(
      minterAddress,
      name,
      symbol,
      isTransferable,
      hardcap
    );
    return deployfunc;
  } catch (err) {
    console.log(err);
  }
};

export const getContractsDetails = async (userWallet: string, FactoryContract: any) => {
  try {
    const details = await FactoryContract.getContractsDetails(userWallet);
    return details;
  } catch (err) {
    console.log(err);
  }
};

export const mintNFT = async (
  ERC721Instance: any,
  signer: any,
  minterAddress: string,
  tokenURI: string,
  amount: string
) => {
  try {
    const minted = await ERC721Instance.connect(signer).singleMintNFT(
      minterAddress,
      tokenURI,
      ethers.utils.parseEther(amount)
    );
    return minted;
  } catch (err) {
    console.log(err);
  }
};

export const transferNFT = async (
  ERC721Instance: any,
  signer: any,
  minterAddress: string,
  toAddress: string,
  tokenId: number
) => {
  try {
    const minted = await ERC721Instance.connect(signer).transferFrom(minterAddress, toAddress, tokenId);
    return minted;
  } catch (err) {
    console.log(err);
  }
};

export const withDrawAmountTo = async (ERC721Instance: any, signer: any, minterAddress: string, toAddress: string) => {
  try {
    const amountTransfered = await ERC721Instance.connect(signer).withdrawFund(toAddress);
    return amountTransfered;
  } catch (err) {
    console.log(err);
  }
};

export const setTokenURI = async (
  ERC721Instance: any,
  signer: any,
  minterAddress: string,
  tokenId: number,
  uri: string
) => {
  try {
    const uriIsSet = await ERC721Instance.connect(signer).setTokenURI(tokenId, uri);
    return uriIsSet;
  } catch (err) {
    console.log(err);
  }
};

export const getTokenURI = async (ERC721Instance: any, minterAddress: string, tokenId: number) => {
  try {
    const uri = await ERC721Instance.tokenURI(tokenId);
    return uri;
  } catch (err) {
    console.log(err);
  }
};

export const setHardcap = async (ERC721Instance: any, signer: any, minterAddress: string, amount: string) => {
  try {
    const hardcapIsSet = await ERC721Instance.connect(signer).setHardcap(amount);
    return hardcapIsSet;
  } catch (err) {
    console.log(err);
  }
};

//----------marketplace contract func--------//

export const makeBid = async (marketplace: any, signer: any, tokenId: number, tokenAmount: string) => {
  try {
    const putBid = await marketplace.connect(signer).Bid(tokenId, { value: ethers.utils.parseEther(tokenAmount) });
    return putBid;
  } catch (err) {
    console.log(err);
  }
};

export const buyNFT = async (marketplace: any, signer: any, tokenId: number, tokenAmount: string) => {
  try {
    const makeDeal = await marketplace
      .connect(signer)
      .buyToken(tokenId, { value: ethers.utils.parseEther(tokenAmount), gasLimit: 100000 });
    return makeDeal;
  } catch (err) {
    console.log(err);
  }
};

export const stopAuction = async (marketplace: any, signer: any, tokenId: number) => {
  try {
    const isCancel = await marketplace.connect(signer).cancelAuction(tokenId);
    return isCancel;
  } catch (err) {
    console.log(err);
  }
};

export const nftWinner = async (marketplace: any, signer: any, tokenId: number) => {
  try {
    const isClaimed = await marketplace.connect(signer).claimNFT(tokenId);
    return isClaimed;
  } catch (err) {
    console.log(err);
  }
};

export const listNFT = async (
  marketplace: any,
  signer: any,
  _tokenId: number,
  _actionForAuction: boolean,
  _bidStartTime: number,
  _bidEndTime: number
) => {
  try {
    const isListed = await marketplace
      .connect(signer)
      .listTokenForSale(_tokenId, _actionForAuction, _bidStartTime, _bidEndTime);
    return isListed;
  } catch (err) {
    console.log(err);
  }
};

export const takeBackBidAmount = async (marketplace: any, signer: any, _tokenId: number) => {
  try {
    const isRefunded = await marketplace.connect(signer).refundbid(_tokenId);
    return isRefunded;
  } catch (err) {
    console.log(err);
  }
};

export const refundEthAfterAuction = async (marketplace: any, signer: any, _tokenId: number) => {
  try {
    const isRefundedAllAmount = await marketplace.connect(signer).refundBidAmount(_tokenId);
    return isRefundedAllAmount;
  } catch (err) {
    console.log(err);
  }
};

export const unlistTokenFromSale = async (marketplace: any, signer: any, _tokenId: number) => {
  try {
    const unlistNFT = await marketplace.connect(signer).unlistTokenForSale(_tokenId);
    return unlistNFT;
  } catch (err) {
    console.log(err);
  }
};

export const updateAuctionTiming = async (
  marketplace: any,
  signer: any,
  _tokenId: number,
  _bidStartTime: number,
  _bidEndTime: number
) => {
  try {
    const isUpdated = await marketplace.connect(signer).updateAuctionTime(_tokenId, _bidStartTime, _bidEndTime);
    return isUpdated;
  } catch (err) {
    console.log(err);
  }
};

export const withdrawAllFundFromContract = async (marketplace: any, signer: any, _to: string) => {
  try {
    const withdraw = await marketplace.connect(signer).withdrawFund(_to);
    return withdraw;
  } catch (err) {
    console.log(err);
  }
};

const bidCounts = async (marketplace: any, tokenID: number) => {
  try {
    const getBidCounts = await marketplace.getUserBidCount(tokenID);
    return getBidCounts;
  } catch (err) {
    console.log(err);
  }
};

export const getUserBidDetails = async (marketplace: any, tokenID: number) => {
  try {
    const getUserBid: any = [];
    const count = await bidCounts(marketplace, tokenID);
    for (let i = 0; i < count; i++) {
      getUserBid.push(await marketplace.bidDetails(tokenID, i));
    }
    return getUserBid;
  } catch (err) {
    console.log(err);
  }
};

export const getBidWinner = async (marketplace: any, tokenID: number) => {
  try {
    const isWinner = await marketplace.bidWinner(tokenID);
    return isWinner;
  } catch (err) {
    console.log(err);
  }
};

export const getTokenDetails = async (marketplace: any, tokenID: number) => {
  try {
    const Details = await marketplace.TokenDetails(tokenID);
    return Details;
  } catch (err) {
    console.log(err);
  }
};

export const shortenAddress = (address: string) => {
  return address.slice(0, 4) + '...' + address.slice(address.length - 5, address.length);
};

export const approveUser = async (marketplace: any, signer: any, tokenID: number, useAddress: string) => {
  try {
    const isApprove = await marketplace.connect(signer).approve(useAddress, tokenID, { gasLimit: 100000 });
    return isApprove;
  } catch (err) {
    console.log(err);
  }
};
