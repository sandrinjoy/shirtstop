import "../styles/globals.css";
import "../styles/main.css";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import { store, persistor } from "../app/store";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <title>ShirtStop</title>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
