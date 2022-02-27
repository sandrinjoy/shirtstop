
import Document, { Html, Head, Main, NextScript } from 'next/document'
import LogoMeta from '../components/LogoMeta'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en' className='scroll-smooth'>
        <Head>

         <LogoMeta/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument