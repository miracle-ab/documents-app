export type DocumentStatus = 'DRAFT' | 'SIGNED' | 'ARCHIVED';

export interface Document {
  id: number;
  title: string;
  author: string;
  status: DocumentStatus;
  updatedAt: string; // ISO
  content: string;
}
