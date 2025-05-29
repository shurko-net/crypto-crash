import { memo } from "react";
import { GameResult } from "~~/types/betting";

interface GameStatusProps {
  timer: number | null;
  gameStatus: string;
  gameResult: GameResult;
  isWinnerDisplay: boolean;
}

export const GameStatus = memo(({ timer, gameStatus, gameResult, isWinnerDisplay }: GameStatusProps) => {
  // const isWinnerDisplay = status.includes("Win:") && timer === 15;

  const getTextColor = () => {
    switch (gameResult) {
      case "long":
        return "text-green-500";
      case "short":
        return "text-red-500";
      case "tie":
        return "text-yellow-500";
    }
  };

  return (
    <div className="absolute z-[5] left-[1%] top-3 text-center min-w-[140px]">
      <div className={`text-[1rem] font-bold lg:text-4xl text-grey-400 ${isWinnerDisplay && getTextColor()}`}>
        {timer}s
      </div>
      <span className={`text-gray-400 text-sm block ${isWinnerDisplay && getTextColor()}`}>{gameStatus}</span>
    </div>
  );
});

GameStatus.displayName = "GameStatus";
