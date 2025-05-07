"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Car } from "./Car";
import { GameInfo } from "./GameInfo";
import { GameStatus } from "./GameStatus";
import { HistoryItem } from "./HistoryItem";
import { RoadTrack } from "./RoadTrack";
import { BanknotesIcon, UsersIcon } from "@heroicons/react/24/solid";
import { BetResult } from "~~/app/page";

interface CarRaceProps {
  betTimer: number;
  gameTimer: number;
  betResult: BetResult;
  isGameStarted: boolean;
  shortCarX: number;
  longCarX: number;
  isBettingOpen: boolean;
}
export const CarRace = ({
  betTimer,
  gameTimer,
  betResult,
  isGameStarted,
  shortCarX,
  longCarX,
  isBettingOpen,
}: CarRaceProps) => {
  const longCarPositionRef = useRef(0);
  const shortCarPositionRef = useRef(0);
  const [gameStatus, setGameStatus] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const longCarRef = useRef<HTMLDivElement>(null);
  const shortCarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameTimer === 10 && !isBettingOpen) {
      const statusMap: Record<Exclude<BetResult, null>, string> = {
        long: "Win: Long 🚀",
        short: "Win: Short 🔻",
        tie: "Win: Tie 🤝",
      };
      setGameStatus(betResult === null ? "Win: Unknown" : statusMap[betResult]);
    } else if (gameTimer > 0) {
      setGameStatus("In the Round");
    } else if (isBettingOpen && betTimer > 0) {
      setGameStatus("Round Through");
    } else {
      setGameStatus("");
    }
  }, [gameTimer, isBettingOpen, betTimer, betResult]);

  useEffect(() => {
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
        const targetLongX = (containerWidth * longCarX) / 100;
        const targetShortX = (containerWidth * shortCarX) / 100;

        const smoothFactor = 0.05;

        longCarPositionRef.current += (targetLongX - longCarPositionRef.current) * smoothFactor;
        shortCarPositionRef.current += (targetShortX - shortCarPositionRef.current) * smoothFactor;

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
  }, [isGameStarted, longCarX, shortCarX]);

  const currentTimer = gameTimer > 0 ? gameTimer : betTimer;

  const gameInfoItems = useMemo(
    () => [
      { icon: <BanknotesIcon className="mr-1.5 w-4.75 lg:w-5.5 lg:mr-2.5" />, label: "Bank: ", value: "34.00$" },
      { icon: <UsersIcon className="mr-1.5 w-4.75 lg:w-5.5 lg:mr-2.5" />, label: "Gamers: ", value: "31" },
    ],
    [],
  );

  const historyItems = useMemo(() => [{ winner: "long" as const }, { winner: "short" as const }], []);

  return (
    <div className="relative w-full h-full overflow-hidden box p-2.5 pt-0 pb-3 md:p-5 md:pb-4 md:pt-0">
      <div className="relative h-40 overflow-hidden md:h-[19.25rem] lg:h-[20.75rem]">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* GameStatus */}
          <GameStatus timer={currentTimer} status={gameStatus} betResult={betResult} />

          <div className="absolute left-0 z-[3] w-full bottom-[0] h-[50%]" ref={containerRef}>
            {/* Road */}
            <RoadTrack isAnimating={isGameStarted} />

            {/* Cars */}
            <Car type="long" isAnimating={isGameStarted} carRef={longCarRef} />
            <Car type="short" isAnimating={isGameStarted} carRef={shortCarRef} />
          </div>
        </div>
      </div>

      {/* Game Info */}
      <ul className="flex h-8 items-center mx-2 gap-3 lg:gap-6">
        {gameInfoItems.map((info, index) => (
          <GameInfo key={index} icon={info.icon} label={info.label} value={info.value} />
        ))}
      </ul>

      {/* History rounds */}
      <div className="no-scrollbar mt-1 lg:mt-3 -mx-2.5 flex h-9 lg:w-[calc(100%+1.75rem*2)] gap-1 overflow-x-auto pl-4 pr-4 pt-1 [mask-image:linear-gradient(90deg,#00000000,black_.5rem,black_calc(100%-4rem),#00000000)] sm:h-11 sm:pt-1 md:py-1 lg:-mx-7 lg:px-7 lg:[mask-image:linear-gradient(90deg,#00000000,black_2rem,black_calc(100%-5rem),#00000000)]">
        {historyItems.map((item, index) => (
          <HistoryItem key={index} winner={item.winner} />
        ))}
      </div>
    </div>
  );
};
