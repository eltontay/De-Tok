import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";

export const Header = ({}) => {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setIsActive(!isActive);
  }

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href={"/"}>
            <div className={styles.title}>
              <span className={`${styles.titleWord} ${styles.word1}`}>De </span>
              <span className={`${styles.titleWord} ${styles.word2}`}>Tok</span>
            </div>
          </Link>
          <div className={styles.navlogo}>
            <Image src="/video.png" alt="De-Tok Logo" width={20} height={20} />
          </div>
        </div>
        <ul
          className={
            isActive === false
              ? styles.navmenu
              : styles.navmenu + " " + styles.active
          }
        >
          <li className={styles.navitem}>
            <Link className={styles.navlink} href="/masters">
              Master Collection
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link className={styles.navlink} href="/dashboard">
              My Account
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link className={styles.navlink} href="/team">
              Team
            </Link>
          </li>

          <li className={styles.navitem}>
            {/* <ConnectButton /> */}
            <button>Connect</button>
          </li>
        </ul>
        <button
          onClick={handleClick}
          className={
            isActive === false
              ? styles.hamburger
              : styles.hamburger + " " + styles.active
          }
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </nav>
    </header>
  );
};
