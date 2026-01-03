import { useGameStore } from "@/store/gameStore";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


export default function SetupScreen() {
  const store = useGameStore();
  const [newName, setNewName] = useState("");
      const handleAddPlayer = () => {
    if (newName.trim()) {
      store.addPlayer(newName);
      setNewName("");
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h1 className="text-3xl font-bold text-emerald-400 mb-6 text-center">Teen Patti Tracker</h1>
          <div className="flex gap-2 mb-8">
            <Input
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-3 text-white"
              placeholder="Enter Name"
              value={newName}
              onChange={(e: any) => setNewName(e.target.value)}
              onKeyDown={(e:any) => e.key === 'Enter' && handleAddPlayer()}
            />
            <Button onClick={handleAddPlayer} className="bg-emerald-600 text-white p-3 rounded"><UserPlus/></Button>
          </div>
          <div className="space-y-2 mb-8">
            {store.players.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-slate-950 p-2 rounded">
                 <img src={p.avatar} className="w-8 h-8 rounded-full"/>
                 <span className="text-white">{p.name}</span>
              </div>
            ))}
          </div>
          <Button 
             onClick={store.startGame} 
             disabled={store.players.length < 2}
             className="w-full bg-emerald-600 text-white font-bold py-3 rounded disabled:opacity-50"
          >
            Start Game
          </Button>
        </div>
      </div>
  )
}
