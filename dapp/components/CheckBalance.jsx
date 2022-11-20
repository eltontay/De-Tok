import React, { useState, useCallback, useEffect } from "react";
import { useAccount, useContractRead, usePrepareContractWrite, useProvider, useSigner } from 'wagmi';

import { ClaimTokens  } from "./ClaimTokens";

import {
  DTOK_ABI,
  DTok_Contract_Address,
} from '../constants/constants';


export const CheckBalance = () => {
  const [status, setstatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [canFetchBalance, setCanFetchBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [readBalance, setReadBalance] = useState(false);
  const [canMint, setCanMint] = useState(false);
  const [error, setError] = useState("");

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();

  
  const { refetch } = useContractRead(
    {
      address: DTok_Contract_Address,
      abi:DTOK_ABI,
      functionName: 'balanceOf',
      args: [address],
    },
  )
  
  const handleClick = async () => {
    const res = await refetch();
    const { status, data} = res;
    if(res.status == "success"){
      setBalance(Number(data));
      setReadBalance(true);
    }
  }

  useEffect(() => {
    if (isConnected) {
      setCanFetchBalance(true);
    } else {
      setIsError(true)
      setError("Connect your wallet first");
    }

    if(readBalance & isConnected){
      if(balance==0){
        setCanMint(true);
      }
    }
  });


  return (
    <div>
  <div className="pt-2">
    <button disabled={!canFetchBalance} hidden={!canFetchBalance}
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      onClick={() => handleClick()}
    >
      Available DToks:{balance}
    </button>
  </div>
  { canMint ? (
            <ClaimTokens/>
          ) : null }
  { isError ? (
     <label>{error}</label>
  ) : null }
  </div>
  )
}