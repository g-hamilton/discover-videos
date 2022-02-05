import Head from "next/head";
import NavBar from "../../components/nav/navbar";

import SectionCards from "../../components/card/section-cards";
import { getMyList } from "../../lib/videos";
import { verifyToken } from "../../lib/utils";

import styles from "../../styles/MyList.module.css";

export async function getServerSideProps(context) {
  // we should always get a token here as the entire app is behind
  // login middleware
  const token = context.req ? context.req.cookies.token : null;
  const userId = await verifyToken(token);
  const videos = await getMyList(userId, token);

  return {
    props: {
      myListVideos: videos,
    },
  };
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
