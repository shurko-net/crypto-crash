export type BetSide = "long" | "short" | "tie" | null;
export type GameResult = "long" | "short" | "tie" | null;
export type UserBetResult = "win" | "lose" | null;
export type WinnerType = {
  id: string;
  winningSide: "Long" | "Short" | "Tie" | "";
};
