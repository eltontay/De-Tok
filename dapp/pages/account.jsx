import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Account.module.css';
import VideoGallery from '../components/VideoGallery';
import { CheckBalance } from '../components/CheckBalance';
import { OwnerVideos } from '../components/OwnerVideos';
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
        <div className={styles.info}>
          <CheckBalance/>
        </div>
        <div className={styles.collections}>
          <div>
            <OwnerVideos/>
          </div>
        </div>
      </main>
    </>
  );
}
