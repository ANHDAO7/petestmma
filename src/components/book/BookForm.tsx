import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GENRES, STATUSES, BookFormData } from '@/types/book';
import { Input } from '../common/Input';
import { SelectPicker } from '../common/SelectPicker';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  validateTitle,
  validateAuthor,
  validateGenre,
  validateStatus,
  validateRating,
  validateNotes,
  BookValidationErrors,
} from '@/utils/validation';

interface BookFormProps {
  onSubmit: (data: BookFormData) => Promise<void>;
  successMessage?: string | null;
  errorMessage?: string | null;
  initialValues?: BookFormData;
  submitButtonText?: string;
  onCancel?: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({
  onSubmit,
  successMessage,
  errorMessage,
  initialValues,
  submitButtonText = 'Add Book',
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [author, setAuthor] = useState(initialValues?.author || '');
  const [genre, setGenre] = useState(initialValues?.genre || '');
  const [status, setStatus] = useState(initialValues?.status || '');
  const [rating, setRating] = useState(initialValues?.rating || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const [errors, setErrors] = useState<BookValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setAuthor(initialValues.author || '');
      setGenre(initialValues.genre || '');
      setStatus(initialValues.status || '');
      setRating(initialValues.rating || '');
      setNotes(initialValues.notes || '');
      setErrors({});
      setHasSubmitted(false);
    }
  }, [initialValues]);

  // Xử lý thay đổi dữ liệu kèm cập nhật lỗi theo thời gian thực (lỗi biến mất khi hợp lệ)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (hasSubmitted) {
      setErrors((prev) => ({ ...prev, title: validateTitle(val) }));
    }
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    if (hasSubmitted) {
      setErrors((prev) => ({ ...prev, author: validateAuthor(val) }));
    }
  };

  const handleGenreChange = (val: string) => {
    setGenre(val);
    if (hasSubmitted) {
      setErrors((prev) => ({ ...prev, genre: validateGenre(val) }));
    }
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    if (hasSubmitted) {
      setErrors((prev) => ({ ...prev, status: validateStatus(val) }));
    }
  };

  const handleRatingChange = (val: string) => {
    setRating(val);
    if (hasSubmitted) {
      setErrors((prev) => ({ ...prev, rating: validateRating(val) }));
    }
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    if (hasSubmitted) {
      setErrors((prev) => ({ ...prev, notes: validateNotes(val) }));
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    const titleError = validateTitle(title);
    const authorError = validateAuthor(author);
    const genreError = validateGenre(genre);
    const statusError = validateStatus(status);
    const ratingError = validateRating(rating);
    const notesError = validateNotes(notes);

    const validationErrors: BookValidationErrors = {
      title: titleError,
      author: authorError,
      genre: genreError,
      status: statusError,
      rating: ratingError,
      notes: notesError,
    };

    setErrors(validationErrors);

    if (
      titleError ||
      authorError ||
      genreError ||
      statusError ||
      ratingError ||
      notesError
    ) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title,
        author,
        genre,
        status,
        rating,
        notes,
      });

      // Nếu là form Add (không có initialValues), xóa form sau khi lưu thành công
      if (!initialValues) {
        setTitle('');
        setAuthor('');
        setGenre('');
        setStatus('');
        setRating('');
        setNotes('');
        setHasSubmitted(false);
        setErrors({});
      }
    } catch {
      // Lỗi do caller và Firestore xử lý, hiển thị qua errorMessage
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={styles.container}>
      <View testID="book-form">
        <Text style={styles.formTitle}>
          {initialValues ? 'Chỉnh sửa thông tin sách' : 'Thêm sách mới'}
        </Text>

        {successMessage ? (
          <View style={styles.successBox}>
            <Text testID="book-success" style={styles.successText}>
              {successMessage}
            </Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text testID="error-book" style={styles.errorBoxText}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <Input
          label="Tiêu đề sách (Title) *"
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Nhập tiêu đề sách"
          error={errors.title}
        />

        <Input
          label="Tác giả (Author) *"
          value={author}
          onChangeText={handleAuthorChange}
          placeholder="Nhập tên tác giả"
          error={errors.author}
        />

        <SelectPicker
          label="Thể loại (Genre) *"
          value={genre}
          placeholder="Choose genre"
          options={GENRES}
          onSelect={handleGenreChange}
          error={errors.genre}
        />

        <SelectPicker
          label="Trạng thái đọc (Status) *"
          value={status}
          placeholder="Choose status"
          options={STATUSES}
          onSelect={handleStatusChange}
          error={errors.status}
        />

        <Input
          label="Đánh giá (Rating: 0 - 5)"
          value={rating}
          onChangeText={handleRatingChange}
          placeholder="Số nguyên từ 0 đến 5 (không bắt buộc)"
          keyboardType="numeric"
          error={errors.rating}
        />

        <Input
          label="Ghi chú (Notes)"
          value={notes}
          onChangeText={handleNotesChange}
          placeholder="Ghi chú ngắn về cuốn sách (tối đa 300 ký tự)"
          multiline
          error={errors.notes}
        />

        <View style={styles.buttonRow}>
          {onCancel ? (
            <Button
              title="Cancel"
              variant="outline"
              onPress={onCancel}
              style={styles.cancelBtn}
            />
          ) : null}
          <Button
            title={submitButtonText}
            onPress={handleSubmit}
            loading={submitting}
            style={styles.submitBtn}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  successBox: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBoxText: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
});
