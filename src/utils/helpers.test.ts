import { describe, it, expect } from 'vitest';
import { generateBookDocId, sortBooks, filterBooks, calculateSummary } from './helpers';
import { Book } from '@/types/book';

describe('Helpers', () => {
  describe('generateBookDocId', () => {
    it('tạo id duy nhất chuẩn hóa title và author không phân biệt hoa thường', () => {
      const id1 = generateBookDocId('user123', 'Dune', 'Frank Herbert');
      const id2 = generateBookDocId('user123', '  dune  ', 'FRANK HERBERT');
      expect(id1).toBe(id2);
      expect(id1).toBe('user123__dune__frank_herbert');
    });

    it('hai user khác nhau có docId khác nhau cho cùng một cuốn sách', () => {
      const id1 = generateBookDocId('user1', 'Dune', 'Frank Herbert');
      const id2 = generateBookDocId('user2', 'Dune', 'Frank Herbert');
      expect(id1).not.toBe(id2);
    });
  });

  describe('sortBooks', () => {
    const mockBooks: Book[] = [
      { id: '1', userId: 'u1', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fiction', status: 'Finished', favorite: true, createdAt: 1 },
      { id: '2', userId: 'u1', title: 'Atomic Habits', author: 'James Clear', genre: 'Non-Fiction', status: 'Reading', favorite: true, createdAt: 2 },
      { id: '3', userId: 'u1', title: 'clean code', author: 'Robert C. Martin', genre: 'Academic', status: 'To Read', favorite: false, createdAt: 3 },
      { id: '4', userId: 'u1', title: 'Clean Code', author: 'Uncle Bob', genre: 'Academic', status: 'To Read', favorite: false, createdAt: 4 },
    ];

    it('sắp xếp theo alphabet title (không phân biệt hoa thường), nếu bằng nhau thì theo author', () => {
      const sorted = sortBooks(mockBooks);
      expect(sorted[0].title.toLowerCase()).toBe('atomic habits');
      expect(sorted[1].title.toLowerCase()).toBe('clean code');
      expect(sorted[1].author).toBe('Robert C. Martin'); // 'r' comes before 'u'
      expect(sorted[2].title.toLowerCase()).toBe('clean code');
      expect(sorted[2].author).toBe('Uncle Bob');
      expect(sorted[3].title.toLowerCase()).toBe('the hobbit');
    });
  });

  describe('filterBooks', () => {
    const mockBooks: Book[] = [
      { id: '1', userId: 'u1', title: 'Dune', author: 'Frank Herbert', genre: 'Fiction', status: 'Reading', favorite: true, createdAt: 1 },
      { id: '2', userId: 'u1', title: 'Clean Code', author: 'Robert Martin', genre: 'Academic', status: 'To Read', favorite: false, createdAt: 2 },
      { id: '3', userId: 'u1', title: 'Atomic Habits', author: 'James Clear', genre: 'Non-Fiction', status: 'Reading', favorite: false, createdAt: 3 },
      { id: '4', userId: 'u1', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fiction', status: 'Finished', favorite: true, createdAt: 4 },
    ];

    it('lọc theo genre', () => {
      const result = filterBooks(mockBooks, 'Fiction', 'All', false, '');
      expect(result.length).toBe(2);
      expect(result.map(b => b.title)).toEqual(['Dune', 'The Hobbit']);
    });

    it('lọc theo status', () => {
      const result = filterBooks(mockBooks, 'All', 'Reading', false, '');
      expect(result.length).toBe(2);
      expect(result.map(b => b.title)).toEqual(['Dune', 'Atomic Habits']);
    });

    it('lọc theo favorites only', () => {
      const result = filterBooks(mockBooks, 'All', 'All', true, '');
      expect(result.length).toBe(2);
      expect(result.map(b => b.title)).toEqual(['Dune', 'The Hobbit']);
    });

    it('tìm kiếm theo title hoặc author không phân biệt hoa thường và bỏ khoảng trắng', () => {
      const result = filterBooks(mockBooks, 'All', 'All', false, '  dUnE  ');
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Dune');

      const resultAuthor = filterBooks(mockBooks, 'All', 'All', false, 'Herbert');
      expect(resultAuthor.length).toBe(1);
      expect(resultAuthor[0].author).toBe('Frank Herbert');
    });

    it('kết hợp cả 4 điều kiện với logic AND', () => {
      const result = filterBooks(mockBooks, 'Fiction', 'Reading', true, 'dune');
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Dune');

      // Nếu không thỏa mãn một điều kiện thì trả về rỗng
      const noMatch = filterBooks(mockBooks, 'Fiction', 'Finished', true, 'dune');
      expect(noMatch.length).toBe(0);
    });
  });

  describe('calculateSummary', () => {
    it('tính đúng số lượng sách, số favorites và breakdown theo thứ tự giảm dần và ưu tiên To Read -> Reading -> Finished', () => {
      const mockBooks: Book[] = [
        { id: '1', userId: 'u1', title: 'Book 1', author: 'A1', genre: 'Fiction', status: 'To Read', favorite: true, createdAt: 1 },
        { id: '2', userId: 'u1', title: 'Book 2', author: 'A2', genre: 'Fiction', status: 'Reading', favorite: false, createdAt: 2 },
        { id: '3', userId: 'u1', title: 'Book 3', author: 'A3', genre: 'Fiction', status: 'Finished', favorite: true, createdAt: 3 },
        { id: '4', userId: 'u1', title: 'Book 4', author: 'A4', genre: 'Fiction', status: 'Finished', favorite: false, createdAt: 4 },
      ];

      const summary = calculateSummary(mockBooks);
      expect(summary.total).toBe(4);
      expect(summary.favorites).toBe(2);
      // Finished has 2, To Read has 1, Reading has 1. Equal counts 1: To Read before Reading.
      expect(summary.breakdown).toEqual([
        { status: 'Finished', count: 2 },
        { status: 'To Read', count: 1 },
        { status: 'Reading', count: 1 },
      ]);
    });

    it('chỉ hiển thị các status có sách xuất hiện', () => {
      const mockBooks: Book[] = [
        { id: '1', userId: 'u1', title: 'Book 1', author: 'A1', genre: 'Fiction', status: 'To Read', favorite: false, createdAt: 1 },
      ];

      const summary = calculateSummary(mockBooks);
      expect(summary.breakdown).toEqual([{ status: 'To Read', count: 1 }]);
    });
  });
});
