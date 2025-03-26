import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { TotpService } from '../services/totpService';
import { Entry } from '../types/Entry';

interface QRScannerProps {
  onScan: (entry: Partial<Entry>) => void;
  onError?: (error: Error) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (result: string | null) => {
    if (result) {
      try {
        const entry = TotpService.parseQRCode(result);
        onScan(entry);
      } catch (error) {
        onError?.(error as Error);
      }
    }
  };

  const handleError = (error: Error) => {
    onError?.(error);
  };

  return (
    <div className="relative">
      {isScanning ? (
        <div className="w-full max-w-md mx-auto">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (result) {
                handleScan(result.getText());
              }
              if (error) {
                handleError(error);
              }
            }}
          />
          <button
            onClick={() => setIsScanning(false)}
            className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsScanning(true)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Scan QR Code
        </button>
      )}
    </div>
  );
}; 