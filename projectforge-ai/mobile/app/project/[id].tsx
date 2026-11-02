import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  GitFork,
  Play,
  CheckCircle2,
  Sparkles,
  Share2,
} from 'lucide-react-native';
import { projectService } from '../../src/services/projectService';
import { Project } from '../../src/types';
import { Card, Badge, Button, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [forking, setForking] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const res = await projectService.getProjectById(id);
        if (res.success && res.data) {
          setProject(res.data);
        }
      } catch (err) {
        // Fallback handled
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleStartProject = () => {
    if (!project) return;
    router.push(`/workspace/${project._id}` as any);
  };

  const handleFork = async () => {
    if (!project) return;
    try {
      setForking(true);
      const res = await projectService.forkProject(project._id);
      if (res.success && res.data) {
        Alert.alert('Project Forked', 'Created a local copy in your workspace.', [
          {
            text: 'Open Workspace',
            onPress: () => {
              const targetId = res.data?.projectId || (res.data as any)?.project?._id || project._id;
              router.push(`/workspace/${targetId}` as any);
            },
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to fork project');
    } finally {
      setForking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading project blueprint..." />;
  }

  if (!project) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingHorizontal: spacing.lg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Project not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {project.title}
        </Text>
        <TouchableOpacity onPress={handleFork} style={styles.forkNavBtn}>
          <GitFork size={20} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Main Details Card */}
        <Card>
          <View style={styles.titleBadgeRow}>
            <Badge
              label={project.category || 'Engineering'}
              variant="secondary"
              size="sm"
            />
            <Badge
              label={project.difficulty || 'Intermediate'}
              variant={
                project.difficulty === 'Beginner' || project.difficulty === 'beginner'
                  ? 'success'
                  : project.difficulty === 'Advanced' || project.difficulty === 'advanced'
                  ? 'danger'
                  : 'warning'
              }
              size="sm"
            />
          </View>

          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.description}>{project.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Clock size={16} color={colors.textMuted} />
              <Text style={styles.metaValue}>{project.estimatedWeeks || 4} Weeks</Text>
              <Text style={styles.metaLabel}>Effort</Text>
            </View>
            <View style={styles.metaBox}>
              <ShieldCheck size={16} color={colors.success} />
              <Text style={styles.metaValue}>94/100</Text>
              <Text style={styles.metaLabel}>Feasibility</Text>
            </View>
            <View style={styles.metaBox}>
              <Sparkles size={16} color={colors.secondaryLight} />
              <Text style={styles.metaValue}>96%</Text>
              <Text style={styles.metaLabel}>Skill Match</Text>
            </View>
          </View>
        </Card>

        {/* Problem & Solution */}
        <Card title="Problem Statement">
          <Text style={styles.bodyText}>
            {project.problem ||
              'Traditional workflows lack centralized observability and automated anomaly detection, creating latency in incident triage.'}
          </Text>
        </Card>

        <Card title="Engineered Solution">
          <Text style={styles.bodyText}>
            {project.solution ||
              'An event-driven full stack architecture that continuously ingests metrics and applies real-time threshold scoring.'}
          </Text>
        </Card>

        {/* Features */}
        <Card title="Core Feature Set">
          {(project.features && project.features.length > 0
            ? project.features
            : [
                'Live metrics ingest pipeline via WebSocket',
                'Multi-tenant role-based access control (RBAC)',
                'Modular reporting & alert notification rules',
                'Offline-first client cache with optimistic updates',
              ]
          ).map((feat: string, idx: number) => (
            <View key={idx} style={styles.featureRow}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </Card>

        {/* Tech Stack */}
        <Card title="Technology Stack">
          <View style={styles.chipsRow}>
            {(project.techStack || ['React', 'Node.js', 'Express', 'MongoDB']).map((tech: string) => (
              <View key={tech} style={styles.techPill}>
                <Text style={styles.techPillText}>{tech}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          <Button
            title="Launch Project Workspace"
            variant="primary"
            size="lg"
            onPress={handleStartProject}
            icon={<Play size={18} color={colors.text} />}
            fullWidth
          />

          <View style={styles.secondaryActionsRow}>
            <Button
              title="Fork Blueprint"
              variant="outline"
              size="md"
              onPress={handleFork}
              loading={forking}
              icon={<GitFork size={16} color={colors.primaryLight} />}
              style={{ flex: 1 }}
            />
            <Button
              title="Validate Scope"
              variant="outline"
              size="md"
              onPress={() =>
                router.push({
                  pathname: '/project/validation',
                  params: { projectId: project._id },
                })
              }
              icon={<ShieldCheck size={16} color={colors.success} />}
              style={{ flex: 1 }}
            />
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.xs,
  },
  navTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    marginHorizontal: spacing.md,
  },
  forkNavBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaBox: {
    alignItems: 'center',
  },
  metaValue: {
    ...typography.captionBold,
    color: colors.text,
    marginTop: 4,
  },
  metaLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    marginTop: 2,
  },
  bodyText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  featureText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techPill: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 6,
  },
  techPillText: {
    ...typography.captionBold,
    color: colors.primaryLight,
  },
  bottomActions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
