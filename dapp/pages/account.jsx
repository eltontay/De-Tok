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

console.log()

export default function Account() {
  const notify = (message) => toast(`${message}`);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasVideos, sethasVideos] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();

  const DETOK_contract = useContract({
    addressOrName: DeTok_Contract_Address,
    contractInterface: DETOK_ABI,
    signerOrProvider: signer || provider,
  });

  const check = async () => {
    try {
      setLoading(true);
      const videos = await DETOK_contract.getAllVideoIdOfOwner(address);
      console.log(videos);
     /* if (videos > 0) {
        sethasVideos(true);
        notify("You are a DAO member :D");
      } else {
        notify("Please upload videos");
      }*/
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  /// to check if the user is the owner or not
  const checkOwner = () => {
    if (address == OwnerAddress) {
      setIsOwner(true);
      console.log("Owner Verified");
      notify("Owner Verified");
    } else {
      setIsOwner(false);
      console.log("You are not the Owner");
      notify("You are not the Owner");
    }
  };

  useEffect(() => {
    if (!isConnected) {
      notify("Connect your wallet first");
    } else {
      check();
      checkOwner();
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