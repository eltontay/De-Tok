import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  useAccount,
  useContractRead,
  useContractInfiniteReads,
  useProvider,
  useSigner,
} from 'wagmi';

import VideoGallery from './VideoGallery';

import styles from '../styles/TrendingVideos.module.css';

import { DETOK_ABI, DeTok_Contract_Address } from '../constants/constants';

export const TrendingVideos = () => {
  const [status, setstatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [videoIds, setVideoIds] = useState([]);
  const [cids, setCids] = useState([]);
  const [error, setError] = useState('');
  const { refetch } = useContractRead({
    address: DeTok_Contract_Address,
    abi: DETOK_ABI,
    functionName: 'getAllTrendingCid',
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
        <span className={`${styles.title.description}`}>Trending Videos</span>
      </div>
      <label>{videoIds}</label>
      <div>
        <VideoGallery data={ videoIds }></VideoGallery>
      </div>
    </div>
  );
};
