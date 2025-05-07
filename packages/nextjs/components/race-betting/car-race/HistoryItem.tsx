interface HistoryItemProps {
  winner: "long" | "short";
}

export const HistoryItem = ({ winner }: HistoryItemProps) => {
  let bgColor = "";

  switch (winner) {
    case "long":
      bgColor = "bg-vividPurple";
      break;
    case "short":
      bgColor = "bg-aquaBlue";
      break;
    default:
      bgColor = "";
  }

  return (
    <div className="flex justify-end">
      <div
        className={`px-3 h-8 font-bold transition-all duration-150 ease-in-out sm:rounded-md sm:text-xs flex items-center rounded-md ${bgColor} hover:filter hover:brightness-[1.1] cursor-pointer text-goldYellow`}
      >
        {winner}
      </div>
    </div>
  );
};
