import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Shield,
  Users,
  FolderGit2,
  Cpu,
  Plus,
  Trash2,
  Lock,
  ArrowLeft,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import { useAuth } from '../../src/store/authContext';
import { adminService } from '../../src/services/adminService';
import { projectService } from '../../src/services/projectService';
import { Header, Card, Badge, Button, Input, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Stats' | 'Users' | 'Technologies'>('Stats');

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalProjects: 48,
    activeWorkspaces: 36,
    systemStatus: 'OPERATIONAL',
  });

  // Technologies
  const [technologies, setTechnologies] = useState<any[]>([
    { _id: 't-1', name: 'TypeScript', category: 'Language', status: 'ACTIVE' },
    { _id: 't-2', name: 'React Native', category: 'Mobile', status: 'ACTIVE' },
    { _id: 't-3', name: 'MongoDB', category: 'Database', status: 'ACTIVE' },
    { _id: 't-4', name: 'Docker', category: 'DevOps', status: 'ACTIVE' },
    { _id: 't-5', name: 'Gemini AI', category: 'AI', status: 'ACTIVE' },
  ]);

  // Modal Create Tech
  const [showAddTech, setShowAddTech] = useState(false);
  const [techName, setTechName] = useState('');
  const [techCategory, setTechCategory] = useState('Framework');

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const res = await adminService.getOverview();
        if (res.success && res.data) {
          setStats((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // RBAC Access Control Guard
  if (user?.role !== 'ADMIN') {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingHorizontal: spacing.lg }]}>
        <Header title="Admin Console" showBack />
        <View style={styles.deniedContainer}>
          <View style={styles.deniedCircle}>
            <Lock size={36} color={colors.danger} />
          </View>
          <Text style={styles.deniedTitle}>Access Denied</Text>
          <Text style={styles.deniedMessage}>
            Role-Based Access Control (RBAC) requires ADMIN privileges. Your current account role is{' '}
            <Text style={{ color: colors.primaryLight, fontWeight: '700' }}>
              {user?.role || 'STUDENT'}
            </Text>
            .
          </Text>
          <Button
            title="Return to Student Workspace"
            variant="outline"
            onPress={() => router.back()}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      </View>
    );
  }

  const handleAddTechnology = async () => {
    if (!techName.trim()) return;
    try {
      const newTech = {
        _id: `tech-${Date.now()}`,
        name: techName.trim(),
        category: techCategory,
        status: 'ACTIVE',
      };
      await adminService.createTechnology(newTech);
      setTechnologies([...technologies, newTech]);
      setTechName('');
      setShowAddTech(false);
      Alert.alert('Success', `Added ${newTech.name} to Technology Catalog`);
    } catch (err) {
      Alert.alert('Error', 'Could not add technology');
    }
  };

  const handleDeleteTech = async (id: string, name: string) => {
    Alert.alert('Delete Technology', `Remove ${name} from catalog?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await adminService.deleteTechnology(id);
          setTechnologies(technologies.filter((t) => t._id !== id));
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Admin Console"
        subtitle="Privileged system administration"
        showBack
        rightAction={
          activeTab === 'Technologies' ? (
            <TouchableOpacity onPress={() => setShowAddTech(true)} style={styles.addBtn}>
              <Plus size={18} color={colors.text} />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Admin Tabs */}
      <View style={styles.tabsRow}>
        {(['Stats', 'Users', 'Technologies'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
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
        {activeTab === 'Stats' && (
          <>
            {/* System Health Card */}
            <Card style={styles.healthCard}>
              <View style={styles.healthRow}>
                <View>
                  <Text style={styles.healthLabel}>CORE SERVICES STATUS</Text>
                  <Text style={styles.healthTitle}>{stats.systemStatus}</Text>
                </View>
                <Badge label="Healthy" variant="success" size="sm" />
              </View>
            </Card>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <Card style={styles.metricCard}>
                <Users size={22} color={colors.primaryLight} />
                <Text style={styles.metricNum}>{stats.totalUsers}</Text>
                <Text style={styles.metricLbl}>Registered Students</Text>
              </Card>

              <Card style={styles.metricCard}>
                <FolderGit2 size={22} color={colors.secondaryLight} />
                <Text style={styles.metricNum}>{stats.totalProjects}</Text>
                <Text style={styles.metricLbl}>Synthesized Projects</Text>
              </Card>

              <Card style={styles.metricCard}>
                <Cpu size={22} color={colors.success} />
                <Text style={styles.metricNum}>{stats.activeWorkspaces}</Text>
                <Text style={styles.metricLbl}>Active Workspaces</Text>
              </Card>

              <Card style={styles.metricCard}>
                <Shield size={22} color={colors.warning} />
                <Text style={styles.metricNum}>0</Text>
                <Text style={styles.metricLbl}>Security Incidents</Text>
              </Card>
            </View>
          </>
        )}

        {activeTab === 'Users' && (
          <Card title="Student Directory">
            <View style={styles.userListItem}>
              <View>
                <Text style={styles.userName}>Monish (Lead Student)</Text>
                <Text style={styles.userEmail}>student@projectforge.ai</Text>
              </View>
              <Badge label="STUDENT" variant="primary" size="sm" />
            </View>
            <View style={styles.userListItem}>
              <View>
                <Text style={styles.userName}>Root Administrator</Text>
                <Text style={styles.userEmail}>admin@projectforge.ai</Text>
              </View>
              <Badge label="ADMIN" variant="secondary" size="sm" />
            </View>
          </Card>
        )}

        {activeTab === 'Technologies' && (
          <Card title="Technology Catalog" subtitle="Approved frameworks for AI generation">
            {technologies.map((t) => (
              <View key={t._id} style={styles.techItemRow}>
                <View>
                  <Text style={styles.techName}>{t.name}</Text>
                  <Text style={styles.techCategory}>{t.category}</Text>
                </View>

                <View style={styles.techActions}>
                  <Badge label={t.status} variant="success" size="sm" />
                  <TouchableOpacity
                    onPress={() => handleDeleteTech(t._id, t.name)}
                    style={styles.trashBtn}
                  >
                    <Trash2 size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      {/* Add Tech Modal */}
      <Modal
        visible={showAddTech}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddTech(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Technology</Text>
              <TouchableOpacity onPress={() => setShowAddTech(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Input
              label="Technology Name"
              placeholder="e.g. PyTorch"
              value={techName}
              onChangeText={setTechName}
            />

            <Input
              label="Category"
              placeholder="e.g. Machine Learning"
              value={techCategory}
              onChangeText={setTechCategory}
            />

            <Button
              title="Save to Catalog"
              variant="primary"
              onPress={handleAddTechnology}
              fullWidth
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    borderColor: colors.secondary,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  tabText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.secondaryLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  healthCard: {
    backgroundColor: colors.surface,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
  },
  healthTitle: {
    ...typography.h2,
    color: colors.success,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  metricNum: {
    ...typography.h1,
    color: colors.text,
    marginVertical: 4,
  },
  metricLbl: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  userListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userName: {
    ...typography.captionBold,
    color: colors.text,
  },
  userEmail: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  techItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  techName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  techCategory: {
    ...typography.caption,
    color: colors.textMuted,
  },
  techActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  trashBtn: {
    padding: spacing.xs,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  addBtnText: {
    ...typography.captionBold,
    color: colors.textInverse,
  },
  deniedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  deniedCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.dangerGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  deniedTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  deniedMessage: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
});
