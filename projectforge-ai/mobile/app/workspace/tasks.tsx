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
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react-native';
import { workspaceService } from '../../src/services/workspaceService';
import { Task, TaskStatus, TaskPriority } from '../../src/types';
import { Header, Card, Badge, Button, Input, LoadingSpinner, EmptyState } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceTasksScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | TaskStatus>('ALL');

  // Modal create state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    if (!projectId) return;
    try {
      const res = await workspaceService.getTasks(projectId);
      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleCreateTask = async () => {
    if (!newTitle.trim() || !projectId) return;
    try {
      setCreating(true);
      const res = await workspaceService.createTask(projectId, {
        title: newTitle.trim(),
        status: 'todo',
        priority: newPriority,
      });

      if (res.success && res.data) {
        setTasks([res.data, ...tasks]);
        setNewTitle('');
        setShowCreateModal(false);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleMoveStatus = async (task: Task) => {
    if (!projectId) return;
    let nextStatus: TaskStatus = 'in_progress';
    if (task.status === 'todo') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'completed';
    else nextStatus = 'todo';

    try {
      await workspaceService.updateTask(projectId, task._id, { status: nextStatus });
      setTasks(
        tasks.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      // Keep optimistic
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!projectId) return;
    try {
      await workspaceService.deleteTask(projectId, taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      Alert.alert('Error', 'Could not delete task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'ALL') return true;
    return t.status === activeFilter;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading task board..." />;
  }

  const filters: Array<'ALL' | TaskStatus> = ['ALL', 'todo', 'in_progress', 'completed'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 08: Tasks"
        subtitle="Sprint management & Kanban items"
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={18} color={colors.text} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        }
      />

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter && styles.filterTabTextActive,
              ]}
            >
              {filter.toUpperCase().replace('_', ' ')}
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
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare size={40} color={colors.primaryLight} />}
            title="No tasks in this column"
            message="Create a new task to track development progress."
            actionTitle="Add New Task"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          filteredTasks.map((t) => (
            <Card key={t._id}>
              <View style={styles.taskCardRow}>
                <TouchableOpacity
                  style={styles.statusToggleBtn}
                  onPress={() => handleMoveStatus(t)}
                >
                  {t.status === 'completed' ? (
                    <CheckCircle2 size={22} color={colors.success} />
                  ) : t.status === 'in_progress' ? (
                    <Clock size={20} color={colors.warning} />
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </TouchableOpacity>

                <View style={styles.taskTextCol}>
                  <Text
                    style={[
                      styles.taskTitle,
                      t.status === 'completed' && styles.taskTitleDone,
                    ]}
                  >
                    {t.title}
                  </Text>
                  <View style={styles.taskMetaRow}>
                    <Badge
                      label={t.priority?.toUpperCase() || 'MEDIUM'}
                      variant={
                        t.priority === 'high' || t.priority === 'critical'
                          ? 'danger'
                          : t.priority === 'low'
                          ? 'neutral'
                          : 'warning'
                      }
                      size="sm"
                    />
                    <Text style={styles.statusBadgeText}>
                      {t.status.toUpperCase().replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteTask(t._id)}
                >
                  <Trash2 size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Create Task Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Input
              label="Task Title"
              placeholder="e.g. Implement refresh token rotation"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.priorityLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setNewPriority(p)}
                  style={[
                    styles.priorityBtn,
                    newPriority === p && styles.priorityBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityBtnText,
                      newPriority === p && styles.priorityBtnTextActive,
                    ]}
                  >
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Create Task"
              variant="primary"
              onPress={handleCreateTask}
              loading={creating}
              fullWidth
              style={{ marginTop: spacing.lg }}
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  addBtnText: {
    ...typography.captionBold,
    color: colors.text,
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 6,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  filterTabActive: {
    backgroundColor: colors.surfaceHighlight,
  },
  filterTabText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  filterTabTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  taskCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusToggleBtn: {
    padding: 2,
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderHighlight,
  },
  taskTextCol: {
    flex: 1,
  },
  taskTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSubtle,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  statusBadgeText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  deleteBtn: {
    padding: spacing.xs,
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
  priorityLabel: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  priorityBtnActive: {
    backgroundColor: colors.primary,
  },
  priorityBtnText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  priorityBtnTextActive: {
    color: colors.text,
  },
});
