import { GENRES, STATUSES } from '@/types/book';

export interface AuthValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateEmail(email: string): string | undefined {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

export function validatePassword(password: string, isRegister: boolean = false): string | undefined {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  if (isRegister && password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return undefined;
}

export function validateConfirmPassword(confirmPassword: string, password: string): string | undefined {
  if (!confirmPassword || confirmPassword.length === 0) {
    return 'Confirm password is required';
  }
  if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return undefined;
}

export interface BookValidationErrors {
  title?: string;
  author?: string;
  genre?: string;
  status?: string;
  rating?: string;
  notes?: string;
}

export function validateTitle(title: string): string | undefined {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.length > 100) {
    return 'Title must be at most 100 characters';
  }
  return undefined;
}

export function validateAuthor(author: string): string | undefined {
  if (!author || author.trim().length === 0) {
    return 'Author is required';
  }
  if (author.length > 60) {
    return 'Author must be at most 60 characters';
  }
  return undefined;
}

export function validateGenre(genre: string): string | undefined {
  if (!genre || genre.trim().length === 0 || genre === 'Choose genre') {
    return 'Please choose a genre';
  }
  if (!GENRES.includes(genre as any)) {
    return 'Please choose a genre';
  }
  return undefined;
}

export function validateStatus(status: string): string | undefined {
  if (!status || status.trim().length === 0 || status === 'Choose status') {
    return 'Please choose a status';
  }
  if (!STATUSES.includes(status as any)) {
    return 'Please choose a status';
  }
  return undefined;
}

export function validateRating(rating?: string | number | null): string | undefined {
  if (rating === undefined || rating === null || rating === '') {
    return undefined;
  }
  const ratingStr = String(rating).trim();
  if (ratingStr === '') {
    return undefined;
  }
  // Must be a whole number between 0 and 5
  if (!/^[0-5]$/.test(ratingStr)) {
    return 'Rating must be a whole number from 0 to 5';
  }
  return undefined;
}

export function validateNotes(notes?: string | null): string | undefined {
  if (!notes) {
    return undefined;
  }
  if (notes.length > 300) {
    return 'Notes must be at most 300 characters';
  }
  return undefined;
}
