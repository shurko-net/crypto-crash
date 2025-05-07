"use client";

import type { NextPage } from "next";
import { PlayerBets } from "~~/components/race-betting/PlayerBets";
import { CarRace } from "~~/components/race-betting/car-race/CarRace";
import { Side } from "~~/components/race-betting/side/Side";
import { useGameHub } from "~~/hooks/signalr/useGameHub";

export type BetResult = "long" | "short" | "tie" | null;

const Home: NextPage = () => {
  const {
    shortCarX,
    longCarX,
    betTimer,
    gameTimer,
    gameResult,
    isGameStarted,
    isBettingOpen,
    connectionStatus,
    placeBet,
  } = useGameHub();

  if (connectionStatus === "connecting") return <span className="loading loading-spinner text-primary"></span>;

  return (
    <div className="container pt-[4.75rem] lg:pt-[1rem]">
      <div className="flex flex-col md:flex-row gap-4 sm:max-md:mx-auto sm:max-md:max-w-[32rem] ">
        <div className="grow overflow-hidden max-md:contents">
          <div className="md:mb-4 gap-4 md:flex md:h-[24.875rem] lg:h-[26.925rem] relative -order-1">
            <CarRace
              shortCarX={shortCarX}
              longCarX={longCarX}
              betTimer={betTimer}
              gameTimer={gameTimer}
              betResult={gameResult}
              isGameStarted={isGameStarted}
              isBettingOpen={isBettingOpen}
            />
          </div>
          <PlayerBets />
        </div>
        <Side placeBet={placeBet} isBettingOpen={isBettingOpen} />
      </div>
    </div>
  );
};

export default Home;
