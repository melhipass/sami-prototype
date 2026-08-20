import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerScreenProps {
  onAccept: () => void;
  onCancel: () => void;
}

export function DisclaimerScreen({ onAccept, onCancel }: DisclaimerScreenProps) {
  const disclaimers = [
    {
      title: 'Nocturnal movement monitor',
      description: 'Sami detects all types of nighttime movement regardless of origin.',
    },
    {
      title: 'No guarantee of effectiveness',
      description: 'SAMI TECHNOLOGIES, INC. does not guarantee effectiveness for any particular application. Use is at your own risk.',
    },
    {
      title: 'Not FDA-approved',
      description: 'Sami has not been approved by the FDA or any other government agency.',
    },
    {
      title: 'Not a medical device',
      description: 'Sami is not intended to prevent, diagnose, treat, or cure any disease or condition.',
    },
    {
      title: 'Consult your physician',
      description: 'Always seek the advice of your doctor with any medical questions.',
    },
  ];

  const [acceptedDisclaimers, setAcceptedDisclaimers] = useState<boolean[]>(
    new Array(disclaimers.length).fill(false)
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const toggleDisclaimer = (index: number) => {
    const newAccepted = [...acceptedDisclaimers];
    newAccepted[index] = !newAccepted[index];
    setAcceptedDisclaimers(newAccepted);
  };

  const allAccepted = acceptedDisclaimers.every((accepted) => accepted) && agreedToTerms;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-surface px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full">
        <div className="w-20 h-20 bg-app-card rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-app-amber">
          <AlertTriangle className="w-10 h-10 text-app-amber" />
        </div>

        <h1 className="text-3xl mb-3 text-app-content text-center">Important Information</h1>
        <p className="text-xl text-app-content-soft mb-6 text-center">Please review the following disclaimers</p>

        <div className="w-full mb-6 max-h-[200px] overflow-y-auto space-y-4 pr-2">
          {disclaimers.map((disclaimer, index) => (
            <div
              key={index}
              className="bg-app-card rounded-xl p-4 border border-app-amber/30"
            >
              <div className="flex items-start gap-3 justify-between">
                <div className="flex-1 text-left">
                  <label
                    htmlFor={`disclaimer-${index}`}
                    className="text-base font-semibold text-app-content mb-1 block cursor-pointer"
                  >
                    {disclaimer.title}
                  </label>
                  <p className="text-sm text-app-content-soft">
                    {disclaimer.description}
                  </p>
                </div>
                <button
                  id={`disclaimer-${index}`}
                  onClick={() => toggleDisclaimer(index)}
                  className={`mt-1 w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    acceptedDisclaimers[index] ? 'bg-app-navy' : 'bg-app-content/10 dark:bg-[#4b5563]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      acceptedDisclaimers[index] ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 w-full">
          <div className="w-full flex items-start gap-3 mb-2">
            <input
              type="checkbox"
              id="terms-agreement"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-app-line/20 dark:border-[#4b5563] bg-app-card checked:bg-[#293283] checked:border-[#293283] cursor-pointer flex-shrink-0"
              style={{ accentColor: '#293283' }}
            />
            <label htmlFor="terms-agreement" className="text-sm text-app-content-soft text-left cursor-pointer">
              I have read and agree to Sami's{' '}
              <a
                href="https://www.samialert.com/policies/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-app-link hover:text-app-link/80 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Terms and Conditions
              </a>
              {' '}and{' '}
              <a
                href="https://www.samialert.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-app-link hover:text-app-link/80 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            onClick={onAccept}
            disabled={!allAccepted}
            className="w-full bg-app-navy text-white py-4 rounded-xl text-lg shadow-lg hover:bg-app-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept All
          </button>

          <button
            onClick={onCancel}
            className="w-full text-app-content-faint py-3 text-base hover:text-app-content transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
