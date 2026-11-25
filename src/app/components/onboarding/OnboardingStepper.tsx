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
                      ? 'bg-[#BFE3D9] text-app-gray-panel'
                      : isActive
                      ? 'bg-app-navy text-white dark:text-app-on-navy stepper-active-circle'
                      : 'bg-white dark:bg-app-sunken border border-app-line/25 dark:border-transparent text-app-content-faint'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-base mt-1 font-medium whitespace-nowrap ${
                    isActive ? 'text-app-blue-accent-b stepper-active-label' : isCompleted ? 'text-app-quiet-text' : 'text-app-content-faint'
                  }`}
                >
                  {label}
                </span>

              </div>

              {/* Connector line */}
              {i < labels.length - 1 && (
                <div
                  className={`w-12 h-0.5 mb-3 mx-1 transition-all ${
                    i < currentIndex ? 'bg-app-quiet' : 'bg-app-sunken'
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
