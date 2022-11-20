import React, { useState, useCallback, useEffect } from 'react';
import styles from '../styles/BasicVideos.module.css';

import { useAccount, useContractRead, useProvider, useSigner } from 'wagmi';
import { DETOK_ABI, DeTok_Contract_Address } from '../constants/constants';

import VideoGallery from './VideoGallery';

export const BasicVideos = () => {
  const [status, setstatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [videoIds, setVideoIds] = useState();
  const [error, setError] = useState('');

  const { refetch } = useContractRead({
    address: DeTok_Contract_Address,
    abi: DETOK_ABI,
    functionName: 'getAllBasicCid',
  });

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

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={`${styles.title.description}`}>Basic Videos</span>
      </div>
      <label>{videoIds}</label>
      <div>
        <VideoGallery data={ videoIds }></VideoGallery>
      </div>
    </div>
  );
};
