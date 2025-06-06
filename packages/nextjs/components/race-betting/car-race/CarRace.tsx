"use client";

import { memo, useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Car } from "./Car";
import GameInfo from "./GameInfo";
import { GameStatus } from "./GameStatus";
import HistoryItem from "./HistoryItem";
import { RoadTrack } from "./RoadTrack";
import { AnimatePresence, motion } from "framer-motion";
import { BanknotesIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useGameHistory } from "~~/hooks/car-race/useGameHistory";
import LightTrafic from "~~/public/images/light-trafic.png";

interface CarRaceProps {
  isGameStarted: boolean | null;
  shortCarX: number | null;
  longCarX: number | null;
  isWinnerDisplay: boolean;
  timer: number | null;
  gameResult: "Long" | "Short" | "Tie" | null;
  gameStatus: string;
  isBettingOpen: boolean | null;
  getBackgroundColor: () => void;
  isLoading: boolean;
  bank: number | null;
  gamersCount: number | null;
}

const CarRace = ({
  isGameStarted,
  shortCarX,
  longCarX,
  isWinnerDisplay,
  timer,
  gameResult,
  gameStatus,
  isBettingOpen,
  isLoading,
  getBackgroundColor,
  bank,
  gamersCount,
}: CarRaceProps) => {
  const longCarPositionRef = useRef(0);
  const shortCarPositionRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const longCarRef = useRef<HTMLDivElement>(null);
  const shortCarRef = useRef<HTMLDivElement>(null);

  const { data: gameHistory } = useGameHistory(isWinnerDisplay);

  useLayoutEffect(() => {
    if (!isGameStarted) {
      longCarPositionRef.current = 0;
      shortCarPositionRef.current = 0;

      if (longCarRef.current) {
        longCarRef.current.style.transform = `translateX(0px)`;
      }
      if (shortCarRef.current) {
        shortCarRef.current.style.transform = `translateX(0px)`;
      }
      return;
    }

    let animationFrameId: number;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;

      if (deltaTime > 16) {
        const containerWidth = containerRef.current?.clientWidth || 0;
        const longCarWidth = longCarRef.current?.offsetWidth || 0;
        const shortCarWidth = shortCarRef.current?.offsetWidth || 0;

        const maxXLong = containerWidth - longCarWidth;
        const maxXShort = containerWidth - shortCarWidth;

        const smoothFactor = 0.05;

        longCarPositionRef.current += (longCarX ?? 0) * smoothFactor;
        shortCarPositionRef.current += (shortCarX ?? 0) * smoothFactor;

        longCarPositionRef.current = Math.max(0, Math.min(maxXLong, longCarPositionRef.current));
        shortCarPositionRef.current = Math.max(0, Math.min(maxXShort, shortCarPositionRef.current));

        if (longCarRef.current) {
          longCarRef.current.style.transform = `translateX(${longCarPositionRef.current}px)`;
        }
        if (shortCarRef.current) {
          shortCarRef.current.style.transform = `translateX(${shortCarPositionRef.current}px)`;
        }

        lastTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [longCarX, shortCarX, isGameStarted]);

  const gameInfoItems = useMemo(
    () => [
      {
        icon: <BanknotesIcon className="mr-1.5 w-4.75 lg:w-5.5 lg:mr-2.5" />,
        label: "Bank: ",
        value: bank ? bank.toFixed(4) : "0",
      },
      {
        icon: <UsersIcon className="mr-1.5 w-4.75 lg:w-5.5 lg:mr-2.5" />,
        label: "Gamers: ",
        value: String(gamersCount ?? 0),
      },
    ],
    [bank, gamersCount],
  );

  return (
    <div
      className={`relative w-full h-full overflow-hidden box p-2.5 pt-0 pb-3 md:p-5 md:pb-4 md:pt-0 ${isLoading && "flex items-center justify-center"}`}
    >
      {isLoading ? (
        <span className="loading loading-spinner text-primary "></span>
      ) : (
        <>
          <GameStatus isWinnerDisplay={isWinnerDisplay} timer={timer} gameStatus={gameStatus} gameResult={gameResult} />
          <div
            className={`absolute w-[140px] h-[80px] left-0 top-0 rounded-tl-[16px] ${
              isWinnerDisplay && getBackgroundColor()
            }`}
          ></div>
          <div className="absolute top-[12px] right-[4px]">
            {isWinnerDisplay && (
              <div className="absolute rounded-full bg-[#fe2528] border-[#8a051f] border-[2px] z-[1] w-[34.23%] aspect-square top-[9%] right-[27%]"></div>
            )}
            {isBettingOpen && (
              <div className="absolute rounded-full bottom-[40px] bg-[#feaf11] border-[#e54f09] border-[2px] z-[1] w-[34.23%] aspect-square right-[27%]"></div>
            )}
            {isGameStarted && (
              <div className="absolute rounded-full bottom-[7px] bg-[#00b34d] border-[#015043] border-[2px] z-[1] w-[34.23%] aspect-square right-[27%]"></div>
            )}
            <div className="relative w-[38px] h-[54px] md:w-[63px] md:h-[90px] lg:w-[76px] lg:h-[110px] aspect-[110/76]">
              <Image
                alt="light-trafic"
                src={LightTrafic}
                fill
                sizes="(min-width: 1024px) 76px, (min-width: 768px) 63px, 38px"
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>

          <div className="relative h-40 overflow-hidden md:h-[19.25rem] lg:h-[20.75rem]">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute left-0 z-[3] w-full bottom-[0] h-[50%]" ref={containerRef}>
                <RoadTrack isAnimating={isGameStarted} />
                <Car type="Long" isAnimating={isGameStarted} carRef={longCarRef} />
                <Car type="Short" isAnimating={isGameStarted} carRef={shortCarRef} />
              </div>
            </div>
          </div>

          <ul className="flex h-8 items-center mx-2 gap-3 lg:gap-6">
            {gameInfoItems.map((info, index) => (
              <GameInfo key={index} icon={info.icon} label={info.label} value={info.value} />
            ))}
          </ul>

          <div className="no-scrollbar mt-1 lg:mt-3 -mx-2.5 flex h-9 lg:w-[calc(100%+1.75rem*2)] gap-1 pl-4 pr-4 pt-1 [mask-image:linear-gradient(90deg,#00000000,black_.5rem,black_calc(100%-4rem),#00000000)] sm:h-11 sm:pt-1 md:py-1 lg:-mx-7 lg:px-7 lg:[mask-image:linear-gradient(90deg,#00000000,black_2rem,black_calc(100%-5rem),#00000000)] overflow-x-hidden transition-all duration-300">
            <AnimatePresence initial={false}>
              {gameHistory.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -56 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 56 }}
                  transition={{ duration: 0.3 }}
                >
                  <HistoryItem winner={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(CarRace);
