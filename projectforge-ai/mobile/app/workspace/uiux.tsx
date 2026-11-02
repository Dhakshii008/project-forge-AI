import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, Palette, Smartphone, Component, CheckCircle2 } from 'lucide-react-native';
import { Header, Card, Badge } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceUiUxScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const screens = [
    {
      name: 'Authentication & Splash',
      desc: 'Branded splash, JWT authentication form, and 5-step student registration.',
    },
    {
      name: 'Home Engineering Dashboard',
      desc: 'Skill score card, active project telemetry, quick action grid, and recommended blueprints.',
    },
    {
      name: 'Project Discovery & Exploration',
      desc: 'Search, domain filters, difficulty chips, and architecture overview cards.',
    },
    {
      name: '14-Module Engineering Workspace',
      desc: 'Modular hub with status tracking, interactive task board, and contextual AI chat mentor.',
    },
  ];

  const designTokens = [
    { label: 'Primary Brand', hex: '#6366f1', name: 'Indigo 500' },
    { label: 'Secondary Accent', hex: '#06b6d4', name: 'Cyan 500' },
    { label: 'Dark Surface', hex: '#0f172a', name: 'Slate 900' },
    { label: 'Deep Background', hex: '#020617', name: 'Slate 950' },
    { label: 'Success Green', hex: '#10b981', name: 'Emerald 500' },
    { label: 'Alert Amber', hex: '#f59e0b', name: 'Amber 500' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 06: UI/UX Planner"
        subtitle="Design system & wireframe architecture"
        showBack
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Core Design System Tokens */}
        <Card title="Design System Tokens" subtitle="Accessible WCAG 2.1 AA compliant palette">
          <View style={styles.tokensGrid}>
            {designTokens.map((t) => (
              <View key={t.hex} style={styles.tokenBox}>
                <View style={[styles.colorSquare, { backgroundColor: t.hex }]} />
                <View style={styles.tokenTextGroup}>
                  <Text style={styles.tokenLabel}>{t.label}</Text>
                  <Text style={styles.tokenHex}>{t.hex}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Screen Hierarchy */}
        <Card title="Screen Architecture Hierarchy">
          {screens.map((s, idx) => (
            <View key={idx} style={styles.screenRow}>
              <View style={styles.screenIconBox}>
                <Smartphone size={18} color={colors.secondaryLight} />
              </View>
              <View style={styles.screenInfo}>
                <Text style={styles.screenName}>{s.name}</Text>
                <Text style={styles.screenDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* UI Principles */}
        <Card title="Mobile-First UX Rules" highlighted>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color={colors.success} />
            <Text style={styles.ruleText}>Minimum 44x44 point touch target across all interactive buttons</Text>
          </View>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color={colors.success} />
            <Text style={styles.ruleText}>Zero horizontal overflow scrolling on root viewport layouts</Text>
          </View>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color={colors.success} />
            <Text style={styles.ruleText}>Graceful KeyboardAvoidingView handling on all form inputs</Text>
          </View>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color={colors.success} />
            <Text style={styles.ruleText}>Safe area insets automatically observed on notches & navigation bars</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  tokensGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  tokenBox: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  colorSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  tokenTextGroup: {
    flex: 1,
  },
  tokenLabel: {
    ...typography.captionBold,
    color: colors.text,
  },
  tokenHex: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  screenRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  screenIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenInfo: {
    flex: 1,
  },
  screenName: {
    ...typography.captionBold,
    color: colors.text,
  },
  screenDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: 4,
  },
  ruleText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
});
