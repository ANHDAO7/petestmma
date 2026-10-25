import { Book, Status, StatusBreakdown } from '@/types/book';

/**
 * Tạo document ID xác định từ userId, title và author để chống trùng lặp tại Firestore
 */
export function generateBookDocId(userId: string, title: string, author: string): string {
  const cleanTitle = title.trim().toLowerCase().replace(/[\s\W]+/g, '_');
  const cleanAuthor = author.trim().toLowerCase().replace(/[\s\W]+/g, '_');
  return `${userId}__${cleanTitle}__${cleanAuthor}`;
}

/**
 * Sắp xếp danh sách sách theo Title (không phân biệt hoa thường).
 * Nếu Title bằng nhau thì sắp xếp theo Author (không phân biệt hoa thường).
 */
export function sortBooks(books: Book[]): Book[] {
  return [...books].sort((a, b) => {
    const titleA = a.title.trim().toLowerCase();
    const titleB = b.title.trim().toLowerCase();
    const titleCompare = titleA.localeCompare(titleB);
    if (titleCompare !== 0) {
      return titleCompare;
    }
    const authorA = a.author.trim().toLowerCase();
    const authorB = b.author.trim().toLowerCase();
    return authorA.localeCompare(authorB);
  });
}

/**
 * Lọc danh sách sách theo Genre, Status, Favorites only và Search (kết hợp logic AND)
 */
export function filterBooks(
  books: Book[],
  genreFilter: string,
  statusFilter: string,
  favoritesOnly: boolean,
  searchQuery: string
): Book[] {
  const cleanSearch = searchQuery.trim().toLowerCase();

  return books.filter((book) => {
    // 1. Genre filter
    if (genreFilter && genreFilter !== 'All') {
      if (book.genre !== genreFilter) {
        return false;
      }
    }

    // 2. Status filter
    if (statusFilter && statusFilter !== 'All') {
      if (book.status !== statusFilter) {
        return false;
      }
    }

    // 3. Favorites only filter
    if (favoritesOnly) {
      if (!book.favorite) {
        return false;
      }
    }

    // 4. Search filter (contains in title or author, case-insensitive, trimmed)
    if (cleanSearch.length > 0) {
      const matchTitle = book.title.toLowerCase().includes(cleanSearch);
      const matchAuthor = book.author.toLowerCase().includes(cleanSearch);
      if (!matchTitle && !matchAuthor) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Tính toán Summary trên danh sách đã lọc:
 * - book-count: tổng số sách đang hiển thị
 * - favorite-count: số sách yêu thích đang hiển thị
 * - status breakdown: một dòng cho mỗi status xuất hiện, sắp xếp giảm dần theo số lượng.
 *   Nếu bằng nhau: To Read -> Reading -> Finished.
 */
export function calculateSummary(books: Book[]): {
  total: number;
  favorites: number;
  breakdown: StatusBreakdown[];
} {
  const total = books.length;
  const favorites = books.filter((b) => b.favorite).length;

  const counts: Record<Status, number> = {
    'To Read': 0,
    'Reading': 0,
    'Finished': 0,
  };

  for (const book of books) {
    if (book.status in counts) {
      counts[book.status]++;
    }
  }

  const priorityOrder: Record<Status, number> = {
    'To Read': 1,
    'Reading': 2,
    'Finished': 3,
  };

  const statusList: Status[] = ['To Read', 'Reading', 'Finished'];
  const breakdown: StatusBreakdown[] = statusList
    .filter((status) => counts[status] > 0)
    .map((status) => ({ status, count: counts[status] }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return priorityOrder[a.status] - priorityOrder[b.status];
    });

  return {
    total,
    favorites,
    breakdown,
  };
}
