import Link from "next/link";

import styles from "./navbar.module.css";

const Navbar = (props) => {
  const { username } = props;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>Logo</div>
          </a>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>Home</li>
          <li className={styles.navItem2}>Somewhere else</li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn}>
              <p className={styles.username}>{username}</p>
              {/* expand more icon */}
            </button>
            <div className={styles.navDropdown}>
              <div>
                <a className={styles.linkName}>Sign out</a>
                <div className={styles.lineWrapper}></div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
