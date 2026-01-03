"use client";

import { useGameStore } from "@/store/gameStore";
import { Ban, Eye } from "lucide-react";
import { ActivePlayerInfo, PlayerInfoCard } from "./player-card";
import { useFindActivePlayer } from "@/utils/useFindActivePlayer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function ActionDeck() {
  const store = useGameStore();
  const activePlayer = useFindActivePlayer();
  const [betAmount, setBetAmount] = useState("");

  // Logic: Calculate Min Bet based on Player's Blind/Seen status
  const currentStake = store.currentStake;

  // If player is blind, they pay 1x Stake. If Seen, they pay 2x Stake.
  // We default to Blind calc, but if activePlayer is defined, we use their status.
  const isPlayerBlind = activePlayer?.isBlind ?? true;

  const minBetAmount = isPlayerBlind ? currentStake : currentStake * 2;
  const doubleBetAmount = minBetAmount * 2;

  const handleBetUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handleBetBlur = () => {
    if (!betAmount) return;

    const numericValue = Number(betAmount);

    if (numericValue < minBetAmount) {
      setBetAmount(minBetAmount.toString());
    }
  };

  if (!activePlayer) return null;

  const placeCustomBet = () => {
    const amount = Number(betAmount);

    if (!amount || amount < minBetAmount) {
      setBetAmount(minBetAmount.toString());
      return;
    }

    store.placeBet(
      activePlayer.id,
      amount,
      activePlayer.isBlind ? "BLIND" : "SEEN"
    );
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t border-slate-800 p-4 pb-8 z-40 shadow-2xl">
      <div className="max-w-md mx-auto">
        {/* Player Info Row */}
        <div className="flex justify-between items-end mb-4">
          <PlayerInfoCard />
          {/* See Cards Button */}
          <ActivePlayerInfo />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-4 gap-3">
          <Button
            onClick={() => store.packPlayer(activePlayer.id)}
            className="col-span-1 bg-slate-900 border border-slate-700 text-red-400 rounded-xl font-bold flex flex-col items-center justify-center py-3 hover:bg-red-900/20"
          >
            <Ban size={20} className="mb-1" />
            PACK
          </Button>

          <Button
            onClick={() =>
              store.placeBet(
                activePlayer.id,
                minBetAmount,
                activePlayer.isBlind ? "BLIND" : "SEEN"
              )
            }
            className="col-span-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold py-3 flex flex-col items-center justify-center border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1"
          >
            <span className="text-[10px] uppercase opacity-75">Chaal</span>
            <span className="text-2xl">रु {minBetAmount}</span>
          </Button>

          <button
            onClick={() =>
              store.placeBet(
                activePlayer.id,
                doubleBetAmount,
                activePlayer.isBlind ? "BLIND" : "SEEN"
              )
            }
            className="col-span-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold py-3 flex flex-col items-center justify-center border-b-4 border-amber-800 active:border-b-0 active:translate-y-1"
          >
            <span className="text-[10px] uppercase opacity-75">Raise</span>
            <span className="text-2xl">रु {doubleBetAmount}</span>
          </button>

          <Input
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-3 text-white"
            placeholder="रु Paisa"
            value={betAmount}
            onChange={(e: any) => handleBetUpdate(e)}
            onBlur={handleBetBlur}
            onKeyDown={(e: any) => e.key === "Enter" && placeCustomBet()}
          />
        </div>
      </div>
    </div>
  );
}
