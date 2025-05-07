export default function BetSideOption({
  side,
  selected,
  onChange,
}: {
  side: "long" | "short";
  selected: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`option items-center cursor-pointer flex-[50%] text-center rounded-[20px] py-[4px]
				${
          side === "long"
            ? "bg-vividPurple border-[5px] border-solid border-hotPink"
            : "bg-aquaBlue border-[5px] border-solid border-turquoise"
        }
				${
          selected
            ? side === "long"
              ? "shadow-(--long-button-shadow) scale-95"
              : "shadow-(--short-button-shadow) scale-95"
            : ""
        }
			`}
    >
      <input type="radio" name="betSide" value={side} checked={selected} onChange={onChange} className="hidden" />
      <span className="text-goldYellow text-[20px] uppercase">{side}</span>
    </label>
  );
}
