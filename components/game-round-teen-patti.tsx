"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Eye, EyeOff, Trophy, UserPlus, Play, Ban, History } from "lucide-react";
import SetupScreen from "./setup-screen";
import Header from "./header";
import PlayerCard from "./player-card";
import WinnerSelectionBanner from "./winner-selection-modal";
import ActionDeck from "./active-player-action-deck";
import { HistorySideBar } from "./history-sidebar";

export default function TeenPattiGame() {
  const store = useGameStore();
  const [showHistory, setShowHistory] = useState(false);

  // --- SETUP SCREEN ---
  if (store.gameStatus === "SETUP" && store.roundNumber === 1) {
    return (
    <SetupScreen />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-[320px]">  
      {/* Header */}
      <Header showHistory={showHistory} setShowHistory={setShowHistory} />

      {/* Players Grid */}
      <PlayerCard/>

      {/* ACTION DECK (For Active Player) */}
      {store.gameStatus === "PLAYING" && (
        <ActionDeck/>
      )}

      {/* History Sidebar */}
      {showHistory && (
       <HistorySideBar setShowHistory={setShowHistory} />
      )}

      {/* WINNER SELECTION BANNER */}
      {store.gameStatus === "WINNER_SELECTION" && (
        <WinnerSelectionBanner/>
      )}
    </div>
  );
}
