import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Rocket, Sparkles, Layers, Terminal, ArrowRight } from 'lucide-react-native';
import { Button, Card } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Rocket size={38} color={colors.primaryLight} />
          </View>
          <Text style={styles.title}>Welcome to ProjectForge AI</Text>
          <Text style={styles.subtitle}>
            Your end-to-end mobile engineering workspace. Let's calibrate your profile to personalize project recommendations and AI guidance.
          </Text>
        </View>

        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Sparkles size={20} color={colors.secondary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI-Powered Generation</Text>
              <Text style={styles.featureDesc}>
                Turn ideas into complete architectures, schemas, APIs, and roadmaps.
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Layers size={20} color={colors.primaryLight} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>14 Engineering Modules</Text>
              <Text style={styles.featureDesc}>
                Requirements, database design, interactive task Kanban, test cases, and deployment blueprints.
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Terminal size={20} color={colors.success} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Skill Intelligence</Text>
              <Text style={styles.featureDesc}>
                Evaluate your proficiency, identify skill gaps, and accelerate your engineering career.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(onboarding)/education')}
          fullWidth
          size="lg"
          icon={<ArrowRight size={18} color={colors.text} />}
          iconPosition="right"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  featureCard: {
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.text,
  },
  featureDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
