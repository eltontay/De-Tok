import React, { useState, useCallback, useEffect } from "react";
import { useAccount, useContractRead, useProvider, useSigner } from 'wagmi';
import styles from '../styles/OwnerVideos.module.css';

import VideoGallery from './VideoGallery';

import {
  DETOK_ABI,
  DeTok_Contract_Address
} from '../constants/constants';


export const OwnerVideos = () => {
  const [status, setstatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [videoIds, setVideoIds] = useState([]);
  const [error, setError] = useState("");

    const { refetch } = useContractRead(
      {
        address: DeTok_Contract_Address,
        abi:DETOK_ABI,
        functionName: 'getAllVideoCIDOfOwner',
      },
    );

    useEffect(() => {
      const fetchData = async () => {
        const res = await refetch();
        const { status, data } = res;
        if (res.status == 'success') {
          setVideoIds(data);
        }
        console.log(data);
      };
      fetchData();
    }, [videoIds]);
    
    const handleClick = async () => {
      const res = await refetch();
      const { status, data} = res;
      if(res.status == "success"){
        setVideoIds(data);
      }
    }

    return (
      <div className={styles.container}>
      <div className={styles.title}>
        <span className={`${styles.title.description}`}>My Videos</span>
      </div>
      <div>
        <VideoGallery data={ videoIds }></VideoGallery>
      </div>
    </div>
    );
}