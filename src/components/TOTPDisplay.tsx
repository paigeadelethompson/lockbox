import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TotpService } from '../services/totpService';
import { Entry } from '../types/Entry';

interface TOTPDisplayProps {
  entry: Entry;
  onVerify?: (isValid: boolean) => void;
}

export const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ entry, onVerify }) => {
  const [token, setToken] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!entry.totp) return;

    const generateToken = () => {
      const newToken = TotpService.generateToken(entry);
      setToken(newToken);
      setTimeLeft(30);
      setIsExpired(false);
    };

    generateToken();
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [entry]);

  const handleVerify = () => {
    if (!entry.totp) return;
    const isValid = TotpService.verifyToken(entry, token);
    onVerify?.(isValid);
  };

  if (!entry.totp) {
    return null;
  }

  const qrCode = TotpService.generateQRCode(entry);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-mono">{token}</div>
        <div className="text-sm text-gray-500">
          {timeLeft}s remaining
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <QRCodeSVG value={qrCode} size={200} />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleVerify}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Verify
        </button>
      </div>
    </div>
  );
}; 