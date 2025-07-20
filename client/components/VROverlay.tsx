import { useState } from "react";

interface VROverlayProps {
  vrSupported: boolean;
  onEnterVR: () => void;
}

export function VROverlay({ vrSupported, onEnterVR }: VROverlayProps) {
  const [isHidden, setIsHidden] = useState(false);

  const handleEnterVR = async () => {
    if (vrSupported) {
      try {
        await onEnterVR();
        setIsHidden(true);
      } catch (error) {
        console.error("VR Session Error:", error);
      }
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      className="vr-overlay"
      role="dialog"
      aria-labelledby="welcome-title"
      aria-hidden={isHidden}
    >
      <h1 id="welcome-title">Welcome to FeexSystems VR</h1>
      <p>
        Explore our AI refinery in virtual reality or navigate using keyboard
        controls.
      </p>
      <button
        className="vr-button"
        onClick={handleEnterVR}
        disabled={!vrSupported}
        aria-label={vrSupported ? "Enter VR mode" : "VR not supported"}
      >
        {vrSupported ? "Enter VR" : "VR Not Supported"}
      </button>
      <p className="mt-4 text-sm">
        Keyboard: Use Arrow keys to navigate, Enter to select panels.
      </p>
    </div>
  );
}
