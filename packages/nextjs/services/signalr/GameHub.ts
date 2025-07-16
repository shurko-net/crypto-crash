import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { BetSide } from "~~/types/betting";

export interface RaceTickData {
  longX: string;
  shortX: string;
}

export interface BettingStateData {
  isGameStarted: boolean;
  isBettingOpen: boolean;
  gameId: string;
}

export interface GameStateData {
  isGameStarted: boolean;
  isBettingOpen: boolean;
  bank: number;
  bets: Bets;
  gameId: string;
}

export type Bet = {
  amount: number;
  isWinner: boolean;
  userAddress: string;
};

export type Bets = Bet[];

export interface GameResultData extends GameStateData {
  gameResult: "Long" | "Short" | "Tie" | null;
  bets: Bets;
}

export interface BetsData {
  bank: number;
  bets: {
    [address: string]: number;
  };
}

type GameHubEventHandlers = {
  onRaceTick?: (data: RaceTickData) => void;
  onBettingState?: (data: BettingStateData) => void;
  onTimer?: (time: number) => void;
  onGameResult?: (data: GameResultData) => void;
  onConnected?: (data: GameStateData) => void;
  onBets?: (data: BetsData) => void;
  onConnectionError?: (error?: Error) => void;
};

class GameHubService {
  private connection: HubConnection | null = null;
  private eventHandlers: GameHubEventHandlers = {};
  private hubUrl = process.env.NEXT_PUBLIC_HUB_URL!;
  private isConnecting = false;
  private isManualDisconnect = false; // ✅ Новый флаг

  public async connect(handlers: GameHubEventHandlers): Promise<void> {
    if (this.connection || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.eventHandlers = handlers;

    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, { timeout: 30000 })
        // .configureLogging(LogLevel.Debug)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.previousRetryCount >= 5) {
              console.warn("[GameHub] Stopping reconnection attempts after 5 attempts");
              handlers.onConnectionError?.(
                new Error("Could not connect to the server. Check your internet connection or try again later."),
              );
              return null;
            }
            const delay = 3000;
            console.info(`[GameHub] Reconnecting in ${delay}ms (attempt ${retryContext.previousRetryCount + 1})`);
            return delay;
          },
        })
        .build();

      this.registerEventHandlers();
      this.registerConnectionHandler();

      await this.connection.start();
      console.info("[GameHub] Connection established.");
    } catch (error) {
      console.error("Failed to connect to GameHub:", error);
      handlers.onConnectionError?.(error instanceof Error ? error : new Error("Unknown connection error"));
    } finally {
      this.isConnecting = false;
    }
  }

  private registerConnectionHandler(): void {
    if (!this.connection) return;

    this.connection.onclose(error => {
      console.error("[GameHub] Connection closed permanently:", error);

      if (!this.isManualDisconnect && this.eventHandlers.onConnectionError) {
        this.eventHandlers.onConnectionError(
          new Error("Could not connect to the server. Check your internet connection or try again later."),
        );
      }

      this.connection = null;
      this.isManualDisconnect = false; // ✅ Всегда сбрасываем после закрытия
    });
  }

  private registerEventHandlers(): void {
    if (!this.connection) return;

    const eventMap: Record<keyof GameHubEventHandlers, string> = {
      onRaceTick: "raceTick",
      onBettingState: "bettingState",
      onTimer: "timer",
      onGameResult: "gameResult",
      onConnected: "onConnected",
      onConnectionError: "onConnectionError",
      onBets: "bets",
    };

    for (const [handlerKey, eventName] of Object.entries(eventMap) as [keyof GameHubEventHandlers, string][]) {
      if (["onConnectionError"].includes(handlerKey)) {
        continue;
      }

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

  public async placeBet(gameId: string, amount: number, side: BetSide, txHash: string): Promise<void> {
    if (!this.connection) {
      throw new Error("No active connection to GameHub");
    }

    try {
      await this.connection.invoke("placeBet", gameId, amount, side, txHash);
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connection) {
      console.log("[GameHub] No active connection to disconnect.");
      return;
    }

    console.log("[GameHub] Disconnecting, current state:", this.connection.state);
    this.isManualDisconnect = true;

    try {
      await this.connection.stop();
      console.log("[GameHub] Connection stopped successfully.");
    } catch (error) {
      console.error("[GameHub] Error disconnecting from GameHub:", error);
    } finally {
      this.connection = null;
      this.isConnecting = false;
      console.log("[GameHub] Connection reset, ready for new connection.");
    }
  }
}

export const gameHubService = new GameHubService();
