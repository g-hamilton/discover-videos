import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="What would you like to watch next?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Netflix</h1>
    </div>
  );
}
