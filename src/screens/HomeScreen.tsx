import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export const HomeScreen: React.FC = () => {
  const { user, loading } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Khi đã đăng nhập, tự động chuyển ngay sang List screen (không hiện flash nội dung)
  useEffect(() => {
    if (!loading && user) {
      navigation.replace('List');
    }
  }, [user, loading, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Title Section */}
        <View style={styles.heroSection}>
          <Text testID="home-title" style={styles.homeTitle}>
            BookShelf
          </Text>
          <Text style={styles.description}>
            Ứng dụng cá nhân quản lý sách thông minh. Giúp bạn theo dõi những cuốn sách đang đọc, đã đọc và muốn đọc, phân loại theo thể loại và đánh dấu yêu thích dễ dàng.
          </Text>

          <View style={styles.authActionRow}>
            <Button
              title="Đăng nhập (Login)"
              onPress={() => navigation.navigate('Login')}
              style={styles.actionBtn}
            />
            <Button
              title="Đăng ký (Register)"
              variant="outline"
              onPress={() => navigation.navigate('Register')}
              style={styles.actionBtn}
            />
          </View>
        </View>

        {/* Feature Cards Section (At least 3 feature cards as required) */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Tính năng nổi bật</Text>

          <Card style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>📚</Text>
            </View>
            <View style={styles.featureTextContent}>
              <Text style={styles.featureTitle}>Track your books</Text>
              <Text style={styles.featureDesc}>
                Lưu trữ toàn bộ tủ sách của bạn một cách riêng tư, an toàn với tài khoản cá nhân.
              </Text>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>🔄</Text>
            </View>
            <View style={styles.featureTextContent}>
              <Text style={styles.featureTitle}>Sort by status</Text>
              <Text style={styles.featureDesc}>
                Phân loại tiến độ đọc nhanh chóng giữa To Read, Reading và Finished.
              </Text>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>⭐</Text>
            </View>
            <View style={styles.featureTextContent}>
              <Text style={styles.featureTitle}>Rate your favorites</Text>
              <Text style={styles.featureDesc}>
                Đánh dấu các cuốn sách tâm đắc nhất và chấm điểm sao từ 0 đến 5.
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 24,
  },
  homeTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 380,
    marginBottom: 24,
  },
  authActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  actionBtn: {
    flex: 1,
    maxWidth: 180,
  },
  featuresSection: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  featureIcon: {
    fontSize: 22,
  },
  featureTextContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
});
