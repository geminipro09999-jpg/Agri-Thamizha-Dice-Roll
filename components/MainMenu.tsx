import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { DEFAULT_PLAYERS } from '../constants';

interface MainMenuProps {
  onStart: (selectedPlayers: Player[], sfx: boolean, bgm: boolean) => void;
  onOpenAdmin: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onOpenAdmin }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState<Player[]>(JSON.parse(JSON.stringify(DEFAULT_PLAYERS)));
  const [sfx, setSfx] = useState(true);
  const [bgm, setBgm] = useState(false);

  // Update inputs when count changes
  useEffect(() => {
    // Ensure we have enough player objects from default if user increases count
    // or keep current edits if they just decrease and increase
    if (players.length < 4) {
        setPlayers(JSON.parse(JSON.stringify(DEFAULT_PLAYERS)));
    }
  }, []);

  const handleNameChange = (idx: number, val: string) => {
    const newP = [...players];
    newP[idx].display = val;
    newP[idx].name = val; // Sync internal name
    setPlayers(newP);
  };

  const startGame = () => {
    // Slice the players array based on count
    const activePlayers = players.slice(0, playerCount);
    onStart(activePlayers, sfx, bgm);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-50">
      <div className="bg-[#1a1a1a]/95 border-[4px] border-[#4caf50] rounded-xl shadow-[0_0_50px_rgba(76,175,80,0.3)] p-8 w-full max-w-2xl backdrop-blur-md">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#81c784] to-[#2e7d32] drop-shadow-[2px_2px_0_black]">
            Agri Tamizha
          </h1>
          <p className="text-gray-400 mt-2 font-mono tracking-widest text-sm uppercase">Farming Snakes & Ladders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Col: Game Settings */}
            <div className="space-y-6">
                
                {/* Player Count */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg border border-[#444]">
                    <label className="block text-[#4caf50] font-bold mb-3 uppercase text-xs tracking-wider">Number of Players</label>
                    <div className="flex gap-2">
                        {[2, 3, 4].map(num => (
                            <button
                                key={num}
                                onClick={() => setPlayerCount(num)}
                                className={`flex-1 py-2 rounded font-bold transition-all ${playerCount === num ? 'bg-[#4caf50] text-black shadow-[0_0_10px_#4caf50]' : 'bg-[#333] text-gray-400 hover:bg-[#444]'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Audio Settings */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg border border-[#444]">
                    <label className="block text-[#4caf50] font-bold mb-3 uppercase text-xs tracking-wider">Audio Settings</label>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300 font-bold">🎵 Background Music</span>
                            <button 
                                onClick={() => setBgm(!bgm)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${bgm ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${bgm ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300 font-bold">🔊 SFX Sound</span>
                            <button 
                                onClick={() => setSfx(!sfx)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${sfx ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${sfx ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Player Names */}
            <div className="bg-[#2a2a2a] p-4 rounded-lg border border-[#444] flex flex-col">
                 <label className="block text-[#4caf50] font-bold mb-3 uppercase text-xs tracking-wider">Player Names</label>
                 <div className="space-y-3 flex-1 overflow-y-auto">
                    {players.slice(0, playerCount).map((p, i) => (
                        <div key={p.id} className="flex items-center gap-3 animate-popIn" style={{animationDelay: `${i*100}ms`}}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg border border-white/20" style={{backgroundColor: p.color}}>
                                {p.avatar}
                            </div>
                            <input 
                                type="text"
                                value={p.display}
                                onChange={(e) => handleNameChange(i, e.target.value)}
                                className="flex-1 bg-[#111] border border-[#444] rounded px-3 py-2 text-white focus:border-[#4caf50] outline-none transition-colors"
                                placeholder={`Player ${i+1}`}
                            />
                        </div>
                    ))}
                 </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
            <button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-[#2e7d32] to-[#4caf50] text-white text-xl font-black uppercase py-4 rounded-lg shadow-[0_5px_0_#1b5e20] active:translate-y-[3px] active:shadow-none transition-all hover:brightness-110"
            >
                Start Game 🚜
            </button>
            
            <button 
                onClick={onOpenAdmin}
                className="text-xs text-gray-500 hover:text-gray-300 underline text-center mt-2"
            >
                Advanced Admin Config
            </button>
        </div>

      </div>
    </div>
  );
};

export default MainMenu;