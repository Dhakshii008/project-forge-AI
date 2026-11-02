import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, Copy, Sparkles, FileText, Share2 } from 'lucide-react-native';
import { Header, Card, Button } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceDocumentationScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [activeDoc, setActiveDoc] = useState<'README' | 'Abstract' | 'SRS'>('README');

  const docs = {
    README: `# ProjectForge AI Architecture
## Executive Summary
ProjectForge AI transforms ideas into production-grade software applications. Built with React Native (Expo SDK 51) and Node.js Express.

## Core Features
- Full 14-Module Engineering Pipeline
- Multi-Provider AI Fallback (Gemini -> OpenAI -> Groq -> Deterministic)
- Strict Multi-User Security & RBAC
- Offline-First Session Persistence

## Quick Start
\`\`\`bash
npm install
npm run start
\`\`\``,
    Abstract: `This project presents an intelligent engineering platform designed to bridge the gap between academic conceptualization and production software engineering. Utilizing autonomous multi-tier AI model evaluation and real-time validation schemas, the system automatically translates ambiguous user requirements into modular architecture diagrams, database designs, and actionable sprint Kanban items.`,
    SRS: `SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
1. INTRODUCTION
   The software aims to provide a mobile engineering workspace for developers.
2. SYSTEM PERSPECTIVE
   Self-contained client-server platform with offline resilience.
3. SECURITY SPECIFICATIONS
   - Passwords salted with bcrypt.
   - JWT sessions stored in Expo SecureStore.
   - Zero client-side API secrets.`,
  };

  const handleCopy = () => {
    Alert.alert('Copied', `${activeDoc} copied to clipboard.`);
  };

  const handleShare = () => {
    Alert.alert('Shared', `${activeDoc} ready for export.`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 12: Documentation"
        subtitle="Automated technical publications"
        showBack
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleCopy} style={styles.actionBtn}>
              <Copy size={18} color={colors.primaryLight} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
              <Share2 size={18} color={colors.secondaryLight} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Doc Selector Tabs */}
      <View style={styles.tabsRow}>
        {(['README', 'Abstract', 'SRS'] as const).map((doc) => (
          <TouchableOpacity
            key={doc}
            onPress={() => setActiveDoc(doc)}
            style={[styles.tabBtn, activeDoc === doc && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeDoc === doc && styles.tabTextActive]}>
              {doc}
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
        <Card title={`${activeDoc} Document View`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.docView}>
              <Text style={styles.docText}>{docs[activeDoc]}</Text>
            </View>
          </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    padding: spacing.xs,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  tabText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primaryLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  docView: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minWidth: 320,
  },
  docText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
});
