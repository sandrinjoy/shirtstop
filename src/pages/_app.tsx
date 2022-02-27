import '../styles/globals.css'
import '../styles/main.css'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'

import store from '../app/store'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
      <title>ShirtStop</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  )
}
