export type Genre = 'Fiction' | 'Non-Fiction' | 'Academic' | 'Other';
export const GENRES: Genre[] = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];

export type Status = 'To Read' | 'Reading' | 'Finished';
export const STATUSES: Status[] = ['To Read', 'Reading', 'Finished'];

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  genre: Genre;
  status: Status;
  rating?: number | null;
  favorite: boolean;
  notes?: string;
  createdAt: any;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  status: string;
  rating?: string;
  notes?: string;
}

export interface StatusBreakdown {
  status: Status;
  count: number;
}
