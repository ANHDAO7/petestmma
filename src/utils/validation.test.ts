import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTitle,
  validateAuthor,
  validateGenre,
  validateStatus,
  validateRating,
  validateNotes,
} from './validation';

describe('Auth Validation', () => {
  describe('Email', () => {
    it('báo lỗi khi email trống', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail('   ')).toBe('Email is required');
    });

    it('báo lỗi khi email không đúng định dạng', () => {
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
      expect(validateEmail('user@')).toBe('Please enter a valid email address');
      expect(validateEmail('@domain.com')).toBe('Please enter a valid email address');
    });

    it('hợp lệ với email chuẩn', () => {
      expect(validateEmail('grader@example.com')).toBeUndefined();
    });
  });

  describe('Password', () => {
    it('báo lỗi khi password trống', () => {
      expect(validatePassword('')).toBe('Password is required');
    });

    it('báo lỗi khi password dưới 6 ký tự ở Register', () => {
      expect(validatePassword('12345', true)).toBe('Password must be at least 6 characters');
    });

    it('cho phép password dưới 6 ký tự ở Login nếu có nhập (chỉ check empty)', () => {
      expect(validatePassword('12345', false)).toBeUndefined();
    });

    it('hợp lệ khi password >= 6 ký tự', () => {
      expect(validatePassword('Test1234!', true)).toBeUndefined();
    });
  });

  describe('Confirm Password', () => {
    it('báo lỗi khi confirm password trống', () => {
      expect(validateConfirmPassword('', 'Test1234!')).toBe('Confirm password is required');
    });

    it('báo lỗi khi confirm password không khớp', () => {
      expect(validateConfirmPassword('Different123!', 'Test1234!')).toBe('Passwords do not match');
    });

    it('hợp lệ khi khớp nhau', () => {
      expect(validateConfirmPassword('Test1234!', 'Test1234!')).toBeUndefined();
    });
  });
});

describe('Book Form Validation', () => {
  describe('Title', () => {
    it('báo lỗi khi title trống hoặc chỉ toàn khoảng trắng', () => {
      expect(validateTitle('')).toBe('Title is required');
      expect(validateTitle('    ')).toBe('Title is required');
    });

    it('báo lỗi khi title quá 100 ký tự', () => {
      const longTitle = 'A'.repeat(101);
      expect(validateTitle(longTitle)).toBe('Title must be at most 100 characters');
    });

    it('hợp lệ khi title từ 1 đến 100 ký tự', () => {
      expect(validateTitle('Dune')).toBeUndefined();
      expect(validateTitle('A'.repeat(100))).toBeUndefined();
    });
  });

  describe('Author', () => {
    it('báo lỗi khi author trống hoặc chỉ toàn khoảng trắng', () => {
      expect(validateAuthor('')).toBe('Author is required');
      expect(validateAuthor('   ')).toBe('Author is required');
    });

    it('báo lỗi khi author quá 60 ký tự', () => {
      const longAuthor = 'B'.repeat(61);
      expect(validateAuthor(longAuthor)).toBe('Author must be at most 60 characters');
    });

    it('hợp lệ khi author từ 1 đến 60 ký tự', () => {
      expect(validateAuthor('Frank Herbert')).toBeUndefined();
      expect(validateAuthor('B'.repeat(60))).toBeUndefined();
    });
  });

  describe('Genre', () => {
    it('báo lỗi khi chưa chọn genre', () => {
      expect(validateGenre('')).toBe('Please choose a genre');
      expect(validateGenre('Choose genre')).toBe('Please choose a genre');
      expect(validateGenre('Sci-Fi')).toBe('Please choose a genre');
    });

    it('hợp lệ khi chọn 1 trong 4 genre chuẩn', () => {
      expect(validateGenre('Fiction')).toBeUndefined();
      expect(validateGenre('Non-Fiction')).toBeUndefined();
      expect(validateGenre('Academic')).toBeUndefined();
      expect(validateGenre('Other')).toBeUndefined();
    });
  });

  describe('Status', () => {
    it('báo lỗi khi chưa chọn status', () => {
      expect(validateStatus('')).toBe('Please choose a status');
      expect(validateStatus('Choose status')).toBe('Please choose a status');
      expect(validateStatus('Completed')).toBe('Please choose a status');
    });

    it('hợp lệ khi chọn 1 trong 3 status chuẩn', () => {
      expect(validateStatus('To Read')).toBeUndefined();
      expect(validateStatus('Reading')).toBeUndefined();
      expect(validateStatus('Finished')).toBeUndefined();
    });
  });

  describe('Rating', () => {
    it('cho phép để trống rating', () => {
      expect(validateRating('')).toBeUndefined();
      expect(validateRating(undefined)).toBeUndefined();
      expect(validateRating(null)).toBeUndefined();
    });

    it('báo lỗi khi rating không phải số nguyên từ 0 đến 5', () => {
      expect(validateRating('6')).toBe('Rating must be a whole number from 0 to 5');
      expect(validateRating('-1')).toBe('Rating must be a whole number from 0 to 5');
      expect(validateRating('3.5')).toBe('Rating must be a whole number from 0 to 5');
      expect(validateRating('abc')).toBe('Rating must be a whole number from 0 to 5');
    });

    it('hợp lệ khi rating là số nguyên từ 0 đến 5', () => {
      expect(validateRating('0')).toBeUndefined();
      expect(validateRating('3')).toBeUndefined();
      expect(validateRating('5')).toBeUndefined();
    });
  });

  describe('Notes', () => {
    it('cho phép để trống notes', () => {
      expect(validateNotes('')).toBeUndefined();
      expect(validateNotes(undefined)).toBeUndefined();
    });

    it('báo lỗi khi notes quá 300 ký tự', () => {
      const longNotes = 'N'.repeat(301);
      expect(validateNotes(longNotes)).toBe('Notes must be at most 300 characters');
    });

    it('hợp lệ khi notes <= 300 ký tự', () => {
      expect(validateNotes('Great book!')).toBeUndefined();
      expect(validateNotes('N'.repeat(300))).toBeUndefined();
    });
  });
});
