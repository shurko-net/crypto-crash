export type BetSide = "Long" | "Short" | "Tie" | null;
export type GameResult = "Long" | "Short" | "Tie" | null;
export type UserBetResult = "win" | "lose" | null;
export type WinnerType = {
  id: string;
  winningSide: "Long" | "Short" | "Tie" | "";
};
