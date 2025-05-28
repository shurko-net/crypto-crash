import { useState } from "react";
import Input from "./Input";
import toast from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

export default function Withdraw({ address }: { address: string | undefined }) {
  const [betAmount, setBetAmount] = useState(0);
  const authStatus = useGlobalState(({ authStatus }) => authStatus);

  const { writeContractAsync, isMining } = useScaffoldWriteContract("MyContract");

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

  const handleBet = async () => {
    if (authStatus === "unauthenticated") {
      toast.error("Подключите кошелёк для размещения ставки");
      return;
    }

    if (!betAmount || betAmount <= 0) {
      toast.error("Введите сумму ставки больше 0");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "withdrawnToUser",
        args: [
          {
            userAddress: `${address}`,
            amount: parseEther(`${betAmount}`),
          },
        ],
      });

      toast.success("Вывод успешен");
    } catch (error) {
      toast.error("Ошибка при отправке ставки");
      console.error(error);
    }
  };

  const formattedBalance = balance && authStatus === "authenticated" ? Number(formatEther(balance)) : 0;

  return (
    <div className="box rounded-3xl relative px-4 py-4 lg:p-5 lg:z-30 shrink-0 flex flex-col gap-3.5">
      <div className="mb-2.5 pl-1.5 text-nano font-medium uppercase text-[#abb2cf]">enter the withdrawal amount</div>
      <div className="mb-4">
        <Input balance={formattedBalance} onChange={setBetAmount} value={betAmount} />
      </div>
      <button
        disabled={isMining}
        onClick={handleBet}
        className="cursor-pointer w-full rounded-[20px] text-goldYellow bg-purpleRoyal border-pinkRose border-[5px] border-solid   text-[32px] uppercase transition-all duration-300 hover:shadow-(--bet-button-shadow) hover:scale-95"
      >
        withdraw
      </button>
    </div>
  );
}
