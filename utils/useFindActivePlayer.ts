import { useGameStore } from "@/store/gameStore";
import { Player } from "@/types/game";

export const useFindActivePlayer = () => {
  const store = useGameStore();
  const activePlayer = store.players.find(
    (p: Player) => p.id === store.activePlayerId
  );
  return activePlayer;
};
