import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Book } from '@/types/book';
import { calculateSummary } from '@/utils/helpers';
import { Card } from '../common/Card';

interface BookSummaryProps {
  filteredBooks: Book[];
}

export const BookSummary: React.FC<BookSummaryProps> = ({ filteredBooks }) => {
  const summary = calculateSummary(filteredBooks);

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
      <Text style={styles.title}>Thống kê danh sách</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tổng số sách</Text>
          <Text testID="book-count" style={styles.statValue}>
            {summary.total}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Sách yêu thích</Text>
          <Text testID="favorite-count" style={[styles.statValue, styles.favoriteValue]}>
            {summary.favorites}
          </Text>
        </View>
      </View>

      {summary.breakdown.length > 0 ? (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Phân loại theo trạng thái:</Text>
          {summary.breakdown.map((item) => (
            <View key={item.status} style={styles.breakdownRow}>
              <View style={styles.statusInfo}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                />
                <Text style={styles.statusName}>{item.status}</Text>
              </View>
              <Text style={styles.statusCount}>{item.count}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  favoriteValue: {
    color: '#d97706',
  },
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    gap: 6,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
  statusCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
});
