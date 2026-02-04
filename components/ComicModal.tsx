import React from 'react';
import { Player } from '../types';

interface ComicModalProps {
  isOpen: boolean;
  player: Player | null;
  text: string;
  imgSrc?: string;
  onClose: () => void;
}

const ComicModal: React.FC<ComicModalProps> = ({ isOpen, player, text, imgSrc, onClose }) => {
  if (!isOpen || !player) return null;

  // Generate an avatar-based SVG if no image is provided
  const avatarImage = `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" style="background-color:${player.color}"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="150">${player.avatar}</text></svg>`);
  
  const displayImage = (imgSrc && imgSrc.length > 5) ? imgSrc : avatarImage;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/90 z-[1000] flex justify-center items-center backdrop-blur-sm">
      <div className="comic-card bg-white w-[90%] max-w-[550px] border-[6px] border-black shadow-[15px_15px_0px_#111] relative animate-popIn text-black overflow-hidden flex flex-col">
        <div className="w-full h-[280px] bg-gray-200 flex justify-center items-center relative">
          <img src={displayImage} alt="Event" className="w-full h-full object-cover" />
        </div>
        <div className="p-6 text-center bg-white flex flex-col items-center">
          <div 
            className="inline-block px-5 py-2 font-black text-xl uppercase border-[3px] border-black shadow-[4px_4px_0_#000] relative -top-9 transform -rotate-2"
            style={{ backgroundColor: player.color, color: '#fff', textShadow: '1px 1px 0 #000' }}
          >
            {player.display}
          </div>
          <div className="text-lg leading-relaxed font-bold mb-6 -mt-2">
            {text}
          </div>
          <button 
            className="bg-[#d32f2f] text-white border-[3px] border-black py-3 px-8 font-extrabold text-base cursor-pointer shadow-[5px_5px_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_#000]"
            onClick={onClose}
          >
            CONTINUE &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComicModal;