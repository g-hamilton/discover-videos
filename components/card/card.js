import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import cls from "classnames";

import styles from "./card.module.css";

/*
  A dynamic card component with 3 possible size values: "small", "medium", "large".
  Defaults to medium size.

  Will handle missing image urls and image errors by falling back to the default placeholder.
*/

const placeholderImg =
  "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2056&q=80";

const Card = (props) => {
  const { id, size = "medium", imgUrl = placeholderImg } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnImgError = () => {
    setImgSrc(placeholderImg);
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(classMap[size], styles.imgMotionWrapper)}
        whileHover={{ ...scale }}
      >
        <Image
          src={imgSrc}
          alt={"Image of a movie"}
          layout="fill"
          onError={handleOnImgError}
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  );
};

export default Card;
