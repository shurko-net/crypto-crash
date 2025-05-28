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
  onConnectionError?: (error?: Error) => void;
};

class GameHubService {
  private connection: HubConnection | null = null;
  private eventHandlers: GameHubEventHandlers = {};
  private hubUrl = process.env.NEXT_PUBLIC_SIGNALR_URL || "https://localhost:7013/gamehub";
  private isConnecting = false;

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

      if (this.eventHandlers.onConnectionError) {
        this.eventHandlers.onConnectionError(new Error("Max retries exceeded"));
      }

      this.connection = null;
    });
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
      onConnectionError: "onConnectionError",
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

  public async placeBet(amount: number, side: BetSide, txHash: string): Promise<void> {
    if (!this.connection) {
      throw new Error("No active connection to GameHub");
    }

    try {
      await this.connection.invoke("placeBet", amount, side, txHash);
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Ошибка при размещении ставки. Попробуйте снова.");
      throw error;
    }
  }

  // public getConnectionState(): string {
  //   return this.connection?.state || "Disconnected";
  // }

  // public isConnected(): boolean {
  //   return this.connection?.state === "Connected";
  // }

  public async disconnect(): Promise<void> {
    if (!this.connection) {
      return;
    }
    try {
      if (this.connection.state !== "Connecting") {
        await this.connection.stop();
      }
    } catch (error) {
      console.error("Error disconnecting from GameHub:", error);
    } finally {
      this.connection = null;
    }
  }
}

export const gameHubService = new GameHubService();
