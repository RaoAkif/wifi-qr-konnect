import React, { useState } from 'react';
import Scanner from './components/Scanner';
import ResultCard from './components/ResultCard';
import { scanQrCode } from './services/qrService';
import { WifiData } from './types';
import { Area } from 'react-easy-crop/types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WifiData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (imageSrc: string, crop: Area) => {
    setLoading(true);
    setError(null);
    setData(null);

    // Small delay to allow UI to show loading state if processing is fast
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = await scanQrCode(imageSrc, crop);

    if (result.success && result.data) {
      setData(result.data);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-green-600 to-green-500 rounded-b-[3rem] shadow-lg z-0"></div>

      <main className="flex-grow flex flex-col items-center justify-center p-6 z-10 w-full max-w-lg mx-auto">
        
        <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-md mb-2">WiFi QR Decoder</h1>
            {!data && <p className="text-green-100 text-opacity-90">Crop and scan to connect</p>}
        </header>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center animate-pulse border border-gray-100">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Processing Image...</p>
          </div>
        ) : data ? (
          <ResultCard data={data} onReset={handleReset} />
        ) : (
          <div className="flex flex-col gap-6 w-full items-center">
            <Scanner onScan={handleScan} />
            {error && (
              <div className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 text-sm text-center animate-bounce">
                {error}
              </div>
            )}
          </div>
        )}

      </main>
      
      {/* Simple footer for spacing on mobile */}
      <footer className="h-4 w-full"></footer>
    </div>
  );
};

export default App;
