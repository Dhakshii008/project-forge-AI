import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Cpu, Sparkles } from 'lucide-react-native';
import { useAuth } from '../src/store/authContext';
import { colors, spacing, typography } from '../src/theme';

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Small delay for smooth splash transition
    const timer = setTimeout(() => {
      if (!isAuthenticated || !user) {
        router.replace('/(auth)/login');
      } else if (!user.onboardingComplete) {
        router.replace('/(onboarding)/welcome');
      } else {
        router.replace('/(tabs)');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, user]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.centerContent}>
        <View style={styles.iconContainer}>
          <Cpu size={52} color={colors.primaryLight} />
          <View style={styles.sparkleBadge}>
            <Sparkles size={16} color={colors.secondary} />
          </View>
        </View>

        <Text style={styles.title}>PROJECTFORGE AI</Text>
        <Text style={styles.tagline}>
          Turn your skills and ideas into projects you can actually build.
        </Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Initializing workspace...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  sparkleBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.surfaceLight,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    letterSpacing: 1.5,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: spacing.sm,
  },
});
