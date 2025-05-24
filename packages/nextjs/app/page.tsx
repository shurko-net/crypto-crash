"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { PlayerBets } from "~~/components/race-betting/PlayerBets";
import { CarRace } from "~~/components/race-betting/car-race/CarRace";
import { Side } from "~~/components/race-betting/side/Side";
import { useGameHub } from "~~/hooks/signalr/useGameHub";
import { GameResult } from "~~/types/betting";

const Home: NextPage = () => {
  const [gameStatus, setGameStatus] = useState<string>("");

  const { shortCarX, longCarX, timer, gameResult, isGameStarted, isBettingOpen, isLoading, placeBet } = useGameHub();

  const isWinnerDisplay = !isGameStarted && !isBettingOpen;

  useEffect(() => {
    if (isWinnerDisplay) {
      const statusMap: Record<Exclude<GameResult, null>, string> = {
        long: "Win: Long",
        short: "Win: Short",
        tie: "Win: Tie",
      };
      setGameStatus(gameResult === null ? "Win: Unknown" : statusMap[gameResult]);
    } else if (isGameStarted) {
      setGameStatus("In the Round");
    } else if (isBettingOpen) {
      setGameStatus("Round Through");
    } else {
      setGameStatus("");
    }
  }, [isBettingOpen, timer, gameResult, isGameStarted, isWinnerDisplay]);

  const getBackgroundColor = () => {
    if (isWinnerDisplay) {
      switch (gameResult) {
        case "long":
          return "bg-[radial-gradient(at_top_left,rgba(45,196,78,0.4)_0%,rgba(45,196,78,0.1)_50%,transparent_80%)]";
        case "short":
          return "bg-[radial-gradient(at_top_left,rgba(252,36,162,0.4)_0%,rgba(252,36,162,0.1)_50%,transparent_80%)]";
        case "tie":
          return "bg-[radial-gradient(at_top_left,rgba(254,203,2,0.4)_0%,rgba(254,203,2,0.1)_50%,transparent_80%)]";
      }
    }
  };

  return (
    <div className="container pt-[4.75rem] lg:pt-[1rem]">
      <div className="flex flex-col md:flex-row gap-4 sm:max-md:mx-auto sm:max-md:max-w-[32rem] ">
        <div className="grow overflow-hidden max-md:contents">
          <div className="md:mb-4 gap-4 md:flex md:h-[24.875rem] lg:h-[26.925rem] relative -order-1">
            <>
              <CarRace
                shortCarX={shortCarX}
                longCarX={longCarX}
                isGameStarted={isGameStarted}
                isWinnerDisplay={isWinnerDisplay}
                timer={timer}
                isBettingOpen={isBettingOpen}
                getBackgroundColor={getBackgroundColor}
                isLoading={isLoading}
                gameStatus={gameStatus}
                gameResult={gameResult}
              />
            </>
          </div>
          <PlayerBets />
        </div>
        <Side placeBet={placeBet} isBettingOpen={isBettingOpen} />
      </div>
    </div>
  );
};

export default Home;
