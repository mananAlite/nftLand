import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Provider as ReduxProvider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

import { store } from '../store/store';

import Layout from '../layout/layout';
import ThemeProviderWrapper from '../theme/ThemeProvider';
import Loader from '../components/common/Loader/Loader';

import { MuiAlert } from '../components/common';
import { MoralisProvider } from 'react-moralis';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <MoralisProvider
        serverUrl="https://xfltwgigxrai.usemoralis.com:2053/server"
        appId="UYFTZ0ISFX03agUQCkS6DYPhuvszK1ILJ4VFFjcl"
      >
        <ReduxProvider store={store}>
          <ThemeProviderWrapper>
            <Loader />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Layout>
              <MuiAlert />
              <Component {...pageProps} />
            </Layout>
          </ThemeProviderWrapper>
        </ReduxProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
