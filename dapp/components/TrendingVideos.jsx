import React, { useState, useCallback, useEffect } from "react";
import { useAccount, useContractRead, useProvider, useSigner } from 'wagmi';

import VideoGallery from "./VideoGallery";

import styles from "../styles/TrendingVideos.module.css";

import {
  DETOK_ABI,
  DeTok_Contract_Address
} from '../constants/constants';


export const TrendingVideos = () => {
  const [status, setstatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [videoIds, setVideoIds] = useState([]);
  const [cids, setCids] = useState([]);
  const [error, setError] = useState("");

    const { refetch } = useContractRead(
      {
        address: DeTok_Contract_Address,
        abi:DETOK_ABI,
        functionName: 'getAllTrendingCid',
      },
    )
        
    const handleClick = async () => {
      const res = await refetch();
      const { status, data} = res;
      if(res.status == "success"){
        setVideoIds(data);
        setCids(["bafybeicq7qd5ns67yfnwfclhunwifsgqptcddvhdfklnz5deopa4apr4qu","bafybeigg6vuimb2rwgmc3pfcrvwrzgg5gxjd75z74avvwxeaz47gsmwyx4"] )
      }
    }

    return (
      <div className="pt-2">
          <div className={styles.title}>
              <span className={`${styles.title.description}`}>
                Trending Videos
              </span>
          </div>
          <label>{cids}</label>
          <div>
             <VideoGallery data={{cids}}></VideoGallery>
          </div>
          <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow marign px-2"
          onClick={() => handleClick()}
        >
         test  
        </button>
      </div>
    )
}