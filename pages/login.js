import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import styles from "../styles/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [usrMsg, setUsrMsg] = useState("");

  const handleOnChangeEmail = (e) => {
    setUsrMsg("");
    const value = e.target.value;
    setEmail(value);
  };

  const handleLoginWithEmail = (e) => {
    e.preventDefault();
    if (!email) {
      setUsrMsg("Enter a valid email.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>Netflix Signin</Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
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
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In / Sign Up</h1>
          <input
            type="email"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.usrMsg}>{usrMsg}</p>
          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>
            Go
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
