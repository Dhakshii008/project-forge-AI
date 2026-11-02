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
import { GitBranch, CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react-native';
import { Header, Card, Badge } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceRoadmapScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const phases = [
    {
      phaseNumber: 1,
      title: 'Phase 1: Inception & Scope',
      goal: 'Define problem boundaries, user personas, and core architecture choice.',
      tasks: ['Requirements SRS writeup', 'Monolith vs Microservices selection'],
      duration: 'Week 1',
      completed: true,
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Database Modeling',
      goal: 'Design normalized collections, indexes, and write migration scripts.',
      tasks: ['Mongoose/MongoDB schemas', 'Unique and compound index testing'],
      duration: 'Week 1-2',
      completed: true,
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Auth & REST Core',
      goal: 'Construct Express API endpoints with JWT authentication and bcrypt.',
      tasks: ['User registration & login', 'RBAC authorization middleware'],
      duration: 'Week 2',
      completed: true,
    },
    {
      phaseNumber: 4,
      title: 'Phase 4: Telemetry & Business Engine',
      goal: 'Implement real-time WebSocket ingestion and threshold scoring logic.',
      tasks: ['Telemetry streaming endpoint', 'Anomaly scoring pipeline'],
      duration: 'Week 3',
      completed: true,
    },
    {
      phaseNumber: 5,
      title: 'Phase 5: Mobile UI Experience',
      goal: 'Assemble React Native / Expo touch-friendly interface across 14 modules.',
      tasks: ['Expo Router tab layout', 'Offline store & optimistic updates'],
      duration: 'Week 3-4',
      completed: true,
    },
    {
      phaseNumber: 6,
      title: 'Phase 6: Automated Testing Suite',
      goal: 'Execute unit, integration, and security regression matrices.',
      tasks: ['Jest test suite passes', 'Multi-user isolation verification'],
      duration: 'Week 4',
      completed: false,
    },
    {
      phaseNumber: 7,
      title: 'Phase 7: Technical Documentation',
      goal: 'Compile README, SRS, API catalog, and architecture guides.',
      tasks: ['Automated README generation', 'cURL example documentation'],
      duration: 'Week 4',
      completed: false,
    },
    {
      phaseNumber: 8,
      title: 'Phase 8: Production Release',
      goal: 'Publish Android APK and deploy backend to high-availability cloud.',
      tasks: ['EAS cloud APK build', 'Public portfolio showcase URL'],
      duration: 'Week 5',
      completed: false,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 07: Roadmap"
        subtitle="8-phase engineering milestones"
        showBack
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {phases.map((p, idx) => (
          <View key={p.phaseNumber} style={styles.timelineItem}>
            {/* Left timeline track */}
            <View style={styles.trackColumn}>
              <View
                style={[
                  styles.dot,
                  p.completed ? styles.dotCompleted : styles.dotPending,
                ]}
              >
                {p.completed ? (
                  <CheckCircle2 size={16} color={colors.success} />
                ) : (
                  <Clock size={14} color={colors.warning} />
                )}
              </View>
              {idx < phases.length - 1 && <View style={styles.line} />}
            </View>

            {/* Right content card */}
            <View style={styles.cardWrapper}>
              <Card
                title={p.title}
                subtitle={p.duration}
                headerRight={
                  <Badge
                    label={p.completed ? 'Done' : 'In Progress'}
                    variant={p.completed ? 'success' : 'warning'}
                    size="sm"
                  />
                }
              >
                <Text style={styles.goalText}>{p.goal}</Text>

                <View style={styles.tasksSection}>
                  {p.tasks.map((task, tIdx) => (
                    <View key={tIdx} style={styles.taskItem}>
                      <Text style={styles.taskBullet}>•</Text>
                      <Text style={styles.taskText}>{task}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          </View>
        ))}
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
  timelineItem: {
    flexDirection: 'row',
  },
  trackColumn: {
    alignItems: 'center',
    width: 32,
    marginRight: spacing.sm,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dotCompleted: {
    borderColor: colors.success,
  },
  dotPending: {
    borderColor: colors.warning,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  cardWrapper: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  goalText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  tasksSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  taskBullet: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  taskText: {
    ...typography.caption,
    color: colors.text,
  },
});
