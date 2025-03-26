export interface Attachment {
  id: string;
  name: string;
  data: ArrayBuffer;
  mimeType: string;
}

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  icon?: string; // Font Awesome icon name
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
} 