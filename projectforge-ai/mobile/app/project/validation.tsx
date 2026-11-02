import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';
import { Card, Badge, Button } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ProjectValidationScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [validation] = useState({
    feasibilityScore: 92,
    scopeScore: 78,
    complexity: 'Moderate-High',
    skillGap: 'Low (Matches 85% of profile skills)',
    riskLevel: 'Low Risk',
    estimatedTime: '4 Weeks',
    verdict: 'Viable Capstone Project',
    recommendation:
      'The initial architecture scope is well-balanced for an individual or small team. We recommend delivering the core event ingestion and auth first (Weeks 1-2) before advancing to automated anomaly notification pipelines (Weeks 3-4).',
    mvpDeliverables: [
      'Modular RESTful API & WebSocket connection',
      'Database schemas with compound indexes',
      'Telemetry ingestion and threshold alerts',
      'Mobile-responsive dashboard interface',
    ],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>AI Project Validation</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Score Overview Card */}
        <Card style={styles.scoreOverviewCard}>
          <View style={styles.scoreHeader}>
            <View>
              <Text style={styles.scoreSubtitle}>VALIDATION VERDICT</Text>
              <Text style={styles.verdictTitle}>{validation.verdict}</Text>
            </View>
            <View style={styles.badgeCircle}>
              <ShieldCheck size={32} color={colors.success} />
            </View>
          </View>

          <View style={styles.scoresGrid}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreNumber}>{validation.feasibilityScore}%</Text>
              <Text style={styles.scoreBoxLabel}>Feasibility</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreNumber}>{validation.scopeScore}%</Text>
              <Text style={styles.scoreBoxLabel}>Scope Fit</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreNumber, { color: colors.success }]}>
                {validation.riskLevel}
              </Text>
              <Text style={styles.scoreBoxLabel}>Risk Index</Text>
            </View>
          </View>
        </Card>

        {/* Technical Complexity & Skill Gap */}
        <Card title="Complexity & Duration">
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Complexity Rating:</Text>
            <Badge label={validation.complexity} variant="secondary" size="sm" />
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Skill Gap Assessment:</Text>
            <Text style={styles.specValue}>{validation.skillGap}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Estimated Build Time:</Text>
            <Text style={styles.specValue}>{validation.estimatedTime}</Text>
          </View>
        </Card>

        {/* Recommendation */}
        <Card title="Architectural Recommendation" highlighted>
          <Text style={styles.recText}>{validation.recommendation}</Text>
        </Card>

        {/* Recommended MVP Scope */}
        <Card title="Recommended MVP Scope">
          {validation.mvpDeliverables.map((item, idx) => (
            <View key={idx} style={styles.deliverableRow}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.deliverableText}>{item}</Text>
            </View>
          ))}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Accept & Launch Workspace"
            variant="primary"
            size="lg"
            onPress={() => {
              if (projectId) {
                router.replace(`/workspace/${projectId}` as any);
              } else {
                router.replace('/(tabs)/projects');
              }
            }}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  navTitle: {
    ...typography.h2,
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scoreOverviewCard: {
    backgroundColor: colors.surface,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreSubtitle: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
  },
  verdictTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: 2,
  },
  badgeCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.successGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreNumber: {
    ...typography.h3,
    color: colors.text,
  },
  scoreBoxLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    marginTop: 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  specLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  specValue: {
    ...typography.caption,
    color: colors.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  recText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  deliverableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  deliverableText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  actionsContainer: {
    marginTop: spacing.md,
  },
});
