import Head from "next/head";
import styles from "../styles/Home.module.css";

import Navbar from "../components/nav/navbar";
import Banner from "../components/banner/banner";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="What would you like to watch next?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar username="greg@test.com" />
      <Banner
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />
      {/* <Card /> */}
    </div>
  );
}
