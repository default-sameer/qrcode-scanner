"use client";

import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useCallback, useState } from "react";

export default function Home() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [scanResult, setScanResult] = useState<IDetectedBarcode[]>([]);

  const highlightCodeOnCanvas = useCallback(
    (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      detectedCodes.forEach((detectedCode) => {
        const { boundingBox } = detectedCode;
        const cornerSize = 20;
        const lineWidth = 4;

        ctx.strokeStyle = "#10B981"; // Green color for corners
        ctx.lineWidth = lineWidth;

        const x = boundingBox.x;
        const y = boundingBox.y;
        const w = boundingBox.width;
        const h = boundingBox.height;

        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(x, y + cornerSize);
        ctx.lineTo(x, y);
        ctx.lineTo(x + cornerSize, y);
        ctx.stroke();

        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(x + w - cornerSize, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + cornerSize);
        ctx.stroke();

        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(x, y + h - cornerSize);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + cornerSize, y + h);
        ctx.stroke();

        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(x + w - cornerSize, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w, y + h - cornerSize);
        ctx.stroke();

        // Scanning line (subtle green)
        const midY = y + h / 2;
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, midY);
        ctx.lineTo(x + w, midY);
        ctx.stroke();
      });
    },
    []
  );

  const handleScan = useCallback((data: IDetectedBarcode[]) => {
    console.log("🚀 ~ Scanned data:", data);
    setScanResult(data);
  }, []);

  const handleError = useCallback((err: unknown) => {
    console.error("Scanner Error:", err);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">QR Code Scanner</h1>
        <p className="text-slate-400">Position the QR code within the frame</p>
      </div>

      {/* Scanner Container */}
      <div className="relative w-full max-w-md">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>

        {/* Scanner wrapper with border and shadow */}
        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
          {/* Scanner area */}
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black">
            {isCameraOn && (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                components={{
                  tracker: highlightCodeOnCanvas,
                  finder: false,
                  zoom: true,
                }}
                constraints={{
                  facingMode: "environment",
                }}
                styles={{
                  container: {
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.75rem",
                  },
                  video: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  },
                }}
                formats={["qr_code", "code_128"]}
              />
            )}
          </div>

          {/* Status indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 justify-center">
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isCameraOn ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                  }`}
                ></div>
                <CameraSwitch
                  enabled={isCameraOn}
                  onChange={() => setIsCameraOn((s) => !s)}
                />
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">
                {scanResult.length > 0 ? "Code Detected!" : "Scanning..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {scanResult.length > 0 && (
        <div className="mt-6 w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">
            Scan Results
          </h2>
          <div className="space-y-3">
            {scanResult.map((result, index) => (
              <div
                key={index}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    {result.format}
                  </span>
                  <span className="text-xs text-slate-400">#{index + 1}</span>
                </div>
                <p className="text-sm text-white font-mono break-all">
                  {result.rawValue}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 text-center max-w-md">
        <p className="text-sm text-slate-400">
          Make sure the QR code is well-lit and within the camera frame
        </p>
      </div>
    </div>
  );
}

const CameraSwitch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) => {
  return (
    <>
      <label
        htmlFor="cameraToggle"
        className="relative block h-6 w-12 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:transparent] has-checked:bg-green-500 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={enabled}
          onChange={onChange}
          id="cameraToggle"
          className="peer sr-only"
        />

        <span className="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
      </label>
    </>
  );
};
