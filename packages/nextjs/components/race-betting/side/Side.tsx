import BetAmount from "./BetAmount";
import Withdraw from "./Withdraw";
import { useAccount } from "wagmi";
import { useGlobalState } from "~~/services/store/store";
import { BetSide } from "~~/types/betting";

interface SideProps {
  isBettingOpen: boolean;
  placeBet: (amount: number, side: BetSide, txHash: string) => Promise<void>;
  gameId: string;
}

export const Side = ({ isBettingOpen, placeBet, gameId }: SideProps) => {
  const authStatus = useGlobalState(({ authStatus }) => authStatus);
  const { address } = useAccount();

  return (
    <div className="order-1 md:w-70 lg:w-79 shrink-0 ">
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
