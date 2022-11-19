import React from "react";
import styles from "../styles/Footer.module.css";
import Image from "next/image";
// import github from "../assets/github.svg";
// import logo from "../assets/logo1.png";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footer_items}>
          <span className={styles.footer_text}>
            © 2022 ALL RIGHTS RESERVED - De-Tok
          </span>
          <div className={`${styles.github} `}>
            <a
              href="https://github.com/eltontay/De-Tok"
              target="_blank"
              rel="noreferrer"
            >
              {/* <Image src={github} /> */}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
