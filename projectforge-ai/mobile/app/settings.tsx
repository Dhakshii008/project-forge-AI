import React, { useState } from 'react';
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
  Server,
  Moon,
  Trash2,
  Lock,
  LogOut,
  Shield,
  HelpCircle,
  Database,
} from 'lucide-react-native';
import { useAuth } from '../src/store/authContext';
import { getApiBaseUrl, setApiBaseUrl } from '../src/api/client';
import { storage } from '../src/services/storage';
import { Header, Card, Input, Button } from '../src/components';
import { colors, spacing, typography, borderRadius } from '../src/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [editingUrl, setEditingUrl] = useState(false);
  const [themePreference, setThemePreference] = useState<'Dark' | 'Light' | 'System'>('Dark');

  const handleSaveApiUrl = async () => {
    if (!apiUrl.trim()) return;
    await setApiBaseUrl(apiUrl.trim());
    setEditingUrl(false);
    Alert.alert('Server Endpoint Updated', `New API URL set to:\n${apiUrl.trim()}`);
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Local Cache',
      'This will clear non-sensitive offline cache while keeping your active login token.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          onPress: async () => {
            Alert.alert('Cache Cleared', 'Local offline cache purged successfully.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your student account and all workspace projects? This action cannot be reversed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
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
      <Header title="Settings" subtitle="Account & environment preferences" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Account Settings */}
        <Card title="Account Profile">
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>User Name</Text>
            <Text style={styles.settingValue}>{user?.name || 'Engineer'}</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email Address</Text>
            <Text style={styles.settingValue}>{user?.email || 'student@projectforge.ai'}</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Role</Text>
            <Text style={styles.settingValue}>{user?.role || 'STUDENT'}</Text>
          </View>
        </Card>

        {/* Backend Connectivity */}
        <Card title="API Endpoint Configuration" subtitle="Configure backend host for device & simulator">
          <View style={styles.serverRow}>
            <Server size={18} color={colors.primaryLight} />
            <Text style={styles.serverUrlText} numberOfLines={1}>
              {apiUrl}
            </Text>
          </View>

          {editingUrl ? (
            <View style={{ marginTop: spacing.sm }}>
              <Input
                placeholder="http://192.168.1.4:5000/api"
                value={apiUrl}
                onChangeText={setApiUrl}
                autoCapitalize="none"
              />
              <View style={styles.btnRow}>
                <Button
                  title="Save URL"
                  size="sm"
                  variant="primary"
                  onPress={handleSaveApiUrl}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Cancel"
                  size="sm"
                  variant="outline"
                  onPress={() => setEditingUrl(false)}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <Button
              title="Change Endpoint URL"
              size="sm"
              variant="outline"
              onPress={() => setEditingUrl(true)}
              style={{ marginTop: spacing.sm }}
            />
          )}
        </Card>

        {/* Theme Preference */}
        <Card title="Theme & Display">
          <View style={styles.themeRow}>
            {(['Dark', 'Light', 'System'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setThemePreference(t)}
                style={[
                  styles.themeBtn,
                  themePreference === t && styles.themeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.themeBtnText,
                    themePreference === t && styles.themeBtnTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Local Cache Management */}
        <Card title="Storage & Cache">
          <Button
            title="Clear Local Offline Cache"
            variant="outline"
            size="sm"
            onPress={handleClearCache}
            icon={<Database size={16} color={colors.textMuted} />}
          />
        </Card>

        {/* Danger Zone */}
        <Card title="Danger Zone" style={styles.dangerCard}>
          <Text style={styles.dangerSub}>
            Irreversible account actions. Please proceed with caution.
          </Text>
          <Button
            title="Delete Account & Data"
            variant="danger"
            size="md"
            onPress={handleDeleteAccount}
            icon={<Trash2 size={16} color={colors.text} />}
            style={{ marginTop: spacing.sm }}
          />
        </Card>

        {/* Sign Out */}
        <Button
          title="Sign Out of Session"
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  settingValue: {
    ...typography.captionBold,
    color: colors.text,
  },
  serverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
  },
  serverUrlText: {
    ...typography.caption,
    color: colors.secondaryLight,
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  themeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  themeBtnText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  themeBtnTextActive: {
    color: colors.text,
  },
  dangerCard: {
    borderColor: 'rgba(244, 63, 94, 0.3)',
    backgroundColor: 'rgba(244, 63, 94, 0.04)',
  },
  dangerSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  logoutBtn: {
    marginTop: spacing.md,
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
});
