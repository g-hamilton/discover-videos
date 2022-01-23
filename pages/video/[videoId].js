import { useRouter } from "next/router";

// https://github.com/reactjs/react-modal#api-documentation
import Modal from "react-modal";
Modal.setAppElement("#__next");

import styles from "../../styles/Video.module.css";

const Video = () => {
  const router = useRouter();
  const { videoId } = router.query;

  return (
    <div className={styles.container}>
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      ></Modal>
    </div>
  );
};

export default Video;
