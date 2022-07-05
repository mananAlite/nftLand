import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { ethers } from 'ethers';

import { Autocomplete, Box, Container, Grid, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

import axios, { AxiosRequestHeaders } from 'axios';

import GreyImage from '../../../assets/images/gray.png';

import { MuiTypography, MuiButton, MuiTextField } from '../../common';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';

import { mintNFT } from '../../../utils/web3';
import { pxToRem } from '../../../utils/font';
import { setLoaderOpen } from '../../../reducers/masterSlice';
import { toast } from 'react-toastify';

const ABI = require('../../../utils/abi/ERC721.json') as any;

const PINATA_API_KEY: string = process.env.NEXT_PUBLIC_PINTA_API_KEY!;
const PINATA_SECRET_API_KEY: string = process.env.NEXT_PUBLIC_PINTA_API_SECRETKEY!;

interface apiBody {
  collection_id: string;
  owner_address: string;
  name: string;
  description: string;
  ipfs_uri: string;
  image_ipfs_uri: string;
  isForSale: boolean;
  isForAuction: boolean;
  tokenAmount: number;
}

const ImageContainer = styled(Box)({
  padding: pxToRem(16),
  border: '1px solid #d3d3d3',
  borderRadius: pxToRem(8),
  alignItems: 'center',
  justifyContent: 'center',
  margin: '32px'
}) as typeof Box;

const PINATA_URL: string = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

function CreateNFT() {
  const [images, setImage] = useState<any>();
  const [imgIpfsHashURL, setImgIpfsHashURL] = useState<string>('');
  const [newERC721, setNewERC721] = useState<any>();
  const [minterCollection, setMinterCollection] = useState<any>();
  const [collectionAddress, setCollectionAddress] = useState<any>();
  const { address, signer } = useAppSelector((state) => state.master);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (collectionAddress?.contract_address) {
      setNewERC721(
        new ethers.Contract(
          collectionAddress?.contract_address,
          ABI,
          new ethers.providers.Web3Provider(window?.ethereum)
        )
      );
    }
  }, [collectionAddress?.contract_address]);

  useEffect(() => {
    address &&
      axios
        .post('/api/collection/usercollections', { owner_address: address } as string | any)
        .then((res) => setMinterCollection(res?.data?.data))
        .catch((err) => err);
  }, [address]);

  useEffect(() => {
    images && ImgIpfsHash(images);
  }, [images]);

  const ImgIpfsHash = async (file: any) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    const headers: AxiosRequestHeaders = {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY
    };

    try {
      const filePin = await axios.post(url, data, { headers });
      setImgIpfsHashURL(`https://ipfs.io/ipfs/${filePin?.data?.IpfsHash}`);
    } catch (err) {
      console.log(err);
    }
  };

  const apiCall = (body: apiBody) => {
    axios
      .post('/api/nft', body)
      .then((res) => {
        toast.success('NFT created successfully');
        dispatch(setLoaderOpen(false));
      })
      .catch((err) => dispatch(setLoaderOpen(false)));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    isTransferable: Yup.boolean().required('Is Transferable is required'),
    tokenAmount: Yup.number().positive().required('Token amount is required')
  });

  const formik = useFormik({
    initialValues: {
      image: '',
      name: '',
      description: '',
      isTransferable: true,
      tokenAmount: 0
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(setLoaderOpen(true));
      const pinatabody = {
        image: imgIpfsHashURL,
        name: values?.name,
        description: values?.description
      };

      try {
        const filePin = await axios.post(PINATA_URL, pinatabody, {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY
          }
        });
        const apiBody: apiBody = {
          image_ipfs_uri: imgIpfsHashURL,
          name: values?.name,
          description: values?.description,
          collection_id: collectionAddress?._id,
          owner_address: address,
          ipfs_uri: `https://gateway.pinata.cloud/ipfs/${filePin?.data?.IpfsHash}`,
          isForSale: false,
          isForAuction: false,
          tokenAmount: values?.tokenAmount
        };
        mintNFT(
          newERC721,
          signer,
          address,
          `https://gateway.pinata.cloud/ipfs/${filePin?.data?.IpfsHash}`,
          String(values?.tokenAmount)
        )
          .then(async (res: any) => {
            await res.wait();
            apiCall(apiBody);
          })
          .catch((err: Error) => dispatch(setLoaderOpen(false)));
      } catch (error: any) {
        console.log('error', error);
        dispatch(setLoaderOpen(false));
      }
    }
  });

  const { values, handleChange, handleSubmit, errors, touched } = formik;
  const { image, name, description, tokenAmount, isTransferable } = values;

  const goToCreateCollection = () => {
    router.push('/create/collection');
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <MuiTypography variant="h1">Create New NFT</MuiTypography>
        </Box>
        {address && (
          <Box>
            <MuiButton variant="contained" onClick={goToCreateCollection}>
              {' '}
              Create new collection
            </MuiButton>
          </Box>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6} sm={6} md={6}>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {!address && <MuiTypography variant="body1">Please Connect Wallet</MuiTypography>}
                  {address && Array.isArray(minterCollection) && minterCollection?.length <= 0 && (
                    <MuiTypography variant="body1">Please Create Collection First</MuiTypography>
                  )}
                  {address && Array.isArray(minterCollection) && minterCollection?.length > 0 && (
                    <Autocomplete
                      options={minterCollection}
                      getOptionLabel={(option: any) => option?.name}
                      onChange={(event: SyntheticEvent, value: any) => {
                        setCollectionAddress(value);
                      }}
                      renderInput={(params: any) => <MuiTextField {...params} label="Select Collection" />}
                    />
                  )}
                </Grid>

                <Grid item xs={12}>
                  <MuiTextField
                    name="image"
                    type="file"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setImage(event?.target?.files?.[0])}
                    error={Boolean(errors?.image && touched?.image)}
                    helperText={errors?.image && touched?.image && errors?.image}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <MuiTextField
                    name="name"
                    label="Name"
                    onChange={handleChange}
                    value={name}
                    error={Boolean(errors?.name && touched?.name)}
                    helperText={errors?.name && touched?.name}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <MuiTextField
                    type={'number'}
                    name="tokenAmount"
                    label="tokenAmount"
                    onChange={handleChange}
                    value={tokenAmount}
                    error={Boolean(errors?.tokenAmount && touched?.tokenAmount)}
                    helperText={errors?.tokenAmount && touched?.tokenAmount}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <MuiTextField
                    name="minterAddress"
                    label="Minter Address"
                    placeholder="Please connect wallet"
                    value={address}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <MuiTextField
                    rows={4}
                    multiline
                    type="text"
                    name="description"
                    label="Description"
                    onChange={handleChange}
                    value={description}
                    error={Boolean(errors?.description && touched?.description)}
                    helperText={errors?.description && touched?.description}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <MuiButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={
                      (Array.isArray(minterCollection) && minterCollection?.length <= 0) ||
                      !Array.isArray(minterCollection)
                    }
                  >
                    Submit
                  </MuiButton>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Grid>
        <Grid item xs={12} lg={6} sm={6} md={6} alignItems="center" display={'flex'}>
          <ImageContainer>
            <Image
              width={370}
              height={370}
              src={images ? URL.createObjectURL(images) : GreyImage}
              alt="Grey Image"
              style={{ borderRadius: '8px' }}
            />
          </ImageContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreateNFT;
