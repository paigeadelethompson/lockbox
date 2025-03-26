import { authenticator } from 'otplib';
import { Entry } from '../types/Entry';

export class TotpService {
  static generateSecret(): string {
    return authenticator.generateSecret();
  }

  static generateQRCode(entry: Entry): string {
    if (!entry.totp) {
      throw new Error('Entry does not have TOTP configured');
    }

    const { secret, algorithm = 'SHA1', digits = 6, period = 30 } = entry.totp;
    const otpauth = authenticator.keyuri(
      entry.username,
      entry.title,
      secret,
      {
        algorithm,
        digits,
        period,
      }
    );

    return otpauth;
  }

  static verifyToken(entry: Entry, token: string): boolean {
    if (!entry.totp) {
      throw new Error('Entry does not have TOTP configured');
    }

    const { secret, algorithm = 'SHA1', digits = 6, period = 30 } = entry.totp;
    return authenticator.verify({
      token,
      secret,
      algorithm,
      digits,
      period,
    });
  }

  static generateToken(entry: Entry): string {
    if (!entry.totp) {
      throw new Error('Entry does not have TOTP configured');
    }

    const { secret, algorithm = 'SHA1', digits = 6, period = 30 } = entry.totp;
    return authenticator.generate(secret, {
      algorithm,
      digits,
      period,
    });
  }

  static parseQRCode(qrCode: string): Partial<Entry> {
    try {
      const url = new URL(qrCode);
      if (url.protocol !== 'otpauth:') {
        throw new Error('Invalid QR code format');
      }

      const params = new URLSearchParams(url.search);
      const secret = params.get('secret');
      const algorithm = params.get('algorithm') as 'SHA1' | 'SHA256' | 'SHA512' | undefined;
      const digits = params.get('digits') ? parseInt(params.get('digits')!) : undefined;
      const period = params.get('period') ? parseInt(params.get('period')!) : undefined;

      if (!secret) {
        throw new Error('Missing secret in QR code');
      }

      return {
        title: decodeURIComponent(url.pathname.slice(1)),
        totp: {
          secret,
          algorithm,
          digits,
          period,
        },
      };
    } catch (error) {
      throw new Error('Failed to parse QR code');
    }
  }
} 