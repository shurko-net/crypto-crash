import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BetResultPayload,
  GameResultData,
  GameStateData,
  RaceTickData,
  gameHubService,
} from "~~/services/signalr/GameHub";
import { BetSide } from "~~/types/betting";

export const useGameHub = () => {
  const [shortCarX, setShortCarX] = useState<number>(0);
  const [longCarX, setLongCarX] = useState<number>(0);
  const [betTimer, setBetTimer] = useState<number>(0);
  const [gameTimer, setGameTimer] = useState<number>(0);
  const [gameResult, setGameResult] = useState<"long" | "short" | "tie" | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isBettingOpen, setIsBettingOpen] = useState<boolean>(true);
  const [userBetResult, setUserBetResult] = useState<"win" | "lose" | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");

  useEffect(() => {
    const setupConnection = async () => {
      setConnectionStatus("connecting");
      try {
        await gameHubService.connect({
          onRaceTick: handleRaceTick,
          onBetTimer: handleBetTimer,
          onGameTimer: handleGameTimer,
          onBettingStarted: handleBettingStarted,
          onBettingEnded: handleBettingEnded,
          onGameResult: handleGameResult,
          onBetResult: handleBetResult,
          onConnected: handleConnected,
        });
        setConnectionStatus("connected");
      } catch (error) {
        console.error("Error connecting to GameHub:", error);
        setConnectionStatus("disconnected");
      }
    };

    setupConnection();

    return () => {
      gameHubService.disconnect();
      setConnectionStatus("disconnected");
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

  const handleBetTimer = (time: number) => {
    setBetTimer(time);
    setGameTimer(0);
  };

  const handleGameTimer = (time: number) => {
    setGameTimer(time);
    setBetTimer(0);
  };

  const handleBettingStarted = (data: GameStateData) => {
    setIsGameStarted(data.isGameStarted);
    console.log("handleBettingStarted", data.isGameStarted);
    setIsBettingOpen(data.isBettingOpen);
  };

  const handleBettingEnded = (data: GameStateData) => {
    console.log("handleBettingEnded", data.isGameStarted);
    setIsGameStarted(data.isGameStarted);
    setIsBettingOpen(data.isBettingOpen);
  };

  const handleGameResult = (data: GameResultData) => {
    setGameResult(data.gameResult);
    setIsBettingOpen(data.isBettingOpen);
    console.log("isGameStarted", data.isGameStarted);
    setIsGameStarted(data.isGameStarted);
  };

  const handleBetResult = (data: BetResultPayload) => {
    setUserBetResult(data.betResult);
    setIsBettingOpen(data.isBettingOpen);
    console.log("handleBetResult", data);
    setIsGameStarted(data.isGameStarted);
  };

  const handleConnected = (data: GameStateData) => {
    console.log("data: ", data);
    setIsBettingOpen(data.isBettingOpen);
    setIsGameStarted(data.isGameStarted);
  };

  const placeBet = async (amount: number, side: BetSide): Promise<void> => {
    if (!amount || !side) {
      toast.error("Не указаны сумма или сторона ставки.");
      throw new Error("Amount and side are required");
    }

    try {
      await gameHubService.placeBet(amount, side);
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Ошибка отправки ставки.");
      throw error;
    }
  };

  return {
    shortCarX,
    longCarX,
    betTimer,
    gameTimer,
    gameResult,
    isGameStarted,
    isBettingOpen,
    userBetResult,
    connectionStatus,
    placeBet,
  };
};
