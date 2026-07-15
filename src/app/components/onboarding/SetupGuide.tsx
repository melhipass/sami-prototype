import { BookOpen, ExternalLink, Wifi, Package } from 'lucide-react';

interface SetupGuideProps {
  connectionType: 'hub' | 'wifi';
  onContinue: () => void;
  onCancel: () => void;
  cancelLabel?: string;
}

export function SetupGuide({ connectionType, onContinue, onCancel, cancelLabel = 'Cancel' }: SetupGuideProps) {
  const handleOpenGuide = (type: 'hub' | 'wifi' | 'complete') => {
    let guideUrl = '';
    if (type === 'hub') {
      guideUrl = 'https://support.samialert.com/hc/en-us/articles/43296226635661-SAMi-Camera-Sami-Hub-Setup-Guide';
    } else if (type === 'wifi') {
      guideUrl = 'https://support.samialert.com/hc/en-us/articles/15332940096525-SAMi-3-Camera-Setup-Guide-Home-Wi-Fi';
    } else if (type === 'complete') {
      guideUrl = 'https://support.samialert.com/hc/en-us/articles/44015598608013-Sami-Complete-Kit-2-Setup-Guide';
    }
    window.open(guideUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-[#FCEAAD] mt-16 mb-4">
          <BookOpen className="w-10 h-10 text-[#FCEAAD]" />
        </div>

        <h1 className="text-3xl mb-3 text-white">Setup Guide</h1>
        <p className="text-base text-gray-300 mx-[0px] mt-[0px] mb-[20px]">
          We recommend reading the setup guide for your connection method before continuing.
        </p>

        <div className="w-full mb-8 space-y-3">
          <button
            onClick={() => handleOpenGuide('complete')}
            className="w-full bg-gray-800 rounded-xl p-4 border border-[#FFC7BD]/30 hover:border-[#FFC7BD]/60 transition-all flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 bg-[#FFC7BD]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-[#FFC7BD]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Sami Complete Kit</h3>
              <p className="text-sm text-gray-400">Setup your all-in-one Sami Complete Kit</p>
            </div>
            <ExternalLink className="w-5 h-5 text-[#FFC7BD] flex-shrink-0" />
          </button>

          <button
            onClick={() => handleOpenGuide('hub')}
            className="w-full bg-gray-800 rounded-xl p-4 border border-[#FCEAAD]/30 hover:border-[#FCEAAD]/60 transition-all flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 bg-[#FCEAAD]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="12" height="7" rx="2" stroke="#FCEAAD" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="16.5" r="1" fill="#FCEAAD"/>
                <path d="M8.5 9.5C8.5 9.5 9.5 8 12 8C14.5 8 15.5 9.5 15.5 9.5" stroke="#FCEAAD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M6 6C6 6 8 4 12 4C16 4 18 6 18 6" stroke="#FCEAAD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Sami Camera + Sami Hub Guide</h3>
              <p className="text-sm text-gray-400">Setup your Sami Camera using the Sami Hub</p>
            </div>
            <ExternalLink className="w-5 h-5 text-[#FCEAAD] flex-shrink-0" />
          </button>

          <button
            onClick={() => handleOpenGuide('wifi')}
            className="w-full bg-gray-800 rounded-xl p-4 border border-[#BFE3D9]/30 hover:border-[#BFE3D9]/60 transition-all flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 bg-[#BFE3D9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wifi className="w-6 h-6 text-[#BFE3D9]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Sami Camera Only Guide</h3>
              <p className="text-sm text-gray-400">Setup your Sami Camera with your home network</p>
            </div>
            <ExternalLink className="w-5 h-5 text-[#BFE3D9] flex-shrink-0" />
          </button>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Continue Setup
          </button>

          <button
            onClick={onCancel}
            className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
