import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="education" />
      <Stack.Screen name="skills" />
      <Stack.Screen name="goals" />
    </Stack>
  );
}
