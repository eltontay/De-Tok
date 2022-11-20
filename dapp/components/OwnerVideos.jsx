import React, { useState, useCallback, useEffect } from "react";
import { useAccount, useContractRead, useProvider, useSigner } from 'wagmi';
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
    )
    
    const handleClick = async () => {
      const res = await refetch();
      const { status, data} = res;
      if(res.status == "success"){
        setVideoIds(data);
      }
    }

    return (
      <div className="pt-2">
          {videoIds}
          <label>Replace with Owner video gallery</label>
      </div>
    )
}