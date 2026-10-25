import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  AuthValidationErrors,
} from '@/utils/validation';

export const RegisterScreen: React.FC = () => {
  const { register, authError, setAuthError } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<AuthValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (hasSubmitted) {
      setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (hasSubmitted) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(val, true),
        confirmPassword: validateConfirmPassword(confirmPassword, val),
      }));
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (hasSubmitted) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(val, password),
      }));
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setRegistrationSuccess(false);
    setAuthError(null);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, true);
    const confirmError = validateConfirmPassword(confirmPassword, password);

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (emailError || passwordError || confirmError) {
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      setRegistrationSuccess(true);
    } catch {
      // Firebase error hiển thị qua authError trong testID="error-auth"
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={[styles.mainLayout, isLargeScreen && styles.mainLayoutWide]}>
          
          {/* Left Hero / Brand Section */}
          <View style={[styles.heroSection, isLargeScreen && styles.heroSectionWide]}>
            <View style={styles.brandRow}>
              <Text style={styles.sproutIcon}>🌱</Text>
              <Text style={styles.brandName}>BookShelf</Text>
            </View>

            <View style={styles.quoteWrapper}>
              <Text style={styles.mainHeadline}>
                Your reading journey{'\n'}starts here
              </Text>
              <Text style={styles.subHeadline}>
                Join BookShelf to organize and track every book you love.
              </Text>
            </View>

            <View style={styles.plantIllustrationCard}>
              <View style={styles.knitPot}>
                <Text style={styles.plantEmoji}>📚</Text>
              </View>
              <View style={styles.coffeeCup}>
                <Text style={styles.cupEmoji}>🌿</Text>
              </View>
            </View>
          </View>

          {/* Right Card / Form Section */}
          <View style={[styles.cardContainer, isLargeScreen && styles.cardContainerWide]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Create your account</Text>

              {/* Registration Success Message */}
              {registrationSuccess ? (
                <View style={styles.successAlertBox}>
                  <Text testID="form-success" style={styles.successAlertText}>
                    Registration successful
                  </Text>
                </View>
              ) : null}

              {/* Firebase Authentication Error Message */}
              {authError ? (
                <View style={styles.errorAlertBox}>
                  <Text testID="error-auth" style={styles.errorAlertText}>
                    {authError}
                  </Text>
                </View>
              ) : null}

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email address</Text>
                <View style={[styles.inputFieldWrapper, errors.email ? styles.inputFieldWrapperError : null]}>
                  <Text style={styles.inputIcon}>✉</Text>
                  <TextInput
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="Enter your email"
                    placeholderTextColor="#a8a29e"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.fieldErrorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputFieldWrapper, errors.password ? styles.inputFieldWrapperError : null]}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder="At least 6 characters"
                    placeholderTextColor="#a8a29e"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIconButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.fieldErrorText}>{errors.password}</Text>
                ) : null}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[styles.inputFieldWrapper, errors.confirmPassword ? styles.inputFieldWrapperError : null]}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#a8a29e"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIconButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁' : '👁‍🗨'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>

              {/* Primary Register Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>Register</Text>
                )}
              </TouchableOpacity>

              {/* Footer Switch to Login */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signUpLink}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b5a190',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#b5a190',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
    maxWidth: 1080,
    width: '100%',
    alignSelf: 'center',
  },
  mainLayoutWide: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 32,
    gap: 48,
  },
  heroSection: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  heroSectionWide: {
    flex: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  sproutIcon: {
    fontSize: 24,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
    fontFamily: 'serif',
  },
  quoteWrapper: {
    marginBottom: 32,
  },
  mainHeadline: {
    fontSize: 38,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: 16,
    fontFamily: 'serif',
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeadline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 24,
    fontWeight: '500',
  },
  plantIllustrationCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  knitPot: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  plantEmoji: {
    fontSize: 48,
  },
  coffeeCup: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cupEmoji: {
    fontSize: 32,
  },
  cardContainer: {
    width: '100%',
  },
  cardContainerWide: {
    flex: 1,
    maxWidth: 460,
  },
  cardContent: {
    backgroundColor: '#fffaf3',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#2b2118',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2b2118',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  successAlertBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successAlertText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorAlertBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorAlertText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57534e',
    marginBottom: 8,
  },
  inputFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e7e5e4',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputFieldWrapperError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    fontSize: 16,
    color: '#78716c',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1c1917',
    paddingVertical: 0,
    height: '100%',
  },
  eyeIconButton: {
    padding: 6,
  },
  eyeIcon: {
    fontSize: 16,
    color: '#78716c',
  },
  fieldErrorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#4ba025',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#4ba025',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#78716c',
    fontSize: 13,
  },
  signUpLink: {
    color: '#4ba025',
    fontSize: 13,
    fontWeight: '700',
  },
});
