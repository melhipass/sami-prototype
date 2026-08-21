import { useState } from 'react';
import { Camera, CheckCircle, Check, AlertCircle } from 'lucide-react';

interface CameraIdentifiedProps {
  cameraName: string;
  cameras: CameraDevice[];
  onAdd: (isNewCamera: boolean) => void;
  onSearchAgain: () => void;
  onCancel: () => void;
}

interface CameraDevice {
  id: string;
  name: string;
  status: string;
  isNewCamera: boolean;
}

export function CameraIdentified({ cameraName, cameras, onAdd, onSearchAgain, onCancel }: CameraIdentifiedProps) {
  const [selectedCamera, setSelectedCamera] = useState<string>(cameras[0]?.id ?? '');

  const handleAdd = () => {
    const camera = cameras.find((c) => c.id === selectedCamera);
    onAdd(camera?.isNewCamera ?? true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        {cameras.length > 0 ? (
          <div className="w-20 h-20 bg-app-card rounded-2xl flex items-center justify-center mb-4 mt-16 relative border-2 border-app-amber">
            <Camera className="w-10 h-10 text-app-amber" />
            <div className="absolute -top-2 -right-2 bg-app-mint dark:bg-[#BFE3D9] rounded-full p-1 border-2 border-app-card dark:border-black">
              <CheckCircle className="w-6 h-6 text-app-mint-ink dark:text-[#2C3B4A]" />
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 bg-app-card rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-app-alert">
            <AlertCircle className="w-10 h-10 text-app-alert" />
          </div>
        )}

        <h1 className="text-3xl mb-3 text-app-content">{cameras.length > 0 ? 'Cameras Found' : 'No Cameras Found'}</h1>
        <p className="text-base text-app-content-faint mb-6">
          {cameras.length > 0 ? 'Select a camera to add' : 'No cameras detected on the network'}
        </p>

        <div className="w-full mb-8 space-y-3">
          {cameras.length > 0 ? (
            <div className="max-h-[170px] overflow-y-auto space-y-3 pr-2">
              {cameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => setSelectedCamera(camera.id)}
                className={`w-full bg-app-card rounded-xl p-4 border-2 transition-all flex items-center justify-between ${
                  selectedCamera === camera.id
                    ? 'border-app-amber'
                    : 'border-app-line/15 dark:border-[#374151] hover:border-app-line/20 dark:hover:border-[#4b5563]'
                }`}
              >
                <div className="flex-1 text-left">
                  <p className="text-base font-semibold text-app-content">{camera.name}</p>
                </div>
                {selectedCamera === camera.id && (
                  <div className="w-6 h-6 bg-app-cream rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-app-cream-ink dark:text-[#2C3B4A]" />
                  </div>
                )}
              </button>
              ))}
            </div>
          ) : (
            <div className="w-full bg-app-card rounded-xl p-6 border border-app-alert/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-app-alert flex-shrink-0 mt-0.5" />
              <p className="text-sm text-app-alert text-left">
                Confirm the Camera Power Light is green and that you're on the same Wi-Fi network.
                <br /><br />
                Pro Tip! Many users prefer to use a wired connection by connecting the camera via Ethernet cable (or their home network) by using a LAN port. This helps with connectivity and speed.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 w-full">
          {cameras.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={!selectedCamera}
              className="w-full bg-app-navy text-white py-4 rounded-xl text-lg shadow-lg hover:bg-app-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Selected Camera
            </button>
          )}

          <button
            onClick={onSearchAgain}
            className="w-full bg-app-sunken text-app-content py-4 rounded-xl text-lg border border-app-line/15 hover:bg-app-content/10 dark:hover:bg-[#4b5563] transition-colors"
          >
            Search Again
          </button>

          <button
            onClick={onCancel}
            className="w-full text-app-content-faint py-3 text-base hover:text-app-content transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
