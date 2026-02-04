import React, { useState, useEffect, useRef } from 'react';
import { Player, BoardConfig, LogicMap } from './types';
import { DEFAULT_BOARD_CONFIG, DEFAULT_LOGIC, DEFAULT_PLAYERS } from './constants';
import { playSynthSound, setAudioConfig, initAudio } from './utils/audio';
import GameBoard from './components/GameBoard';
import Dice from './components/Dice';
import AdminPanel from './components/AdminPanel';
import ComicModal from './components/ComicModal';
import WeatherLayer from './components/WeatherLayer';
import MainMenu from './components/MainMenu';

type ViewState = 'menu' | 'playing' | 'admin';

const App: React.FC = () => {
  // Application View State
  const [viewState, setViewState] = useState<ViewState>('menu');
  const [isPreview, setIsPreview] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  
  // Game Data
  const [players, setPlayers] = useState<Player[]>(JSON.parse(JSON.stringify(DEFAULT_PLAYERS)));
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(DEFAULT_BOARD_CONFIG);
  const [logic, setLogic] = useState<LogicMap>(DEFAULT_LOGIC);

  // Runtime Game State
  const [turnIdx, setTurnIdx] = useState(0);
  const [logs, setLogs] = useState<string[]>(['System Loaded.']);
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [activeTokenIdx, setActiveTokenIdx] = useState<number | undefined>(undefined);
  
  // UI State
  const [weatherActive, setWeatherActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{player: Player | null, text: string, img?: string, cb?: () => void}>({ player: null, text: '' });

  // Audio State
  const [audioSettings, setAudioSettings] = useState({ sfx: true, bgm: false });

  // Refs
  const playersRef = useRef(players);
  const logicRef = useRef(logic);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { logicRef.current = logic; }, [logic]);

  // Sync Audio Settings
  useEffect(() => {
    initAudio();
    setAudioConfig(audioSettings.sfx, audioSettings.bgm);
  }, [audioSettings]);

  // Apply Wallpaper
  useEffect(() => {
    document.body.style.backgroundImage = boardConfig.wallpaper ? `url(${boardConfig.wallpaper})` : 'none';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }, [boardConfig.wallpaper]);

  // Logger
  const log = (msg: string) => setLogs(prev => [msg, ...prev]);

  // Save/Load
  const save = (slot: string) => {
    localStorage.setItem(`agriTamizha_${slot}`, JSON.stringify({ players, logic, boardConfig }));
    alert('Saved!');
  };
  const load = (slot: string) => {
    const s = localStorage.getItem(`agriTamizha_${slot}`);
    if (s) {
      const d = JSON.parse(s);
      setPlayers(d.players || d);
      if(d.logic) setLogic(d.logic);
      if(d.boardConfig) setBoardConfig(d.boardConfig);
      alert('Loaded!');
    } else alert('No data found.');
  };
  const reset = () => {
    if(window.confirm('Reset all settings?')) {
      setPlayers(JSON.parse(JSON.stringify(DEFAULT_PLAYERS)));
      setLogic(DEFAULT_LOGIC);
      setBoardConfig(DEFAULT_BOARD_CONFIG);
    }
  };

  // --- Start Sequence ---
  const handleMenuStart = (selectedPlayers: Player[], sfx: boolean, bgm: boolean) => {
    // Reset positions
    const readyPlayers = selectedPlayers.map(p => ({
      ...p,
      pos: 0,
      sixCount: 0
    }));
    
    setPlayers(readyPlayers);
    setAudioSettings({ sfx, bgm });
    setViewState('playing');
    setTurnIdx(0);
    setLogs(['Game Started! Rule: Need 6 to Start.']);
    
    // Intro Popup
    setTimeout(() => {
      openModal(readyPlayers[0], `வணக்கம்! நான் ${readyPlayers[0].display}. என் விவசாய பயணத்தை தொடங்குகிறேன்!`, undefined, 'nature');
    }, 1000);
  };

  const launchGameFromAdmin = () => {
    setViewState('playing');
    setIsPreview(false);
    // Reuse current player list but reset pos
    setPlayers(players.map(p => ({...p, pos: 0, sixCount: 0})));
    setTurnIdx(0);
    setLogs(['Game Started! Rule: Need 6 to Start.']);
    
    setTimeout(() => {
        openModal(players[0], `வணக்கம்! நான் ${players[0].display}. என் விவசாய பயணத்தை தொடங்குகிறேன்!`, undefined, 'nature');
    }, 1000);
  };

  const nextTurn = () => {
    setIsRolling(false);
    setPlayers(prev => {
      const newP = [...prev];
      newP[turnIdx].sixCount = 0;
      return newP;
    });
    setTurnIdx(prev => (prev + 1) % players.length);
  };

  const handleDiceRoll = () => {
    if (isRolling) return;
    const currentPlayer = players[turnIdx];
    
    if (currentPlayer.pos === 100) {
      log(`${currentPlayer.display} finished.`);
      nextTurn();
      return;
    }

    setIsRolling(true);
    playSynthSound('dice');

    // Wait for animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      log(`${currentPlayer.display} rolls ${roll}`);

      let extraChance = false;
      let newSixCount = currentPlayer.sixCount;

      if (roll === 6) {
        newSixCount++;
        if (newSixCount === 3) {
          log(`⚠️ Three 6s! Turn Cancelled.`);
          setPlayers(prev => {
             const copy = [...prev];
             copy[turnIdx].sixCount = 0;
             return copy;
          });
          nextTurn();
          return;
        }
        extraChance = true;
      } else {
        newSixCount = 0;
      }

      // Update six count immediately
      setPlayers(prev => {
        const copy = [...prev];
        copy[turnIdx].sixCount = newSixCount;
        return copy;
      });

      // Move Logic
      if (currentPlayer.pos === 0) {
        if (roll === 6) {
          log(`${currentPlayer.display} enters!`);
          movePlayer(turnIdx, 1, extraChance);
        } else {
          log(`${currentPlayer.display} needs 6.`);
          if (extraChance) {
             setIsRolling(false);
          } else {
             nextTurn();
          }
        }
      } else {
        const nextPos = currentPlayer.pos + roll;
        if (nextPos > 100) {
          log(`Needs exact roll.`);
          if (extraChance) setIsRolling(false);
          else nextTurn();
        } else {
          movePlayer(turnIdx, nextPos, extraChance);
        }
      }

    }, 1500); // Sync with CSS animation duration
  };

  const movePlayer = (pIdx: number, newPos: number, hasExtraTurn: boolean) => {
    // 1. Update position
    setPlayers(prev => {
      const copy = [...prev];
      copy[pIdx].pos = newPos;
      return copy;
    });
    
    // Trigger Token animation
    setActiveTokenIdx(pIdx);
    setTimeout(() => setActiveTokenIdx(undefined), 500);

    // 2. Check Logic (Snake/Ladder/Event) after short delay for visual movement
    setTimeout(() => {
      const currentP = playersRef.current[pIdx];
      const event = currentP.events.find(e => e.sq === newPos);
      const jumpTo = logicRef.current[newPos];

      const finalize = () => {
        if (currentP.pos === 100) {
           openModal(currentP, "வெற்றி! (Winner)", undefined, "victory", () => {
             log(`🏆 WINNER: ${currentP.display}`);
           });
           setIsRolling(false); // Game effectively ends for them or continues for others
        } else if (hasExtraTurn) {
           log("EXTRA turn!");
           setIsRolling(false);
        } else {
           nextTurn();
        }
      };

      if (event) {
        // Trigger Weather if text contains keywords
        if (event.text.toLowerCase().match(/cyclone|rain|புயல்|மழை/)) {
           setWeatherActive(true);
           setTimeout(() => setWeatherActive(false), 5000);
        }
        
        openModal(currentP, event.text, event.img, event.sound, () => {
          if (jumpTo) performJump(pIdx, jumpTo, finalize);
          else finalize();
        });
      } else if (jumpTo) {
        performJump(pIdx, jumpTo, finalize);
      } else {
        finalize();
      }
    }, 800);
  };

  const performJump = (pIdx: number, dest: number, cb: () => void) => {
    const p = playersRef.current[pIdx];
    const isLadder = dest > p.pos;
    const msg = isLadder ? "ஏணி! (Ladder Climb)" : "சறுக்கல்! (Pipe Slide)";
    const snd = isLadder ? "success" : "sad";

    openModal(p, msg, undefined, snd, () => {
      setPlayers(prev => {
        const copy = [...prev];
        copy[pIdx].pos = dest;
        return copy;
      });
      cb();
    });
  };

  const openModal = (player: Player, text: string, img?: string, sound?: string, cb?: () => void) => {
    if (sound) playSynthSound(sound);
    setModalData({ player, text, img, cb });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (modalData.cb) modalData.cb();
  };

  return (
    <div className="app-container w-full max-w-[1400px] flex flex-col items-center p-5 relative mx-auto">
      <WeatherLayer active={weatherActive} />

      {/* View: Main Menu */}
      {viewState === 'menu' && (
        <MainMenu 
           onStart={handleMenuStart} 
           onOpenAdmin={() => setViewState('admin')} 
        />
      )}

      {/* View: Admin Panel */}
      {viewState === 'admin' && (
        <AdminPanel 
          players={players} config={boardConfig} logic={logic}
          onUpdatePlayers={setPlayers} onUpdateConfig={setBoardConfig} onUpdateLogic={setLogic}
          onSave={save} onLoad={load} onReset={reset} onToggleGrid={() => setShowGrid(!showGrid)}
          onStartGame={launchGameFromAdmin} onOpenPreview={() => { setIsPreview(true); setViewState('admin'); }} // Keep admin state but show preview
          onBackToMenu={() => setViewState('menu')}
        />
      )}

      {/* View: Game (Only render logic if playing or previewing) */}
      <div className={`w-full grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start ${(viewState === 'playing' || isPreview) ? 'grid' : 'hidden'}`}>
        
        {/* Preview Overlay when in Admin Mode */}
        {isPreview && viewState === 'admin' && (
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/90 border-2 border-amber-500 p-4 rounded-xl z-[1000] w-[90%] max-w-[600px] shadow-2xl">
            <div className="flex justify-between items-center mb-2 border-b border-[#444] pb-2">
                <span className="font-bold text-amber-500">Preview Mode</span>
                <button onClick={() => { setIsPreview(false); }} className="bg-red-600 text-white px-2 py-1 rounded text-sm">Close Preview</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400">Scale</label>
                    <input type="range" min="50" max="200" value={boardConfig.scale} onChange={(e) => setBoardConfig({...boardConfig, scale: Number(e.target.value)})} className="w-full" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">X Position</label>
                    <input type="range" min="0" max="100" value={boardConfig.x} onChange={(e) => setBoardConfig({...boardConfig, x: Number(e.target.value)})} className="w-full" />
                </div>
            </div>
            </div>
        )}

        {/* Board Area */}
        <GameBoard 
          config={boardConfig} 
          showGrid={showGrid} 
          players={players} 
          activeTokenIndex={activeTokenIdx}
        />

        {/* Sidebar */}
        <div className="bg-[#141414]/95 p-6 rounded-2xl border border-[#333] flex flex-col gap-5 shadow-2xl sticky top-5 z-[50]">
           <div className="flex justify-between items-start">
             <h2 className="m-0 text-amber-500 text-left text-2xl font-bold">Agri Tamizha</h2>
             <button onClick={() => setViewState('menu')} className="text-xs text-gray-500 hover:text-white border border-[#444] px-2 py-1 rounded">Menu</button>
           </div>
           
           {/* Turn Indicator */}
           <div className="bg-[#222] p-3 rounded-lg flex items-center gap-4 border border-[#444]">
             <div className="text-xs text-gray-500 uppercase tracking-widest">Current Turn</div>
             <div className="text-xl font-bold flex items-center gap-2" style={{ color: players[turnIdx].color }}>
                <span className="text-2xl">{players[turnIdx].avatar}</span>
                {players[turnIdx].display}
             </div>
           </div>

           {/* Dice */}
           <Dice 
             rolling={isRolling} 
             value={diceValue} 
             onClick={handleDiceRoll} 
             disabled={isRolling}
           />

           <button 
             onClick={handleDiceRoll} 
             disabled={isRolling}
             className={`text-lg py-4 rounded-lg font-bold transition-all ${isRolling ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 shadow-[0_5px_0_#1b5e20] active:translate-y-[2px] active:shadow-none'}`}
           >
             {isRolling ? 'Rolling...' : 'Roll Dice 🎲'}
           </button>

           <button 
              onClick={() => setViewState('admin')}
              className="bg-[#333] text-gray-300 py-2 rounded text-sm hover:bg-[#444]"
           >
             ⚙️ Admin Panel
           </button>

           {/* Logs */}
           <div className="flex-1 bg-[#0a0a0a] border border-[#333] p-3 overflow-y-auto font-mono text-gray-400 max-h-[250px] text-sm rounded-md shadow-inner">
             {logs.map((l, i) => (
               <div key={i} className="mb-1 border-b border-white/5 pb-1 last:border-0">{l}</div>
             ))}
           </div>
        </div>
      </div>

      <ComicModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        player={modalData.player} 
        text={modalData.text} 
        imgSrc={modalData.img}
      />
    </div>
  );
};

export default App;