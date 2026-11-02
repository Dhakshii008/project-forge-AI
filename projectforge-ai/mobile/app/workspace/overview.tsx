import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layers, Save, CheckCircle2 } from 'lucide-react-native';
import { workspaceService } from '../../src/services/workspaceService';
import { projectService } from '../../src/services/projectService';
import { Header, Card, Input, Button, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceOverviewScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [techStack, setTechStack] = useState('');

  useEffect(() => {
    const loadOverview = async () => {
      if (!projectId) return;
      try {
        const res = await projectService.getProjectById(projectId);
        if (res.success && res.data) {
          setTitle(res.data.title || '');
          setProblem(res.data.problem || res.data.description || '');
          setTargetUsers(
            Array.isArray(res.data.targetUsers)
              ? res.data.targetUsers.join(', ')
              : (res.data.targetUsers || 'Software engineers, DevOps teams, Cloud architects')
          );
          setTechStack((res.data.techStack || []).join(', '));
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, [projectId]);

  const handleSave = async () => {
    if (!projectId) return;
    try {
      setSaving(true);
      await projectService.updateProject(projectId, {
        title,
        problem,
        solution,
        targetUsers: targetUsers.split(',').map((u) => u.trim()),
        techStack: techStack.split(',').map((t) => t.trim()),
      });
      Alert.alert('Saved', 'Project overview updated successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update overview.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading project overview..." />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header
          title="Module 01: Overview"
          subtitle={title}
          showBack
          rightAction={
            <Button
              title="Save"
              size="sm"
              variant="primary"
              onPress={handleSave}
              loading={saving}
              icon={<Save size={14} color={colors.text} />}
            />
          }
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Card title="Project Title">
            <Input value={title} onChangeText={setTitle} />
          </Card>

          <Card title="Problem Statement" subtitle="The core friction being eliminated">
            <Input
              multiline
              numberOfLines={4}
              value={problem}
              onChangeText={setProblem}
              style={styles.textArea}
            />
          </Card>

          <Card title="Engineered Solution" subtitle="How your architecture solves the problem">
            <Input
              multiline
              numberOfLines={4}
              value={solution}
              onChangeText={setSolution}
              style={styles.textArea}
            />
          </Card>

          <Card title="Target Audience" subtitle="Primary beneficiaries & stakeholders">
            <Input
              multiline
              numberOfLines={2}
              value={targetUsers}
              onChangeText={setTargetUsers}
              style={[styles.textArea, { minHeight: 60 }]}
            />
          </Card>

          <Card title="Tech Stack" subtitle="Comma-separated technologies">
            <Input value={techStack} onChangeText={setTechStack} />
          </Card>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
