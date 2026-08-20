interface MotionDetectionIconProps {
  className?: string;
}

export function MotionDetectionIcon({ className = "w-6 h-6" }: MotionDetectionIconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stick figure - Head */}
      <circle cx="12" cy="4.5" r="2.5" />
      
      {/* Stick figure - Body */}
      <line x1="12" y1="7" x2="12" y2="15" />
      
      {/* Arms */}
      <line x1="12" y1="10" x2="8" y2="12" />
      <line x1="12" y1="10" x2="16" y2="12" />
      
      {/* Legs */}
      <line x1="12" y1="15" x2="9" y2="20" />
      <line x1="12" y1="15" x2="15" y2="20" />
      
      {/* Left wave - inner arc */}
      <path d="M 5 8 C 4 10 4 14 5 16" />
      
      {/* Left wave - outer arc */}
      <path d="M 2 6 C 0.5 8.5 0.5 15.5 2 18" />
      
      {/* Right wave - inner arc */}
      <path d="M 19 8 C 20 10 20 14 19 16" />
      
      {/* Right wave - outer arc */}
      <path d="M 22 6 C 23.5 8.5 23.5 15.5 22 18" />
    </svg>
  );
}