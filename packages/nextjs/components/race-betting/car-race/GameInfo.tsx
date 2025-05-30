import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface GameInfoProps {
  icon?: JSX.Element;
  label: string;
  value?: number;
}

export const GameInfo = ({ icon, label, value }: GameInfoProps) => {
  const [prevCount, setPrevCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (value !== undefined) {
      setPrevCount(prev => (prev === value ? prev : value));
    }
  }, [value]);

  if (value === undefined) return null;

  // Умовне форматування: якщо дробне — до 4 знаків, якщо ціле — без дробової частини
  const formatValue = (v: number) => (Number.isInteger(v) ? v.toString() : v.toFixed(4));

  const currentStr = formatValue(value);
  const prevStr = formatValue(prevCount ?? value);
  const currentChars = currentStr.split("");
  const prevChars = prevStr.split("");

  return (
    <li className="flex items-center gap-1 text-tiny font-medium uppercase text-[#a6adcd] crash:text-[#ff9696]">
      {icon}
      <span className="crash:text-[#ffc4c4] max-lg:sr-only">{label}</span>
      <div className="flex overflow-hidden h-[24px]">
        {currentChars.map((char, index) => {
          const hasChanged = char !== prevChars[index];
          const isDot = char === ".";

          return (
            <div key={index} className="w-[10px] relative text-center">
              <AnimatePresence initial={false}>
                {hasChanged && !isDot ? (
                  <motion.div
                    key={char + index + value}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 w-full font-bold text-yellow-500"
                  >
                    {char}
                  </motion.div>
                ) : (
                  <div className="absolute top-0 left-0 w-full font-bold text-yellow-500">{char}</div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </li>
  );
};
