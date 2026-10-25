import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Book } from '@/types/book';
import { Card } from '../common/Card';
import { StarButton } from '../common/StarButton';

interface BookItemProps {
  book: Book;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const BookItem: React.FC<BookItemProps> = ({
  book,
  onPress,
  onToggleFavorite,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finished':
        return '#10b981';
      case 'Reading':
        return '#3b82f6';
      case 'To Read':
      default:
        return '#f59e0b';
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity
        testID="book-item"
        style={styles.touchArea}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>
              {book.title}
            </Text>
            <StarButton
              favorite={book.favorite}
              onPress={onToggleFavorite}
              size={26}
            />
          </View>
          <Text style={styles.author}>bởi {book.author}</Text>

          <View style={styles.tagsRow}>
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{book.genre}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(book.status)}20`, borderColor: getStatusColor(book.status) },
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor(book.status) }]}>
                {book.status}
              </Text>
            </View>
            {book.rating !== undefined && book.rating !== null ? (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {book.rating}/5</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  touchArea: {
    padding: 16,
  },
  content: {
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    lineHeight: 22,
  },
  author: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  genreBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  genreText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '700',
  },
});
