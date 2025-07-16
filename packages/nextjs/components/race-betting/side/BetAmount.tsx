import { useState } from "react";
import BetSideOption from "./BetSideOption";
import Input from "./Input";
import toast from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { useScaffoldWriteContract, useWatchBalance } from "~~/hooks/scaffold-eth";
import { BetSide } from "~~/types/betting";

interface BetAmountProps {
  authStatus: string;
  address: string | undefined;
  isBettingOpen: boolean | null;
  placeBet: (gameId: string, amount: number, side: BetSide, txHash: string) => Promise<void>;
  gameId: string | null;
}

export default function BetAmount({ authStatus, isBettingOpen, placeBet, address, gameId }: BetAmountProps) {
  const [betAmount, setBetAmount] = useState("");
  const [betSide, setBetSide] = useState<BetSide>(null);

  const { writeContractAsync, isMining } = useScaffoldWriteContract("MyContract");

  const { data: balance } = useWatchBalance({
    address,
  });

  const handleBet = async () => {
    if (authStatus === "unauthenticated") {
      toast.error("Connect your wallet to place a bet!", {
        icon: "🚫",
      });
      return;
    }
    if (!isBettingOpen) {
      toast.error("Bets are currently closed. Please wait for the next round.", {
        icon: "⏳",
      });
      return;
    }

    if (!betAmount || Number(betAmount) <= 0) {
      toast.error("Enter a bet amount greater than 0.", {
        icon: "🚫",
      });
      return;
    }

    if (!betSide) {
      toast.error("Select a side (LONG, SHORT).", {
        icon: "🧭",
      });
      return;
    }

    try {
      const txHash = await writeContractAsync({
        functionName: "deposit",
        value: parseEther(`${betAmount}`),
      });

      if (!gameId) return;
      console.log("gameId: ", gameId);
      console.log("betAmount: ", Number(betAmount));
      console.log("betSide: ", betSide);
      console.log("txHash: ", txHash);

      await placeBet(gameId, Number(betAmount), betSide, txHash as `0x${string}`);
      setBetAmount("");
      setBetSide(null);
      toast.success("Bid sent! 🎯", {
        icon: "🎯",
      });
    } catch (error) {
      setBetAmount("");
      setBetSide(null);
      toast.error("Error sending bid");
      console.error(error);
      return;
    }
  };

  const formattedBalance = balance && authStatus === "authenticated" ? Number(formatEther(balance.value)) : 0;

  return (
    <div className="box rounded-3xl relative px-4 py-4 lg:p-5 lg:z-30 shrink-1 lg:shrink-0 flex flex-col gap-3.5 mb-4 md:mb-0 lg:mb-4">
      <div className="mb-2.5 pl-1.5 font-medium uppercase text-[#abb2cf]">Enter the bet amount</div>
      <div className="mb-4">
        <Input onChange={setBetAmount} value={betAmount} balance={parseFloat(formattedBalance.toFixed(4))} />
      </div>
      <div className="mb-4">
        <div className="font-medium uppercase text-[#abb2cf] mb-2">Select side</div>
        <div className="flex gap-4">
          <BetSideOption
            side="Long"
            selected={betSide === "Long"}
            onChange={() => {
              setBetSide("Long");
            }}
          />
          <BetSideOption
            side="Short"
            selected={betSide === "Short"}
            onChange={() => {
              setBetSide("Short");
            }}
          />
        </div>
      </div>
      <button
        disabled={isMining}
        onClick={handleBet}
        className="cursor-pointer w-full rounded-[20px] text-goldYellow bg-purpleRoyal border-pinkRose border-[5px] border-solid   text-[32px] uppercase transition-all duration-300 hover:shadow-(--bet-button-shadow) hover:scale-95"
      >
        place bet
      </button>
    </div>
  );
}
