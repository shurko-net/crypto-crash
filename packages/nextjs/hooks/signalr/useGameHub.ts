import { useEffect, useState } from "react";
import {
  BetsData,
  BettingStateData,
  GameResultData,
  GameStateData,
  RaceTickData,
  gameHubService,
} from "~~/services/signalr/GameHub";
import { BetSide } from "~~/types/betting";

export const useGameHub = () => {
  const [shortCarX, setShortCarX] = useState<number | null>(null);
  const [longCarX, setLongCarX] = useState<number | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<"long" | "short" | "tie" | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean | null>(null);
  const [isBettingOpen, setIsBettingOpen] = useState<boolean | null>(null);

  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [bank, setBank] = useState<number | null>(null);
  const [gamersCount, setGamersCount] = useState<number | null>(null);
  const [playerBets, setPlayerBets] = useState({});
  const [resultBets, setResultBets] = useState<{ [address: string]: boolean }>({});

  const isWinnerDisplay = !isGameStarted && !isBettingOpen;

  const validResults = ["long", "short", "tie"] as const;

  const isLoading =
    shortCarX === null || longCarX === null || timer === null || isGameStarted === null || isBettingOpen === null;

  useEffect(() => {
    const setupConnection = async () => {
      try {
        await gameHubService.connect({
          onRaceTick: handleRaceTick,
          onBettingState: handleBettingState,
          onTimer: handleTimer,
          onGameResult: handleGameResult,
          onConnected: handleConnected,
          onConnectionError: handleConnectionError,
          onBets: handleBets,
        });
      } catch (error) {
        console.error("Error connecting to GameHub:", error);
      }
    };

    setupConnection();

    return () => {};
  }, []);

  const handleRaceTick = (data: RaceTickData) => {
    const longXValue = parseFloat(data.longX);
    const shortXValue = parseFloat(data.shortX);

    if (!isNaN(longXValue) && !isNaN(shortXValue)) {
      setLongCarX(longXValue);
      setShortCarX(shortXValue);
    }
  };

  const handleBettingState = (data: BettingStateData) => {
    setGameId(data.gameId);
    setIsGameStarted(data.isGameStarted);
    setIsBettingOpen(data.isBettingOpen);
    setLongCarX(0);
    setShortCarX(0);
    if (data.isBettingOpen) {
      setBank(0);
      setGamersCount(0);
      setPlayerBets({});
      setResultBets({});
    }
  };

  const handleBets = (data: BetsData) => {
    setBank(data.bank);
    setGamersCount(Object.keys(data.bets).length);
    setPlayerBets(data.bets);
  };

  const handleTimer = (time: number) => {
    setTimer(time);
  };

  const handleGameResult = (data: GameResultData) => {
    const gameResultLower = data.gameResult?.toLowerCase() ?? null;

    const normalizedResult = validResults.includes(gameResultLower as (typeof validResults)[number])
      ? (gameResultLower as "long" | "short" | "tie")
      : null;

    setGameResult(normalizedResult);
    setIsBettingOpen(data.isBettingOpen);
    setIsGameStarted(data.isGameStarted);

    const result: { [address: string]: boolean } = {};
    data.bets.forEach(bet => {
      result[bet.userAddress] = bet.isWinner;
    });

    setResultBets(result);
    console.log(result);
  };

  const handleConnected = (data: GameStateData) => {
    setIsBettingOpen(data.isBettingOpen);
    setIsGameStarted(data.isGameStarted);
  };

  const handleConnectionError = (error?: Error) => {
    setConnectionError(error ?? null);
  };

  const placeBet = async (gameId: string, amount: number, side: BetSide, txHash: string): Promise<void> => {
    try {
      await gameHubService.placeBet(gameId, amount, side, txHash);
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  };

  return {
    shortCarX,
    longCarX,
    timer,
    gameResult,
    isGameStarted,
    isBettingOpen,
    isLoading,
    placeBet,
    connectionError,
    gameId,
    bank,
    gamersCount,
    playerBets,
    isWinnerDisplay,
    resultBets,
  };
};
