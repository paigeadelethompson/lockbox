export interface Entry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  totp?: {
    secret: string;
    algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
    digits?: number;
    period?: number;
  };
  createdAt: number;
  customFields?: {
    key: string;
    value: string;
    isProtected: boolean;
  }[];
  attachments?: {
    name: string;
    data: ArrayBuffer;
    mimeType: string;
  }[];
} 