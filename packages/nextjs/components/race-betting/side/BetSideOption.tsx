export default function BetSideOption({
  side,
  selected,
  onChange,
}: {
  side: "long" | "short" | "tie";
  selected: boolean;
  onChange: () => void;
}) {
  const baseClasses = "option items-center cursor-pointer flex-[50%] text-center rounded-[20px] py-[4px]";

  const sideStyles: Record<"long" | "short" | "tie", string> = {
    long: "bg-vividPurple border-[5px] border-solid border-hotPink",
    short: "bg-aquaBlue border-[5px] border-solid border-turquoise",
    tie: "bg-[#55156c] border-[5px] border-solid border-[#a61fa7]",
  };

  const selectedShadow: Record<"long" | "short" | "tie", string> = {
    long: "shadow-(--long-button-shadow) scale-95",
    short: "shadow-(--short-button-shadow) scale-95",
    tie: "shadow-(--tie-button-shadow) scale-95",
  };

  return (
    <label className={`${baseClasses} ${sideStyles[side]} ${selected ? selectedShadow[side] : ""}`}>
      <input type="radio" name="betSide" value={side} checked={selected} onChange={onChange} className="hidden" />
      <span className="text-goldYellow text-[20px] uppercase">{side}</span>
    </label>
  );
}
