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
import { CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react-native';
import { useAuth } from '../../src/store/authContext';
import { authService } from '../../src/services/authService';
import { Button, Card } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function OnboardingGoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuth();

  const [careerGoal, setCareerGoal] = useState('Full Stack Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    'Web Development',
    'Artificial Intelligence',
    'Mobile Apps',
  ]);
  const [loading, setLoading] = useState(false);

  const careerOptions = [
    'Full Stack Engineer',
    'AI / ML Engineer',
    'Backend Engineer',
    'Mobile Application Engineer',
    'Cloud / DevOps Engineer',
  ];

  const domainOptions = [
    'Web Development',
    'Artificial Intelligence',
    'Mobile Apps',
    'Cloud Systems',
    'Data Engineering',
    'Cybersecurity',
    'Blockchain',
  ];

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      const res = await authService.completeOnboarding({
        careerGoal,
        experienceLevel,
        domains: selectedDomains,
      });

      if (user) {
        setUser({
          ...user,
          careerGoal,
          onboardingComplete: true,
        });
      }

      router.replace('/(tabs)');
    } catch (err: any) {
      // If error, still set onboarding locally to avoid getting stuck
      if (user) {
        setUser({
          ...user,
          careerGoal,
          onboardingComplete: true,
        });
      }
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.md },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Step 3 of 3</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Career Objectives & Domains</Text>
          <Text style={styles.subtitle}>
            We'll recommend capstone and portfolio projects tailored to these goals.
          </Text>
        </View>

        <Card title="Primary Career Goal">
          {careerOptions.map((goal) => (
            <TouchableOpacity
              key={goal}
              onPress={() => setCareerGoal(goal)}
              style={[
                styles.optionRow,
                careerGoal === goal && styles.optionRowSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  careerGoal === goal && styles.optionTextSelected,
                ]}
              >
                {goal}
              </Text>
              {careerGoal === goal && (
                <CheckCircle2 size={18} color={colors.primaryLight} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        <Card title="Experience Level">
          <View style={styles.levelRow}>
            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <TouchableOpacity
                key={lvl}
                onPress={() => setExperienceLevel(lvl)}
                style={[
                  styles.levelBtn,
                  experienceLevel === lvl && styles.levelBtnSelected,
                ]}
              >
                <Text
                  style={[
                    styles.levelText,
                    experienceLevel === lvl && styles.levelTextSelected,
                  ]}
                >
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card title="Preferred Project Domains">
          <View style={styles.chipsRow}>
            {domainOptions.map((dm) => {
              const isSelected = selectedDomains.includes(dm);
              return (
                <TouchableOpacity
                  key={dm}
                  onPress={() => toggleDomain(dm)}
                  style={[
                    styles.domainChip,
                    isSelected && styles.domainChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.domainText,
                      isSelected && styles.domainTextSelected,
                    ]}
                  >
                    {dm}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Build Your ProjectForge Profile"
          onPress={handleFinish}
          loading={loading}
          fullWidth
          size="lg"
          variant="primary"
          icon={<Sparkles size={18} color={colors.text} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backBtn: {
    padding: spacing.xs,
  },
  stepIndicator: {
    ...typography.captionBold,
    color: colors.primaryLight,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  optionRowSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  optionText: {
    ...typography.body,
    color: colors.textMuted,
  },
  optionTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  levelRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  levelBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  levelText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  levelTextSelected: {
    color: colors.text,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  domainChip: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  domainChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondaryLight,
  },
  domainText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  domainTextSelected: {
    color: colors.textInverse,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
