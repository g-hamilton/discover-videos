import Head from "next/head";
import styles from "../styles/Home.module.css";

import Navbar from "../components/nav/navbar";
import Banner from "../components/banner/banner";
import SectionCards from "../components/card/section-cards";

import { getVideos } from "../lib/videos";

export async function getServerSideProps() {
  const disneyVideos = await getVideos();

  return { props: { disneyVideos } };
}

export default function Home({ disneyVideos }) {
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
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
      </div>
    </div>
  );
}
