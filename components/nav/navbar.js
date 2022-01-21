import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./navbar.module.css";

import { magic } from "../../lib/magic-client";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");

  const router = useRouter();

  /*
    This effect attempts to retrieve a user's metadata from Magic
    when this navbar component is created.
  */
  useEffect(() => {
    async function getUserMetaData() {
      // https://magic.link/docs/api-reference/client-side-sdks/web#getmetadata
      try {
        // Assumes a user is already logged in
        const { email } = await magic.user.getMetadata();
        if (email) {
          setUsername(email);
        }
      } catch (err) {
        console.error("Error retrieving user data from Magic:", err);
      }
    }
    getUserMetaData();
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      await magic.user.logout();
      console.log(await magic.user.isLoggedIn()); // => 'false'
      router.push("/login");
    } catch (err) {
      console.error("Error logging out of Magic:", err);
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                alt="Netflix logo"
                src={"/static/netflix.svg"}
                width={128}
                height={34}
              />
            </div>
          </a>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              <Image
                alt="Expand menu icon"
                src={"/static/expand_more.svg"}
                width={24}
                height={24}
              />
            </button>
            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
