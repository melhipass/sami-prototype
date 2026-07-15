import { useState, useEffect } from 'react';

export function RecordingIcon() {
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRecording((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`relative rounded-full px-3 py-1 flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`} 
      style={{ backgroundColor: isRecording ? '#B95555' : '#6B7280' }}
    >
      <span className="text-white text-xs font-bold">REC</span>
    </div>
  );
}