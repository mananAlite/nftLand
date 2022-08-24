import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';

import { ethers } from 'ethers';

import { Box, Container, Grid } from '@mui/material';

import { Form, Formik, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';

import axios from 'axios';

import Grey from '../../../assets/images/gray.png';

import { MuiButton, MuiTypography, MuiTextField } from '../../common';

import { depolyERC721Contract, factoryAddress, getContractsDetails } from '../../../utils/web3';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setLoaderOpen } from '../../../reducers/masterSlice';

const ABI = require('../../../utils/abi/Factory.json') as any;
declare global {
  interface Window {
    ethereum?: any;
  }
}
interface initialValue {
  // image: string;
  name: string;
  symbol: string;
  isTransferable: boolean;
  description: string;
  hardCap: number;
  errors?: FormikErrors<{
    [field: string]: any;
  }>;
  touched?: FormikTouched<{
    [field: string]: any;
  }>;
  autofocus?: boolean;
  disabled?: boolean;
}

export default function CreateCollection(): JSX.Element {
  const { isWalletConnected, address, signer } = useAppSelector((state) => state.master);

  const [image, setImage] = useState<any>();
  const [factoryContract, setFactoryContract] = useState<any>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (typeof window !== undefined) {
      setFactoryContract(new ethers.Contract(factoryAddress, ABI, new ethers.providers.Web3Provider(window?.ethereum)));
    }
  }, []);

  const validationSchema = Yup.object().shape({
    hardCap: Yup.number().required('Hard Cap is required'),
    name: Yup.string().required('Name is required'),
    symbol: Yup.string().required('Symbol is required'),
    description: Yup.string().required('Description is required'),
    isTransferable: Yup.boolean().required('Is Transferable is required')
  });

  const initialValues: initialValue = {
    name: '',
    symbol: '',
    hardCap: 0,
    description: '',
    isTransferable: false
  };

  const handleUploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mymarketplace');
    formData.append('cloud_name', 'dizio9n6p');
    const response = await axios.post('https://api.cloudinary.com/v1_1/dizio9n6p/image/upload', formData);
    return response?.data?.secure_url;
  };

  type apiBody = {
    owner_address: string;
    name: string;
    symbol: string;
    isTransferrable: boolean;
    contract_address: string;
    description: string;
    hardcap: number;
    image_url: string;
  };

  return (
    <>
      <Container maxWidth="md" sx={{ my: 3 }}>
        <Box sx={{ mb: 3 }}>
          <MuiTypography variant="h1">Create New Collection</MuiTypography>
        </Box>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                dispatch(setLoaderOpen(true));
                const img_url = image && (await handleUploadImage(image));
                depolyERC721Contract(address, values.name, values.symbol, true, values.hardCap, factoryContract, signer)
                  .then(async (res) => {
                    await res.wait();
                    getContractsDetails(address, factoryContract)
                      .then((res) => {
                        const apiBody: apiBody = {
                          owner_address: address,
                          name: values.name,
                          symbol: values.symbol,
                          isTransferrable: true,
                          contract_address: res[res.length - 1][3],
                          description: values.description,
                          hardcap: values.hardCap,
                          image_url: img_url
                        };
                        axios
                          .post('/api/collection', apiBody)
                          .then((res) => {
                            if (res?.status === 200) {
                              dispatch(setLoaderOpen(false));
                              router.push('/create/nft');
                            }
                          })
                          .catch((err) => dispatch(setLoaderOpen(false)));
                      })
                      .catch((err) => dispatch(setLoaderOpen(false)));
                  })
                  .catch((err) => dispatch(setLoaderOpen(false)));
              }}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form>
                  <Box sx={{ mb: 3 }}>
                    <MuiTextField
                      fullWidth
                      name="image"
                      type="file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e?.target?.files?.[0])}
                    />
                  </Box>
                  <MuiTextField
                    fullWidth
                    id="name"
                    name="name"
                    label="name"
                    placeholder="name"
                    size="medium"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <Box sx={{ my: 2 }}>
                    <MuiTextField
                      fullWidth
                      id="symbol"
                      name="symbol"
                      label="symbol"
                      placeholder="symbol"
                      size="medium"
                      value={values.symbol}
                      onChange={handleChange}
                      error={touched.symbol && Boolean(errors.symbol)}
                      helperText={touched.symbol && errors.symbol}
                    />
                  </Box>
                  <Box sx={{ my: 2 }}>
                    <MuiTextField
                      fullWidth
                      id="minterAddress"
                      name="minterAddress"
                      label="minter address"
                      placeholder="Please connect wallet"
                      size="medium"
                      value={address}
                    />
                  </Box>
                  <Box sx={{ my: 2 }}>
                    <MuiTextField
                      fullWidth
                      id="hardCap"
                      name="hardCap"
                      label="hard cap"
                      placeholder="hard cap"
                      size="medium"
                      type="number"
                      value={values.hardCap}
                      onChange={handleChange}
                      error={touched.hardCap && Boolean(errors.hardCap)}
                      helperText={touched.hardCap && errors.hardCap}
                    />
                  </Box>
                  <Box sx={{ my: 2 }}>
                    <MuiTextField
                      fullWidth
                      rows={4}
                      multiline
                      type="textArea"
                      id="description"
                      name="description"
                      label="description"
                      placeholder="description"
                      size="medium"
                      value={values.description}
                      onChange={handleChange}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />
                  </Box>
                  <MuiButton
                    fullWidth
                    size="large"
                    variant="contained"
                    type="submit"
                    disabled={!isWalletConnected && !image}
                  >
                    Submit
                  </MuiButton>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item lg={6} xs={12}>
            <Box
              sx={{
                m: 4,
                p: 2,
                border: '1px solid #d3d3d3',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Image
                width={370}
                height={370}
                style={{ borderRadius: '8px' }}
                src={image ? URL.createObjectURL(image) : Grey}
                alt="grey image"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
