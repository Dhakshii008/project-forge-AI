import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  FileText,
  Cpu,
  Database,
  Globe,
  Layout,
  GitBranch,
  CheckSquare,
  Code2,
  FlaskConical,
  BookOpen,
  Cloud,
  Briefcase,
  ChevronRight,
} from 'lucide-react-native';
import { projectService } from '../../src/services/projectService';
import { Project } from '../../src/types';
import { Card, Badge, Button, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceHubScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProject();
  };

  const modules = [
    {
      id: 'overview',
      name: 'Overview',
      desc: 'Problem, solution, goals & tech stack',
      icon: <Layers size={20} color={colors.primaryLight} />,
      status: 'completed',
      route: '/workspace/overview',
    },
    {
      id: 'requirements',
      name: 'Requirements',
      desc: 'Functional, non-functional & user stories',
      icon: <FileText size={20} color={colors.secondaryLight} />,
      status: 'completed',
      route: '/workspace/requirements',
    },
    {
      id: 'architecture',
      name: 'Architecture',
      desc: 'Monolith vs Microservices & Mermaid',
      icon: <Cpu size={20} color="#a855f7" />,
      status: 'completed',
      route: '/workspace/architecture',
    },
    {
      id: 'database',
      name: 'Database Schema',
      desc: 'MongoDB, PostgreSQL collections & fields',
      icon: <Database size={20} color={colors.success} />,
      status: 'completed',
      route: '/workspace/database',
    },
    {
      id: 'api',
      name: 'API Designer',
      desc: 'REST endpoints, cURL & payloads',
      icon: <Globe size={20} color={colors.warning} />,
      status: 'completed',
      route: '/workspace/api',
    },
    {
      id: 'uiux',
      name: 'UI/UX Planner',
      desc: 'Mobile-first screens, design system & flow',
      icon: <Layout size={20} color="#ec4899" />,
      status: 'completed',
      route: '/workspace/uiux',
    },
    {
      id: 'roadmap',
      name: 'Roadmap',
      desc: '8-phase engineering milestones',
      icon: <GitBranch size={20} color="#f97316" />,
      status: 'in-progress',
      route: '/workspace/roadmap',
    },
    {
      id: 'tasks',
      name: 'Task Management',
      desc: 'Interactive Kanban & Sprint items',
      icon: <CheckSquare size={20} color={colors.primaryLight} />,
      status: 'in-progress',
      route: '/workspace/tasks',
    },
    {
      id: 'assistant',
      name: 'AI Development Assistant',
      desc: 'Contextual mentor & code troubleshooter',
      icon: <Bot size={20} color={colors.secondaryLight} />,
      status: 'completed',
      route: '/workspace/assistant',
    },
    {
      id: 'starter-code',
      name: 'Starter Code',
      desc: 'Project directory tree & boilerplates',
      icon: <Code2 size={20} color="#14b8a6" />,
      status: 'completed',
      route: '/workspace/starter-code',
    },
    {
      id: 'testing',
      name: 'Testing Center',
      desc: 'Unit, integration & API test suites',
      icon: <FlaskConical size={20} color="#8b5cf6" />,
      status: 'in-progress',
      route: '/workspace/testing',
    },
    {
      id: 'documentation',
      name: 'Documentation',
      desc: 'README, SRS & technical abstracts',
      icon: <BookOpen size={20} color={colors.success} />,
      status: 'completed',
      route: '/workspace/documentation',
    },
    {
      id: 'deployment',
      name: 'Deployment Center',
      desc: 'Vercel, Render & Atlas deployment guides',
      icon: <Cloud size={20} color={colors.secondaryLight} />,
      status: 'completed',
      route: '/workspace/deployment',
    },
    {
      id: 'portfolio',
      name: 'Public Portfolio',
      desc: 'Showcase URL & recruiter-ready presentation',
      icon: <Briefcase size={20} color="#eab308" />,
      status: 'completed',
      route: '/workspace/portfolio',
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading workspace modules..." />;
  }

  const progress = project?.progress || 72;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {project?.title || 'Project Workspace'}
          </Text>
          <Text style={styles.headerSub}>14 Engineering Modules</Text>
        </View>
        <TouchableOpacity
          style={styles.aiMentorNavBtn}
          onPress={() =>
            router.push({
              pathname: '/workspace/assistant',
              params: { projectId: id },
            })
          }
        >
          <Bot size={20} color={colors.secondaryLight} />
        </TouchableOpacity>
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
        {/* Workspace Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryCategory}>
                {project?.category || 'Full Stack Engineering'}
              </Text>
              <Text style={styles.summaryTitle}>{project?.title}</Text>
            </View>
            <Badge
              label={`${progress}% Complete`}
              variant={progress >= 70 ? 'success' : 'primary'}
              size="sm"
            />
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </Card>

        {/* 14 Engineering Modules List */}
        <Text style={styles.sectionHeader}>WORKSPACE MODULES</Text>

        {modules.map((m, idx) => (
          <TouchableOpacity
            key={m.id}
            style={styles.moduleCard}
            activeOpacity={0.75}
            onPress={() =>
              router.push({
                pathname: m.route as any,
                params: { projectId: id },
              })
            }
          >
            <View style={styles.moduleIconBox}>{m.icon}</View>

            <View style={styles.moduleInfo}>
              <View style={styles.moduleNameRow}>
                <Text style={styles.moduleIndex}>0{idx + 1}</Text>
                <Text style={styles.moduleName}>{m.name}</Text>
              </View>
              <Text style={styles.moduleDesc} numberOfLines={1}>
                {m.desc}
              </Text>
            </View>

            <View style={styles.statusCol}>
              {m.status === 'completed' ? (
                <CheckCircle2 size={18} color={colors.success} />
              ) : (
                <Clock size={16} color={colors.warning} />
              )}
              <ChevronRight size={16} color={colors.textSubtle} style={{ marginTop: 4 }} />
            </View>
          </TouchableOpacity>
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
  headerTitleWrapper: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  headerSub: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  aiMentorNavBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.surface,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  summaryCategory: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 0.5,
  },
  summaryTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.text,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  sectionHeader: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  moduleIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moduleIndex: {
    ...typography.tiny,
    color: colors.textSubtle,
    fontWeight: '700',
  },
  moduleName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  moduleDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusCol: {
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});
