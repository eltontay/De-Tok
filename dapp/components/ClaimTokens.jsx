import { useContractRead } from 'wagmi'

export const Balance = () => {
  const { refetch } = useContractRead(
    {
      addressOrName: DTok_Contract_Address,
      abi: Greeter_ABI,
    },
    'greeting'
  )

  const handleClick = async () => {
    const res = refetch()
    console.log(`Greeting: ${res}`)
  }

  return <button onClick={handleClick}>Read greeting</button>
}