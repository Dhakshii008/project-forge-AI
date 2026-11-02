import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Cloud, ChevronDown, ChevronUp, Terminal, CheckCircle2 } from 'lucide-react-native';
import { Header, Card, Badge } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceDeploymentScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [activePlatform, setActivePlatform] = useState<'Render' | 'Vercel' | 'Railway' | 'Atlas'>('Render');

  const platforms = [
    {
      name: 'Render',
      type: 'Backend REST API',
      buildCommand: 'npm run build',
      startCommand: 'npm run start',
      envVars: ['PORT=5000', 'NODE_ENV=production', 'MONGODB_URI=mongodb+srv://...', 'JWT_SECRET=...'],
      steps: [
        'Create a new Web Service on Render linked to GitHub repository.',
        'Set Root Directory to server (if monorepo).',
        'Configure Environment Variables securely in Render dashboard.',
        'Trigger automatic deploy on main branch commits.',
      ],
    },
    {
      name: 'Vercel',
      type: 'Frontend Web & Docs',
      buildCommand: 'npm run build',
      startCommand: 'npx serve dist',
      envVars: ['VITE_API_BASE_URL=https://your-api.onrender.com'],
      steps: [
        'Import GitHub repository on Vercel.',
        'Select Vite framework preset.',
        'Define VITE_API_BASE_URL pointing to production backend.',
        'Deploy with global edge CDN caching.',
      ],
    },
    {
      name: 'Railway',
      type: 'Containerized Microservices',
      buildCommand: 'docker build -t app .',
      startCommand: 'docker run -p 5000:5000 app',
      envVars: ['PORT=5000', 'DATABASE_URL=...'],
      steps: [
        'Create a new Railway project from Git repo.',
        'Provision Redis or PostgreSQL add-on if caching is required.',
        'Link environment variables and generate public domain.',
      ],
    },
    {
      name: 'Atlas',
      type: 'Managed MongoDB Cluster',
      buildCommand: 'N/A',
      startCommand: 'N/A',
      envVars: ['MONGODB_URI=mongodb+srv://...'],
      steps: [
        'Deploy an M0 free tier or serverless cluster in AWS us-east-1.',
        'Create database user with readWrite privileges.',
        'Add 0.0.0.0/0 to Network Access IP Access List.',
        'Copy SRV connection string into backend environment configuration.',
      ],
    },
  ];

  const currentGuide = platforms.find((p) => p.name === activePlatform) || platforms[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 13: Deployment"
        subtitle="Cloud infrastructure & host recipes"
        showBack
      />

      {/* Platform Selectors */}
      <View style={styles.platformRow}>
        {platforms.map((p) => (
          <TouchableOpacity
            key={p.name}
            onPress={() => setActivePlatform(p.name as any)}
            style={[
              styles.platformBtn,
              activePlatform === p.name && styles.platformBtnActive,
            ]}
          >
            <Text
              style={[
                styles.platformBtnText,
                activePlatform === p.name && styles.platformBtnTextActive,
              ]}
            >
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        <Card
          title={`${currentGuide.name} Setup Guide`}
          subtitle={currentGuide.type}
          headerRight={<Badge label="Production Ready" variant="success" size="sm" />}
        >
          {/* Build and start commands */}
          {currentGuide.buildCommand !== 'N/A' && (
            <View style={styles.cmdSection}>
              <Text style={styles.sectionLabel}>BUILD & RUN COMMANDS</Text>
              <View style={styles.cmdBox}>
                <Text style={styles.cmdText}>Build: {currentGuide.buildCommand}</Text>
                <Text style={styles.cmdText}>Start: {currentGuide.startCommand}</Text>
              </View>
            </View>
          )}

          {/* Environment Variables */}
          <View style={styles.cmdSection}>
            <Text style={styles.sectionLabel}>REQUIRED SECURE ENVIRONMENT VARIABLES</Text>
            <View style={styles.cmdBox}>
              {currentGuide.envVars.map((v, i) => (
                <Text key={i} style={styles.envText}>
                  {v}
                </Text>
              ))}
            </View>
          </View>

          {/* Step-by-Step Instructions */}
          <Text style={styles.sectionLabel}>DEPLOYMENT EXECUTION STEPS</Text>
          <View style={styles.stepsList}>
            {currentGuide.steps.map((step, idx) => (
              <View key={idx} style={styles.stepItem}>
                <CheckCircle2 size={16} color={colors.secondaryLight} />
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
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
  platformRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  platformBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  platformBtnActive: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  platformBtnText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  platformBtnTextActive: {
    color: colors.secondaryLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  cmdSection: {
    marginVertical: spacing.xs,
  },
  sectionLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  cmdBox: {
    backgroundColor: '#090d16',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cmdText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.primaryLight,
    fontSize: 12,
  },
  envText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.warning,
    fontSize: 12,
    lineHeight: 18,
  },
  stepsList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
});
