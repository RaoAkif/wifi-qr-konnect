import React, { useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';

interface ScannerProps {
  onScan: (imageSrc: string, crop: Area) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Cropper State
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Reset value so same file can be selected again
    e.target.value = ''; 
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleScan = () => {
    if (imageSrc && croppedAreaPixels) {
      onScan(imageSrc, croppedAreaPixels);
      // We don't clear imageSrc here to allow re-cropping if scan fails, 
      // but the parent might handle resets.
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  if (imageSrc) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="relative flex-grow w-full bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
                containerClassName: "bg-gray-900",
                mediaClassName: ""
            }}
          />
        </div>
        
        {/* Cropper Controls */}
        <div className="bg-white p-6 pb-10 flex flex-col gap-4 rounded-t-2xl shadow-2xl z-50">
           <div className="flex flex-col gap-2">
             <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Zoom</label>
             <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
           </div>
           
           <div className="flex gap-4 mt-2">
             <button 
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
             >
                Cancel
             </button>
             <button 
                onClick={handleScan}
                className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-600/30 hover:bg-green-700 transition-all active:scale-95"
             >
                Scan Code
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div 
        className={`relative group cursor-pointer border-2 border-dashed rounded-xl transition-all duration-300 p-10 flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-md
            ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Scan QR Code</h3>
        <p className="text-gray-500 text-center text-sm mb-6">
          Tap to capture or upload a WiFi QR code image
        </p>

        <button className="px-6 py-2 bg-green-600 text-white rounded-full font-medium shadow-lg shadow-green-600/30 hover:bg-green-700 transition-all active:scale-95">
          Select Image
        </button>

        <input 
            type="file" 
            ref={inputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
        />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">Cropping & Processing runs locally</p>
      </div>
    </div>
  );
};

export default Scanner;