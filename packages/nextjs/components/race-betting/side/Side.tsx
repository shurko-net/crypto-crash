import { useState } from "react";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import BetSideOption from "~~/components/race-betting/side/BetSideOption";
import Input from "~~/components/race-betting/side/Input";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { BetResult, BetSide } from "~~/types/betting";

interface SideProps {
  isBettingOpen: boolean;
  placeBet: (amount: number, side: BetResult, txHash: string) => Promise<void>;
}

export const Side = ({ isBettingOpen, placeBet }: SideProps) => {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betSide, setBetSide] = useState<BetSide>(null);
  const authStatus = useGlobalState(({ authStatus }) => authStatus);

  const { writeContractAsync, isMining } = useScaffoldWriteContract("MyContract");

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
        args: [] as any[],
        value: parseEther(`${betAmount}`),
      });
      await placeBet(betAmount, betSide, txHash as `0x${string}`);

      setBetAmount(0);
      setBetSide(null);

      toast.success("Ставка отправлена! 🎯");
    } catch (error) {
      toast.error("Ошибка при отправке ставки");
      console.error(error);
    }
  };
  return (
    <div className="order-1 md:w-70 lg:w-79 shrink-0 ">
      <div className="box rounded-3xl relative px-4 py-4 lg:p-5 lg:z-30 shrink-0 flex flex-col gap-3.5">
        <div className="mb-2.5 pl-1.5 text-nano font-medium uppercase text-[#abb2cf]">Enter the bet amount</div>
        <div className="mb-4">
          <Input onChange={setBetAmount} value={betAmount} />
        </div>
        <div className="mb-4">
          <div className="text-nano font-medium uppercase text-[#abb2cf] mb-2">Select side</div>
          <div className="flex gap-4">
            <BetSideOption side="long" selected={betSide === "long"} onChange={() => setBetSide("long")} />
            <BetSideOption side="short" selected={betSide === "short"} onChange={() => setBetSide("short")} />
          </div>
        </div>
        <button
          onClick={handleBet}
          className="cursor-pointer w-full rounded-[20px] text-goldYellow bg-purpleRoyal border-pinkRose border-[5px] border-solid   text-[32px] uppercase transition-all duration-300 hover:shadow-(--bet-button-shadow) hover:scale-95"
        >
          place bet
        </button>
      </div>
    </div>
  );
};
