import { Check } from 'lucide-react';

interface OnboardingStepperProps {
  currentIndex: number; // 0-based active step index
  labels: string[];
}

export function OnboardingStepper({ currentIndex, labels }: OnboardingStepperProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-center pt-5 pb-3 px-6 z-10">
      <div className="flex items-center gap-0">
        {labels.map((label, i) => {
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={label} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#BFE3D9] text-[#2C3B4A]'
                      : isActive
                      ? 'bg-[#5B8BBF] text-white'
                      : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[14px] mt-1 font-medium whitespace-nowrap ${
                    isActive ? 'text-[#5B8BBF]' : isCompleted ? 'text-[#BFE3D9]' : 'text-gray-600'
                  }`}
                >
                  {label}
                </span>

              </div>

              {/* Connector line */}
              {i < labels.length - 1 && (
                <div
                  className={`w-12 h-0.5 mb-3 mx-1 transition-all ${
                    i < currentIndex ? 'bg-[#BFE3D9]' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
