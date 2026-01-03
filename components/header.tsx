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
                <button onClick={() => setShowHistory(!showHistory)} className="p-2 bg-slate-800 rounded text-slate-400"><History size={18} /></button>
                {/* FIXED: Using correct action setGameStatus */}
                <button
                    onClick={() => store.setGameStatus("WINNER_SELECTION")}
                    className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded border border-slate-700 hover:bg-slate-700"
                >
                    End Round
                </button>
            </div>
        </div>
    )
}


export  function HistorySideBar({setShowHistory}: {setShowHistory:any}) {
    const store = useGameStore();
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setShowHistory(false)}>
            <div className="w-160 bg-slate-900 h-full border-l border-slate-800 p-6 overflow-y-auto">
               <h3 className="text-white font-bold mb-4">History</h3>
               {store.history.map((h,i) => (
                 <div key={i} className="mb-3 p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="flex justify-between text-emerald-400 font-bold">
                       <span>{h.winnerName}</span>
                       <span>रु {h.pot}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Round {h.roundNumber} • {h.timestamp}</div>
                 </div>
               ))}
            </div>
         </div>
    )
}
