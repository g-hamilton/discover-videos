import { useRouter } from "next/router";
import clsx from "classnames";
import { useState } from "react";

// https://github.com/reactjs/react-modal#api-documentation
import Modal from "react-modal";
Modal.setAppElement("#__next");

import Navbar from "../../components/nav/navbar";
import Like from "../../components/icons/like-icon";
import Dislike from "../../components/icons/dislike-icon";

import styles from "../../styles/Video.module.css";

import { getYoutubeVideoById } from "../../lib/videos";

/*
  This page uses ISR.
  https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
*/
export async function getStaticProps(context) {
  const { videoId } = context.params;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const staticVideos = ["mYfJxlgR2jw", "1VIZ89FEjYI", "4zH5iYM4wJo"];

  const paths = staticVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();
  const { videoId } = router.query;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  const runRatingService = async (favourited) => {
    return await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleToggleDislike = async () => {
    setToggleDisLike(!toggleDisLike);
    setToggleLike(toggleDisLike);

    const val = !toggleDisLike;
    const favourited = val ? 0 : 1;
    const response = await runRatingService(favourited);
  };

  const handleToggleLike = async () => {
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDisLike(toggleLike);

    const favourited = val ? 1 : 0;
    const response = await runRatingService(favourited);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
          className={styles.videoPlayer}
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like fill={"white"} selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <Dislike fill={"white"} selected={toggleDisLike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Studio: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
