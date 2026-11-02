import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/store/authContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor={colors.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="project/[id]" />
          <Stack.Screen name="project/validation" />
          <Stack.Screen name="workspace/[id]" />
          <Stack.Screen name="workspace/overview" />
          <Stack.Screen name="workspace/requirements" />
          <Stack.Screen name="workspace/architecture" />
          <Stack.Screen name="workspace/database" />
          <Stack.Screen name="workspace/api" />
          <Stack.Screen name="workspace/uiux" />
          <Stack.Screen name="workspace/roadmap" />
          <Stack.Screen name="workspace/tasks" />
          <Stack.Screen name="workspace/assistant" />
          <Stack.Screen name="workspace/starter-code" />
          <Stack.Screen name="workspace/testing" />
          <Stack.Screen name="workspace/documentation" />
          <Stack.Screen name="workspace/deployment" />
          <Stack.Screen name="workspace/portfolio" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="admin/index" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
