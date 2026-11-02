import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  FolderPlus,
} from 'lucide-react-native';
import { aiService } from '../../src/services/aiService';
import { projectService } from '../../src/services/projectService';
import { Button, Input, Card, Badge } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function CreateProjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('An intelligent IoT home energy monitoring dashboard with anomaly detection');
  const [domain, setDomain] = useState('AI & ML');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [selectedTech, setSelectedTech] = useState<string[]>(['React Native', 'Node.js', 'Python', 'FastAPI']);
  const [careerGoal, setCareerGoal] = useState('Full Stack & AI Engineer');

  const [generating, setGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const domains = ['Full Stack', 'AI & ML', 'Mobile', 'Cloud Systems', 'Cybersecurity', 'IoT'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const availableTech = [
    'React',
    'React Native',
    'Next.js',
    'Node.js',
    'Python',
    'FastAPI',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'TensorFlow',
    'Gemini AI',
  ];

  const toggleTech = (t: string) => {
    if (selectedTech.includes(t)) {
      setSelectedTech(selectedTech.filter((item) => item !== t));
    } else {
      setSelectedTech([...selectedTech, t]);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setErrorMessage('');

      const res = await aiService.generateProject({
        prompt,
        domain,
        difficulty,
        technologies: selectedTech,
        careerGoal,
      });

      if (res.success && res.data) {
        setGeneratedProject(res.data);
      } else {
        setErrorMessage(res.error?.message || 'Failed to generate project. Try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAndOpen = async () => {
    if (!generatedProject) return;
    try {
      setGenerating(true);
      const res = await projectService.createProject({
        title: generatedProject.title,
        description: generatedProject.description || generatedProject.problem,
        category: domain,
        difficulty,
        techStack: generatedProject.techStack || selectedTech,
        problem: generatedProject.problem,
        solution: generatedProject.solution,
        features: generatedProject.features || [],
      });

      if (res.success && res.data) {
        const targetId = (res.data as any)._id || (res.data as any).project?._id || 'demo';
        router.push(`/workspace/${targetId}` as any);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not save project.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Project Generator</Text>
          <Text style={styles.headerSubtitle}>
            Transform your concepts into production software blueprints
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 90 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {!generatedProject ? (
            <>
              {/* Step Tracker */}
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumText}>STEP {step} OF 4</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
                </View>
              </View>

              {/* STEP 1: Prompt */}
              {step === 1 && (
                <Card
                  title="What do you want to build?"
                  subtitle="Describe the idea, challenge, or domain you want to solve"
                >
                  <Input
                    multiline
                    numberOfLines={4}
                    placeholder="e.g., A mobile app that detects plant diseases using on-device camera and AI vision..."
                    value={prompt}
                    onChangeText={setPrompt}
                    style={{ minHeight: 90, textAlignVertical: 'top' }}
                  />
                  <Text style={styles.tipText}>
                    Tip: Mention target users or specific problems to get higher quality architecture.
                  </Text>
                </Card>
              )}

              {/* STEP 2: Domain & Difficulty */}
              {step === 2 && (
                <Card title="Domain & Difficulty" subtitle="Select engineering scope">
                  <Text style={styles.label}>TARGET DOMAIN</Text>
                  <View style={styles.chipsRow}>
                    {domains.map((d) => (
                      <TouchableOpacity
                        key={d}
                        onPress={() => setDomain(d)}
                        style={[
                          styles.chip,
                          domain === d && styles.chipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            domain === d && styles.chipTextSelected,
                          ]}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { marginTop: spacing.md }]}>DIFFICULTY LEVEL</Text>
                  <View style={styles.diffRow}>
                    {difficulties.map((diff) => (
                      <TouchableOpacity
                        key={diff}
                        onPress={() => setDifficulty(diff)}
                        style={[
                          styles.diffBtn,
                          difficulty === diff && styles.diffBtnSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.diffBtnText,
                            difficulty === diff && styles.diffBtnTextSelected,
                          ]}
                        >
                          {diff}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Card>
              )}

              {/* STEP 3: Technologies */}
              {step === 3 && (
                <Card
                  title="Target Technologies"
                  subtitle="Choose the frameworks and libraries to incorporate"
                >
                  <View style={styles.chipsRow}>
                    {availableTech.map((t) => {
                      const isSelected = selectedTech.includes(t);
                      return (
                        <TouchableOpacity
                          key={t}
                          onPress={() => toggleTech(t)}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {t}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </Card>
              )}

              {/* STEP 4: Review & Generate */}
              {step === 4 && (
                <Card title="Generation Parameters" subtitle="Ready to synthesize project blueprint">
                  <View style={styles.paramItem}>
                    <Text style={styles.paramLabel}>Concept:</Text>
                    <Text style={styles.paramVal} numberOfLines={2}>
                      {prompt}
                    </Text>
                  </View>
                  <View style={styles.paramItem}>
                    <Text style={styles.paramLabel}>Domain:</Text>
                    <Text style={styles.paramVal}>{domain}</Text>
                  </View>
                  <View style={styles.paramItem}>
                    <Text style={styles.paramLabel}>Difficulty:</Text>
                    <Text style={styles.paramVal}>{difficulty}</Text>
                  </View>
                  <View style={styles.paramItem}>
                    <Text style={styles.paramLabel}>Technologies:</Text>
                    <Text style={styles.paramVal}>{selectedTech.join(', ')}</Text>
                  </View>

                  {generating ? (
                    <View style={styles.generatingBox}>
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={styles.generatingTitle}>Synthesizing Architecture...</Text>
                      <Text style={styles.generatingSub}>
                        Calling AI engine • Analyzing feasibility • Generating modular roadmap
                      </Text>
                    </View>
                  ) : null}
                </Card>
              )}

              {/* Wizard Navigation Buttons */}
              <View style={styles.stepperNav}>
                {step > 1 && (
                  <Button
                    title="Back"
                    variant="outline"
                    onPress={() => setStep(step - 1)}
                    style={{ flex: 1, marginRight: spacing.sm }}
                  />
                )}
                {step < 4 ? (
                  <Button
                    title="Next"
                    variant="primary"
                    onPress={() => setStep(step + 1)}
                    style={{ flex: 1 }}
                    icon={<ArrowRight size={16} color={colors.text} />}
                    iconPosition="right"
                  />
                ) : (
                  <Button
                    title="Synthesize Project"
                    variant="primary"
                    onPress={handleGenerate}
                    loading={generating}
                    style={{ flex: step > 1 ? 2 : 1 }}
                    icon={<Sparkles size={16} color={colors.text} />}
                  />
                )}
              </View>
            </>
          ) : (
            /* Generated Project Blueprint Preview */
            <View>
              <Card
                title={generatedProject.title || 'Generated Project Blueprint'}
                subtitle={`${domain} • ${difficulty}`}
                headerRight={
                  <Badge label="AI Synthesized" variant="secondary" size="sm" />
                }
                highlighted
              >
                <Text style={styles.previewSectionTitle}>PROBLEM STATEMENT</Text>
                <Text style={styles.previewText}>
                  {generatedProject.problem || generatedProject.description}
                </Text>

                <Text style={styles.previewSectionTitle}>PROPOSED SOLUTION</Text>
                <Text style={styles.previewText}>
                  {generatedProject.solution || 'Modular full-stack platform addressing user friction.'}
                </Text>

                <Text style={styles.previewSectionTitle}>CORE FEATURES</Text>
                {(generatedProject.features || [
                  'Automated telemetry ingestion',
                  'Anomaly detection neural network',
                  'Interactive dashboard with alert rules',
                ]).map((feat: string, i: number) => (
                  <View key={i} style={styles.featureItemRow}>
                    <CheckCircle2 size={16} color={colors.success} />
                    <Text style={styles.featureItemText}>{feat}</Text>
                  </View>
                ))}

                <Text style={styles.previewSectionTitle}>RECOMMENDED TECH STACK</Text>
                <View style={styles.chipsRow}>
                  {(generatedProject.techStack || selectedTech).map((t: string) => (
                    <View key={t} style={styles.techPill}>
                      <Text style={styles.techPillText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              {/* Action Buttons */}
              <View style={styles.blueprintActions}>
                <Button
                  title="Initialize Workspace"
                  variant="primary"
                  size="lg"
                  onPress={handleSaveAndOpen}
                  loading={generating}
                  icon={<FolderPlus size={18} color={colors.text} />}
                  fullWidth
                />
                <Button
                  title="Regenerate Another Idea"
                  variant="outline"
                  size="md"
                  onPress={() => {
                    setGeneratedProject(null);
                    setStep(1);
                  }}
                  style={{ marginTop: spacing.sm }}
                  fullWidth
                />
              </View>
            </View>
          )}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  stepHeader: {
    marginBottom: spacing.md,
  },
  stepNumText: {
    ...typography.tiny,
    color: colors.primaryLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  tipText: {
    ...typography.tiny,
    color: colors.textSubtle,
    marginTop: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  chipText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  chipTextSelected: {
    color: colors.text,
  },
  diffRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  diffBtn: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  diffBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  diffBtnText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  diffBtnTextSelected: {
    color: colors.text,
  },
  paramItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paramLabel: {
    ...typography.captionBold,
    color: colors.textSubtle,
  },
  paramVal: {
    ...typography.captionBold,
    color: colors.text,
    maxWidth: '70%',
    textAlign: 'right',
  },
  generatingBox: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  generatingTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  generatingSub: {
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  stepperNav: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  previewSectionTitle: {
    ...typography.tiny,
    color: colors.secondaryLight,
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: 4,
  },
  previewText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  featureItemText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  techPill: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  techPillText: {
    ...typography.tiny,
    color: colors.primaryLight,
  },
  blueprintActions: {
    marginTop: spacing.lg,
  },
  errorBanner: {
    backgroundColor: colors.dangerGhost,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
});
