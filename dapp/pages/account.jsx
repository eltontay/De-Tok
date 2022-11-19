import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Account.module.css";
import VideoGallery from "../components/VideoGallery";
import { ToastContainer, toast } from "react-toastify";

import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import {
  DTOK_ABI,
  DVID_ABI,
  DETOK_ABI,
  OwnerAddress,
  DeTok_Contract_Address  
} from "../constants/constants";

export default function Account() {
  const notify = (message) => toast(`${message}`);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasVideos, sethasVideos] = useState(false);

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();

  console.log(provider);
  console.log(address);
  console.log(isConnected);

  const DETOK_contract = useContract({
    addressOrName: DeTok_Contract_Address,
    contractInterface: DETOK_ABI,
    signerOrProvider: signer || provider,
  });

  console.log(DETOK_contract)
  
  const check = async () => {
    try {
      setLoading(true);
      const videos = await DETOK_contract.getAllVideoIdOfOwner(address);
      console.log(videos);
     /* if (videos > 0) {
        sethasVideos(true);
      } else {
        notify("Please upload videos");
      }*/
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!isConnected) {
      notify("Connect your wallet first");
    } else {
      check();
    }
  }, []);

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
                  <VideoGallery/>
                </div>
          </main>
        </>
      );
}