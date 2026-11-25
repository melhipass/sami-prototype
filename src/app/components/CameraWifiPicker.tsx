import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Wifi, Check, Lock, Eye, EyeOff, Star } from 'lucide-react';

// Shared Camera Wi-Fi picker popup, used by both Camera Settings and the
// end-of-onboarding "Set up Wi-Fi" flow. It owns the whole flow internally:
// select network -> (other network) -> password -> warning -> connecting ->
// success. The parent only decides when it is open, what the device's current
// network is, whether the camera is wired, and what to do on cancel/complete.

interface CameraWifiPickerProps {
  // When true the picker is shown; the internal flow resets each time it opens.
  open: boolean;
  // The network the device is currently using. If it is in the list it is shown
  // first, preselected, and marked with a star as the preferred network.
  currentNetwork: string;
  // Drives the success message: wired cameras can disconnect the Ethernet wire.
  isWired: boolean;
  // Accent color for primary actions (defaults to the app navy).
  accentColor?: string;
  // Called when the user cancels anywhere before the success popup is dismissed.
  onCancel: () => void;
  // Called when the success popup is dismissed with OK, with the chosen network.
  onComplete: (ssid: string) => void;
}

const CW_NETWORKS = [
  { ssid: 'Sami-5G', secured: true, strength: 3 },
  { ssid: 'Home-WiFi-5G', secured: true, strength: 3 },
  { ssid: 'Home-WiFi-2.4G', secured: true, strength: 2 },
  { ssid: 'CoffeeShop_Free', secured: false, strength: 2 },
  { ssid: 'Guest-Network', secured: true, strength: 2 },
  { ssid: 'OpenWifi_Lobby', secured: false, strength: 1 },
];

type Step = 'select' | 'password' | 'warning' | 'testing' | 'hidden';

export function CameraWifiPicker({ open, currentNetwork, isWired, accentColor = 'var(--app-navy)', onCancel, onComplete }: CameraWifiPickerProps) {
  const [step, setStep] = useState<Step>('select');
  const [pendingSsid, setPendingSsid] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [pendingIsOpen, setPendingIsOpen] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successNetwork, setSuccessNetwork] = useState('');
  const [selectedSsid, setSelectedSsid] = useState('Sami-5G');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [hiddenSsid, setHiddenSsid] = useState('');

  // Whether the current network exists in the list (so it can be starred/first).
  const currentInList = CW_NETWORKS.some(n => n.ssid === currentNetwork);

  // Current network first (preferred), the rest keep their relative order.
  const orderedNetworks = useMemo(() => {
    if (!currentInList) return CW_NETWORKS;
    const current = CW_NETWORKS.find(n => n.ssid === currentNetwork)!;
    return [current, ...CW_NETWORKS.filter(n => n.ssid !== currentNetwork)];
  }, [currentNetwork, currentInList]);

  // Reset the whole flow each time the picker is opened.
  useEffect(() => {
    if (!open) return;
    setStep('select');
    setSelectedSsid(currentInList ? currentNetwork : 'Sami-5G');
    setIsRefreshing(false);
    setPassword('');
    setShowPw(false);
    setPwError(false);
    setHiddenSsid('');
    setPendingSsid('');
    setPendingPassword('');
    setPendingIsOpen(false);
    setPasswordAttempt(0);
    setShowSuccess(false);
    setSuccessNetwork('');
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open && !showSuccess) return null;

  return (
    <>
      {/* Picker overlay — hidden once the success popup takes over */}
      {open && !showSuccess && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">

          {/* Step: Select network */}
          {step === 'select' && (
            <div className="bg-app-card rounded-2xl w-[480px] overflow-hidden border border-app-line/15 dark:border-app-dk-sunken shadow-2xl">
              <div className="p-6 border-b border-app-line/15 dark:border-app-dk-sunken flex items-start justify-between">
                <div>
                  <h2 className="text-2xl text-app-content">Select Camera Wi-Fi</h2>
                  <p className="text-base text-app-content-faint mt-1">Choose the network for your camera</p>
                  <p className="text-base text-app-amber mt-2">For better use, select a Sami network</p>
                </div>
                <button
                  onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1500); }}
                  disabled={isRefreshing}
                  className="ml-4 mt-1 p-2 rounded-lg hover:bg-app-content/10 dark:hover:bg-app-dk-border-strong transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: accentColor }} />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {isRefreshing ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
                    <p className="text-app-content-faint text-base">Searching for networks...</p>
                  </div>
                ) : orderedNetworks.map(network => {
                  const isSelected = network.ssid === selectedSsid;
                  const isCurrent = currentInList && network.ssid === currentNetwork;
                  return (
                    <button key={network.ssid} onClick={() => setSelectedSsid(network.ssid)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? 'bg-app-sunken' : 'hover:bg-app-sunken'}`}
                    >
                      <Wifi className={`w-5 h-5 flex-shrink-0 ${network.strength === 3 ? 'text-app-content' : network.strength === 2 ? 'text-app-content-faint' : 'text-app-content-faint'}`} />
                      <span className="flex-1 flex items-center gap-2 min-w-0 text-left">
                        <span className="text-base truncate" style={{ color: isSelected ? accentColor : 'var(--app-content)', fontWeight: isSelected ? 600 : 400 }}>{network.ssid}</span>
                        {isCurrent && <Star className="w-4 h-4 flex-shrink-0 text-app-amber" aria-label="Current network" />}
                      </span>
                      {isSelected
                        ? <Check className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
                        : network.secured && <Lock className="w-4 h-4 flex-shrink-0 text-app-content-faint" />
                      }
                    </button>
                  );
                })}
              </div>
              {/* Hidden network entry — discreet, only when the list is shown */}
              {!isRefreshing && (
                <div className="px-4 py-3 border-t border-app-line/15 dark:border-app-dk-sunken text-center">
                  <button
                    onClick={() => {
                      setHiddenSsid('');
                      setPassword('');
                      setShowPw(false);
                      setPwError(false);
                      setStep('hidden');
                    }}
                    className="text-base hover:underline"
                    style={{ color: accentColor }}
                  >Join another network…</button>
                </div>
              )}
              <div className="p-4 border-t border-app-line/15 dark:border-app-dk-sunken flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 bg-app-sunken text-app-content py-3 rounded-xl border border-app-line/15 dark:border-transparent hover:bg-app-content/10 dark:hover:bg-app-dk-border-strong transition-colors"
                >Cancel</button>
                <button
                  onClick={() => {
                    const net = orderedNetworks.find(n => n.ssid === selectedSsid);
                    const secured = net?.secured ?? true;
                    setPendingSsid(selectedSsid);
                    setPendingIsOpen(!secured);
                    if (!secured) {
                      setPendingPassword('');
                      setStep('warning');
                    } else {
                      setPasswordAttempt(0);
                      setPwError(false);
                      setPassword('');
                      setStep('password');
                    }
                  }}
                  className="flex-1 text-white dark:text-app-on-navy py-3 rounded-xl hover:opacity-80 transition-colors font-semibold"
                  style={{ backgroundColor: accentColor }}
                >Select</button>
              </div>
            </div>
          )}

          {/* Step: Other network form — mirrors the password step layout */}
          {step === 'hidden' && (
            <div className="bg-app-card rounded-2xl w-[480px] overflow-hidden border border-app-line/15 dark:border-app-dk-sunken shadow-2xl p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Wifi className="w-6 h-6 text-app-content" />
                <h2 className="text-xl text-center text-app-content">Other network</h2>
              </div>
              <p className="text-base text-app-content-faint mb-6 text-center">Enter the network name</p>
              <div className="mb-6">
                <label className="block text-base mb-2 text-app-content-faint">Network name</label>
                <input
                  type="text"
                  value={hiddenSsid}
                  onChange={e => setHiddenSsid(e.target.value)}
                  maxLength={32}
                  autoFocus
                  placeholder="Enter network name"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none bg-app-surface text-app-content placeholder-gray-600 border-app-line/20 dark:border-app-dk-border-strong focus:border-app-blue-accent"
                />
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Treat it like selecting a normal secured network: hand off to
                    // the standard password step to enter the password.
                    setPendingSsid(hiddenSsid.trim());
                    setPendingIsOpen(false);
                    setPasswordAttempt(0);
                    setPwError(false);
                    setPassword('');
                    setStep('password');
                  }}
                  disabled={hiddenSsid.trim().length === 0}
                  className="w-full text-white dark:text-app-on-navy py-3 rounded-xl hover:opacity-80 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accentColor }}
                >Next</button>
                <button
                  onClick={() => { setHiddenSsid(''); setStep('select'); }}
                  className="w-full bg-app-sunken text-app-content py-3 rounded-xl border border-app-line/15 dark:border-transparent hover:bg-app-content/10 dark:hover:bg-app-dk-border-strong transition-colors"
                >Back</button>
              </div>
            </div>
          )}

          {/* Step: Password */}
          {step === 'password' && (
            <div className="bg-app-card rounded-2xl w-[480px] overflow-hidden border border-app-line/15 dark:border-app-dk-sunken shadow-2xl p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Wifi className="w-6 h-6 text-app-content" />
                <h2 className="text-xl text-center text-app-content">{pendingSsid}</h2>
              </div>
              <p className="text-base text-app-content-faint mb-6 text-center">Enter the password for this network</p>
              {pwError && (
                <div className="mb-4 px-4 py-3 bg-app-card dark:bg-[#B85555]/20 border border-app-alert/50 dark:border-[#B85555]/50 rounded-xl">
                  <p className="text-app-alert dark:text-[#F08080] text-base font-bold dark:font-normal text-center">Incorrect password. Please try again.</p>
                </div>
              )}
              <div className="mb-6">
                <label className="block text-base mb-2 text-app-content-faint">Wi-Fi Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && password.length > 0) { setPendingPassword(password); setStep('warning'); } }}
                    className={`w-full px-4 py-3 border rounded-xl pr-12 focus:outline-none bg-app-surface text-app-content placeholder-gray-600 ${pwError ? 'border-[#B6594C] dark:border-[#B85555]' : 'border-app-line/20 dark:border-app-dk-border-strong focus:border-app-blue-accent'}`}
                    placeholder="Enter password"
                    autoFocus
                  />
                  <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-app-sunken rounded-lg" type="button">
                    {showPw ? <EyeOff className="w-5 h-5 text-app-content-faint" /> : <Eye className="w-5 h-5 text-app-content-faint" />}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { setPendingPassword(password); setStep('warning'); }}
                  disabled={password.length === 0}
                  className="w-full text-white dark:text-app-on-navy py-3 rounded-xl disabled:opacity-50 transition-colors font-semibold"
                  style={{ backgroundColor: accentColor }}
                >Connect</button>
                <button onClick={() => { setPwError(false); setStep('select'); }}
                  className="w-full bg-app-sunken text-app-content py-3 rounded-xl border border-app-line/15 dark:border-transparent hover:bg-app-content/10 dark:hover:bg-app-dk-border-strong transition-colors">Back</button>
              </div>
            </div>
          )}

          {/* Step: Warning */}
          {step === 'warning' && (
            <div className="bg-app-card rounded-2xl w-[480px] overflow-hidden border border-app-line/15 dark:border-app-dk-sunken shadow-2xl">
              <div className="px-8 pt-6 pb-2">
                <h2 className="text-app-content text-xl font-semibold text-center">Warning</h2>
              </div>
              <div className="px-8 py-5">
                <p className="text-app-content-soft text-base leading-relaxed text-center">
                  {pendingIsOpen
                    ? `You are moving the Sami camera to the "${pendingSsid}" network.`
                    : `You are moving the Sami camera to the "${pendingSsid}" network with the password "${pendingPassword}".`
                  }{' '}
                  If this is incorrect you may need to connect the camera to a router with an Ethernet wire to recover.
                </p>
              </div>
              <div className="border-t border-app-line/15 dark:border-app-dk-sunken flex flex-col">
                <button
                  onClick={() => {
                    setStep('testing');
                    setTimeout(() => {
                      if (!pendingIsOpen && passwordAttempt === 0) {
                        setPasswordAttempt(1);
                        setPwError(true);
                        setPassword('');
                        setStep('password');
                      } else {
                        setSuccessNetwork(pendingSsid);
                        setShowSuccess(true);
                      }
                    }, 3000);
                  }}
                  className="w-full text-lg py-4 hover:bg-app-sunken transition-colors text-center font-semibold border-b border-app-line/15 dark:border-app-dk-sunken"
                  style={{ color: accentColor }}
                >Continue</button>
                {!pendingIsOpen && (
                  <button onClick={() => setStep('password')}
                    className="w-full text-lg py-4 hover:bg-app-sunken transition-colors text-center font-semibold border-b border-app-line/15 dark:border-app-dk-sunken"
                    style={{ color: accentColor }}
                  >Edit password</button>
                )}
                <button
                  onClick={onCancel}
                  className="w-full text-lg py-4 hover:bg-app-sunken transition-colors text-center font-semibold text-[#B6594C] dark:text-[#B95555]"
                >Cancel</button>
              </div>
            </div>
          )}

          {/* Step: Connecting (testing) */}
          {step === 'testing' && (
            <div className="bg-app-card rounded-lg w-[480px] overflow-hidden border border-app-line/15 dark:border-app-dk-sunken">
              <div className="px-8 pt-6 pb-4 border-b border-app-line/15 dark:border-app-dk-sunken">
                <h2 className="text-app-content text-xl font-semibold text-center">Connecting Camera to Wi-Fi</h2>
              </div>
              <div className="px-8 py-8 flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-app-card rounded-full flex items-center justify-center border-2 border-app-quiet">
                  <RefreshCw className="w-12 h-12 text-app-quiet animate-spin" />
                </div>
                <p className="text-base text-app-content-faint">This may take a few seconds</p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Success popup */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-app-card rounded-lg w-[520px] overflow-hidden border border-app-line/15 dark:border-app-dk-sunken">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-app-content text-xl font-semibold">Wi-Fi configured.</h2>
            </div>
            <div className="px-8 py-5">
              <p className="text-app-content-soft text-base leading-relaxed">
                {isWired
                  ? `Camera Wi-Fi has been set to use "${successNetwork}". You can disconnect the Ethernet wire now.`
                  : `Camera Wi-Fi has been set to use "${successNetwork}". Change your device to the same network to reconnect.`
                }
              </p>
            </div>
            <div className="border-t border-app-line/15 dark:border-app-dk-sunken flex">
              <button
                onClick={() => { const ssid = successNetwork; setShowSuccess(false); onComplete(ssid); }}
                className="flex-1 text-lg py-4 hover:bg-app-sunken transition-colors text-center font-semibold"
                style={{ color: accentColor }}
              >Ok</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
