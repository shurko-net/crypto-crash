"use client";

import Image from "next/image";
import Monad from "~~/public/images/Monad.svg";

interface InputProps {
  onChange: (amount: string) => void;
  disabled?: boolean;
  value: string;
  balance: number;
}

export default function Input({ onChange, disabled, balance, value }: InputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    const regex = /^\d*\.?\d{0,4}$/;

    if (regex.test(input)) {
      onChange(input);
    }
  };

  const handleMaxClick = () => {
    const roundedBalance = parseFloat(balance.toFixed(4));
    onChange(roundedBalance.toString());
  };

  return (
    <>
      <div className="flex flex-col bg-[#291c66] rounded-[1rem] gap-2 p-2 pl-4 mb-3">
        <div className="grid grid-cols-[1fr_auto] min-h-[2.5rem] mb-0 items-center">
          <input
            type="text"
            placeholder="0.0000"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className="font-light text-2xl leading-[25px] text-[#f0f0f8] text-start w-full h-[calc(1.5em_+_.75rem_+_2px)] p-0 max-h-[23px] my-2 border-none outline-none bg-transparent disabled:opacity-50"
            aria-label="Bet amount"
          />
          <div className="flex items-center justify-end h-10 text-[1.125rem] leading-[1.375rem] text-[#f0f0f8] gap-[10px] pr-2">
            <Image alt="MON" src={Monad} width={30} height={30} priority />
            <span>MON</span>
          </div>
        </div>
      </div>

      <div className="w-full justify-end items-center gap-1 text-[#8b98a5] cursor-default flex text-[0.75rem] leading-[0.9375rem] font-light">
        <div className="items-center gap-2 flex-row flex">
          <div className="cursor-pointer flex flex-col text-[#f0f0f8]">{balance}</div>
          <button
            className="cursor-pointer hover:text-[#7371fc] transition-all duration-300 ease-in-out disabled:opacity-50"
            onClick={handleMaxClick}
            disabled={disabled}
            type="button"
            aria-label="Set maximum amount"
          >
            Max
          </button>
        </div>
      </div>
    </>
  );
}
