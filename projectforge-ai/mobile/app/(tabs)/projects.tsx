import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FolderGit2,
  Plus,
  Play,
  Trash2,
  GitFork,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { projectService } from '../../src/services/projectService';
import { Project } from '../../src/types';
import { Card, Badge, Button, EmptyState, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function MyProjectsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Drafts' | 'Completed'>('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyProjects = async () => {
    try {
      const res = await projectService.getMyProjects();
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      // Fallback handled
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyProjects();
  };

  const handleDelete = (projectId: string, title: string) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await projectService.deleteProject(projectId);
            setProjects(projects.filter((p) => p._id !== projectId));
          },
        },
      ]
    );
  };

  const handleFork = async (projectId: string) => {
    try {
      const res = await projectService.forkProject(projectId);
      if (res.success && res.data) {
        Alert.alert('Project Forked', 'Created a working copy in your workspace.');
        fetchMyProjects();
      }
    } catch (err) {
      Alert.alert('Error', 'Could not fork project.');
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return p.status === 'Active' || !p.status;
    if (activeTab === 'Drafts') return p.status === 'Draft';
    if (activeTab === 'Completed') return p.status === 'Completed';
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Projects</Text>
          <Text style={styles.headerSubtitle}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} in your engineering workspace
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Plus size={18} color={colors.text} />
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(['All', 'Active', 'Drafts', 'Completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabBtn,
              activeTab === tab && styles.tabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Projects List */}
      {loading ? (
        <LoadingSpinner message="Loading your projects..." />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 size={44} color={colors.primaryLight} />}
          title="No projects here"
          message={
            activeTab === 'All'
              ? "You haven't created a project yet. Start with our AI generator or explore existing blueprints."
              : `You have no ${activeTab.toLowerCase()} projects.`
          }
          actionTitle="Generate New Project"
          onAction={() => router.push('/(tabs)/create')}
        />
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primaryLight}
            />
          }
          renderItem={({ item }) => {
            const progress = item.progress || 0;
            return (
              <Card
                title={item.title}
                subtitle={item.category || 'Full Stack'}
                headerRight={
                  <Badge
                    label={item.status || 'Active'}
                    variant={
                      item.status === 'Completed'
                        ? 'success'
                        : item.status === 'Draft'
                        ? 'neutral'
                        : 'primary'
                    }
                    size="sm"
                  />
                }
              >
                <Text style={styles.projectDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Progress bar */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressText}>Progress</Text>
                    <Text style={styles.progressPercent}>{progress}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                </View>

                {/* Tech Tags */}
                <View style={styles.techRow}>
                  {item.techStack?.slice(0, 3).map((t: string) => (
                    <View key={t} style={styles.techPill}>
                      <Text style={styles.techPillText}>{t}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Buttons Row */}
                <View style={styles.cardActionsRow}>
                  <Button
                    title="Open Workspace"
                    variant="primary"
                    size="sm"
                    onPress={() => router.push(`/workspace/${item._id}` as any)}
                    icon={<Play size={14} color={colors.text} />}
                    style={{ flex: 1 }}
                  />
                  <TouchableOpacity
                    style={styles.iconActionBtn}
                    onPress={() => handleFork(item._id)}
                  >
                    <GitFork size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconActionBtn}
                    onPress={() => handleDelete(item._id, item.title)}
                  >
                    <Trash2 size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  newBtnText: {
    ...typography.captionBold,
    color: colors.text,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tabBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  tabBtnActive: {
    backgroundColor: colors.surfaceHighlight,
  },
  tabText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  projectDesc: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    marginVertical: spacing.xs,
  },
  progressSection: {
    marginVertical: spacing.sm,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    ...typography.tiny,
    color: colors.textSubtle,
  },
  progressPercent: {
    ...typography.tiny,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  techRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: spacing.xs,
  },
  techPill: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  techPillText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iconActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
