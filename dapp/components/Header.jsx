import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = ({}) => {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setIsActive(!isActive);
  }

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.navlogo}>
            <Link href={"/"}>
              <Image
                src="/de-tok-low-resolution-logo-color-on-transparent-background.png"
                alt="De-Tok Logo"
                width={160}
                height={160}
              />
            </Link>
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
            <Link className={styles.navlink} href="/">
              Home
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link className={styles.navlink} href="/account">
              Account
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link className={styles.navlink} href="/mintvideo">
              Mint Video
            </Link>
          </li>
          <li className={styles.navitem}>
            <ConnectButton />
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
