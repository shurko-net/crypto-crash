import { memo } from "react";
import { WinnerType } from "~~/types/betting";

interface HistoryItemProps {
  winner: WinnerType;
}

const HistoryItem = ({ winner }: HistoryItemProps) => {
  let bgColor = "";

  switch (winner.winningSide) {
    case "Long":
      bgColor = "bg-[rgba(45,196,78,0.4)]";
      break;
    case "Short":
      bgColor = "bg-[rgba(252,36,162,0.4)]";
      break;
    case "Tie":
      bgColor = "bg-[rgba(254,203,2,0.4)]";
      break;
  }

  return (
    <div className="flex justify-end">
      <div
        className={`min-w-[3.51375rem] px-3 h-8 font-bold transition-all duration-150 ease-in-out sm:rounded-md sm:text-xs flex justify-center items-center rounded-md ${bgColor} hover:filter hover:brightness-[1.1] cursor-pointer text-goldYellow`}
      >
        {winner.winningSide}
      </div>
    </div>
  );
};

export default memo(HistoryItem);
