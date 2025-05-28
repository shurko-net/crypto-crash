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
  isBettingOpen: boolean;
  placeBet: (amount: number, side: BetSide, txHash: string, gameId: string) => Promise<void>;
  gameId: string;
}

export default function BetAmount({ authStatus, isBettingOpen, placeBet, address, gameId }: BetAmountProps) {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betSide, setBetSide] = useState<BetSide>(null);

  const { writeContractAsync, isMining } = useScaffoldWriteContract("MyContract");

  const { data: balance } = useWatchBalance({
    address,
  });

  const handleBet = async () => {
    if (authStatus === "unauthenticated") {
      toast.error("Подключите кошелёк для размещения ставки");
      return;
    }
    if (!isBettingOpen) {
      toast.error("Ставки сейчас закрыты");
      return;
    }

    if (!betAmount || betAmount <= 0) {
      toast.error("Введите сумму ставки больше 0");
      return;
    }

    if (!betSide) {
      toast.error("Выберите сторону ставки: long или short");
      return;
    }

    try {
      const txHash = await writeContractAsync({
        functionName: "deposit",
        value: parseEther(`${betAmount}`),
      });
      console.log("txHash", txHash);
      await placeBet(betAmount, betSide, txHash as `0x${string}`, gameId);

      setBetAmount(0);
      setBetSide(null);

      toast.success("Ставка отправлена! 🎯");
    } catch (error) {
      toast.error("Ошибка при отправке ставки");
      console.error(error);
    }
  };

  const formattedBalance = balance && authStatus === "authenticated" ? Number(formatEther(balance.value)) : 0;

  return (
    <div className="box rounded-3xl relative px-4 py-4 lg:p-5 lg:z-30 shrink-0 flex flex-col gap-3.5 mb-4">
      <div className="mb-2.5 pl-1.5 text-nano font-medium uppercase text-[#abb2cf]">Enter the bet amount</div>
      <div className="mb-4">
        <Input onChange={setBetAmount} value={betAmount} balance={parseFloat(formattedBalance.toFixed(4))} />
      </div>
      <div className="mb-4">
        <div className="text-nano font-medium uppercase text-[#abb2cf] mb-2">Select side</div>
        <div className="flex gap-4">
          <BetSideOption side="long" selected={betSide === "long"} onChange={() => setBetSide("long")} />
          <BetSideOption side="short" selected={betSide === "short"} onChange={() => setBetSide("short")} />
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
