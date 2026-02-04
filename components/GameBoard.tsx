import React from 'react';
import { Player, BoardConfig } from '../types';

interface GameBoardProps {
  config: BoardConfig;
  showGrid: boolean;
  players: Player[];
  activeTokenIndex?: number; // to trigger hop animation
}

const GameBoard: React.FC<GameBoardProps> = ({ config, showGrid, players, activeTokenIndex }) => {
  
  // Create 100 cells, standard logic for visualization
  // Row 9 (top) -> 100..91
  // Row 0 (bottom) -> 1..10
  const cells = [];
  for (let r = 9; r >= 0; r--) {
    for (let c = 0; c < 10; c++) {
      const num = (r % 2 === 0) ? (r * 10) + c + 1 : (r * 10) + (10 - c);
      cells.push(num);
    }
  }

  // Calculate coordinates for tokens (percentage based)
  const getCoord = (n: number) => {
    if (n <= 0) return { x: 0, y: 0 };
    const r0 = Math.floor((n - 1) / 10);
    const c0 = (n - 1) % 10;
    const cV = (r0 % 2 === 0) ? c0 : (9 - c0);
    return { x: cV * 10 + 2, y: (9 - r0) * 10 };
  };

  const containerStyle: React.CSSProperties = {
    '--cell-size': `${config.cellSize}${config.cellUnit}`,
    '--board-padding': `${config.boardPadding}${config.cellUnit}`,
    '--board-inner': `calc(10 * var(--cell-size))`,
    '--board-total': `calc(var(--board-inner) + 2 * var(--board-padding))`,
    width: 'var(--board-total)',
    height: 'var(--board-total)',
  } as React.CSSProperties;

  return (
    <div 
      className="bg-[#111] border-[8px] border-[#5d4037] rounded relative shadow-[0_30px_80px_rgba(0,0,0,0.8)] mx-auto box-content"
      style={containerStyle}
    >
      <div className="absolute top-[var(--board-padding)] left-[var(--board-padding)] w-[var(--board-inner)] h-[var(--board-inner)] overflow-hidden bg-black">
        {/* Background Image Layer */}
        <div 
          className="w-full h-full bg-no-repeat absolute"
          style={{
            backgroundImage: config.bgImage ? `url(${config.bgImage})` : 'none',
            backgroundSize: `${config.scale}%`,
            backgroundPosition: `${config.x}% ${config.y}%`
          }}
        />

        {/* Grid Overlay */}
        <div 
          className="absolute top-0 left-0 w-full h-full grid grid-cols-10 grid-rows-10 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: showGrid ? 1 : 0 }}
        >
          {cells.map((num) => (
             <div key={num} className="border border-white/15 flex justify-start items-start p-[2px] text-[14px] text-white/90 font-black drop-shadow-[1px_1px_3px_black]">
               {num}
             </div>
          ))}
        </div>

        {/* Tokens */}
        <div className="absolute inset-0 pointer-events-none z-50">
          {players.map((p, i) => {
            if (p.pos === 0) return null;
            const { x, y } = getCoord(p.pos);
            const isHopping = false; // Triggered via CSS class usually, logic handled in parent or here via key change
            
            // Adjust offset for multiple players on same square to avoid total overlap
            const offsetX = (i % 2) * 10 - 5;
            const offsetY = (i > 1 ? 1 : 0) * 10 - 25; // -25 to pull up
            
            return (
              <div
                key={p.id}
                className={`absolute w-[40px] h-[50px] transition-all duration-500 z-50 flex justify-center pt-[5px] origin-bottom shadow-lg backdrop-blur-[2px] rounded-[50%_50%_15%_15%] border border-white/30 bg-gradient-to-br from-white/40 to-white/10 ${activeTokenIndex === i ? 'hop' : ''}`}
                style={{
                  left: `calc(${x}% + ${offsetX}px)`,
                  top: `calc(${y}% + ${offsetY}px)`,
                  borderBottom: `5px solid ${p.color}`
                }}
              >
                <div className="text-[26px] bg-white rounded-full w-[32px] h-[32px] grid place-items-center border-[2px] border-black/10">
                  {p.avatar}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;