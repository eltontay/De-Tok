import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Account.module.css";

export default function Account() {
    return (
        <>
          <Head>
            <title>My Account</title>
            <meta
              name="description"
              content="My Videos"
            />
            <link rel="icon" href="/video.png" />
          </Head>
    
          <main className={styles.main}>
                <div className={styles.title}>
                  <span className={`${styles.titleWord} ${styles.word2}`}>
                    My Videos
                  </span>
                </div>
          </main>
        </>
      );
}