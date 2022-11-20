import React, { useState, useCallback, useEffect } from 'react';
import styles from '../styles/BasicVideos.module.css';
import { Web3Storage } from 'web3.storage';
import { useAccount, useContractRead, useProvider, useSigner } from 'wagmi';
import { DETOK_ABI, DeTok_Contract_Address } from '../constants/constants';

export const GetDeal = () => {
  const [status, setstatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [videoIds, setVideoIds] = useState([]);
  const [error, setError] = useState('');

  function makeStorageClient() {
    return new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN,
    });
  }

  const handleClick = async () => {
    const res = await refetch();
    const { status, data } = res;
    if (res.status == 'success') {
      setVideoIds(data);
    }
    const client = makeStorageClient();
    const files = await client.get(videoIds[0]);
    console.log(files);
  };

  const { refetch } = useContractRead({
    address: DeTok_Contract_Address,
    abi: DETOK_ABI,
    functionName: 'getAllCid',
  });

  return (
    <div className="pt-2">
      <div className="pt-2">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow marign px-2"
          onClick={() => handleClick()}
        >
          {videoIds}
        </button>
      </div>
    </div>
  );
};
