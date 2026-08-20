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
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-root-bg px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        {cameras.length > 0 ? (
          <div className="w-20 h-20 bg-app-surface-1 rounded-2xl flex items-center justify-center mb-4 mt-16 relative border-2 border-[#FCEAAD]">
            <Camera className="w-10 h-10 text-[#FCEAAD]" />
            <div className="absolute -top-2 -right-2 bg-[#BFE3D9] rounded-full p-1 border-2 border-black">
              <CheckCircle className="w-6 h-6 text-[#2C3B4A]" />
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 bg-app-surface-1 rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-[#FFC7BD]">
            <AlertCircle className="w-10 h-10 text-[#FFC7BD]" />
          </div>
        )}

        <h1 className="text-3xl mb-3 text-app-root-fg">{cameras.length > 0 ? 'Cameras Found' : 'No Cameras Found'}</h1>
        <p className="text-base text-app-text-3 mb-6">
          {cameras.length > 0 ? 'Select a camera to add' : 'No cameras detected on the network'}
        </p>

        <div className="w-full mb-8 space-y-3">
          {cameras.length > 0 ? (
            <div className="max-h-[170px] overflow-y-auto space-y-3 pr-2">
              {cameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => setSelectedCamera(camera.id)}
                className={`w-full bg-app-surface-1 rounded-xl p-4 border-2 transition-all flex items-center justify-between ${
                  selectedCamera === camera.id
                    ? 'border-[#FCEAAD]'
                    : 'border-app-line-1 hover:border-app-line-2'
                }`}
              >
                <div className="flex-1 text-left">
                  <p className="text-base font-semibold text-app-root-fg">{camera.name}</p>
                </div>
                {selectedCamera === camera.id && (
                  <div className="w-6 h-6 bg-[#FCEAAD] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#2C3B4A]" />
                  </div>
                )}
              </button>
              ))}
            </div>
          ) : (
            <div className="w-full bg-app-surface-1 rounded-xl p-6 border border-[#FFC7BD]/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FFC7BD] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#FFC7BD] text-left">
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
              className="w-full bg-[#5B8BBF] text-app-root-fg py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Selected Camera
            </button>
          )}

          <button
            onClick={onSearchAgain}
            className="w-full bg-app-surface-2 text-app-root-fg py-4 rounded-xl text-lg hover:bg-app-surface-3 transition-colors"
          >
            Search Again
          </button>

          <button
            onClick={onCancel}
            className="w-full text-app-text-3 py-3 text-base hover:text-app-root-fg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
