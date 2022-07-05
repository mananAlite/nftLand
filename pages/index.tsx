import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

import Hero from '../components/Hero';
import UserGuide from '../components/User Guide';

import { useAppDispatch } from '../hooks/redux';
import { setAlert } from '../reducers/masterSlice';

const Home: NextPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>NFT Market Place</title>
      </Head>

      <Hero />

      <UserGuide />
    </>
  );
};

export default Home;
