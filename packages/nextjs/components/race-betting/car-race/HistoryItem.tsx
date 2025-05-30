import { WinnerType } from "~~/types/betting";

interface HistoryItemProps {
  winner: WinnerType;
}

export const HistoryItem = ({ winner }: HistoryItemProps) => {
  let bgColor = "";

  switch (winner) {
    case "long":
      bgColor = "bg-[rgba(45,196,78,0.4)]";
      break;
    case "short":
      bgColor = "bg-[rgba(252,36,162,0.4)]";
      break;
    case "tie":
      bgColor = "bg-[rgba(254,203,2,0.4)]";
  }

  return (
    <div className="flex justify-end">
      <div
        className={`min-w-[3.51375rem] px-3 h-8 font-bold transition-all duration-150 ease-in-out sm:rounded-md sm:text-xs flex justify-center items-center rounded-md ${bgColor} hover:filter hover:brightness-[1.1] cursor-pointer text-goldYellow`}
      >
        {winner}
      </div>
    </div>
  );
};
