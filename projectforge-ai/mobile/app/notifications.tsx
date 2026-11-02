import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, CheckCircle2, AlertTriangle, Sparkles, Clock, Trash2 } from 'lucide-react-native';
import { Header, Card, Badge, EmptyState } from '../src/components';
import { colors, spacing, typography, borderRadius } from '../src/theme';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'alert' | 'ai';
  read: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Architecture Generated',
      message: 'AI has completed modular system design for EcoTrack AI.',
      timestamp: '10m ago',
      type: 'ai',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Sprint Milestone Achieved',
      message: 'Phase 5: Mobile UI Integration is marked 100% complete.',
      timestamp: '1h ago',
      type: 'success',
      read: false,
    },
    {
      id: 'n-3',
      title: 'Task Reminder',
      message: 'Review Jest integration test coverage for authentication route.',
      timestamp: '3h ago',
      type: 'alert',
      read: true,
    },
    {
      id: 'n-4',
      title: 'Skill Score Increased',
      message: 'Your ProjectForge score climbed to 82% after completing database modeling.',
      timestamp: 'Yesterday',
      type: 'success',
      read: true,
    },
  ]);

  const handleClearAll = () => {
    setNotifications([]);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Notifications"
        subtitle={`${notifications.filter((n) => !n.read).length} unread alerts`}
        showBack
        rightAction={
          notifications.length > 0 ? (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
              <Trash2 size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={40} color={colors.textSubtle} />}
            title="All caught up!"
            message="You have no pending notifications or alerts."
          />
        ) : (
          notifications.map((item) => (
            <Card
              key={item.id}
              style={[
                styles.notifCard,
                !item.read && styles.unreadCard,
              ]}
            >
              <View style={styles.notifRow}>
                <View style={styles.iconBox}>
                  {item.type === 'ai' ? (
                    <Sparkles size={18} color={colors.secondaryLight} />
                  ) : item.type === 'success' ? (
                    <CheckCircle2 size={18} color={colors.success} />
                  ) : (
                    <AlertTriangle size={18} color={colors.warning} />
                  )}
                </View>

                <View style={styles.textCol}>
                  <View style={styles.titleRow}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.timeText}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.descText}>{item.message}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  notifCard: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  unreadCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    ...typography.captionBold,
    color: colors.text,
  },
  timeText: {
    ...typography.tiny,
    color: colors.textSubtle,
  },
  descText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
});
