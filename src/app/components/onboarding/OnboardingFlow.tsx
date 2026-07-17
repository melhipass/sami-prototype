import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { WelcomeScreen } from './WelcomeScreen';
import { LocationExplainer } from './LocationExplainer';
import { DisclaimerScreen } from './DisclaimerScreen';
import { SetupGuide } from './SetupGuide';
import { NetworkCheck } from './NetworkCheck';
import { CameraIdentified } from './CameraIdentified';
import { PowerConnection } from './PowerConnection';
import { CreatePassword } from './CreatePassword';
import { PasswordManagement } from './PasswordManagement';
import { ConnectivityTest } from './ConnectivityTest';
import { WiFiSelection } from './WiFiSelection';
import { NetworkPassword } from './NetworkPassword';
import { WifiTestingScreen } from './WifiTestingScreen';
import { OnboardingStepper } from './OnboardingStepper';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip?: () => void;
  onCancel?: () => void;
  initialStep?: number;
  skipPermissions?: boolean;
  platform?: 'ios' | 'android';
  currentWifi?: string;
  savedPasswordHint?: string;
  onPasswordHintSaved?: (hint: string) => void;
  onPasswordSaved?: (password: string) => void;
}

interface CameraDevice {
  id: string;
  name: string;
  status: string;
}

export function OnboardingFlow({ onComplete, onSkip, onCancel, initialStep = 0, skipPermissions = false, platform = 'ios', currentWifi, savedPasswordHint = '', onPasswordHintSaved, onPasswordSaved }: OnboardingFlowProps) {
  const isAndroid = platform === 'android';
  const [step, setStep] = useState<number>(initialStep);
  const [locationGranted, setLocationGranted] = useState(false);
  const [cameraFound, setCameraFound] = useState(false);
  const [cameraName, setCameraName] = useState('Sami Camera');
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [isNewCamera, setIsNewCamera] = useState(true);
  const [password, setPassword] = useState('');
  const [createdPassword, setCreatedPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState(savedPasswordHint);
  const [connectionType, setConnectionType] = useState<'hub' | 'wifi'>('hub');
  const [isFirstNetworkCheck, setIsFirstNetworkCheck] = useState(true);
  const [selectedWifi, setSelectedWifi] = useState('');
  const [wifiPasswordAttempt, setWifiPasswordAttempt] = useState(0);
  const [wifiShowErrorOnReturn, setWifiShowErrorOnReturn] = useState(false);

  const handleLearnMore = () => {
    // Open Sami website or info page
    window.open('https://samicam.com', '_blank');
  };

  const handleDisclaimerAccept = () => {
    if (isAndroid) {
      setStep(13); // Android: WiFi selection first
    } else {
      setStep(2); // iOS: Setup Guide
    }
  };

  const handleSetupGuideContinue = () => {
    setStep(3); // Power Connection
  };

  const handleSetupGuideCancel = () => {
    if (skipPermissions && onCancel) {
      onCancel();
    } else if (isAndroid) {
      setStep(13); // Go back to WiFi selection
    } else {
      setStep(0); // Go back to welcome screen
    }
  };

  const handleLightIsGreen = () => {
    if (skipPermissions || isAndroid) {
      setStep(7); // Skip to Network Check (Android has pre-configured permissions)
    } else {
      setStep(4); // Location Explainer
    }
  };

  const handleLightIsNotGreen = () => {
    setStep(2); // Go back to Setup Guide
  };

  const handleLocationPermission = () => {
    // Simulate system permission request
    setTimeout(() => {
      setLocationGranted(true);
      setStep(6); // Move to Local Network Permission
    }, 500);
  };

  const handleLocalNetworkPermission = () => {
    // Simulate system permission request
    setTimeout(() => {
      setStep(7); // Move to Network Check
    }, 500);
  };

  const handleNetworkCheckComplete = (found: boolean, name: string, camerasList: CameraDevice[]) => {
    setCameraFound(found);
    setCameraName(name);
    setCameras(camerasList);
    setIsFirstNetworkCheck(false);
    setStep(8); // Camera Identified (always go here, even if no cameras found)
  };

  const handleCameraConfirm = () => {
    if (skipPermissions) {
      // Coming from Device settings, skip Create Password
      setStep(10); // Password Management
    } else if (isNewCamera) {
      setStep(9); // Create Password
    } else {
      setStep(10); // Password Management
    }
  };

  const handleCreatePassword = (pwd: string, hint: string) => {
    setCreatedPassword(pwd);
    setPasswordHint(hint);
    setPassword(pwd); // Use the created password directly

    // Save the password hint to parent component
    if (onPasswordHintSaved) {
      onPasswordHintSaved(hint);
    }

    // Save the password to parent component
    if (onPasswordSaved) {
      onPasswordSaved(pwd);
    }

    setStep(11); // Skip password re-entry, go directly to Connectivity Test
  };

  const handlePasswordSubmit = (pwd: string) => {
    setPassword(pwd);
    setStep(11); // Connectivity Test
  };

  const handleTestComplete = (success: boolean) => {
    onComplete(); // Go directly to main app
  };

  const handleRetry = () => {
    setStep(10); // Go back to Password Management
  };

  const handleSearchAgain = () => {
    setIsFirstNetworkCheck(false); // Subsequent searches should find cameras
    setStep(7); // Go back to Network Check
  };

  const handleCancel = () => {
    onComplete(); // Exit onboarding
  };

  // Labels vary by platform and whether coming from Settings (skipPermissions)
  const getStepperConfig = (): { labels: string[]; index: number } | null => {
    if (skipPermissions) {
      // Re-pairing from Settings: hide Disclaimers and Permissions steps
      if (isAndroid) {
        // Labels: Wi-Fi, Verify, Connect
        if (step === 13 || step === 14 || step === 15) return { labels: ['Wi-Fi', 'Verify', 'Connect'], index: 0 };
        if (step === 3 || step === 7 || step === 8) return { labels: ['Wi-Fi', 'Verify', 'Connect'], index: 1 };
        if (step === 9 || step === 10 || step === 11) return { labels: ['Wi-Fi', 'Verify', 'Connect'], index: 2 };
      } else {
        // Labels: Guide, Connect
        if (step === 2 || step === 3) return { labels: ['Guide', 'Connect'], index: 0 };
        if (step === 8 || step === 9 || step === 10 || step === 11) return { labels: ['Guide', 'Connect'], index: 1 };
      }
      return null;
    }

    // Full onboarding flow
    if (isAndroid) {
      if (step === 1) return { labels: ['Disclaimers', 'Wi-Fi', 'Verify', 'Connect'], index: 0 };
      if (step === 13 || step === 14 || step === 15) return { labels: ['Disclaimers', 'Wi-Fi', 'Verify', 'Connect'], index: 1 };
      if (step === 3 || step === 7 || step === 8) return { labels: ['Disclaimers', 'Wi-Fi', 'Verify', 'Connect'], index: 2 };
      if (step === 9 || step === 10 || step === 11) return { labels: ['Disclaimers', 'Wi-Fi', 'Verify', 'Connect'], index: 3 };
    } else {
      if (step === 1) return { labels: ['Disclaimers', 'Guide', 'Permissions', 'Connect'], index: 0 };
      if (step === 2 || step === 3) return { labels: ['Disclaimers', 'Guide', 'Permissions', 'Connect'], index: 1 };
      if (step === 4 || step === 5 || step === 6 || step === 7 || step === 12) return { labels: ['Disclaimers', 'Guide', 'Permissions', 'Connect'], index: 2 };
      if (step === 8 || step === 9 || step === 10 || step === 11) return { labels: ['Disclaimers', 'Guide', 'Permissions', 'Connect'], index: 3 };
    }
    return null; // Hide on welcome screen
  };

  const stepperConfig = getStepperConfig();

  return (
    <div className="fixed inset-0 z-50 relative">
      {stepperConfig && (
        <OnboardingStepper
          currentIndex={stepperConfig.index}
          labels={stepperConfig.labels}
        />
      )}
      {step === 0 && (
        <WelcomeScreen
          onLearnMore={handleLearnMore}
          onConfigure={() => setStep(1)}
          onSkip={onSkip ?? onComplete}
          platform={platform}
        />
      )}
      {step === 1 && (
        <DisclaimerScreen
          onAccept={handleDisclaimerAccept}
          onCancel={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <SetupGuide
          connectionType={connectionType}
          onContinue={handleSetupGuideContinue}
          onCancel={handleSetupGuideCancel}
          cancelLabel={isAndroid ? 'Back' : 'Cancel'}
        />
      )}
      {step === 3 && (
        <PowerConnection
          onLightIsGreen={handleLightIsGreen}
          onLightIsNotGreen={handleLightIsNotGreen}
          onGoBack={() => setStep(13)}
          isAndroid={isAndroid}
        />
      )}
      {step === 4 && (
        <LocationExplainer onContinue={() => setStep(5)} onCancel={() => setStep(3)} />
      )}
      {step === 5 && (
        <div className="flex items-center justify-center min-h-screen bg-black px-6">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-[#FCEAAD]/30">
            <h2 className="text-xl mb-4 text-center text-white">Allow Location Sharing</h2>
            <div className="space-y-3">
              <button
                onClick={handleLocationPermission}
                className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Allow Once
              </button>
              <button
                onClick={handleLocationPermission}
                className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Allow While Using App
              </button>
              <button
                onClick={() => setStep(12)}
                className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Do Not Allow
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 6 && (
        <div className="flex items-center justify-center min-h-screen bg-black px-6">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-[#BFE3D9]/30">
            <h2 className="text-xl mb-4 text-center text-white">Allow Sami to look for local network devices.</h2>
            <div className="space-y-3">
              <button
                onClick={handleLocalNetworkPermission}
                className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Allow
              </button>
              <button
                onClick={() => setStep(12)}
                className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Do Not Allow
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 7 && (
        <NetworkCheck
          onComplete={handleNetworkCheckComplete}
          onError={handleCancel}
          isFirstAttempt={isFirstNetworkCheck}
          selectedWifi={isAndroid && selectedWifi ? selectedWifi : undefined}
        />
      )}
      {step === 8 && (
        <CameraIdentified
          cameraName={cameraName}
          cameras={cameras}
          onAdd={handleCameraConfirm}
          onSearchAgain={handleSearchAgain}
          onCancel={() => setStep(isAndroid ? 13 : 2)}
        />
      )}
      {step === 9 && (
        <CreatePassword
          onSubmit={handleCreatePassword}
          onCancel={() => setStep(8)}
        />
      )}
      {step === 10 && (
        <PasswordManagement
          isNewCamera={isNewCamera}
          passwordHint={passwordHint}
          onSubmit={handlePasswordSubmit}
          onCancel={() => setStep(8)}
        />
      )}
      {step === 11 && (
        <ConnectivityTest
          onComplete={handleTestComplete}
          onRetry={handleRetry}
          password={password}
        />
      )}
      {step === 13 && (
        <WiFiSelection
          title={skipPermissions ? 'Confirm Wi-Fi Network' : 'Select Wi-Fi Network'}
          onSelect={(ssid, secured) => {
            setSelectedWifi(ssid);
            setWifiPasswordAttempt(0);
            // Skip password if open network, or re-pairing with same WiFi
            if (!secured || (skipPermissions && currentWifi && ssid === currentWifi)) {
              setStep(isAndroid ? 3 : 2);
            } else {
              setStep(14);
            }
          }}
          onCancel={() => {
            if (skipPermissions && onCancel) {
              onCancel();
            } else {
              setStep(0);
            }
          }}
        />
      )}
      {step === 14 && (
        <NetworkPassword
          ssid={selectedWifi}
          showErrorOnMount={wifiShowErrorOnReturn}
          onSubmit={() => {
            setWifiShowErrorOnReturn(false);
            setStep(15);
          }}
          onCancel={() => {
            setWifiShowErrorOnReturn(false);
            setStep(13);
          }}
        />
      )}
      {step === 15 && (
        <WifiTestingScreen
          onComplete={() => {
            if (wifiPasswordAttempt === 0) {
              setWifiPasswordAttempt(1);
              setWifiShowErrorOnReturn(true);
              setStep(14);
            } else {
              setStep(isAndroid ? 3 : 2);
            }
          }}
        />
      )}
      {step === 12 && (
        <div className="flex items-center justify-center min-h-screen bg-black px-6 py-8">
          <div className="flex flex-col items-center max-w-md w-full text-center">
            <div className="w-32 h-32 bg-gray-800 rounded-3xl flex items-center justify-center mb-6 border-2 border-[#FFC7BD]">
              <AlertCircle className="w-16 h-16 text-[#FFC7BD]" />
            </div>

            <h1 className="text-3xl mb-4 text-white">Permissions Required</h1>
            <p className="text-base text-gray-300 mb-8 leading-relaxed">
              Sami needs Location and Network permissions to discover and connect to your Sami camera.
              Please go to your device's Settings &gt; Sami &gt; Permissions and enable Location and Local Network access, then close and reopen the app.
            </p>

            <div className="space-y-3 w-full">
              <button
                onClick={() => setStep(5)}
                className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => setStep(0)}
                className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
              >
                Exit Setup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
