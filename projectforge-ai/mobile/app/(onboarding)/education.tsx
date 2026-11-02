import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { Button, Input, Card } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';

export default function OnboardingEducationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [college, setCollege] = useState('MIT');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');

  const years = ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Postgraduate'];

  const handleNext = () => {
    router.push('/(onboarding)/skills');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
            <Text style={styles.stepIndicator}>Step 1 of 3</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Education Profile</Text>
            <Text style={styles.subtitle}>
              Help us tailor project complexity and academic project formats to your level.
            </Text>
          </View>

          <Card>
            <Input
              label="College / University"
              placeholder="e.g. Massachusetts Institute of Technology"
              value={college}
              onChangeText={setCollege}
              leftIcon={<GraduationCap size={18} color={colors.textMuted} />}
            />

            <Input
              label="Department / Specialization"
              placeholder="e.g. Computer Science & AI"
              value={department}
              onChangeText={setDepartment}
            />

            <Text style={styles.label}>Year of Study</Text>
            <View style={styles.yearsRow}>
              {years.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => setYear(y)}
                  style={[
                    styles.yearChip,
                    year === y && styles.yearChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.yearChipText,
                      year === y && styles.yearChipTextSelected,
                    ]}
                  >
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
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
    </KeyboardAvoidingView>
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
    marginBottom: spacing.xl,
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
  label: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  yearsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  yearChip: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  yearChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  yearChipText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  yearChipTextSelected: {
    color: colors.text,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
