import { useState, useCallback } from "react";
import { VRScene } from "../components/VRScene";
import { VRHeader } from "../components/VRHeader";
import { VROverlay } from "../components/VROverlay";

export default function Index() {
  const [vrSupported, setVRSupported] = useState(false);

  const handleVRReady = useCallback((supported: boolean) => {
    setVRSupported(supported);
  }, []);

  const handleEnterVR = useCallback(async () => {
    if (navigator.xr && vrSupported) {
      try {
        const session = await navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["hand-tracking"],
          optionalFeatures: ["local-floor"],
        });
        // VR session setup would be handled by the VRScene component
        console.log("VR session started", session);
      } catch (error) {
        console.error("Failed to start VR session:", error);
        throw error;
      }
    }
  }, [vrSupported]);

  return (
    <div className="relative w-full h-screen bg-background text-foreground overflow-hidden">
      <VRHeader />
      <VRScene onVRReady={handleVRReady} />
      <VROverlay vrSupported={vrSupported} onEnterVR={handleEnterVR} />
    </div>
  );
}
