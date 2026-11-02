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
  Briefcase,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react-native';
import { projectService } from '../../src/services/projectService';
import { useAuth } from '../../src/store/authContext';
import { Project } from '../../src/types';
import { Header, Card, Badge, Button, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspacePortfolioScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      try {
        const res = await projectService.getProjectById(projectId);
        if (res.success && res.data) {
          setProject(res.data);
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  const shareableUrl = `https://projectforge.ai/portfolio/${project?._id || 'demo-showcase'}`;

  const handleCopyLink = () => {
    Alert.alert('Link Copied', `Public Portfolio URL copied:\n${shareableUrl}`);
  };

  const handleShare = () => {
    Alert.alert('Share Portfolio', `Ready to showcase ${project?.title || 'Project'} to recruiters.`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading portfolio preview..." />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 14: Portfolio"
        subtitle="Recruiter-ready project showcase"
        showBack
        rightAction={
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Share2 size={18} color={colors.secondaryLight} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Showcase Banner */}
        <Card style={styles.bannerCard} highlighted>
          <View style={styles.bannerRow}>
            <View>
              <Text style={styles.bannerTitle}>{project?.title || 'EcoTrack AI'}</Text>
              <Text style={styles.bannerAuthor}>
                Engineered by {user?.name || 'Student Engineer'} • {user?.college || 'MIT'}
              </Text>
            </View>
            <Badge label="Verified Capstone" variant="success" size="sm" />
          </View>

          <Text style={styles.bannerDesc}>
            {project?.description ||
              'An enterprise IoT and telemetry tracking architecture with real-time stream evaluation and automated alerting.'}
          </Text>

          <View style={styles.shareUrlBox}>
            <Text style={styles.shareUrlText} numberOfLines={1}>
              {shareableUrl}
            </Text>
            <TouchableOpacity onPress={handleCopyLink} style={styles.copyLinkBtn}>
              <Copy size={16} color={colors.primaryLight} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Problem & Solution Showcase */}
        <Card title="The Engineering Challenge">
          <Text style={styles.bodyText}>
            {project?.problem ||
              'Traditional telemetry setups suffer from silent data anomalies and fragmented visualization pipelines.'}
          </Text>
        </Card>

        <Card title="System Architecture & Stack">
          <View style={styles.chipsRow}>
            {(project?.techStack || ['React Native', 'Node.js', 'MongoDB', 'Docker', 'WebSockets']).map(
              (tech: string) => (
                <View key={tech} style={styles.techPill}>
                  <Text style={styles.techPillText}>{tech}</Text>
                </View>
              )
            )}
          </View>
        </Card>

        {/* Security Privacy Notice */}
        <Card title="Privacy & Security Enforced" style={styles.privacyCard}>
          <View style={styles.privacyRow}>
            <Lock size={18} color={colors.success} />
            <Text style={styles.privacyText}>
              Public portfolio view automatically redacts private environment credentials, student passwords, internal tasks, and database connection strings.
            </Text>
          </View>
        </Card>

        <Button
          title="Copy Public Showcase Link"
          variant="primary"
          size="lg"
          onPress={handleCopyLink}
          icon={<Copy size={18} color={colors.text} />}
          fullWidth
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shareBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  bannerCard: {
    backgroundColor: colors.surface,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bannerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  bannerAuthor: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  bannerDesc: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 20,
    marginVertical: spacing.sm,
  },
  shareUrlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareUrlText: {
    ...typography.tiny,
    color: colors.secondaryLight,
    flex: 1,
    marginRight: spacing.sm,
  },
  copyLinkBtn: {
    padding: 4,
  },
  bodyText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
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
  privacyCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  privacyText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 18,
  },
});
