import { memo } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

type BetsProps = {
  playerBets: { [address: string]: number };
  resultBets: { [address: string]: boolean };
};

const PlayerBets = ({ playerBets, resultBets }: BetsProps) => {
  const isEmpty = Object.keys(playerBets).length === 0;
  return (
    <section className="pt-2 order-2 flex-1 box px-4 py-4 lg:p-5">
      <div className="mb-4 flex items-center ">
        <DocumentTextIcon className="w-[1.125rem] text-[#a6adcd]" />
        <h2 className="!mb-0 pl-1.5 font-medium uppercase text-[#abb2cf]">Players Bets</h2>
      </div>
      {isEmpty ? (
        <div className="h-full flex justify-center items-center font-medium uppercase text-[#abb2cf]">
          Waiting for players to place their bets...
        </div>
      ) : (
        <ul className="overflow-y-auto max-h-[48.75rem]">
          {Object.entries(playerBets).map(([address, bet]) => {
            const isWinner = resultBets[address];
            console.log(isWinner);

            return (
              <li key={address} className="h-18 sm:h-21">
                <div
                  className={`relative z-1 flex h-16 items-center gap-3 overflow-hidden rounded pl-3 sm:h-20 sm:pl-4 lg:rounded-2xl bg-[#1c233a] bg-gradient-var-to-r [--to:#232c4833] ${
                    isWinner === true
                      ? "bg-[linear-gradient(to_left,rgba(45,196,78,0.2)_0%,rgba(45,196,78,0.1)_100%,transparent_80%)]"
                      : isWinner === false
                        ? "bg-[linear-gradient(to_left,rgba(252,36,162,0.2)_0%,rgba(252,36,162,0.1)_100%,transparent_80%)]"
                        : "#2a345480"
                  }`}
                >
                  <div className="mr-auto flex items-center gap-3 sm:gap-4.5">
                    <div className="block aspect-square h-fit shrink-0 w-10 sm:w-11.5">
                      <div className="mb-0.5 font-medium max-md:sr-only">
                        {address?.slice(0, 6) + "..." + address?.slice(-4)}
                      </div>
                      <div className="text-sm font-semibold text-[#7371fc] sm:text-base whitespace-nowrap">{`${bet.toFixed(4)} MON`}</div>
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-3 overflow-hidden ">
                    <div className="relative z-1 flex h-full items-center gap-4 pr-3 sm:pr-4 ">
                      <div
                        className={`flex items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed  px-3 py-1.5 text-xs font-semibold uppercase  sm:min-w-16.5 ${
                          isWinner === true
                            ? "text-[#00be43ab] border-[#00be43ab]"
                            : isWinner === false
                              ? "text-[#ff4d4cab] border-[#ff4d4cab]"
                              : "text-[#d6e2ff] border-[#7371fc]"
                        }`}
                      >
                        {isWinner === true ? "Won" : isWinner === false ? "Lost" : "In Game"}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default memo(PlayerBets);
