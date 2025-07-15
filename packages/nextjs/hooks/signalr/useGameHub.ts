import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BetsData,
  BettingStateData,
  GameResultData,
  GameStateData,
  RaceTickData,
  gameHubService,
} from "~~/services/signalr/GameHub";
import { BetSide } from "~~/types/betting";

export const useGameHub = (isAuthenticated: string) => {
  const [shortCarX, setShortCarX] = useState<number | null>(null);
  const [longCarX, setLongCarX] = useState<number | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<"Long" | "Short" | "Tie" | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean | null>(null);
  const [isBettingOpen, setIsBettingOpen] = useState<boolean | null>(null);

  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [bank, setBank] = useState<number | null>(null);
  const [gamersCount, setGamersCount] = useState<number | null>(null);
  const [playerBets, setPlayerBets] = useState({});
  const [resultBets, setResultBets] = useState<{ [address: string]: boolean }>({});

  const isWinnerDisplay = !isGameStarted && !isBettingOpen;

  const isLoading =
    bank === null || isBettingOpen === null || isGameStarted === null || playerBets === null || gameId === null;

  useEffect(() => {
    let isMounted = true;
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
        if (isMounted) {
          setConnectionError(error as Error);
        }
      }
    };

    setupConnection();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setupConnection();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated]);

  const handleRaceTick = useCallback((data: RaceTickData) => {
    const longXValue = parseFloat(data.longX);
    const shortXValue = parseFloat(data.shortX);

    if (!isNaN(longXValue) && !isNaN(shortXValue)) {
      setLongCarX(longXValue);
      setShortCarX(shortXValue);
    }
  }, []);

  const handleBettingState = useCallback((data: BettingStateData) => {
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
  }, []);

  const handleBets = useCallback((data: BetsData) => {
    setBank(data.bank);
    setGamersCount(Object.keys(data.bets).length);
    setPlayerBets(data.bets);
  }, []);

  const handleTimer = useCallback((time: number) => {
    setTimer(time);
  }, []);

  const handleGameResult = useCallback((data: GameResultData) => {
    setGameResult(data.gameResult);
    setIsBettingOpen(data.isBettingOpen);
    setIsGameStarted(data.isGameStarted);
    const result: { [address: string]: boolean } = {};
    data.bets.forEach(bet => {
      result[bet.userAddress] = bet.isWinner;
    });

    setResultBets(result);
  }, []);

  const handleConnected = useCallback((data: GameStateData) => {
    setIsBettingOpen(data.isBettingOpen);
    setIsGameStarted(data.isGameStarted);
    setBank(data.bank);
    setGameId(data.gameId);
    setPlayerBets(data.bets);
  }, []);

  const handleConnectionError = useCallback((error?: Error) => {
    setConnectionError(error ?? null);
  }, []);

  const placeBet = useCallback(async (gameId: string, amount: number, side: BetSide, txHash: string): Promise<void> => {
    try {
      await gameHubService.placeBet(gameId, amount, side, txHash);
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  }, []);

  return useMemo(
    () => ({
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
    }),
    [
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
    ],
  );
};
