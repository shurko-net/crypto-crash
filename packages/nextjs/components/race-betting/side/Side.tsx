import { memo } from "react";
import BetAmount from "./BetAmount";
import Withdraw from "./Withdraw";
import { useAccount } from "wagmi";
import { useGlobalState } from "~~/services/store/store";
import { BetSide } from "~~/types/betting";

interface SideProps {
  isBettingOpen: boolean | null;
  placeBet: (gameId: string, amount: number, side: BetSide, txHash: string) => Promise<void>;
  gameId: string | null;
}

const Side = ({ isBettingOpen, placeBet, gameId }: SideProps) => {
  const authStatus = useGlobalState(({ authStatus }) => authStatus);
  const { address } = useAccount();

  return (
    <div className="order-1 shrink-0 block justify-between md:flex md:gap-x-4 md:shrink-1 md:justify-between md:w-full lg:w-79 lg:shrink-0 lg:block ">
      <BetAmount
        address={address}
        authStatus={authStatus}
        isBettingOpen={isBettingOpen}
        placeBet={placeBet}
        gameId={gameId}
      />
      <Withdraw address={address} />
    </div>
  );
};

export default memo(Side);
