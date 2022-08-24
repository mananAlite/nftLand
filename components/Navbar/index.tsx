import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { ethers } from 'ethers';

import { AppBar, Box, Toolbar, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import axios from 'axios';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoIcon from '../Logo';

import { Hidden, MuiButton, MuiTypography, NextLink, MuiTextField } from '../common';
import { pxToRem } from '../../utils/font';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setWalletAddress, setSigner, setWalletConnected, setUserId, setChainId } from '../../reducers/masterSlice';
import { shortenAddress } from '../../utils/web3';

import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { useRouter } from 'next/router';
const APP_BAR_HEIGHT: number = 72;

const AppbarContainer = styled(AppBar)(({ theme }) => ({
  boxShadow: 'rgb(4 17 29 / 25%) 0px 0px 8px 0px',
  backgroundColor: theme.palette.background.default
})) as typeof AppBar;

const ToolbarContainer = styled(Toolbar)({
  height: APP_BAR_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  gap: pxToRem(16),
  justifyContent: 'space-between'
}) as typeof Toolbar;

const ListStyle = styled('ul')(({ theme }) => ({
  listStyleType: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: pxToRem(10),
  '& li': {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    padding: pxToRem(8),
    cursor: 'pointer',
    '& h5': {
      color: theme.palette.grey[700]
    },
    '&:hover': {
      '& h5': {
        color: theme.palette.common.black
      }
    }
  }
}));

interface NavbarProps {
  onOpenSidebar: () => void;
}

function Navbar({ onOpenSidebar }: NavbarProps): JSX.Element {
  const { address, chainId } = useAppSelector((state) => state.master);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [wallet, setWallet] = useState<boolean>(false);
  const [search, setSearch] = useState<any>();

  useEffect(() => {
    let provider: any;
    provider = new ethers.providers.Web3Provider(window?.ethereum);
    if (wallet && typeof window !== undefined) {
      provider
        .send('eth_requestAccounts', [])
        .then((account: any) => {
          Login_Register_Api(account && account[0]);
          dispatch(setWalletAddress(account[0]));
          dispatch(setSigner(provider.getSigner(account[0])));
          dispatch(setChainId(window?.ethereum?.chainId));
        })
        .catch((err: Error) => console.log(err));
      //@ts-ignore
      ethereum.on('accountsChanged', (account: Array<string>) => {
        Login_Register_Api(account && account[0]);
        dispatch(setWalletAddress(account[0]));
        dispatch(setSigner(provider.getSigner(account && account[0])));
        dispatch(setChainId(window?.ethereum?.chainId));
      });
      //@ts-ignore
      ethereum.on('chainChanged', (_chainId: chainId) => {
        dispatch(setChainId(_chainId));
        window.location.reload();
      });
    } else if (!wallet) {
      //@ts-ignore
      ethereum.on('disconnect', (err: Error) => {
        console.log(err);
      });
      dispatch(setChainId(undefined));
      dispatch(setWalletAddress(''));
      dispatch(setSigner({}));
    }
    dispatch(setWalletConnected(wallet));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const Login_Register_Api = async (wallet_address: string) => {
    await axios
      .post('/api/users', { wallet_address })
      .then((res) => {
        dispatch(setUserId(res?.data?.data?.insertedId));
      })
      .catch((err) => {
        dispatch(setUserId(err?.response?.data?.data?._id));
      });
  };

  const Web3Api = useMoralisWeb3Api();

  return (
    <AppbarContainer>
      <ToolbarContainer>
        <Hidden width="mdUp">
          <IconButton size="large" edge="start" aria-label="open drawer" sx={{ mr: 2 }} onClick={onOpenSidebar}>
            <MenuIcon />
          </IconButton>
        </Hidden>
        <NextLink to="/">
          <LogoIcon />
        </NextLink>

        <Hidden width="mdDown">
          <Box sx={{ flexBasis: '40%' }}>
            <MuiTextField
              fullWidth
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items, collections and accounts"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      router.push(`/asset/${search}`);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />
          </Box>
        </Hidden>

        <Hidden width="mdDown">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ListStyle>
              <li>
                <NextLink to="/explore">
                  <MuiTypography variant="h5">Explore</MuiTypography>{' '}
                </NextLink>
              </li>
              <li>
                <NextLink to="/create/nft">
                  <MuiTypography variant="h5">Create</MuiTypography>
                </NextLink>
              </li>
              <li>
                <NextLink to="/mycollection">
                  <MuiTypography variant="h5">My Collection</MuiTypography>
                </NextLink>
              </li>
            </ListStyle>
          </Box>
        </Hidden>

        <Hidden width="mdDown">
          <Box>
            <MuiButton
              variant="contained"
              onClick={() => {
                setWallet(!wallet);
              }}
            >
              {!address ? 'Connect wallet' : shortenAddress(address)}
            </MuiButton>
          </Box>
        </Hidden>
      </ToolbarContainer>
    </AppbarContainer>
  );
}

export default Navbar;
