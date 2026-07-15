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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full">
        <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-[#FCEAAD]">
          <AlertTriangle className="w-10 h-10 text-[#FCEAAD]" />
        </div>

        <h1 className="text-3xl mb-3 text-white text-center">Important Information</h1>
        <p className="text-xl text-gray-300 mb-6 text-center">Please review the following disclaimers</p>

        <div className="w-full mb-6 max-h-[200px] overflow-y-auto space-y-4 pr-2">
          {disclaimers.map((disclaimer, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-4 border border-[#FCEAAD]/30"
            >
              <div className="flex items-start gap-3 justify-between">
                <div className="flex-1 text-left">
                  <label
                    htmlFor={`disclaimer-${index}`}
                    className="text-base font-semibold text-white mb-1 block cursor-pointer"
                  >
                    {disclaimer.title}
                  </label>
                  <p className="text-sm text-gray-400">
                    {disclaimer.description}
                  </p>
                </div>
                <button
                  id={`disclaimer-${index}`}
                  onClick={() => toggleDisclaimer(index)}
                  className={`mt-1 w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    acceptedDisclaimers[index] ? 'bg-[#5B8BBF]' : 'bg-gray-600'
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
              className="mt-1 w-5 h-5 rounded border-2 border-gray-600 bg-gray-800 checked:bg-[#293283] checked:border-[#293283] cursor-pointer flex-shrink-0"
              style={{ accentColor: '#293283' }}
            />
            <label htmlFor="terms-agreement" className="text-sm text-gray-300 text-left cursor-pointer">
              I have read and agree to Sami's{' '}
              <a
                href="https://www.samialert.com/policies/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5B8BBF] hover:text-[#5B8BBF]/80 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Terms and Conditions
              </a>
              {' '}and{' '}
              <a
                href="https://www.samialert.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5B8BBF] hover:text-[#5B8BBF]/80 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            onClick={onAccept}
            disabled={!allAccepted}
            className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept All
          </button>

          <button
            onClick={onCancel}
            className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
