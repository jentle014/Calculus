import React, { useState, useRef, useEffect } from 'react';
import { Crop, RotateCw, Check, X, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  onCancel: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  onCancel
}) => {
  const [rotation, setRotation] = useState<number>(0);
  // Crop area percentages (0 to 100)
  const [cropTop, setCropTop] = useState<number>(0);
  const [cropBottom, setCropBottom] = useState<number>(0);
  const [cropLeft, setCropLeft] = useState<number>(0);
  const [cropRight, setCropRight] = useState<number>(0);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setRotation(0);
    setCropTop(0);
    setCropBottom(0);
    setCropLeft(0);
    setCropRight(0);
  };

  const applyCropAndExport = () => {
    const img = imgRef.current;
    if (!img) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

      // Handle orientation dimensions
      const isRotated90 = rotation === 90 || rotation === 270;
      const rotW = isRotated90 ? naturalH : naturalW;
      const rotH = isRotated90 ? naturalW : naturalH;

      // Calculate cropped pixel coordinates on rotated space
      const cropX = (cropLeft / 100) * rotW;
      const cropY = (cropTop / 100) * rotH;
      const cropW = Math.max(10, rotW - cropX - (cropRight / 100) * rotW);
      const cropH = Math.max(10, rotH - cropY - (cropBottom / 100) * rotH);

      canvas.width = cropW;
      canvas.height = cropH;

      // Translate context to center for rotation transform
      ctx.save();
      ctx.translate(cropW / 2, cropH / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw initial unrotated image relative to center
      if (rotation === 0) {
        ctx.drawImage(img, -cropX - cropW / 2, -cropY - cropH / 2, naturalW, naturalH);
      } else if (rotation === 90) {
        ctx.drawImage(img, -cropY - cropH / 2, -(rotW - cropX - cropW) - cropW / 2, naturalW, naturalH);
      } else if (rotation === 180) {
        ctx.drawImage(img, -(rotW - cropX - cropW) - cropW / 2, -(rotH - cropY - cropH) - cropH / 2, naturalW, naturalH);
      } else if (rotation === 270) {
        ctx.drawImage(img, -(rotH - cropY - cropH) - cropH / 2, -cropX - cropW / 2, naturalW, naturalH);
      }

      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onCropComplete(croppedDataUrl);
    } catch (e) {
      console.error('Failed to crop image canvas:', e);
      // Fallback: pass original image if canvas export fails
      onCropComplete(imageSrc);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#09090e] border border-[#262635] shadow-2xl p-4 sm:p-5 flex flex-col space-y-4 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1f1f2a]">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-[#e5c158]" />
            <h3 className="text-sm font-bold font-classical text-white">
              Crop & Rotate Math Image
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-[#1a1a24] text-[#a0a0b0] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cropping Canvas Preview Container */}
        <div className="relative w-full h-64 sm:h-72 bg-black rounded-xl overflow-hidden border border-[#2a2a3a] flex items-center justify-center select-none">
          <div
            className="relative transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              className="max-h-60 sm:max-h-64 object-contain pointer-events-none"
            />
          </div>

          {/* Semi-transparent Dark Mask for Crop Boundary */}
          <div
            className="absolute inset-0 pointer-events-none border-2 border-[#e5c158] shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] rounded-md transition-all"
            style={{
              top: `${cropTop}%`,
              bottom: `${cropBottom}%`,
              left: `${cropLeft}%`,
              right: `${cropRight}%`
            }}
          >
            <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded bg-black/80 border border-[#e5c158]/50 text-[9px] font-mono text-[#e5c158]">
              Crop Focus
            </div>
          </div>
        </div>

        {/* Sliders for Top/Bottom/Left/Right Crop Margins */}
        <div className="space-y-2 bg-[#101017] p-3 rounded-xl border border-[#1f1f2b] text-[11px] font-mono">
          <div className="flex items-center justify-between text-[#a0a0b0] pb-1 border-b border-[#1c1c28]">
            <span>Adjust Crop Margins</span>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[#e5c158] hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
            <div>
              <div className="flex justify-between text-[10px] text-[#a0a0b0] mb-0.5">
                <span>Top Trim</span>
                <span>{cropTop}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={cropTop}
                onChange={(e) => setCropTop(Number(e.target.value))}
                className="w-full accent-[#e5c158] bg-[#222230] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a0a0b0] mb-0.5">
                <span>Bottom Trim</span>
                <span>{cropBottom}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={cropBottom}
                onChange={(e) => setCropBottom(Number(e.target.value))}
                className="w-full accent-[#e5c158] bg-[#222230] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a0a0b0] mb-0.5">
                <span>Left Trim</span>
                <span>{cropLeft}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={cropLeft}
                onChange={(e) => setCropLeft(Number(e.target.value))}
                className="w-full accent-[#e5c158] bg-[#222230] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a0a0b0] mb-0.5">
                <span>Right Trim</span>
                <span>{cropRight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={cropRight}
                onChange={(e) => setCropRight(Number(e.target.value))}
                className="w-full accent-[#e5c158] bg-[#222230] h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handleRotate}
            className="px-3 py-2 rounded-xl bg-[#14141f] hover:bg-[#1e1e2d] border border-[#2a2a3a] text-xs font-mono text-white flex items-center gap-1.5 transition-all"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>Rotate 90°</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2 rounded-xl bg-[#14141f] hover:bg-[#1e1e2d] border border-[#2a2a3a] text-xs font-mono text-[#a0a0b0] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={applyCropAndExport}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-xs font-classical flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Cropping...' : 'Apply Crop & Attach'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
