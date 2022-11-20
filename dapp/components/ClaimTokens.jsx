import React, { useState, useCallback, useEffect } from "react";
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useProvider, useSigner } from 'wagmi';
import {
  DeTOK_ABI,
  DeTok_Contract_Address
} from '../constants/constants';

export const ClaimTokens = () => {
  const [status, setstatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [canMint, setCanMint] = useState(false);
  const [error, setError] = useState("");

  const { config } = usePrepareContractWrite({
    address: DeTok_Contract_Address,
    abi: DeTOK_ABI,
    functionName: 'claimToken',
    args: [
      {
        gasLimit: 100000000,
        value: 0
      },
    ],
  });

  const { data, isSuccess, write } = useContractWrite(config);

  console.log(write);

  const handleClick = async () => {
    write();
   // setCanMint(true);
  }

 /* useEffect(() => {
    if(canMint){
      //todo: not sure why i cannot call write like in mint
      write()
    }
    
  },[]);*/

  return (
    <div className="pt-2">
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={() => handleClick()}
      >
       Mint free tokens
      </button>
    </div>
  )
}