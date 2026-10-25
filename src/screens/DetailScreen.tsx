import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { useBooks } from '@/contexts/BooksContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StarButton } from '@/components/common/StarButton';
import { BookForm } from '@/components/book/BookForm';
import { BookFormData } from '@/types/book';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bookId } = route.params;

  const { books, updateBook, deleteBook, toggleFavorite, bookError, setBookError } = useBooks();
  const book = books.find((b) => b.id === bookId);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy cuốn sách này.</Text>
          <Button
            title="Quay lại danh sách"
            onPress={() => navigation.navigate('List')}
            style={styles.backBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdate = async (formData: BookFormData) => {
    setBookError(null);
    try {
      await updateBook(book.id, formData);
      setIsEditing(false);
    } catch {
      // Lỗi hiển thị qua error-book trong BookForm
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(book.id);
      setDeleteModalVisible(false);
      navigation.navigate('List');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể xóa sách.');
      setDeleting(false);
    }
  };

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('List')}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Quay lại danh sách</Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          /* Edit Mode */
          <BookForm
            initialValues={{
              title: book.title,
              author: book.author,
              genre: book.genre,
              status: book.status,
              rating: book.rating !== null && book.rating !== undefined ? String(book.rating) : '',
              notes: book.notes || '',
            }}
            submitButtonText="Save"
            onSubmit={handleUpdate}
            errorMessage={bookError}
            onCancel={() => {
              setIsEditing(false);
              setBookError(null);
            }}
          />
        ) : (
          /* View Mode */
          <Card style={styles.detailCard}>
            <View style={styles.headerRow}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>Tác giả: {book.author}</Text>
              </View>
              <StarButton
                favorite={book.favorite}
                onPress={() => toggleFavorite(book.id)}
                size={32}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thể loại (Genre):</Text>
                <View style={styles.badgeBox}>
                  <Text style={styles.badgeText}>{book.genre}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Trạng thái (Status):</Text>
                <View
                  style={[
                    styles.badgeBox,
                    {
                      backgroundColor: `${getStatusColor(book.status)}20`,
                      borderColor: getStatusColor(book.status),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: getStatusColor(book.status) },
                    ]}
                  >
                    {book.status}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Đánh giá (Rating):</Text>
                <Text style={styles.infoValue}>
                  {book.rating !== null && book.rating !== undefined
                    ? `★ ${book.rating} / 5`
                    : 'Chưa đánh giá'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Yêu thích (Favorite):</Text>
                <Text style={styles.infoValue}>
                  {book.favorite ? 'Đã yêu thích (Có)' : 'Không'}
                </Text>
              </View>

              <View style={styles.notesSection}>
                <Text style={styles.infoLabel}>Ghi chú (Notes):</Text>
                <Text style={styles.notesText}>
                  {book.notes ? book.notes : '(Không có ghi chú)'}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Button
                title="Edit"
                variant="primary"
                onPress={() => setIsEditing(true)}
                style={styles.editBtn}
              />
              <Button
                title="Delete"
                variant="danger"
                onPress={() => setDeleteModalVisible(true)}
                style={styles.deleteBtn}
              />
            </View>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Xác nhận xóa</Text>
              <Text style={styles.modalMessage}>
                Bạn có chắc chắn muốn xóa cuốn sách "{book.title}" không? Hành động này không thể hoàn tác.
              </Text>
              <View style={styles.modalButtons}>
                <Button
                  title="Hủy"
                  variant="outline"
                  onPress={() => setDeleteModalVisible(false)}
                  style={styles.modalCancelBtn}
                />
                <Button
                  title="Xóa sách"
                  variant="danger"
                  loading={deleting}
                  onPress={confirmDelete}
                  style={styles.modalConfirmBtn}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
  },
  topNavRow: {
    marginBottom: 12,
  },
  backLink: {
    paddingVertical: 6,
  },
  backLinkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  backBtn: {
    minWidth: 160,
  },
  detailCard: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 4,
  },
  author: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  infoGrid: {
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  badgeBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  notesSection: {
    gap: 6,
    marginTop: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  editBtn: {
    flex: 1,
  },
  deleteBtn: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalConfirmBtn: {
    flex: 1,
  },
});
