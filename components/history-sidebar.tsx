import { useGameStore } from "@/store/gameStore";
import { RoundHistoryEntry } from "@/types/game";
import { ChevronDown, ChevronUp, Coins, Trophy, X } from "lucide-react";
import { useState } from "react";


export  function HistorySideBar({setShowHistory}: {setShowHistory:any}) {
    const store = useGameStore();
    return (
        <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={() => setShowHistory(false)}
    >
      {/* Increased width (w-96 or max-w-md) for better readability of details */}
      <div
        className="w-full max-w-md bg-slate-900 h-full border-l border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <HistoryIcon /> Game History
            </h3>
            <button onClick={() => setShowHistory(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {store.history.length === 0 ? (
             <div className="text-center text-slate-500 italic mt-10">No rounds played yet.</div>
          ) : (
             store.history.map((h, i) => (
                <HistoryCard key={`${h.roundNumber}-${i}`} historyEntry={h} />
             ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-component for an individual history item (Accordion Style) ---
function HistoryCard({ historyEntry: h }: { historyEntry: RoundHistoryEntry }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate net win for the winner (Pot - their own contribution)
    const winnerContribution = h.contributions.find(c => c.isWinner)?.amount || 0;
    const netProfit = h.pot - winnerContribution;

    return (
        <div className={`bg-slate-950 rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-emerald-500/30 shadow-lg shadow-emerald-900/10' : 'border-slate-800 hover:border-slate-700'}`}>
            
            {/* Main Summary Header - Click to expand */}
            <div 
                className="p-4 cursor-pointer flex flex-col gap-3" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Top Row: Round Info & Time */}
                <div className="flex justify-between items-center text-xs text-slate-500 font-mono uppercase tracking-wider">
                    <span>Round {h.roundNumber}</span>
                    <span>{h.timestamp}</span>
                </div>

                {/* Middle Row: Winner & Total Pot */}
                <div className="flex justify-between items-center">
                    {/* Winner Highlight */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                             <img src={h.winnerImage} className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-sm" alt={h.winnerName} />
                             <Trophy size={14} className="absolute -top-1 -right-1 text-amber-400 fill-amber-400" />
                        </div>
                        <div>
                            <div className="text-xs text-emerald-400 font-bold uppercase">Winner</div>
                            <div className="text-white font-bold text-lg">{h.winnerName}</div>
                        </div>
                    </div>

                    {/* Pot Amount */}
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-emerald-400 font-black text-2xl">
                            <Coins size={18} className="text-emerald-500" />
                            <span>{h.pot}</span>
                        </div>
                        <div className="text-xs text-slate-400">Total Pot</div>
                    </div>
                </div>

                 {/* Expand/Collapse Indicator */}
                <div className="flex justify-center pt-1">
                    {isExpanded ? <ChevronUp size={16} className="text-slate-600"/> : <ChevronDown size={16} className="text-slate-600"/>}
                </div>
            </div>

            {/* Detailed Breakdown - Revealed on expand */}
            {isExpanded && (
                <div className="bg-slate-900/50 p-4 border-t border-slate-800 animate-in slide-in-from-top-2">
                    
                    {/* Net Profit Highlight */}
                    <div className="mb-4 bg-emerald-900/20 p-3 rounded-lg border border-emerald-900/50 flex justify-between items-center">
                         <span className="text-sm text-emerald-300">Net Profit (Pot - Investment)</span>
                         <span className="font-bold text-emerald-400">+ रु {netProfit}</span>
                    </div>

                    <h4 className="text-xs text-slate-500 uppercase font-bold mb-3">Pot Contributions breakdown</h4>
                    
                    <div className="space-y-2">
                        {h.contributions.map((contrib, index) => (
                            <div 
                                key={index} 
                                className={`flex justify-between items-center p-2 rounded-lg text-sm ${contrib.isWinner ? 'bg-slate-800' : ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    <img src={contrib.playerAvatar} className="w-6 h-6 rounded-full grayscale opacity-70" alt={contrib.playerName} />
                                    <span className={contrib.isWinner ? 'text-white font-medium' : 'text-slate-400'}>
                                        {contrib.playerName} 
                                        {contrib.isWinner && <span className="text-xs text-slate-500 ml-2">(Winner)</span>}
                                    </span>
                                </div>
                                {/* Show contribution as negative red, unless they won the whole thing */}
                                <span className="font-mono text-red-400 font-medium">
                                    - रु {contrib.amount}
                                </span>
                            </div>
                        ))}
                         <div className="border-t border-slate-800 mt-2 pt-2 flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400">Total Pot collected</span>
                            <span className="text-emerald-400">रु {h.pot}</span>
                         </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Simple Icon component if not using lucide-react globally
const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12"/></svg>
);