import { useState } from "react";
import Input from "./Input";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

export default function Withdraw() {
  const [betAmount, setBetAmount] = useState<number>(0);
  const authStatus = useGlobalState(({ authStatus }) => authStatus);
  const { address } = useAccount();

  //@ts-ignore
  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useScaffoldReadContract({
    contractName: "MyContract",
    functionName: "balanceOf",
    args: [address],
  });

  const formattedBalance = balance && authStatus === "authenticated" ? Number(formatEther(balance)) : 0;

  return (
    <div className="box rounded-3xl relative px-4 py-4 lg:p-5 lg:z-30 shrink-0 flex flex-col gap-3.5">
      <div className="mb-2.5 pl-1.5 text-nano font-medium uppercase text-[#abb2cf]">enter the withdrawal amount</div>
      <div className="mb-4">
        <Input balance={formattedBalance} onChange={setBetAmount} value={betAmount} />
      </div>
      <button
        // disabled={isMining}
        // onClick={handleBet}
        className="cursor-pointer w-full rounded-[20px] text-goldYellow bg-purpleRoyal border-pinkRose border-[5px] border-solid   text-[32px] uppercase transition-all duration-300 hover:shadow-(--bet-button-shadow) hover:scale-95"
      >
        withdraw
      </button>
    </div>
  );
}
