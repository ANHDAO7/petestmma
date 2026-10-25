import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './AuthContext';
import { Book, BookFormData, Genre, Status } from '@/types/book';
import { generateBookDocId, sortBooks } from '@/utils/helpers';

interface BooksContextType {
  books: Book[];
  loading: boolean;
  bookError: string | null;
  setBookError: (error: string | null) => void;
  addBook: (data: BookFormData) => Promise<void>;
  updateBook: (bookId: string, data: BookFormData) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  toggleFavorite: (bookId: string) => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookError, setBookError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'books'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedBooks: Book[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedBooks.push({
            id: docSnap.id,
            userId: data.userId,
            title: data.title,
            author: data.author,
            genre: data.genre as Genre,
            status: data.status as Status,
            rating: data.rating !== undefined ? data.rating : null,
            favorite: Boolean(data.favorite),
            notes: data.notes || '',
            createdAt: data.createdAt,
          });
        });
        // Tự động sắp xếp alphabet theo Title, sau đó Author
        setBooks(sortBooks(loadedBooks));
        setLoading(false);
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        setBookError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addBook = async (formData: BookFormData): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to add a book.');
    }
    setBookError(null);

    // Kiểm tra trùng lặp Title + Author (không phân biệt hoa/thường) trên cùng tài khoản
    const isDuplicate = books.some(
      (b) =>
        b.title.trim().toLowerCase() === formData.title.trim().toLowerCase() &&
        b.author.trim().toLowerCase() === formData.author.trim().toLowerCase()
    );
    if (isDuplicate) {
      const err = 'A book with this title and author already exists.';
      setBookError(err);
      throw new Error(err);
    }

    const docId = generateBookDocId(user.uid, formData.title, formData.author);
    const docRef = doc(db, 'books', docId);

    const newBook = {
      id: docId,
      userId: user.uid,
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre,
      status: formData.status,
      rating: formData.rating && formData.rating !== '' ? parseInt(formData.rating, 10) : null,
      favorite: false,
      notes: formData.notes ? formData.notes.trim() : '',
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(docRef, newBook);
    } catch (err: any) {
      const message = err.message || 'Failed to add book to Firestore.';
      setBookError(message);
      throw new Error(message);
    }
  };

  const updateBook = async (bookId: string, formData: BookFormData): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to update a book.');
    }
    setBookError(null);

    const existingBook = books.find((b) => b.id === bookId);
    if (!existingBook) {
      throw new Error('Book not found.');
    }

    // Kiểm tra trùng lặp với cuốn sách khác nếu đổi tên hoặc tác giả
    const isDuplicateOther = books
      .filter((b) => b.id !== bookId)
      .some(
        (b) =>
          b.title.trim().toLowerCase() === formData.title.trim().toLowerCase() &&
          b.author.trim().toLowerCase() === formData.author.trim().toLowerCase()
      );
    if (isDuplicateOther) {
      const err = 'A book with this title and author already exists.';
      setBookError(err);
      throw new Error(err);
    }

    const newDocId = generateBookDocId(user.uid, formData.title, formData.author);

    try {
      if (newDocId !== bookId) {
        // Tiêu đề hoặc Tác giả bị đổi -> Tạo doc mới với ID mới
        const updatedBook = {
          id: newDocId,
          userId: user.uid,
          title: formData.title.trim(),
          author: formData.author.trim(),
          genre: formData.genre,
          status: formData.status,
          rating: formData.rating && formData.rating !== '' ? parseInt(formData.rating, 10) : null,
          favorite: existingBook.favorite,
          notes: formData.notes ? formData.notes.trim() : '',
          createdAt: existingBook.createdAt || serverTimestamp(),
        };

        await setDoc(doc(db, 'books', newDocId), updatedBook);
        await deleteDoc(doc(db, 'books', bookId));
      } else {
        // Không đổi Title và Author -> Cập nhật trực tiếp
        const updates: any = {
          title: formData.title.trim(),
          author: formData.author.trim(),
          genre: formData.genre,
          status: formData.status,
          rating: formData.rating && formData.rating !== '' ? parseInt(formData.rating, 10) : null,
          notes: formData.notes ? formData.notes.trim() : '',
        };
        await updateDoc(doc(db, 'books', bookId), updates);
      }
    } catch (err: any) {
      const message = err.message || 'Failed to update book.';
      setBookError(message);
      throw new Error(message);
    }
  };

  const deleteBook = async (bookId: string): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to delete a book.');
    }
    setBookError(null);

    try {
      await deleteDoc(doc(db, 'books', bookId));
    } catch (err: any) {
      const message = err.message || 'Failed to delete book.';
      setBookError(message);
      throw new Error(message);
    }
  };

  const toggleFavorite = async (bookId: string): Promise<void> => {
    if (!user) return;
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    try {
      await updateDoc(doc(db, 'books', bookId), {
        favorite: !targetBook.favorite,
      });
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      setBookError(err.message || 'Failed to update favorite status.');
    }
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        bookError,
        setBookError,
        addBook,
        updateBook,
        deleteBook,
        toggleFavorite,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = (): BooksContextType => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};
