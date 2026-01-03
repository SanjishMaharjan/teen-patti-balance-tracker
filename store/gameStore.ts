import { create } from 'zustand';
import { GameState, BetType, Player } from '@/types/game';

const getNextActivePlayerId = (players: Player[], currentId: string | null): string => {
  if (!currentId) return players[0]?.id;
  const currIdx = players.findIndex(p => p.id === currentId);
  let nextIdx = (currIdx + 1) % players.length;
  
  // Loop until we find a non-packed player
  while (players[nextIdx].isPacked && nextIdx !== currIdx) {
    nextIdx = (nextIdx + 1) % players.length;
  }
  return players[nextIdx].id;
};

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  roundNumber: 1,
  activePlayerId: null,
  pot: 0,
  currentStake: 10,
  history: [],
  gameStatus: "SETUP",

  addPlayer: (name) => set(state => ({
    players: [...state.players, {
      id: Math.random().toString(36).substring(7),
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      totalSpent: 0,
      totalWon: 0,
      balance: 0,
      isPacked: false,
      isBlind: true, // Default to Blind
      status: "WAITING",
      currentRoundContribution: 0
    }]
  })),

  // FIXED: Explicit action to change status
  setGameStatus: (status) => set({ gameStatus: status }),

  // NEW: Action to permanently mark a player as Seen
  markAsSeen: (playerId) => set(state => ({
    players: state.players.map(p => 
      p.id === playerId ? { ...p, isBlind: false } : p
    )
  })),

  startGame: () => {
    const { players } = get();
    const BOOT_AMOUNT = 10;
    
    // Reset everyone to Blind and Active
    const bootedPlayers = players.map(p => ({
      ...p,
      isPacked: false,
      isBlind: true, // RESET BLIND STATUS
      status: "PLAYING" as const,
      currentRoundContribution: BOOT_AMOUNT,
      totalSpent: p.totalSpent + BOOT_AMOUNT,
      balance: p.balance - BOOT_AMOUNT
    }));

    set({
      gameStatus: "PLAYING",
      players: bootedPlayers,
      pot: players.length * BOOT_AMOUNT,
      currentStake: BOOT_AMOUNT,
      activePlayerId: bootedPlayers[0].id
    });
  },

  placeBet: (playerId, amount, type) => {
    const { players, pot, currentStake } = get();
    
    // Calculate new stake base
    let newBaseStake = currentStake;
    if (type === "BLIND") {
      newBaseStake = amount;
    } else {
      newBaseStake = amount / 2;
    }

    const updatedPlayers = players.map(p => {
      if (p.id !== playerId) return p;
      return {
        ...p,
        // If they place a "SEEN" bet, ensure they are marked seen
        isBlind: type === "BLIND", 
        totalSpent: p.totalSpent + amount,
        balance: p.balance - amount,
        currentRoundContribution: p.currentRoundContribution + amount
      };
    });

    set({
      players: updatedPlayers,
      pot: pot + amount,
      activePlayerId: getNextActivePlayerId(updatedPlayers, playerId),
      // Logic: Stake can never go down. 
      currentStake: newBaseStake > currentStake ? newBaseStake : currentStake,
    });
  },

  packPlayer: (playerId) => {
    const { players, activePlayerId } = get();
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, isPacked: true, status: "PACKED" as const } : p
    );

    const activePlayers = updatedPlayers.filter(p => !p.isPacked);
    
    if (activePlayers.length === 1) {
      set({ players: updatedPlayers, gameStatus: "WINNER_SELECTION", activePlayerId: null });
    } else {
      set({ 
        players: updatedPlayers, 
        activePlayerId: getNextActivePlayerId(updatedPlayers, activePlayerId) 
      });
    }
  },

  nextRound: (winnerId) => {
    const { players, pot, roundNumber, history } = get();
    const winner = players.find(p => p.id === winnerId);
    if (!winner) return;

    const updatedPlayers = players.map(p => {
      if (p.id === winnerId) {
        return {
          ...p,
          totalWon: p.totalWon + pot,
          balance: p.balance + pot,
          status: "WAITING" as const,
          currentRoundContribution: 0
        };
      }
      return { ...p, status: "WAITING" as const, currentRoundContribution: 0 };
    });

    set({
      players: updatedPlayers,
      pot: 0,
      roundNumber: roundNumber + 1,
      history: [{
        roundNumber,
        winnerName: winner.name,
        pot,
        timestamp: new Date().toLocaleTimeString()
      }, ...history],
      gameStatus: "SETUP",
      activePlayerId: null
    });
    
    get().startGame();
  }
}));
