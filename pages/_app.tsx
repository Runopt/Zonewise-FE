import '@/styles/globals.scss';
import '@/styles/main.scss';
import Layout from '../components/layout';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../components/store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClerkProvider } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const ErrorPage = () => (
  <div>Something went wrong. Please try again.</div>
);

const LoadingPage = () => (
  <div>Loading...</div>
);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          // Hide Clerk's default UI components
          rootBox: "hidden",
          card: "hidden",
          form: "hidden",
          socialButtonsBlockButton: "hidden",
          footerAction: "hidden",
          dividerRow: "hidden",
          dividerText: "hidden"
        },
        layout: {
          socialButtonsPlacement: "bottom"
        }
      }}
      navigate={(to) => router.push(to)}
      afterSignInUrl="/home"
      afterSignUpUrl="/home"
    >
      <Provider store={store}>
        <PersistGate loading={<LoadingPage />} persistor={persistor}>
          <Layout>
            <ToastContainer />
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    </ClerkProvider>
  );
}
