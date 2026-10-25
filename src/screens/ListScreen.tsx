import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/contexts/BooksContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Header } from '@/components/layout/Header';
import { BookForm } from '@/components/book/BookForm';
import { BookItem } from '@/components/book/BookItem';
import { BookFilter } from '@/components/book/BookFilter';
import { BookSummary } from '@/components/book/BookSummary';
import { Card } from '@/components/common/Card';
import { filterBooks } from '@/utils/helpers';
import { BookFormData } from '@/types/book';

export const ListScreen: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { books, loading: booksLoading, addBook, toggleFavorite, bookError, setBookError } = useBooks();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Form add state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter state
  const [genreFilter, setGenreFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Không hiển thị bất kỳ nội dung nào khi đang kiểm tra trạng thái đăng nhập (tránh flash screen)
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Nếu không đăng nhập, quay về Home
  if (!user) {
    return null;
  }

  const handleAddBook = async (formData: BookFormData) => {
    setSuccessMessage(null);
    setBookError(null);
    try {
      await addBook(formData);
      setSuccessMessage('Book added');
    } catch {
      // Lỗi hiển thị qua error-book
    }
  };

  const handleClearFilters = () => {
    setGenreFilter('All');
    setStatusFilter('All');
    setFavoritesOnly(false);
    setSearchQuery('');
  };

  // Áp dụng bộ lọc kết hợp
  const filteredBooks = filterBooks(
    books,
    genreFilter,
    statusFilter,
    favoritesOnly,
    searchQuery
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View testID="list-screen" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Section A: Add a Book */}
          <BookForm
            onSubmit={handleAddBook}
            successMessage={successMessage}
            errorMessage={bookError}
          />

          {/* Section C: Filter, Search and Summary */}
          <BookFilter
            genre={genreFilter}
            setGenre={setGenreFilter}
            status={statusFilter}
            setStatus={setStatusFilter}
            favoritesOnly={favoritesOnly}
            setFavoritesOnly={setFavoritesOnly}
            search={searchQuery}
            setSearch={setSearchQuery}
            onClear={handleClearFilters}
          />

          <BookSummary filteredBooks={filteredBooks} />

          {/* Section B: The List */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              Danh sách sách ({filteredBooks.length})
            </Text>

            {booksLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text style={styles.loadingText}>Đang tải danh sách sách...</Text>
              </View>
            ) : filteredBooks.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>📖</Text>
                <Text testID="books-empty" style={styles.emptyText}>
                  No books found
                </Text>
                <Text style={styles.emptySubtext}>
                  {books.length === 0
                    ? 'Bạn chưa thêm cuốn sách nào. Hãy thêm cuốn sách đầu tiên của bạn ở form trên!'
                    : 'Không tìm thấy sách nào phù hợp với bộ lọc hiện tại.'}
                </Text>
              </Card>
            ) : (
              filteredBooks.map((book) => (
                <BookItem
                  key={book.id}
                  book={book}
                  onPress={() => navigation.navigate('Detail', { bookId: book.id })}
                  onToggleFavorite={() => toggleFavorite(book.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  listSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  loadingBox: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 14,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
});
