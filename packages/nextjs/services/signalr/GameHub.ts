import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-hot-toast";
// добавляем
import { BetSide } from "~~/types/betting";

export interface Candle {
  timestamp: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export interface RaceTickData {
  longX: string;
  shortX: string;
}

export interface GameStateData {
  isGameStarted: boolean;
  isBettingOpen: boolean;
}

export interface GameResultData extends GameStateData {
  gameResult: "long" | "short" | "tie" | null;
}

export interface BetResultPayload {
  betResult: "win" | "lose";
  isBettingOpen: boolean;
  isGameStarted: boolean;
}

type GameHubEventHandlers = {
  onRaceTick?: (data: RaceTickData) => void;
  onBetTimer?: (time: number) => void;
  onGameTimer?: (time: number) => void;
  onBettingStarted?: (data: GameStateData) => void;
  onBettingEnded?: (data: GameStateData) => void;
  onGameResult?: (data: GameResultData) => void;
  onBetResult?: (data: BetResultPayload) => void;
};

class GameHubService {
  private connection: HubConnection | null = null;
  private eventHandlers: GameHubEventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private hubUrl = process.env.NEXT_PUBLIC_SIGNALR_URL || "http://localhost:5080/gamehub";

  public async connect(handlers: GameHubEventHandlers): Promise<void> {
    if (this.connection) {
      console.log("Connection already exists");
      return;
    }

    this.eventHandlers = handlers;

    this.connection = new HubConnectionBuilder().withUrl(this.hubUrl).withAutomaticReconnect().build();

    this.registerEventHandlers();

    try {
      await this.connection.start();
      toast.success("Подключено к серверу! 🚀");
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error("Failed to connect to GameHub:", error);
      toast.error("Не удалось подключиться к серверу.");
      this.reconnectAttempts++;

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        toast("Повторное подключение... 🔄");
        setTimeout(() => this.connect(handlers), 2000);
      } else {
        toast.error("Не удалось установить соединение после нескольких попыток.");
      }
    }
  }
  //в цикл засунуть эти conection и написать функцию которая будет помагать
  private registerEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on("raceTick", (data: RaceTickData) => {
      this.eventHandlers.onRaceTick?.(data);
    });

    this.connection.on("betTimer", (time: number) => {
      this.eventHandlers.onBetTimer?.(time);
    });

    this.connection.on("gameTimer", (time: number) => {
      this.eventHandlers.onGameTimer?.(time);
    });

    this.connection.on("bettingStarted", (data: GameStateData) => {
      this.eventHandlers.onBettingStarted?.(data);
    });

    this.connection.on("bettingEnded", (data: GameStateData) => {
      this.eventHandlers.onBettingEnded?.(data);
    });

    this.connection.on("gameResult", (data: GameResultData) => {
      this.eventHandlers.onGameResult?.(data);
    });

    this.connection.on("betResult", (data: BetResultPayload) => {
      this.eventHandlers.onBetResult?.(data);
    });
  }

  public async placeBet(amount: number, side: BetSide): Promise<void> {
    if (!this.connection) {
      toast.error("Нет активного соединения с сервером.");
      throw new Error("No active connection to GameHub");
    }

    try {
      await this.connection.invoke("placeBet", amount, side);
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Ошибка при размещении ставки. Попробуйте снова.");
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.connection = null;
        toast("Отключено от сервера.");
      } catch (error) {
        console.error("Error disconnecting from GameHub:", error);
        toast.error("Ошибка при отключении от сервера.");
      }
    }
  }
}

export const gameHubService = new GameHubService();
