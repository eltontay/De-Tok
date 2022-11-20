import React, { useState, useCallback, useEffect } from "react";
import { useAccount, useContractRead, useProvider, useSigner } from 'wagmi';
import {
  DTOK_ABI,
  DTok_Contract_Address
} from '../constants/constants';


export const CheckBalance = () => {
  const [status, setstatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

    const { refetch } = useContractRead(
      {
        address: DTok_Contract_Address,
        abi:DTOK_ABI,
        functionName: 'balanceOf',
        args: ['0x9680A866299a8D021114Ac6A460Ba8e5860B68Fb'],
      },
    )
    
    const handleClick = async () => {
      const res = await refetch();
      const { status, data} = res;
      if(res.status == "success"){
        setBalance(Number(data));
      }
    }

    return (
      <div className="pt-2">
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={() => handleClick()}
      >
       Available DToks:{balance}
      </button>
    </div>
    )
}