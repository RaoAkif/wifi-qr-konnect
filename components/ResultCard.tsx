import React from 'react';
import { WifiData } from '../types';

interface ResultCardProps {
  data: WifiData;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  const { ssid, password, networkType, hidden } = data;

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

          <div className="border-b border-gray-200 pb-4">
            <p className="text-xl font-medium text-gray-900 break-all">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M號3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          <p className="text-gray-500 text-sm leading-relaxed">
            You can connect to the WiFi network using the decoded information above.
          </p>
        </div>

        <button 
            onClick={onReset}
            className="mt-6 w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors active:scale-95 duration-200"
        >
            Scan Another
        </button>

      </div>
    </div>
  );
};

export default ResultCard;
