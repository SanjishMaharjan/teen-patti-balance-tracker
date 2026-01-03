import { useGameStore } from "@/store/gameStore";
import { useFindActivePlayer } from "@/utils/useFindActivePlayer";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

export default function PlayerCard() {
  const store = useGameStore();
  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
      {store.players.map((player) => {
        const isActive = store.activePlayerId === player.id;
        return (
          <div
            key={player.id}
            onClick={() => {
              if (store.gameStatus === "WINNER_SELECTION" && !player.isPacked) {
                store.nextRound(player.id);
              }
            }}
            className={`
                relative p-4 rounded-xl border-2 transition-all
                ${
                  player.isPacked
                    ? "bg-slate-900/50 border-slate-800 opacity-50"
                    : "bg-slate-900"
                }
                ${
                  isActive
                    ? "border-amber-400 shadow-lg scale-105 z-10"
                    : "border-slate-800"
                }
                ${
                  store.gameStatus === "WINNER_SELECTION" && !player.isPacked
                    ? "cursor-pointer hover:border-emerald-500 animate-pulse"
                    : ""
                }
              `}
          >
            {isActive && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                TURN
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <img
                src={player.avatar}
                className="w-10 h-10 rounded-full bg-slate-800"
              />
              <div className="overflow-hidden">
                <div className="font-bold truncate">{player.name}</div>
                <div
                  className={`text-xs ${
                    player.balance >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {player.balance >= 0 ? "+" : ""}
                  {player.balance}
                </div>
              </div>
            </div>

            {/* Show Blind/Seen Status Badge on Card */}
            {!player.isPacked && (
              <div className="flex gap-2">
                {player.isBlind ? (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded flex items-center gap-1">
                    <EyeOff size={10} /> BLIND
                  </span>
                ) : (
                  <span className="text-[10px] bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded flex items-center gap-1">
                    <Eye size={10} /> SEEN
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PlayerInfoCard() {
  const activePlayer = useFindActivePlayer();
  if (!activePlayer) return null;

  return (
    <div className="flex items-center gap-3">
      <img
        src={activePlayer.avatar}
        className="w-12 h-12 rounded-full border-2 border-amber-400"
      />
      <div>
        <div className="text-amber-400 text-xs font-bold uppercase">
          Your Turn
        </div>
        <div className="text-white font-bold text-xl">{activePlayer.name}</div>
      </div>
    </div>
  );
}

export const ActivePlayerInfo = () => {
  const store = useGameStore();
  const activePlayer = useFindActivePlayer();
  if (!activePlayer) return null;

  return activePlayer.isBlind ? (
    <Button
      onClick={() => store.markAsSeen(activePlayer.id)}
      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
    >
      <Eye size={16} /> See Cards
    </Button>
  ) : (
    <div className="text-indigo-400 text-sm font-bold flex items-center gap-2 bg-indigo-900/20 px-3 py-1 rounded">
      <Eye size={16} /> Playing Seen
    </div>
  );
};
