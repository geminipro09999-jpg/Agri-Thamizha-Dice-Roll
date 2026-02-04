import React from 'react';

interface DiceProps {
  rolling: boolean;
  value: number;
  onClick: () => void;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ rolling, value, onClick, disabled }) => {
  const getTransformClass = (val: number) => {
    switch(val) {
      case 1: return 'show-1';
      case 2: return 'show-2';
      case 3: return 'show-3';
      case 4: return 'show-4';
      case 5: return 'show-5';
      case 6: return 'show-6';
      default: return 'show-1';
    }
  };

  return (
    <div className="scene w-[100px] h-[100px] mx-auto my-4">
      <div 
        className={`cube w-full h-full relative cursor-pointer ${rolling ? 'is-spinning' : getTransformClass(value)}`}
        onClick={!disabled ? onClick : undefined}
      >
        <div className="cube__face cube__face--1 flex items-center justify-center">1</div>
        <div className="cube__face cube__face--2 flex items-center justify-center">2</div>
        <div className="cube__face cube__face--3 flex items-center justify-center">3</div>
        <div className="cube__face cube__face--4 flex items-center justify-center">4</div>
        <div className="cube__face cube__face--5 flex items-center justify-center">5</div>
        <div className="cube__face cube__face--6 flex items-center justify-center">6</div>
      </div>
    </div>
  );
};

export default Dice;