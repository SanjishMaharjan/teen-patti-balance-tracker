export type BetType = "BLIND" | "SEEN";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  // Stats
  totalSpent: number;
  totalWon: number;
  balance: number;
  // Round State
  isPacked: boolean;
  isBlind: boolean; // <--- ADDED THIS: Tracks if THIS specific player is blind
  status: "WAITING" | "PLAYING" | "PACKED" | "WINNER";
  currentRoundContribution: number;
}

export interface RoundHistoryEntry {
  roundNumber: number;
  winnerName: string;
  pot: number;
  timestamp: string;
}

export interface GameState {
  players: Player[];
  roundNumber: number;
  activePlayerId: string | null;
  pot: number;
  currentStake: number;
  history: RoundHistoryEntry[];
  gameStatus: "SETUP" | "PLAYING" | "WINNER_SELECTION";
  
  // Actions
  addPlayer: (name: string) => void;
  startGame: () => void;
  setGameStatus: (status: "SETUP" | "PLAYING" | "WINNER_SELECTION") => void; // <--- FIXED THIS
  markAsSeen: (playerId: string) => void; // <--- NEW ACTION
  placeBet: (playerId: string, amount: number, type: BetType) => void;
  packPlayer: (playerId: string) => void;
  nextRound: (winnerId: string) => void;
}
