import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, typography } from '../theme';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    let bg = colors.primaryGhost;
    let border = colors.primary;

    switch (variant) {
      case 'secondary':
        bg = colors.secondaryGhost;
        border = colors.secondary;
        break;
      case 'success':
        bg = colors.successGhost;
        border = colors.success;
        break;
      case 'warning':
        bg = colors.warningGhost;
        border = colors.warning;
        break;
      case 'danger':
        bg = colors.dangerGhost;
        border = colors.danger;
        break;
      case 'neutral':
        bg = colors.surfaceLight;
        border = colors.borderHighlight;
        break;
    }

    return {
      backgroundColor: bg,
      borderColor: border,
      borderWidth: 1,
      paddingHorizontal: size === 'sm' ? 6 : 10,
      paddingVertical: size === 'sm' ? 2 : 4,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
    };
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primaryLight;
      case 'secondary':
        return colors.secondaryLight;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.danger;
      case 'neutral':
        return colors.textMuted;
    }
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text
        style={[
          size === 'sm' ? typography.tiny : typography.captionBold,
          { color: getTextColor() },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};
