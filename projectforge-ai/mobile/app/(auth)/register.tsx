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
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
  Code2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react-native';
import { useAuth } from '../../src/store/authContext';
import { Button, Input, Card, Badge } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Education
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');

  // Step 3: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'TypeScript',
    'React',
    'Node.js',
    'MongoDB',
  ]);

  // Step 4: Goals
  const [careerGoal, setCareerGoal] = useState('Full Stack Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');

  const availableSkills = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'React',
    'React Native',
    'Next.js',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'Gemini AI',
    'Git',
  ];

  const careerGoals = [
    'Full Stack Engineer',
    'AI / ML Engineer',
    'Mobile App Developer',
    'Backend Engineer',
    'DevOps / Cloud Architect',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!name.trim()) return setErrorMessage('Full Name is required');
      if (!email.trim() || !email.includes('@'))
        return setErrorMessage('Valid email address is required');
      if (password.length < 6)
        return setErrorMessage('Password must be at least 6 characters');
      if (password !== confirmPassword)
        return setErrorMessage('Passwords do not match');
    } else if (step === 2) {
      if (!college.trim()) return setErrorMessage('College/University is required');
    } else if (step === 3) {
      if (selectedSkills.length === 0)
        return setErrorMessage('Please select at least 1 skill');
    }
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'STUDENT',
        college: college.trim(),
        department: department.trim(),
        year: yearOfStudy,
        skills: selectedSkills,
        careerGoal,
      });

      router.replace('/(onboarding)/welcome');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Tracker */}
        <View style={styles.stepperContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>
            Step {step} of 5:{' '}
            {step === 1
              ? 'Account'
              : step === 2
              ? 'Education'
              : step === 3
              ? 'Technical Skills'
              : step === 4
              ? 'Career Goals'
              : 'Review'}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 5) * 100}%` }]} />
        </View>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* STEP 1: Account */}
        {step === 1 && (
          <Card title="Create Your Account" subtitle="Enter your personal details">
            <Input
              label="Full Name"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={18} color={colors.textMuted} />}
            />
            <Input
              label="Email Address"
              placeholder="alex@example.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={18} color={colors.textMuted} />}
            />
            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={<Lock size={18} color={colors.textMuted} />}
            />
            <Input
              label="Confirm Password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              leftIcon={<Lock size={18} color={colors.textMuted} />}
            />
          </Card>
        )}

        {/* STEP 2: Education */}
        {step === 2 && (
          <Card title="Academic Background" subtitle="Tell us about your institution">
            <Input
              label="College / University"
              placeholder="e.g. Stanford University"
              value={college}
              onChangeText={setCollege}
              leftIcon={<GraduationCap size={18} color={colors.textMuted} />}
            />
            <Input
              label="Department / Major"
              placeholder="e.g. Computer Science & Engineering"
              value={department}
              onChangeText={setDepartment}
            />
            <Input
              label="Current Year"
              placeholder="e.g. 3rd Year / Junior"
              value={yearOfStudy}
              onChangeText={setYearOfStudy}
            />
          </Card>
        )}

        {/* STEP 3: Skills */}
        {step === 3 && (
          <Card
            title="Technical Skills"
            subtitle="Select the languages and tools you know or are learning"
          >
            <View style={styles.skillsWrapper}>
              {availableSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <TouchableOpacity
                    key={sk}
                    onPress={() => toggleSkill(sk)}
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
                      {sk}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        )}

        {/* STEP 4: Goals */}
        {step === 4 && (
          <Card title="Career Objectives" subtitle="Align your project recommendations">
            <Text style={styles.fieldLabel}>Target Career Path</Text>
            {careerGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                onPress={() => setCareerGoal(goal)}
                style={[
                  styles.optionCard,
                  careerGoal === goal && styles.optionCardSelected,
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

            <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>
              Current Experience Level
            </Text>
            <View style={styles.experienceRow}>
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => setExperienceLevel(lvl)}
                  style={[
                    styles.experienceBtn,
                    experienceLevel === lvl && styles.experienceBtnSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.experienceText,
                      experienceLevel === lvl && styles.experienceTextSelected,
                    ]}
                  >
                    {lvl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* STEP 5: Review */}
        {step === 5 && (
          <Card title="Review & Confirm" subtitle="Verify your profile details">
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Full Name:</Text>
              <Text style={styles.reviewValue}>{name}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Email:</Text>
              <Text style={styles.reviewValue}>{email}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>College:</Text>
              <Text style={styles.reviewValue}>{college || 'Not specified'}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Career Goal:</Text>
              <Text style={styles.reviewValue}>{careerGoal}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Skills:</Text>
              <Text style={styles.reviewValue}>
                {selectedSkills.join(', ') || 'None selected'}
              </Text>
            </View>
          </Card>
        )}

        {/* Action Controls */}
        <View style={styles.actionsRow}>
          {step < 5 ? (
            <Button
              title="Next Step"
              onPress={handleNext}
              fullWidth
              size="lg"
              icon={<ArrowRight size={18} color={colors.text} />}
              iconPosition="right"
            />
          ) : (
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              fullWidth
              size="lg"
              variant="success"
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={styles.signInLink}
        >
          <Text style={styles.signInLinkText}>
            Already have an account? <Text style={{ color: colors.primaryLight }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  stepTitle: {
    ...typography.h3,
    color: colors.text,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
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
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
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
  fieldLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  optionCardSelected: {
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
  experienceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  experienceBtn: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  experienceBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  experienceText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  experienceTextSelected: {
    color: colors.text,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewLabel: {
    ...typography.captionBold,
    color: colors.textSubtle,
  },
  reviewValue: {
    ...typography.captionBold,
    color: colors.text,
    maxWidth: '65%',
    textAlign: 'right',
  },
  actionsRow: {
    marginTop: spacing.xl,
  },
  signInLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  signInLinkText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
