import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { GENRES, STATUSES } from '@/types/book';
import { Card } from '../common/Card';

interface BookFilterProps {
  genre: string;
  setGenre: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (val: boolean) => void;
  search: string;
  setSearch: (val: string) => void;
  onClear: () => void;
}

export const BookFilter: React.FC<BookFilterProps> = ({
  genre,
  setGenre,
  status,
  setStatus,
  favoritesOnly,
  setFavoritesOnly,
  search,
  setSearch,
  onClear,
}) => {
  const genreOptions = ['All', ...GENRES];
  const statusOptions = ['All', ...STATUSES];

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Bộ lọc & Tìm kiếm</Text>
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm theo tiêu đề hoặc tác giả..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          autoCapitalize="none"
        />
      </View>

      {/* Genre Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Thể loại (Genre):</Text>
        <View style={styles.chipsRow}>
          {genreOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setGenre(opt)}
              style={[
                styles.chip,
                (genre === opt || (!genre && opt === 'All')) ? styles.activeChip : null,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  (genre === opt || (!genre && opt === 'All')) ? styles.activeChipText : null,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Status Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Trạng thái (Status):</Text>
        <View style={styles.chipsRow}>
          {statusOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setStatus(opt)}
              style={[
                styles.chip,
                (status === opt || (!status && opt === 'All')) ? styles.activeChip : null,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  (status === opt || (!status && opt === 'All')) ? styles.activeChipText : null,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Favorites Only Switch */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Chỉ sách yêu thích (Favorites only)</Text>
        <Switch
          value={favoritesOnly}
          onValueChange={setFavoritesOnly}
          trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
          thumbColor={favoritesOnly ? '#2563eb' : '#f8fafc'}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  clearBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeChip: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#ffffff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
});
