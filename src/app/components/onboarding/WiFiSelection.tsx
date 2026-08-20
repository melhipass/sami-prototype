import { useState } from 'react';
import { Wifi, Lock, RefreshCw, Check } from 'lucide-react';

interface WiFiNetwork {
  ssid: string;
  secured: boolean;
  strength: number;
}

interface WiFiSelectionProps {
  onSelect: (ssid: string, secured: boolean) => void;
  onCancel: () => void;
  title?: string;
}

export function WiFiSelection({ onSelect, onCancel, title = 'Select Wi-Fi Network' }: WiFiSelectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSsid, setSelectedSsid] = useState('Sami-5G');

  const networks: WiFiNetwork[] = [
    { ssid: 'Sami-5G', secured: true, strength: 3 },
    { ssid: 'Home-WiFi-5G', secured: true, strength: 3 },
    { ssid: 'Home-WiFi-2.4G', secured: true, strength: 2 },
    { ssid: 'CoffeeShop_Free', secured: false, strength: 2 },
    { ssid: 'Guest-Network', secured: true, strength: 2 },
    { ssid: 'OpenWifi_Lobby', secured: false, strength: 1 },
  ];

  const selectedNetwork = networks.find(n => n.ssid === selectedSsid);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const NetworkItem = ({ network }: { network: WiFiNetwork }) => {
    const isSelected = network.ssid === selectedSsid;
    return (
      <button
        onClick={() => setSelectedSsid(network.ssid)}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? 'bg-app-sunken' : 'hover:bg-app-sunken active:bg-app-content/10 dark:active:bg-[#4b5563]'}`}
      >
        <Wifi className={`w-5 h-5 ${network.strength === 3 ? 'text-app-content' : network.strength === 2 ? 'text-app-content-faint' : 'text-app-content-faint'}`} />
        <span className={`flex-1 text-left text-base ${isSelected ? 'text-[#5B8BBF] font-semibold' : 'text-app-content'}`}>{network.ssid}</span>
        {isSelected ? (
          <Check className="w-5 h-5 text-[#5B8BBF]" />
        ) : (
          network.secured && <Lock className="w-4 h-4 text-app-content-faint" />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-surface px-6 py-8">
      <div className="bg-app-card rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-app-line/15 dark:border-[#374151]">
        {/* Header */}
        <div className="p-6 border-b border-app-line/15 dark:border-[#374151] flex items-start justify-between">
          <div>
            <h2 className="text-2xl text-app-content">{title}</h2>
            <p className="text-sm text-app-content-faint mt-1">Choose the network for your camera</p>
            <p className="text-base text-app-amber mt-2">For better use, select a Sami-5G network</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-4 mt-1 p-2 rounded-lg hover:bg-app-content/10 dark:hover:bg-[#4b5563] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-[#5B8BBF] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Network list */}
        <div className="max-h-96 overflow-y-auto">
          {isRefreshing ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <RefreshCw className="w-8 h-8 text-[#5B8BBF] animate-spin" />
              <p className="text-app-content-faint text-sm">Searching for networks...</p>
            </div>
          ) : (
            <>
              {networks.map((network) => (
                <NetworkItem key={network.ssid} network={network} />
              ))}
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="p-4 border-t border-app-line/15 dark:border-[#374151] flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-app-sunken text-app-content py-3 rounded-xl border border-app-line/15 hover:bg-app-content/10 dark:hover:bg-[#4b5563] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect(selectedSsid, selectedNetwork?.secured ?? true)}
            className="flex-1 bg-app-navy text-white py-3 rounded-xl hover:bg-app-navy-700 transition-colors font-semibold"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
