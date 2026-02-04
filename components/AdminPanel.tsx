import React, { useState } from 'react';
import { Player, BoardConfig, LogicMap, GameEvent } from '../types';

interface AdminPanelProps {
  players: Player[];
  config: BoardConfig;
  logic: LogicMap;
  onUpdatePlayers: (players: Player[]) => void;
  onUpdateConfig: (config: BoardConfig) => void;
  onUpdateLogic: (logic: LogicMap) => void;
  onSave: (slot: string) => void;
  onLoad: (slot: string) => void;
  onReset: () => void;
  onToggleGrid: () => void;
  onStartGame: () => void;
  onOpenPreview: () => void;
  onBackToMenu: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  players, config, logic,
  onUpdatePlayers, onUpdateConfig, onUpdateLogic,
  onSave, onLoad, onReset, onToggleGrid, onStartGame, onOpenPreview, onBackToMenu
}) => {
  const [slot, setSlot] = useState('slot1');
  const [newLogic, setNewLogic] = useState({ start: '', end: '' });

  // Helper to handle file uploads
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, cb: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => cb(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Helper to update specific player
  const updatePlayer = (idx: number, changes: Partial<Player>) => {
    const newPlayers = [...players];
    newPlayers[idx] = { ...newPlayers[idx], ...changes };
    onUpdatePlayers(newPlayers);
  };

  // Helper to add event
  const addEvent = (pIdx: number, sq: number, text: string, sound: any, img: string) => {
    const newPlayers = [...players];
    newPlayers[pIdx].events.push({ sq, text, sound, img });
    newPlayers[pIdx].events.sort((a, b) => a.sq - b.sq);
    onUpdatePlayers(newPlayers);
  };

  const removeEvent = (pIdx: number, eIdx: number) => {
    const newPlayers = [...players];
    newPlayers[pIdx].events.splice(eIdx, 1);
    onUpdatePlayers(newPlayers);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#1a1a1a]/98 z-[200] p-5 overflow-y-auto flex flex-col backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-[#333] pb-4 mb-5 sticky top-0 bg-[#1a1a1a] z-10 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button onClick={onBackToMenu} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold">⬅ Menu</button>
          <div className="text-2xl text-green-600 font-bold">🌾 Admin</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select 
            value={slot} onChange={(e) => setSlot(e.target.value)}
            className="p-2 rounded bg-[#333] text-amber-500 border border-[#666] font-bold cursor-pointer"
          >
            <option value="slot1">📂 Plan 1</option>
            <option value="slot2">📂 Plan 2</option>
            <option value="slot3">📂 Plan 3</option>
          </select>
          <button onClick={onToggleGrid} className="bg-[#444] text-white border border-[#666] px-4 py-2 rounded font-bold"># Grid</button>
          <button onClick={() => onSave(slot)} className="bg-[#444] text-white border border-[#666] px-4 py-2 rounded font-bold">💾 Save</button>
          <button onClick={() => onLoad(slot)} className="bg-[#444] text-white border border-[#666] px-4 py-2 rounded font-bold">📂 Load</button>
          <button onClick={onReset} className="bg-[#444] text-white border border-[#666] px-4 py-2 rounded font-bold">🔄 Reset</button>
          <button onClick={onStartGame} className="bg-green-700 text-white px-5 py-2 rounded font-bold hover:bg-green-600">Play ▶</button>
        </div>
      </div>

      {/* Board Settings */}
      <div className="bg-[#252525] p-4 mb-5 rounded-lg border border-[#444]">
        <div className="flex justify-between items-center border-b border-[#444] pb-2 mb-3">
          <h3 className="text-amber-500 text-lg font-bold">🖼️ Board & Wallpaper Settings</h3>
          <button onClick={onOpenPreview} className="text-xs bg-[#444] px-2 py-1 rounded text-white border border-[#666]">👁️ Live Preview</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          <div>
             <label className="block text-gray-400 text-sm mb-1">1. Game Board Image:</label>
             <input type="file" accept="image/*" onChange={(e) => handleFile(e, (url) => onUpdateConfig({ ...config, bgImage: url }))} className="w-full border border-[#555] p-1 rounded bg-[#333] text-white" />
          </div>
          <div>
             <label className="block text-gray-400 text-sm mb-1">2. App Wallpaper:</label>
             <input type="file" accept="image/*" onChange={(e) => handleFile(e, (url) => onUpdateConfig({ ...config, wallpaper: url }))} className="w-full border border-[#555] p-1 rounded bg-[#333] text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-4">
          <div>
             <label className="text-gray-400 text-sm">Cell Size:</label>
             <div className="flex gap-2">
               <input type="number" value={config.cellSize} onChange={(e) => onUpdateConfig({...config, cellSize: Number(e.target.value)})} className="bg-[#333] border border-[#555] text-white p-1 rounded w-20" />
               <select value={config.cellUnit} onChange={(e) => onUpdateConfig({...config, cellUnit: e.target.value as any})} className="bg-[#333] text-white border border-[#555] rounded">
                 <option value="px">px</option>
                 <option value="mm">mm</option>
               </select>
             </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Board Padding:</label>
            <input type="number" value={config.boardPadding} onChange={(e) => onUpdateConfig({...config, boardPadding: Number(e.target.value)})} className="bg-[#333] border border-[#555] text-white p-1 rounded w-20" />
          </div>
        </div>

        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <label className="w-24 text-gray-400 text-sm">Board Scale:</label>
             <input type="range" min="50" max="200" value={config.scale} onChange={(e) => onUpdateConfig({...config, scale: Number(e.target.value)})} className="flex-1" />
             <span className="w-10 text-right text-amber-500 text-xs">{config.scale}%</span>
           </div>
           <div className="flex items-center gap-2">
             <label className="w-24 text-gray-400 text-sm">Board X:</label>
             <input type="range" min="0" max="100" value={config.x} onChange={(e) => onUpdateConfig({...config, x: Number(e.target.value)})} className="flex-1" />
             <span className="w-10 text-right text-amber-500 text-xs">{config.x}%</span>
           </div>
           <div className="flex items-center gap-2">
             <label className="w-24 text-gray-400 text-sm">Board Y:</label>
             <input type="range" min="0" max="100" value={config.y} onChange={(e) => onUpdateConfig({...config, y: Number(e.target.value)})} className="flex-1" />
             <span className="w-10 text-right text-amber-500 text-xs">{config.y}%</span>
           </div>
        </div>
      </div>

      {/* Game Logic */}
      <div className="bg-[#252525] p-4 mb-5 rounded-lg border border-[#444]">
        <h3 className="text-amber-500 text-lg font-bold border-b border-[#444] pb-2 mb-3">⚙️ Game Settings: Ladders & Snakes</h3>
        <div className="bg-[#333] p-2 rounded mb-3 flex gap-2 items-center">
          <input 
            type="number" placeholder="Start" className="w-20 p-1 rounded bg-[#222] text-white border border-[#555]"
            value={newLogic.start} onChange={(e) => setNewLogic({...newLogic, start: e.target.value})}
          />
          <span className="text-white">➔</span>
          <input 
            type="number" placeholder="End" className="w-20 p-1 rounded bg-[#222] text-white border border-[#555]"
            value={newLogic.end} onChange={(e) => setNewLogic({...newLogic, end: e.target.value})}
          />
          <button 
            onClick={() => {
              const s = parseInt(newLogic.start);
              const e = parseInt(newLogic.end);
              if (s && e && s !== e) {
                onUpdateLogic({ ...logic, [s]: e });
                setNewLogic({ start: '', end: '' });
              }
            }}
            className="bg-amber-500 text-black px-3 py-1 rounded font-bold"
          >
            + Add
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {Object.entries(logic).map(([start, end]) => (
            <div key={start} className={`p-2 rounded flex justify-between items-center text-sm bg-[#333] border-l-4 ${Number(end) > Number(start) ? 'border-green-500' : 'border-green-500'}`}>
               <span className="text-white"><strong>{start}</strong> ➔ <strong>{end}</strong></span>
               <button onClick={() => { const newL = { ...logic }; delete newL[Number(start)]; onUpdateLogic(newL); }} className="bg-red-600 text-white px-2 rounded text-xs">X</button>
            </div>
          ))}
        </div>
      </div>

      {/* Player Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-10">
        {players.map((p, idx) => (
          <div key={p.id} className="bg-[#252525] p-4 rounded-lg border-l-[5px] border-[#555]">
            <div className="flex items-center gap-3 mb-3 border-b border-[#444] pb-2">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: p.color }}></div>
              <input 
                type="text" 
                value={p.display} 
                onChange={(e) => updatePlayer(idx, { display: e.target.value })}
                className="bg-[#111] border border-[#555] text-white p-1 rounded font-bold w-full"
              />
            </div>
            
            {/* Event Adder Form (Simplified) */}
            <div className="bg-[#333] p-2 rounded mb-2">
              <div className="grid grid-cols-[50px_1fr] gap-2 mb-2">
                 <input id={`sq-${idx}`} type="number" placeholder="#" className="bg-[#222] border border-[#444] text-white p-1 rounded w-full" />
                 <input id={`txt-${idx}`} type="text" placeholder="Event Text" className="bg-[#222] border border-[#444] text-white p-1 rounded w-full" />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select id={`snd-${idx}`} className="bg-[#222] border border-[#444] text-white p-1 rounded text-xs">
                  <option value="neutral">Normal</option>
                  <option value="success">Success</option>
                  <option value="sad">Sad</option>
                  <option value="suspense">Suspense</option>
                  <option value="nature">Nature</option>
                </select>
                <input id={`img-${idx}`} type="file" accept="image/*" className="text-xs text-gray-400 w-full" />
              </div>
              <button 
                className="w-full bg-amber-500 text-black py-1 rounded font-bold text-sm"
                onClick={() => {
                   const sqInput = document.getElementById(`sq-${idx}`) as HTMLInputElement;
                   const txtInput = document.getElementById(`txt-${idx}`) as HTMLInputElement;
                   const sndInput = document.getElementById(`snd-${idx}`) as HTMLSelectElement;
                   const imgInput = document.getElementById(`img-${idx}`) as HTMLInputElement;
                   
                   if (sqInput.value && txtInput.value) {
                      const file = imgInput.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => addEvent(idx, parseInt(sqInput.value), txtInput.value, sndInput.value, e.target?.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        addEvent(idx, parseInt(sqInput.value), txtInput.value, sndInput.value, "");
                      }
                      // reset inputs
                      sqInput.value = '';
                      txtInput.value = '';
                   }
                }}
              >
                + Add Event
              </button>
            </div>

            <div className="max-h-[150px] overflow-y-auto bg-black p-1 border border-[#333]">
               {p.events.length === 0 && <div className="text-gray-500 text-xs p-1">No events.</div>}
               {p.events.map((ev, ei) => (
                 <div key={ei} className="flex justify-between items-center border-b border-[#333] p-1 text-xs text-gray-300">
                   <span>Sq {ev.sq}: {ev.text.substring(0, 12)}...</span>
                   <button onClick={() => removeEvent(idx, ei)} className="text-red-500 hover:text-red-400">X</button>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;