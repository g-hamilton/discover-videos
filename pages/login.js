import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "../styles/Login.module.css";

import { magic, rpcError, rpcErrorCode } from "../lib/magic-client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [usrMsg, setUsrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setUsrMsg("");
    const value = e.target.value;
    setEmail(value);
  };

  const handleLoginWithEmail = async (e) => {
    // prevent any page refresh
    e.preventDefault();

    // prevent missing email
    if (!email) {
      setUsrMsg("Enter your email address.");
      return;
    }

    // prevent invalid email (using regex)
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      setUsrMsg("Enter a valid email.");
      return;
    }

    // email is valid
    setIsLoading(true);

    // attempt magic link login...
    // https://magic.link/docs/api-reference/client-side-sdks/web#loginwithmagiclink
    try {
      const didToken = await magic.auth.loginWithMagicLink({ email });
      if (!didToken) {
        return;
      }

      /* 
      successful magic login :)
      call the login api to create any new user in the db and set a cookie
      containing the user's auth credentials in a JWT so that the user can
      make authenticated requests to the db for the next 7 days..
      */
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const loggedInResponse = await response.json();

      if (loggedInResponse.done) {
        router.push("/"); // login complete, route to homepage
      } else {
        setIsLoading(false);
        setUsrMsg("Something went wrong signing in");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Something went wrong signing in:", err);
      if (err instanceof rpcError) {
        switch (err.code) {
          case rpcErrorCode.MagicLinkFailedVerification:
            setUsrMsg("Magic link failed verification.");
            break;
          case rpcErrorCode.MagicLinkExpired:
            setUsrMsg("Magic link expired.");
            break;
          case rpcErrorCode.MagicLinkRateLimited:
            setUsrMsg("Magic link rate limited.");
            break;
          case rpcErrorCode.UserAlreadyLoggedIn:
            setUsrMsg("You're already logged in.");
            break;
          default:
            setUsrMsg("Something went wrong signing in.");
            break;
        }
        return;
      }
      setUsrMsg("Something went wrong signing in.");
      return;
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
            {isLoading ? "Loading..." : "Go"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
