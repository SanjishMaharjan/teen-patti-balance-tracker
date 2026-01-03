import { useGameStore } from "@/store/gameStore";
import { History } from "lucide-react";

export default function Header({showHistory,setShowHistory}: {showHistory:boolean,setShowHistory:any}) {
    const store = useGameStore();
    return (
        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center">
            <div>
                <div className="text-xs text-slate-500 uppercase">Round {store.roundNumber}</div>
                <div className="text-2xl font-bold text-emerald-400">Pot: रु {store.pot}</div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setShowHistory(!showHistory)} className="p-2 bg-slate-800 rounded-md text-slate-400 border-b-4 border-black/40 active:border-b-0 active:translate-y-1"><History size={18} /></button>
                {/* FIXED: Using correct action setGameStatus */}
                <button
                    onClick={() => store.setGameStatus("WINNER_SELECTION")}
                    className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-md border border-slate-700 hover:bg-slate-700 border-b-4 border-black/40 active:border-b-0 active:translate-y-1"
                >
                    End Round
                </button>
            </div>
        </div>
    )
}
