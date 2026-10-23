import { useState, useEffect } from 'react';

interface RecordingIconProps {
  // When true, the indicator stays gray (not recording) and stops cycling —
  // used while the camera stream is unavailable.
  forceGray?: boolean;
}

export function RecordingIcon({ forceGray = false }: RecordingIconProps) {
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    if (forceGray) return; // Frozen gray; no cycling.
    const interval = setInterval(() => {
      setIsRecording((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, [forceGray]);

  const recording = isRecording && !forceGray;

  return (
    <div
      className={`relative rounded-full px-3 py-1 flex items-center justify-center ${recording ? 'animate-pulse' : ''}`}
      style={{ backgroundColor: recording ? '#B95555' : '#6B7280' }}
    >
      <span className="text-white text-xs font-bold">REC</span>
    </div>
  );
}