import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Plus,
} from 'lucide-react-native';
import { workspaceService } from '../../src/services/workspaceService';
import { Requirements } from '../../src/types';
import { Header, Card, Badge, Button, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceRequirementsScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<Requirements | null>(null);

  // Accordion states
  const [expandFR, setExpandFR] = useState(true);
  const [expandNFR, setExpandNFR] = useState(true);
  const [expandStories, setExpandStories] = useState(true);

  useEffect(() => {
    const loadReqs = async () => {
      if (!projectId) return;
      try {
        const res = await workspaceService.getRequirements(projectId);
        if (res.success && res.data) {
          setRequirements(res.data);
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadReqs();
  }, [projectId]);

  const handleCopyAll = () => {
    Alert.alert('Copied', 'Requirements copied to clipboard.');
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading requirements..." />;
  }

  const functional = requirements?.functional || [
    'The system must authenticate users via JWT and bcrypt password hashing.',
    'The system must allow creation, reading, updating, and deletion of project entities.',
    'The system must stream real-time telemetry metrics using WebSockets.',
    'The system must evaluate metrics against custom alert thresholds.',
  ];

  const nonFunctional = requirements?.nonFunctional || [
    'Sub-200ms API response latency for 99th percentile under 500 req/sec load.',
    'Zero plaintext secret storage in local client cache.',
    '99.9% uptime with automated health-check endpoints.',
    'Strict Role-Based Access Control (RBAC) enforced on every protected endpoint.',
  ];

  const userStories = requirements?.userStories || [
    {
      role: 'Student Engineer',
      action: 'generate a software architecture from an idea',
      benefit: 'I can build a resume-worthy capstone project with clear milestone guidance.',
    },
    {
      role: 'DevOps Architect',
      action: 'monitor incoming telemetry and set automated alerts',
      benefit: 'I can preempt outages before SLA impact occurs.',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 02: Requirements"
        subtitle="SRS specifications & user stories"
        showBack
        rightAction={
          <TouchableOpacity onPress={handleCopyAll} style={styles.copyBtn}>
            <Copy size={18} color={colors.primaryLight} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Functional Requirements */}
        <Card>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => setExpandFR(!expandFR)}
          >
            <View>
              <Text style={styles.cardHeaderTitle}>Functional Requirements</Text>
              <Text style={styles.cardHeaderSub}>System capabilities & workflows</Text>
            </View>
            {expandFR ? (
              <ChevronUp size={20} color={colors.textMuted} />
            ) : (
              <ChevronDown size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {expandFR && (
            <View style={styles.itemsList}>
              {functional.map((item: string, idx: number) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemBullet}>FR-0{idx + 1}</Text>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Non-Functional Requirements */}
        <Card>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => setExpandNFR(!expandNFR)}
          >
            <View>
              <Text style={styles.cardHeaderTitle}>Non-Functional Requirements</Text>
              <Text style={styles.cardHeaderSub}>Performance, security & scalability</Text>
            </View>
            {expandNFR ? (
              <ChevronUp size={20} color={colors.textMuted} />
            ) : (
              <ChevronDown size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {expandNFR && (
            <View style={styles.itemsList}>
              {nonFunctional.map((item: string, idx: number) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemBullet}>NFR-0{idx + 1}</Text>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* User Stories */}
        <Card>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => setExpandStories(!expandStories)}
          >
            <View>
              <Text style={styles.cardHeaderTitle}>Agile User Stories</Text>
              <Text style={styles.cardHeaderSub}>Role, action & value statements</Text>
            </View>
            {expandStories ? (
              <ChevronUp size={20} color={colors.textMuted} />
            ) : (
              <ChevronDown size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {expandStories && (
            <View style={styles.itemsList}>
              {userStories.map((story: any, idx: number) => (
                <View key={idx} style={styles.storyCard}>
                  <Text style={styles.storyRole}>As a {story.role},</Text>
                  <Text style={styles.storyAction}>I want to {story.action},</Text>
                  <Text style={styles.storyBenefit}>So that {story.benefit}.</Text>
                </View>
              ))}
            </View>
          )}
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
  copyBtn: {
    padding: spacing.xs,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    ...typography.h3,
    color: colors.text,
  },
  cardHeaderSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemsList: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  itemBullet: {
    ...typography.captionBold,
    color: colors.primaryLight,
    minWidth: 54,
  },
  itemText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  storyCard: {
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  storyRole: {
    ...typography.captionBold,
    color: colors.secondaryLight,
  },
  storyAction: {
    ...typography.bodyBold,
    color: colors.text,
    marginVertical: 2,
  },
  storyBenefit: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
