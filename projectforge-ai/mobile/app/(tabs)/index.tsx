import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles,
  Compass,
  CheckSquare,
  Bot,
  ArrowRight,
  Bell,
  TrendingUp,
  FolderGit2,
  Clock,
  ShieldCheck,
} from 'lucide-react-native';
import { useAuth } from '../../src/store/authContext';
import { projectService } from '../../src/services/projectService';
import { skillService } from '../../src/services/skillService';
import { Project } from '../../src/types';
import { Card, Badge, Button, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function HomeDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [skillScore, setSkillScore] = useState(82);

  const fetchDashboardData = async () => {
    try {
      // Fetch user projects
      const res = await projectService.getMyProjects();
      if (res.success && res.data && res.data.length > 0) {
        setActiveProject(res.data[0]);
      }

      // Fetch recommended projects
      const recRes = await projectService.getProjects({ limit: 4 });
      if (recRes.success && recRes.data) {
        setRecommendedProjects(recRes.data);
      }

      // Fetch skill profile
      const skillRes = await skillService.getSkillProfile();
      if (skillRes.success && skillRes.data?.overallScore) {
        setSkillScore(skillRes.data.overallScore);
      }
    } catch (err) {
      // Fallbacks already handled by apiClient / standaloneStore
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.greetingText}>{getGreeting()},</Text>
          <Text style={styles.userNameText}>{user?.name || 'Engineer'}</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={20} color={colors.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryLight}
          />
        }
      >
        {/* ProjectForge Skill Score Card */}
        <Card style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>PROJECTFORGE SCORE</Text>
              <View style={styles.scoreValueRow}>
                <Text style={styles.scoreValue}>{skillScore}%</Text>
                <Badge
                  label="Ready to Build"
                  variant="success"
                  size="sm"
                  style={{ marginLeft: spacing.sm }}
                />
              </View>
              <Text style={styles.scoreSub}>
                Top 15% student engineering benchmark
              </Text>
            </View>
            <View style={styles.scoreBadgeWrapper}>
              <TrendingUp size={32} color={colors.secondaryLight} />
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${skillScore}%` }]} />
          </View>
        </Card>

        {/* Current Active Project */}
        {activeProject ? (
          <Card
            title={`Continue ${activeProject.title}`}
            subtitle={`${activeProject.progress || 72}% complete • ${activeProject.category || 'Full Stack'}`}
            headerRight={
              <Badge
                label={activeProject.status || 'Active'}
                variant="primary"
                size="sm"
              />
            }
            highlighted
          >
            <Text style={styles.projectDesc} numberOfLines={2}>
              {activeProject.description}
            </Text>
            <View style={styles.projectMetaRow}>
              <View style={styles.metaItem}>
                <Clock size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{activeProject.estimatedWeeks || 4} Weeks</Text>
              </View>
              <View style={styles.metaItem}>
                <ShieldCheck size={14} color={colors.success} />
                <Text style={styles.metaText}>Validated</Text>
              </View>
            </View>
            <Button
              title="Open Workspace"
              variant="primary"
              size="md"
              onPress={() => router.push(`/workspace/${activeProject._id}` as any)}
              icon={<ArrowRight size={16} color={colors.text} />}
              iconPosition="right"
              style={{ marginTop: spacing.md }}
            />
          </Card>
        ) : (
          <Card style={styles.emptyProjectCard}>
            <FolderGit2 size={32} color={colors.primaryLight} />
            <Text style={styles.emptyTitle}>No active projects yet</Text>
            <Text style={styles.emptySub}>
              Generate a project from your ideas or fork an existing industry blueprint.
            </Text>
            <Button
              title="Generate With AI"
              size="sm"
              onPress={() => router.push('/(tabs)/create')}
              style={{ marginTop: spacing.md }}
            />
          </Card>
        )}

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeader}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => router.push('/(tabs)/create')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <Sparkles size={22} color={colors.primaryLight} />
            </View>
            <Text style={styles.actionTileTitle}>Generate Project</Text>
            <Text style={styles.actionTileSub}>AI blueprint wizard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <Compass size={22} color={colors.secondaryLight} />
            </View>
            <Text style={styles.actionTileTitle}>Explore Blueprints</Text>
            <Text style={styles.actionTileSub}>Browse 40+ projects</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => {
              if (activeProject) {
                router.push({
                  pathname: '/workspace/tasks',
                  params: { projectId: activeProject._id },
                });
              } else {
                router.push('/(tabs)/projects');
              }
            }}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <CheckSquare size={22} color={colors.success} />
            </View>
            <Text style={styles.actionTileTitle}>My Tasks</Text>
            <Text style={styles.actionTileSub}>Interactive Kanban</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => {
              if (activeProject) {
                router.push({
                  pathname: '/workspace/assistant',
                  params: { projectId: activeProject._id },
                });
              } else {
                router.push('/(tabs)/projects');
              }
            }}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Bot size={22} color={colors.warning} />
            </View>
            <Text style={styles.actionTileTitle}>AI Mentor</Text>
            <Text style={styles.actionTileSub}>Contextual assistance</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Projects List */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionHeader}>RECOMMENDED FOR YOU</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {recommendedProjects.map((proj) => (
          <Card
            key={proj._id}
            title={proj.title}
            subtitle={proj.category}
            headerRight={
              <Badge
                label={proj.difficulty || 'Intermediate'}
                variant={
                  proj.difficulty === 'Beginner'
                    ? 'success'
                    : proj.difficulty === 'Advanced'
                    ? 'danger'
                    : 'warning'
                }
                size="sm"
              />
            }
            onPress={() => router.push(`/project/${proj._id}` as any)}
          >
            <Text style={styles.projectDesc} numberOfLines={2}>
              {proj.description}
            </Text>
            <View style={styles.techTagsRow}>
              {proj.techStack?.slice(0, 3).map((tech) => (
                <View key={tech} style={styles.techTag}>
                  <Text style={styles.techTagText}>{tech}</Text>
                </View>
              ))}
              <Text style={styles.matchScore}>95% Match</Text>
            </View>
          </Card>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greetingText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  userNameText: {
    ...typography.h2,
    color: colors.text,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderHighlight,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  scoreSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
  scoreBadgeWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
  },
  projectDesc: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    marginVertical: spacing.xs,
  },
  projectMetaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  emptyProjectCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptySub: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
  },
  sectionHeader: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  seeAllText: {
    ...typography.captionBold,
    color: colors.primaryLight,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionTile: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionTileTitle: {
    ...typography.captionBold,
    color: colors.text,
  },
  actionTileSub: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  techTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  techTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  techTagText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  matchScore: {
    ...typography.tiny,
    color: colors.success,
    marginLeft: 'auto',
    fontWeight: '700',
  },
});
