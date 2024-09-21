export type DecodedFrameState = {
  gameState?: string;
};

export type GameStatus =
  | "GAME_WON"
  | "GAME_LOST"
  | "GAME_CONTINUE"
  | "RIGHT_GUESS"
  | "WRONG_GUESS";

export type GameState = {
  nextGameState: string;
  word: string;
  rightGuesses: string;
  wrongGuesses: string;
  status: GameStatus;
};
