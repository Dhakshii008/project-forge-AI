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
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { Button, Card } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function OnboardingSkillsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'TypeScript',
    'React',
    'Node.js',
    'MongoDB',
    'Docker',
  ]);

  const skillCategories = [
    {
      category: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'C++'],
    },
    {
      category: 'Frontend & Mobile',
      skills: ['React', 'React Native', 'Next.js', 'Vue.js', 'Tailwind CSS'],
    },
    {
      category: 'Backend & Cloud',
      skills: ['Node.js', 'Express', 'FastAPI', 'Docker', 'AWS', 'Kubernetes'],
    },
    {
      category: 'Databases & AI',
      skills: ['MongoDB', 'PostgreSQL', 'Redis', 'Gemini AI', 'OpenAI', 'LangChain'],
    },
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
    router.push('/(onboarding)/goals');
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
          <Text style={styles.stepIndicator}>Step 2 of 3</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Your Technical Stack</Text>
          <Text style={styles.subtitle}>
            Select the technologies you have experience with or want to build projects with.
          </Text>
        </View>

        {skillCategories.map((group) => (
          <Card key={group.category} title={group.category}>
            <View style={styles.chipsContainer}>
              {group.skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    style={[
                      styles.skillChip,
                      isSelected && styles.skillChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
                        isSelected && styles.skillChipTextSelected,
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleNext}
          fullWidth
          size="lg"
          icon={<ArrowRight size={18} color={colors.text} />}
          iconPosition="right"
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  skillChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  skillChipText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  skillChipTextSelected: {
    color: colors.text,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
