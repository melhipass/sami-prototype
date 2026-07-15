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
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? 'bg-gray-700' : 'hover:bg-gray-700 active:bg-gray-600'}`}
      >
        <Wifi className={`w-5 h-5 ${network.strength === 3 ? 'text-white' : network.strength === 2 ? 'text-gray-400' : 'text-gray-600'}`} />
        <span className={`flex-1 text-left text-base ${isSelected ? 'text-[#5B8BBF] font-semibold' : 'text-white'}`}>{network.ssid}</span>
        {isSelected ? (
          <Check className="w-5 h-5 text-[#5B8BBF]" />
        ) : (
          network.secured && <Lock className="w-4 h-4 text-gray-500" />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-8">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-start justify-between">
          <div>
            <h2 className="text-2xl text-white">{title}</h2>
            <p className="text-sm text-gray-400 mt-1">Choose the network for your camera</p>
            <p className="text-base text-[#FCEAAD] mt-2">For better use, select a Sami-5G network</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-4 mt-1 p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-[#5B8BBF] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Network list */}
        <div className="max-h-96 overflow-y-auto">
          {isRefreshing ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <RefreshCw className="w-8 h-8 text-[#5B8BBF] animate-spin" />
              <p className="text-gray-400 text-sm">Searching for networks...</p>
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
        <div className="p-4 border-t border-gray-700 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect(selectedSsid, selectedNetwork?.secured ?? true)}
            className="flex-1 bg-[#5B8BBF] text-white py-3 rounded-xl hover:bg-[#5B8BBF]/80 transition-colors font-semibold"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
