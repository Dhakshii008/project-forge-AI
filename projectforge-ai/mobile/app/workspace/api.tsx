import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Globe, ChevronDown, ChevronUp, Copy, Lock, ShieldCheck } from 'lucide-react-native';
import { workspaceService } from '../../src/services/workspaceService';
import { ApiEndpoint } from '../../src/types';
import { Header, Card, Badge, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceApiScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>('ep-1');

  useEffect(() => {
    const loadApis = async () => {
      if (!projectId) return;
      try {
        const res = await workspaceService.getApiEndpoints(projectId);
        if (res.success && res.data) {
          const epList = (res.data as any).endpoints || (Array.isArray(res.data) ? res.data : []);
          if (epList.length > 0) setEndpoints(epList);
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadApis();
  }, [projectId]);

  const fallbackEndpoints: ApiEndpoint[] = [
    {
      _id: 'ep-1',
      path: '/api/auth/login',
      method: 'POST',
      description: 'Authenticate user credentials and generate JWT token',
      requestBody: '{\n  "email": "student@projectforge.ai",\n  "password": "Password@123"\n}',
      responseBody: '{\n  "success": true,\n  "data": {\n    "token": "eyJhbGciOi...",\n    "user": { "role": "STUDENT" }\n  }\n}',
      authRequired: false,
    },
    {
      _id: 'ep-2',
      path: '/api/projects',
      method: 'GET',
      description: 'Retrieve projects belonging to the authenticated student',
      responseBody: '{\n  "success": true,\n  "data": [\n    { "_id": "...", "title": "EcoTrack AI", "progress": 72 }\n  ]\n}',
      authRequired: true,
    },
    {
      _id: 'ep-3',
      path: '/api/ai/generate',
      method: 'POST',
      description: 'Synthesize full software architecture and module specs using AI engine',
      requestBody: '{\n  "prompt": "IoT energy monitoring dashboard",\n  "domain": "AI & ML",\n  "difficulty": "Intermediate"\n}',
      responseBody: '{\n  "success": true,\n  "data": {\n    "title": "EcoTrack AI",\n    "features": [...]\n  }\n}',
      authRequired: true,
    },
  ];

  const list = endpoints.length > 0 ? endpoints : fallbackEndpoints;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopyCurl = (ep: ApiEndpoint) => {
    Alert.alert('cURL Copied', `curl -X ${ep.method} https://api.projectforge.ai${ep.path}`);
  };

  const getMethodBadgeVariant = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'secondary';
      case 'POST':
        return 'success';
      case 'PUT':
        return 'warning';
      case 'DELETE':
        return 'danger';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading API catalog..." />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 05: API Designer"
        subtitle="RESTful contract specifications"
        showBack
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {list.map((ep, idx) => {
          const epKey = ep._id || ep.id || `ep-${idx}`;
          const isExpanded = expandedId === epKey;
          return (
            <Card key={epKey}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggleExpand(epKey)}
              >
                <View style={styles.methodPathRow}>
                  <Badge
                    label={ep.method}
                    variant={getMethodBadgeVariant(ep.method) as any}
                    size="sm"
                  />
                  <Text style={styles.pathText} numberOfLines={1}>
                    {ep.path}
                  </Text>
                </View>
                {isExpanded ? (
                  <ChevronUp size={20} color={colors.textMuted} />
                ) : (
                  <ChevronDown size={20} color={colors.textMuted} />
                )}
              </TouchableOpacity>

              <Text style={styles.descText}>{ep.description}</Text>

              {isExpanded && (
                <View style={styles.detailsContainer}>
                  {/* Auth Requirement */}
                  <View style={styles.authRow}>
                    <Lock size={14} color={ep.authRequired ? colors.warning : colors.textSubtle} />
                    <Text style={styles.authText}>
                      {ep.authRequired ? 'Authorization: Bearer <JWT>' : 'Public (No Auth Required)'}
                    </Text>
                  </View>

                  {/* Request Body */}
                  {ep.requestBody && (
                    <View style={styles.codeSection}>
                      <Text style={styles.codeLabel}>REQUEST PAYLOAD (JSON)</Text>
                      <View style={styles.codeBlock}>
                        <Text style={styles.codeContent}>{ep.requestBody}</Text>
                      </View>
                    </View>
                  )}

                  {/* Response Body */}
                  {ep.responseBody && (
                    <View style={styles.codeSection}>
                      <Text style={styles.codeLabel}>200 OK RESPONSE</Text>
                      <View style={styles.codeBlock}>
                        <Text style={styles.codeContent}>{ep.responseBody}</Text>
                      </View>
                    </View>
                  )}

                  {/* Copy cURL Button */}
                  <TouchableOpacity
                    style={styles.curlBtn}
                    onPress={() => handleCopyCurl(ep)}
                  >
                    <Copy size={14} color={colors.primaryLight} />
                    <Text style={styles.curlBtnText}>Copy cURL Command</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          );
        })}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodPathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  pathText: {
    ...typography.bodyBold,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
  },
  descText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  detailsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  authText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  codeSection: {
    marginVertical: spacing.xs,
  },
  codeLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginBottom: 4,
  },
  codeBlock: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  codeContent: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.secondaryLight,
    fontSize: 11,
    lineHeight: 16,
  },
  curlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
  },
  curlBtnText: {
    ...typography.captionBold,
    color: colors.primaryLight,
  },
});
