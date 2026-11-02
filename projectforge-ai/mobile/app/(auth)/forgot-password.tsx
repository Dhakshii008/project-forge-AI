import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { authService } from '../../src/services/authService';
import { Button, Input, Card } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleReset = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await authService.forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err: any) {
      // In case backend returns error or is unreachable
      setErrorMessage(err.message || 'Unable to process password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>

        {submitted ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={48} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Check Your Inbox</Text>
            <Text style={styles.successMessage}>
              We have dispatched password recovery instructions to:
            </Text>
            <Text style={styles.emailHighlight}>{email}</Text>
            <Button
              title="Return to Sign In"
              onPress={() => router.replace('/(auth)/login')}
              fullWidth
              size="lg"
              style={{ marginTop: spacing.xl }}
            />
          </View>
        ) : (
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your registered student email address. We'll send you a link to reset your password.
              </Text>
            </View>

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Card style={styles.formCard}>
              <Input
                label="Registered Email Address"
                placeholder="student@projectforge.ai"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errorMessage) setErrorMessage('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={18} color={colors.textMuted} />}
              />

              <Button
                title="Send Recovery Instructions"
                onPress={handleReset}
                loading={loading}
                fullWidth
                size="lg"
                style={{ marginTop: spacing.md }}
              />
            </Card>

            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              style={styles.backToLogin}
            >
              <Text style={styles.backToLoginText}>
                Remember your password? <Text style={{ color: colors.primaryLight }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  backButton: {
    padding: spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  errorBanner: {
    backgroundColor: colors.dangerGhost,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  successMessage: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emailHighlight: {
    ...typography.bodyBold,
    color: colors.secondaryLight,
    marginTop: spacing.xs,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  backToLoginText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
