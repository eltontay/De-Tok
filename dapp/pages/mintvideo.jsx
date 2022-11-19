import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MintVideo.module.css";

export default function MintVideo() {
    return (
        <>
          <Head>
            <title>Mint</title>
            <meta
              name="description"
              content="Mint a New Video"
            />
            <link rel="icon" href="/video.png" />
          </Head>
    
          <main className={styles.main}>
                <div className={styles.title}>
                  <span className={`${styles.titleWord} ${styles.word2}`}>
                    Mint a Video
                  </span>
                </div>
          </main>
        </>
      );
}