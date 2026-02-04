import React from 'react';

interface WeatherLayerProps {
  active: boolean;
}

const WeatherLayer: React.FC<WeatherLayerProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[150]">
      <div className="rain-bg w-full h-full opacity-50 absolute top-0 left-0"></div>
      <div className="storm-flash w-full h-full bg-white opacity-0 absolute top-0 left-0"></div>
    </div>
  );
};

export default WeatherLayer;