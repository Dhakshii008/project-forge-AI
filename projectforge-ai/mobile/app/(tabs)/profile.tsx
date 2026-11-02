import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Shield,
  LogOut,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { useAuth } from '../../src/store/authContext';
import { skillService } from '../../src/services/skillService';
import { projectService } from '../../src/services/projectService';
import { Button, Card, Badge, SkillRadar } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [skillData, setSkillData] = useState<{
    overallScore: number;
    skills: { name: string; score: number }[];
    strongSkills: string[];
    weakSkills: string[];
    recommendedTech: string[];
    careerFit: string;
  }>({
    overallScore: 82,
    skills: [
      { name: 'TypeScript', score: 88 },
      { name: 'React', score: 85 },
      { name: 'Node.js', score: 80 },
      { name: 'MongoDB', score: 78 },
      { name: 'System Design', score: 72 },
      { name: 'Testing', score: 65 },
    ],
    strongSkills: ['TypeScript', 'React', 'Node.js'],
    weakSkills: ['Automated Testing', 'Docker / CI/CD', 'Kubernetes'],
    recommendedTech: ['Jest / Cypress', 'Docker', 'FastAPI'],
    careerFit: 'Full Stack Engineer (88% Match)',
  });

  const [projectCount, setProjectCount] = useState(3);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const res = await skillService.getSkillProfile();
        if (res.success && res.data) {
          setSkillData(res.data);
        }
        const projRes = await projectService.getMyProjects();
        if (projRes.success && projRes.data) {
          setProjectCount(projRes.data.length);
        }
      } catch (err) {
        // Fallback data present
      }
    };
    loadProfileData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to end your active session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Engineering Profile</Text>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={styles.settingsIconBtn}
        >
          <Settings size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* User Profile Card */}
        <Card style={styles.userCard}>
          <View style={styles.userRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.userName}>{user?.name || 'Student Engineer'}</Text>
                <Badge
                  label={user?.role || 'STUDENT'}
                  variant={user?.role === 'ADMIN' ? 'secondary' : 'primary'}
                  size="sm"
                />
              </View>
              <Text style={styles.userEmail}>{user?.email || 'student@projectforge.ai'}</Text>
            </View>
          </View>

          {/* Academic & Career details */}
          <View style={styles.academicGrid}>
            <View style={styles.academicItem}>
              <GraduationCap size={16} color={colors.primaryLight} />
              <Text style={styles.academicText}>
                {user?.college || 'Massachusetts Institute of Tech'}
              </Text>
            </View>
            <View style={styles.academicItem}>
              <Briefcase size={16} color={colors.secondaryLight} />
              <Text style={styles.academicText}>
                {user?.careerGoal || 'Full Stack Engineer'}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{projectCount}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{skillData.overallScore}%</Text>
              <Text style={styles.statLabel}>Skill Score</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>14</Text>
              <Text style={styles.statLabel}>Modules</Text>
            </View>
          </View>
        </Card>

        {/* Skill Intelligence Section */}
        <Text style={styles.sectionHeader}>SKILL INTELLIGENCE</Text>
        <Card title="Skill Proficiency Radar" subtitle="Multi-dimensional competency assessment">
          <SkillRadar skills={skillData.skills} />

          <View style={styles.careerFitBox}>
            <Award size={18} color={colors.secondaryLight} />
            <Text style={styles.careerFitText}>{skillData.careerFit}</Text>
          </View>

          {/* Strengths & Gaps */}
          <View style={styles.gapGrid}>
            <View style={styles.gapCol}>
              <View style={styles.gapHeader}>
                <CheckCircle2 size={14} color={colors.success} />
                <Text style={styles.strongLabel}>Strong Areas</Text>
              </View>
              {skillData.strongSkills.map((s) => (
                <Text key={s} style={styles.skillBullet}>
                  • {s}
                </Text>
              ))}
            </View>

            <View style={styles.gapCol}>
              <View style={styles.gapHeader}>
                <AlertCircle size={14} color={colors.warning} />
                <Text style={styles.weakLabel}>Skill Gaps</Text>
              </View>
              {skillData.weakSkills.map((w) => (
                <Text key={w} style={styles.skillBullet}>
                  • {w}
                </Text>
              ))}
            </View>
          </View>

          {/* Recommended Tech */}
          <Text style={styles.recTitle}>RECOMMENDED TECHNOLOGIES TO LEARN</Text>
          <View style={styles.recChipsRow}>
            {skillData.recommendedTech.map((tech) => (
              <View key={tech} style={styles.recChip}>
                <Zap size={12} color={colors.primaryLight} />
                <Text style={styles.recChipText}>{tech}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Admin Portal Tile (Only if user.role === 'ADMIN') */}
        {user?.role === 'ADMIN' && (
          <Card
            title="Admin Management Console"
            subtitle="Manage students, system technologies, and project moderation"
            headerRight={<Badge label="Admin Access" variant="secondary" size="sm" />}
            onPress={() => router.push('/admin/index')}
            style={styles.adminCard}
          >
            <View style={styles.adminRow}>
              <Shield size={24} color={colors.secondaryLight} />
              <Text style={styles.adminText}>
                Open privileged admin panel with RBAC verification
              </Text>
            </View>
          </Card>
        )}

        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          icon={<LogOut size={16} color={colors.danger} />}
          textStyle={{ color: colors.danger }}
          style={styles.logoutBtn}
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  settingsIconBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  userCard: {
    backgroundColor: colors.surface,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  userInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userName: {
    ...typography.h2,
    fontSize: 18,
    color: colors.text,
  },
  userEmail: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  academicGrid: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  academicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  academicText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    marginTop: 2,
  },
  sectionHeader: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  careerFitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: 8,
    marginVertical: spacing.md,
  },
  careerFitText: {
    ...typography.captionBold,
    color: colors.secondaryLight,
  },
  gapGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  gapCol: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  gapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  strongLabel: {
    ...typography.captionBold,
    color: colors.success,
  },
  weakLabel: {
    ...typography.captionBold,
    color: colors.warning,
  },
  skillBullet: {
    ...typography.tiny,
    color: colors.textMuted,
    lineHeight: 18,
  },
  recTitle: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  recChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  recChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recChipText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  adminCard: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    marginVertical: spacing.md,
  },
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  adminText: {
    ...typography.captionBold,
    color: colors.secondaryLight,
    flex: 1,
  },
  logoutBtn: {
    marginTop: spacing.xl,
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
});
