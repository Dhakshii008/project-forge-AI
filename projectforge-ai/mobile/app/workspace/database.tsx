import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Database, Key, Hash, FileCode, CheckCircle2 } from 'lucide-react-native';
import { workspaceService } from '../../src/services/workspaceService';
import { DatabaseSchema } from '../../src/types';
import { Header, Card, Badge, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceDatabaseScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [dbType, setDbType] = useState<'mongodb' | 'postgresql' | 'mysql'>('mongodb');
  const [schemaData, setSchemaData] = useState<DatabaseSchema | null>(null);

  useEffect(() => {
    const loadSchema = async () => {
      if (!projectId) return;
      try {
        const res = await workspaceService.getDatabaseSchema(projectId);
        if (res.success && res.data) {
          setSchemaData(res.data);
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadSchema();
  }, [projectId]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading database schema..." />;
  }

  const collections = schemaData?.collections || [
    {
      name: 'users',
      description: 'Stores student and admin credentials & profiles',
      fields: [
        { name: '_id', type: 'ObjectId', required: true, description: 'Primary key' },
        { name: 'email', type: 'String', required: true, description: 'Unique email index' },
        { name: 'password', type: 'String', required: true, description: 'Hashed bcrypt secret' },
        { name: 'role', type: 'String', required: true, description: 'STUDENT | ADMIN' },
        { name: 'createdAt', type: 'Date', required: true, description: 'Timestamp' },
      ],
      indexes: ['{ email: 1 } (unique)', '{ role: 1 }'],
    },
    {
      name: 'projects',
      description: 'Core project specifications and engineering metadata',
      fields: [
        { name: '_id', type: 'ObjectId', required: true, description: 'Primary key' },
        { name: 'ownerId', type: 'ObjectId', required: true, description: 'Foreign key to users._id' },
        { name: 'title', type: 'String', required: true, description: 'Project title' },
        { name: 'status', type: 'String', required: true, description: 'Active | Completed | Draft' },
        { name: 'progress', type: 'Number', required: true, description: 'Completion percentage (0-100)' },
      ],
      indexes: ['{ ownerId: 1, status: 1 }', '{ createdAt: -1 }'],
    },
    {
      name: 'tasks',
      description: 'Agile Kanban engineering tasks per project',
      fields: [
        { name: '_id', type: 'ObjectId', required: true, description: 'Primary key' },
        { name: 'projectId', type: 'ObjectId', required: true, description: 'Foreign key to projects._id' },
        { name: 'title', type: 'String', required: true, description: 'Task title' },
        { name: 'status', type: 'String', required: true, description: 'TODO | IN_PROGRESS | DONE' },
        { name: 'priority', type: 'String', required: true, description: 'LOW | MEDIUM | HIGH' },
      ],
      indexes: ['{ projectId: 1, status: 1 }'],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 04: Database"
        subtitle="Collections, fields, types & indexes"
        showBack
      />

      {/* Engine Selector */}
      <View style={styles.engineRow}>
        {(['mongodb', 'postgresql', 'mysql'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setDbType(type)}
            style={[styles.engineBtn, dbType === type && styles.engineBtnActive]}
          >
            <Text style={[styles.engineText, dbType === type && styles.engineTextActive]}>
              {type === 'mongodb' ? 'MongoDB' : type === 'postgresql' ? 'PostgreSQL' : 'MySQL'}
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
        {collections.map((col: any) => (
          <Card
            key={col.name}
            title={col.name}
            subtitle={col.description}
            headerRight={<Badge label={dbType.toUpperCase()} variant="secondary" size="sm" />}
          >
            <Text style={styles.fieldsSectionTitle}>FIELDS & DATA TYPES</Text>

            <View style={styles.fieldsContainer}>
              {col.fields.map((f: any) => (
                <View key={f.name} style={styles.fieldRow}>
                  <View style={styles.fieldNameGroup}>
                    <Hash size={13} color={colors.textSubtle} />
                    <Text style={styles.fieldName}>{f.name}</Text>
                    {f.required && <Text style={styles.requiredStar}>*</Text>}
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{f.type}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Indexes */}
            {col.indexes && col.indexes.length > 0 && (
              <View style={styles.indexSection}>
                <Text style={styles.indexTitle}>INDEXES</Text>
                {col.indexes.map((idx: string, i: number) => (
                  <View key={i} style={styles.indexRow}>
                    <Key size={12} color={colors.warning} />
                    <Text style={styles.indexText}>{idx}</Text>
                  </View>
                ))}
              </View>
            )}
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
  engineRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  engineBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  engineBtnActive: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  engineText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  engineTextActive: {
    color: colors.secondaryLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  fieldsSectionTitle: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginVertical: spacing.xs,
  },
  fieldsContainer: {
    gap: 6,
    marginVertical: spacing.xs,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldName: {
    ...typography.captionBold,
    color: colors.text,
  },
  requiredStar: {
    color: colors.danger,
    fontSize: 12,
  },
  typeBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    ...typography.tiny,
    color: colors.primaryLight,
  },
  indexSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  indexTitle: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginBottom: 4,
  },
  indexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  indexText: {
    ...typography.tiny,
    color: colors.warning,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
