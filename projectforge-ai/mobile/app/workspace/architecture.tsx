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
import { Cpu, Server, Database, Layers, ArrowRight, Code } from 'lucide-react-native';
import { workspaceService } from '../../src/services/workspaceService';
import { Architecture } from '../../src/types';
import { Header, Card, Badge, Button, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function WorkspaceArchitectureScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visual' | 'mermaid'>('visual');
  const [archType, setArchType] = useState<'monolith' | 'microservices'>('monolith');
  const [architecture, setArchitecture] = useState<Architecture | null>(null);

  useEffect(() => {
    const loadArch = async () => {
      if (!projectId) return;
      try {
        const res = await workspaceService.getArchitecture(projectId);
        if (res.success && res.data) {
          setArchitecture(res.data);
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadArch();
  }, [projectId]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading architecture..." />;
  }

  const mermaidCode =
    architecture?.mermaidDiagram ||
    `graph TD
    Client[React Native Mobile / Web App] -->|REST / JWT| Gateway[Express API Gateway]
    Gateway -->|Auth Service| Auth[JWT & Bcrypt Engine]
    Gateway -->|Telemetry Service| Ingest[Event Stream Ingest]
    Gateway -->|DB Service| Mongo[(MongoDB Atlas / Fallback)]
    Gateway -->|AI Gateway| LLM[Gemini / OpenAI / Groq]`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 03: Architecture"
        subtitle="System topology & pipeline flows"
        showBack
      />

      {/* Segmented control: Visual vs Code */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'visual' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('visual')}
        >
          <Text
            style={[
              styles.toggleBtnText,
              activeTab === 'visual' && styles.toggleBtnTextActive,
            ]}
          >
            Component Diagram
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'mermaid' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('mermaid')}
        >
          <Text
            style={[
              styles.toggleBtnText,
              activeTab === 'mermaid' && styles.toggleBtnTextActive,
            ]}
          >
            Mermaid Code
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Architecture Mode Selector */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modePill,
              archType === 'monolith' && styles.modePillActive,
            ]}
            onPress={() => setArchType('monolith')}
          >
            <Text
              style={[
                styles.modePillText,
                archType === 'monolith' && styles.modePillTextActive,
              ]}
            >
              Modular Monolith (Recommended for Students)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modePill,
              archType === 'microservices' && styles.modePillActive,
            ]}
            onPress={() => setArchType('microservices')}
          >
            <Text
              style={[
                styles.modePillText,
                archType === 'microservices' && styles.modePillTextActive,
              ]}
            >
              Production Microservices
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'visual' ? (
          <>
            {/* Visual Flow Representation */}
            <Card title="Mobile-Optimized Architecture Flow">
              {/* Layer 1: Client */}
              <View style={styles.archLayer}>
                <View style={styles.layerHeader}>
                  <Text style={styles.layerLabel}>LAYER 1: PRESENTATION CLIENT</Text>
                </View>
                <View style={styles.componentBox}>
                  <Layers size={18} color={colors.secondaryLight} />
                  <View style={styles.compInfo}>
                    <Text style={styles.compTitle}>React Native Mobile Client (Expo SDK 51)</Text>
                    <Text style={styles.compSub}>
                      Offline-aware cache, Expo Router, SecureStore JWT
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.flowArrow}>
                <ArrowRight size={18} color={colors.primaryLight} style={{ transform: [{ rotate: '90deg' }] }} />
              </View>

              {/* Layer 2: API Gateway & Business Logic */}
              <View style={styles.archLayer}>
                <View style={styles.layerHeader}>
                  <Text style={styles.layerLabel}>LAYER 2: BACKEND APPLICATION CORE</Text>
                </View>
                <View style={styles.componentBox}>
                  <Server size={18} color={colors.primaryLight} />
                  <View style={styles.compInfo}>
                    <Text style={styles.compTitle}>Express.js REST Engine + TypeScript</Text>
                    <Text style={styles.compSub}>
                      RBAC validation, rate-limiter, project services
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.flowArrow}>
                <ArrowRight size={18} color={colors.primaryLight} style={{ transform: [{ rotate: '90deg' }] }} />
              </View>

              {/* Layer 3: Persistence & AI */}
              <View style={styles.archLayer}>
                <View style={styles.layerHeader}>
                  <Text style={styles.layerLabel}>LAYER 3: DATA & INTELLIGENCE</Text>
                </View>
                <View style={styles.componentBox}>
                  <Database size={18} color={colors.success} />
                  <View style={styles.compInfo}>
                    <Text style={styles.compTitle}>MongoDB Atlas + Embedded Fallback</Text>
                    <Text style={styles.compSub}>
                      Indexes on ownerId, status, and createdAt
                    </Text>
                  </View>
                </View>
                <View style={[styles.componentBox, { marginTop: spacing.sm }]}>
                  <Cpu size={18} color={colors.warning} />
                  <View style={styles.compInfo}>
                    <Text style={styles.compTitle}>Unified Multi-Provider AI Engine</Text>
                    <Text style={styles.compSub}>
                      Gemini 2.5 Flash → OpenAI → Groq → Deterministic Fallback
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            <Card title="Pattern Justification">
              <Text style={styles.justText}>
                {archType === 'monolith'
                  ? 'A Modular Monolith provides students and startups with fast iterative development, zero distributed network latency, straightforward deployment on a single cloud VM or container, and simplified debugging without distributed tracing overhead.'
                  : 'The Microservices pattern decouples project generation, AI synthesis, task management, and authentication into autonomous services, ideal for enterprise scalability and independently scaling GPU-bound AI workloads.'}
              </Text>
            </Card>
          </>
        ) : (
          <Card title="Raw Mermaid Diagram Definition">
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{mermaidCode}</Text>
            </View>
          </Card>
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
  toggleRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  toggleBtnActive: {
    backgroundColor: colors.surfaceLight,
  },
  toggleBtnText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  toggleBtnTextActive: {
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  modeRow: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  modePill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  modePillActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  modePillText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  modePillTextActive: {
    color: colors.primaryLight,
  },
  archLayer: {
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  layerHeader: {
    marginBottom: spacing.xs,
  },
  layerLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
  },
  componentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  compInfo: {
    flex: 1,
  },
  compTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  compSub: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  flowArrow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  justText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  codeContainer: {
    backgroundColor: '#090d16',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.secondaryLight,
    fontSize: 12,
    lineHeight: 18,
  },
});
