import '@/styles/globals.scss';
import '@/styles/main.scss';
import Layout from '../components/layout';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../components/store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <Layout>
          <ToastContainer />
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
}
