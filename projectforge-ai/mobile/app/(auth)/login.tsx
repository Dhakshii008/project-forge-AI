import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, Server, Cpu, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '../../src/store/authContext';
import { getApiBaseUrl, setApiBaseUrl } from '../../src/api/client';
import { Button, Input, Card, Badge } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Server settings toggle
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const result = await login(email.trim().toLowerCase(), password);

      if (!result.success) {
        setErrorMessage(result.error || 'Login failed. Please check your credentials.');
        return;
      }

      if (result.user && !result.user.onboardingComplete) {
        router.replace('/(onboarding)/welcome');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  const handleSaveServerUrl = async () => {
    if (!customServerUrl.trim()) return;
    await setApiBaseUrl(customServerUrl.trim());
    setShowServerConfig(false);
    Alert.alert('Server Updated', `API endpoint set to: ${customServerUrl.trim()}`);
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
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Cpu size={32} color={colors.primaryLight} />
          </View>
          <Text style={styles.title}>ProjectForge AI</Text>
          <Text style={styles.subtitle}>Sign in to your engineering workspace</Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Login Form */}
        <Card style={styles.formCard}>
          <Input
            label="Email Address"
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

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (errorMessage) setErrorMessage('');
            }}
            isPassword
            leftIcon={<Lock size={18} color={colors.textMuted} />}
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
            style={{ marginTop: spacing.sm }}
          />
        </Card>

        {/* Quick Demo Logins */}
        <View style={styles.demoSection}>
          <Text style={styles.demoSectionTitle}>1-TAP TEST CREDENTIALS</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillQuickAccount('student@projectforge.ai', 'Student@123')}
            >
              <Text style={styles.demoButtonRole}>Student</Text>
              <Text style={styles.demoButtonEmail}>student@projectforge.ai</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillQuickAccount('admin@projectforge.ai', 'Admin@123')}
            >
              <Text style={styles.demoButtonRole}>Admin</Text>
              <Text style={styles.demoButtonEmail}>admin@projectforge.ai</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registration Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Server Endpoint Config Link */}
        <TouchableOpacity
          style={styles.serverSettingsToggle}
          onPress={() => setShowServerConfig(!showServerConfig)}
        >
          <Server size={14} color={colors.textSubtle} />
          <Text style={styles.serverSettingsText}>
            Server API Endpoint: {getApiBaseUrl()}
          </Text>
        </TouchableOpacity>

        {showServerConfig && (
          <Card style={styles.serverCard}>
            <Text style={styles.serverTitle}>Custom Server Base URL</Text>
            <Input
              placeholder="http://192.168.1.4:5000/api"
              value={customServerUrl}
              onChangeText={setCustomServerUrl}
              autoCapitalize="none"
              helper="Change if running device over LAN or custom cloud"
            />
            <Button
              title="Save Endpoint"
              size="sm"
              variant="outline"
              onPress={handleSaveServerUrl}
            />
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
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
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotText: {
    ...typography.caption,
    color: colors.primaryLight,
  },
  demoSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  demoSectionTitle: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  demoButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  demoButtonRole: {
    ...typography.captionBold,
    color: colors.secondaryLight,
  },
  demoButtonEmail: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  signupText: {
    ...typography.bodyBold,
    color: colors.primaryLight,
  },
  serverSettingsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: 6,
  },
  serverSettingsText: {
    ...typography.tiny,
    color: colors.textSubtle,
  },
  serverCard: {
    marginTop: spacing.md,
  },
  serverTitle: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
