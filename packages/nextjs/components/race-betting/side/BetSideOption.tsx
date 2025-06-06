export default function BetSideOption({
  side,
  selected,
  onChange,
}: {
  side: "Long" | "Short" | "Tie";
  selected: boolean;
  onChange: () => void;
}) {
  const baseClasses = "option items-center cursor-pointer flex-[50%] text-center rounded-[20px] py-[4px]";

  const sideStyles: Record<"Long" | "Short" | "Tie", string> = {
    Long: "bg-vividPurple border-[5px] border-solid border-hotPink",
    Short: "bg-aquaBlue border-[5px] border-solid border-turquoise",
    Tie: "bg-[#55156c] border-[5px] border-solid border-[#a61fa7]",
  };

  const selectedShadow: Record<"Long" | "Short" | "Tie", string> = {
    Long: "shadow-(--long-button-shadow) scale-95",
    Short: "shadow-(--short-button-shadow) scale-95",
    Tie: "shadow-(--tie-button-shadow) scale-95",
  };

  return (
    <label className={`${baseClasses} ${sideStyles[side]} ${selected ? selectedShadow[side] : ""}`}>
      <input type="radio" name="betSide" value={side} checked={selected} onChange={onChange} className="hidden" />
      <span className="text-goldYellow text-[20px] uppercase">{side}</span>
    </label>
  );
}
