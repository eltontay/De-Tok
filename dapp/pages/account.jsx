import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Account.module.css';
import VideoGallery from '../components/VideoGallery';
import { CheckBalance } from '../components/CheckBalance';
import { ToastContainer, toast } from 'react-toastify';

import { useAccount, useContractRead, useProvider, useSigner } from 'wagmi';
import {
  DTOK_ABI,
  DVID_ABI,
  DETOK_ABI,
  OwnerAddress,
  DeTok_Contract_Address,
} from '../constants/constants';

export default function Account() {
  return (
    <>
      <Head>
        <title>My Account</title>
        <meta name="description" content="My Videos" />
        <link rel="icon" href="/video.png" />
      </Head>

      <main className={styles.main}>
        <div>
         <CheckBalance/>
        </div>
        <div className={styles.title}>
          <span className={`${styles.titleWord} ${styles.word2}`}>
            My Videos
          </span>
          <div>
            <VideoGallery/>
          </div>
          
        </div>
      </main>
    </>
  );
}
