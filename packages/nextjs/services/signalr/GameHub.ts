import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-hot-toast";
import { BetSide } from "~~/types/betting";

export interface RaceTickData {
  longX: string;
  shortX: string;
}

export interface BettingStateData {
  isGameStarted: boolean;
  isBettingOpen: boolean;
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
  onBettingState?: (data: BettingStateData) => void;
  onTimer?: (time: number) => void;
  onGameResult?: (data: GameResultData) => void;
  onBetResult?: (data: BetResultPayload) => void;
  onConnected?: (data: GameStateData) => void;
};

class GameHubService {
  private connection: HubConnection | null = null;
  private eventHandlers: GameHubEventHandlers = {};
  private hubUrl = process.env.NEXT_PUBLIC_SIGNALR_URL || "http://localhost:5080/gamehub";

  public async connect(handlers: GameHubEventHandlers): Promise<void> {
    if (this.connection) {
      return;
    }

    this.eventHandlers = handlers;

    this.connection = new HubConnectionBuilder().withUrl(this.hubUrl).withAutomaticReconnect().build();

    this.registerEventHandlers();

    try {
      await this.connection.start();
      console.info("[GameHub] Connection established.");
    } catch (error) {
      console.error("Failed to connect to GameHub:", error);
      setTimeout(() => this.connect(handlers), 2000);
    }
  }

  private registerEventHandlers(): void {
    if (!this.connection) return;

    const eventMap: Record<keyof GameHubEventHandlers, string> = {
      onRaceTick: "raceTick",
      onBettingState: "bettingState",
      onTimer: "timer",
      onGameResult: "gameResult",
      onBetResult: "betResult",
      onConnected: "onConnected",
    };

    for (const [handlerKey, eventName] of Object.entries(eventMap) as [keyof GameHubEventHandlers, string][]) {
      this.connection.on(eventName, (data: any) => {
        const handler = this.eventHandlers[handlerKey];
        if (handler) {
          try {
            handler(data);
          } catch (error) {
            console.error(`Error in ${eventName} handler:`, error);
          }
        }
      });
    }
  }

  public async placeBet(amount: number, side: BetSide): Promise<void> {
    if (!this.connection) {
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
    if (!this.connection) {
      return;
    }
    try {
      await this.connection.stop();
    } catch (error) {
      console.error("Error disconnecting from GameHub:", error);
    } finally {
      this.connection = null;
    }
  }
}

export const gameHubService = new GameHubService();
