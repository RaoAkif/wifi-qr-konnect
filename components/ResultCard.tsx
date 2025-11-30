import React, { useState } from 'react';
import { WifiData } from '../types';

interface ResultCardProps {
  data: WifiData;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  const { ssid, password, networkType, hidden } = data;
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
      {/* Green Top Border */}
      <div className="h-2 bg-green-600 w-full"></div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-normal text-gray-800 tracking-tight">Scanned Data</h2>
        </div>

        {/* Data Rows */}
        <div className="space-y-6">
          
          <div className="border-b border-gray-200 pb-4">
            <p className="text-xl font-medium text-gray-900 break-all">
              <span className="font-bold mr-2">SSID:</span> 
              {ssid}
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4 flex justify-between items-center group">
            <p className="text-xl font-medium text-gray-900 break-all flex-grow mr-2">
              <span className="font-bold mr-2">Password:</span>
              {password || <span className="text-gray-400 italic">None</span>}
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
             <p className="text-xl font-medium text-gray-900">
              <span className="font-bold mr-2">Network Type:</span>
              {networkType}
            </p>
          </div>

          <div className="pb-4">
             <p className="text-xl font-medium text-gray-900">
              <span className="font-bold mr-2">Hidden:</span>
              {hidden ? 'Yes' : 'No'}
            </p>
          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-sm leading-relaxed">
            Copy the password below and connect via your device settings.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
            {password ? (
                <button 
                    onClick={handleCopyPassword}
                    className={`w-full py-3 font-semibold rounded-lg shadow-md transition-all active:scale-95 duration-200 flex items-center justify-center gap-2
                    ${copied ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Password Copied!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy Password
                        </>
                    )}
                </button>
            ) : (
                <button disabled className="w-full py-3 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed">
                    No Password Required
                </button>
            )}

            <button 
                onClick={onReset}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors active:scale-95 duration-200"
            >
                Scan Another
            </button>
        </div>

      </div>
    </div>
  );
};

export default ResultCard;