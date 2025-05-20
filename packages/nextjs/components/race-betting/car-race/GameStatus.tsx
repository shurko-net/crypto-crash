import { memo } from "react";
import { BetResult } from "~~/app/page";

export const GameStatus = memo(
  ({ timer, status, betResult }: { timer: number; status: string; betResult: BetResult }) => {
    const isWinnerDisplay = status.includes("Win:") && timer === 15;
    console.log("status", status);
    if (isWinnerDisplay) {
      return (
        <div className={`text-center ${betResult === "long" ? "text-green-400" : "text-red-400"}`}>
          <h1 className="text-lg lg:text-6xl uppercase text-white text-center">
            {betResult === "long" ? "long wins!" : betResult === "short" ? "short wins!" : "tie!"}
          </h1>
        </div>
      );
    }

    return (
      <div className="absolute z-[5] left-[2%] top-4 text-center min-w-[140px]">
        <div className="text-[1rem] font-bold lg:text-4xl">{timer}s</div>
        <span className="text-gray-400 text-sm block">{status}</span>
      </div>
    );
  },
);

GameStatus.displayName = "GameStatus";
