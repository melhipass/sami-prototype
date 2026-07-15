import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

export function AnimatedWifiIcon() {
  const [state, setState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => (prev + 1) % 6);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // State 5: Camera disconnected icon with red prohibition sign
  if (state === 5) {
    return (
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Camera icon with lens circle */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Camera body */}
          <path
            d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Lens outer circle */}
          <circle
            cx="12"
            cy="13"
            r="4"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          {/* Lens inner circle */}
          <circle
            cx="12"
            cy="13"
            r="2"
            fill="white"
          />
        </svg>
        
        {/* Red circle with diagonal line */}
        <svg
          className="absolute inset-0 w-8 h-8"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Red circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#E74C3C"
            strokeWidth="3"
            fill="none"
          />
          {/* Diagonal line */}
          <line
            x1="6"
            y1="6"
            x2="26"
            y2="26"
            stroke="#E74C3C"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Define colors for each bar based on state
  // The WiFi icon has 4 elements: 3 arcs (outermost to innermost) + 1 dot (bottom)
  const getBarColors = () => {
    switch (state) {
      case 0: // All 4 bars light gray
        return ['#CCCCCC', '#CCCCCC', '#CCCCCC', '#CCCCCC'];
      case 1: // Top 3 light gray, bottom 1 red
        return ['#CCCCCC', '#CCCCCC', '#CCCCCC', '#B95555'];
      case 2: // Top 2 light gray, bottom 2 yellow
        return ['#CCCCCC', '#CCCCCC', '#FCEAAD', '#FCEAAD'];
      case 3: // Top 1 light gray, bottom 3 green
        return ['#CCCCCC', '#BFE3D9', '#BFE3D9', '#BFE3D9'];
      case 4: // All 4 green
        return ['#BFE3D9', '#BFE3D9', '#BFE3D9', '#BFE3D9'];
      default:
        return ['#CCCCCC', '#CCCCCC', '#CCCCCC', '#CCCCCC'];
    }
  };

  const colors = getBarColors();

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      {/* Arc 1 (outermost/top) */}
      <path
        d="M1 11C1 11 5.5 6.5 12 6.5C18.5 6.5 23 11 23 11"
        stroke={colors[0]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Arc 2 (second from top) */}
      <path
        d="M5 14C5 14 8 11 12 11C16 11 19 14 19 14"
        stroke={colors[1]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Arc 3 (third from top) */}
      <path
        d="M8.5 16.5C8.5 16.5 10 15 12 15C14 15 15.5 16.5 15.5 16.5"
        stroke={colors[2]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Dot (bottom) */}
      <circle
        cx="12"
        cy="20"
        r="1.5"
        fill={colors[3]}
      />
    </svg>
  );
}