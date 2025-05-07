interface GameInfoProps {
  icon?: JSX.Element;
  label: string;
  value: string;
}

export const GameInfo = ({ icon, label, value }: GameInfoProps) => {
  return (
    <li className="flex items-center gap-1 text-tiny font-medium uppercase text-[#a6adcd] crash:text-[#ff9696]">
      {icon}
      <span className="crash:text-[#ffc4c4] max-lg:sr-only">{label}</span>
      <span className="tabular-nums text-sm font-semibold text-[#dae2f5] crash:text-white">{value}</span>
    </li>
  );
};
