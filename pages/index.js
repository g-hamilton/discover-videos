import Head from 'next/head';

import styles from '../styles/Home.module.css';

import Navbar from '../components/nav/navbar';
import Banner from '../components/banner/banner';
import SectionCards from '../components/card/section-cards';

import {
  getVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from '../lib/videos';
import { verifyToken } from '../lib/utils';

export async function getServerSideProps(context) {
  // we should always get a token here as the entire app is behind
  // login middleware
  const token = context.req ? context.req.cookies.token : null;
  const userId = await verifyToken(token);

  /*
  Watch it again is personalised and requires a token so this could be
  conditionally fetched or set to null and hidden client side until
  user is logged in - if we decided not to use login middleware across
  the entire app.
  */
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  /* */
  const disneyVideos = await getVideos('disney trailer');
  const productivityVideos = await getVideos('productivity');
  const travelVideos = await getVideos('travel');
  const popularVideos = await getPopularVideos();

  return {
    props: {
      watchItAgainVideos,
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
    },
  };
}

export default function Home({
  watchItAgainVideos,
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>NextFlix Videos</title>
        <meta name='description' content='What would you like to watch next?' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.main}>
        <Navbar />
        {/* <Banner
          videoId='4zH5iYM4wJo'
          title='Clifford the red dog'
          subTitle='a very cute dog'
          imgUrl='/static/clifford.webp'
        /> */}
        <div className={styles.sectionWrapper}>
          <SectionCards
            title='Watch it again'
            videos={watchItAgainVideos}
            size='small'
          />
          <SectionCards title='Disney' videos={disneyVideos} size='large' />
          <SectionCards title='Travel' videos={travelVideos} size='small' />
          <SectionCards
            title='Productivity'
            videos={productivityVideos}
            size='medium'
          />
          <SectionCards title='Popular' videos={popularVideos} size='small' />
        </div>
      </div>
    </div>
  );
}
