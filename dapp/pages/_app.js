import Head from "next/head";
import "../styles/globals.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>De-Tok</title>
        <meta
          name="description"
          content="Viral videos live for long time, other die!"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
