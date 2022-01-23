import Link from "next/link";

import Card from "./card";

import styles from "./section-cards.module.css";

const SectionCards = (props) => {
  const { title, videos = [], size } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((i) => (
          <Link key={`disney-video-${i.id}`} href={`/video/${i.id}`} passHref>
            <a>
              <Card id={i.id} size={(i, size)} imgUrl={i.imgUrl} />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
