import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BetResultPayload,
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
  const [userBetResult, setUserBetResult] = useState<"win" | "lose" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    if (shortCarX !== null && longCarX !== null && timer !== null && isGameStarted !== null && isBettingOpen !== null) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [shortCarX, longCarX, timer, isGameStarted, isBettingOpen]);

  useEffect(() => {
    const setupConnection = async () => {
      try {
        await gameHubService.connect({
          onRaceTick: handleRaceTick,
          onBettingState: handleBettingState,
          onTimer: handleTimer,
          onGameResult: handleGameResult,
          onBetResult: handleBetResult,
          onConnected: handleConnected,
          onConnectionError: handleConnectionError,
        });
      } catch (error) {
        console.error("Error connecting to GameHub:", error);
      }
    };

    setupConnection();

    return () => {
      gameHubService.disconnect();
    };
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
  };

  const handleTimer = (time: number) => {
    setTimer(time);
  };

  const handleGameResult = (data: GameResultData) => {
    setGameResult(data.gameResult);
    setIsBettingOpen(data.isBettingOpen);
    setIsGameStarted(data.isGameStarted);
  };

  const handleBetResult = (data: BetResultPayload) => {
    setUserBetResult(data.betResult);
    setIsBettingOpen(data.isBettingOpen);
    setIsGameStarted(data.isGameStarted);
  };

  const handleConnected = (data: GameStateData) => {
    setIsBettingOpen(data.isBettingOpen);

    setIsGameStarted(data.isGameStarted);
  };

  const handleConnectionError = (error?: Error) => {
    setConnectionError(error ?? null);
  };

  const placeBet = async (amount: number, side: BetSide, txHash: string): Promise<void> => {
    if (!amount || !side) {
      toast.error("Не указаны сумма или сторона ставки.");
      throw new Error("Amount and side are required");
    }

    try {
      await gameHubService.placeBet(amount, side, txHash);
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Ошибка отправки ставки.");
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
    userBetResult,
    isLoading,
    placeBet,
    connectionError,
    gameId,
  };
};
