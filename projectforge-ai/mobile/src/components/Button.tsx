import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, borderRadius, spacing, touchTarget } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  style,
  textStyle,
  ...rest
}) => {
  const getContainerStyle = (): ViewStyle => {
    let base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      minHeight: touchTarget.minHeight,
      paddingHorizontal: spacing.lg,
    };

    if (fullWidth) base.width = '100%';

    // Size
    if (size === 'sm') {
      base.paddingVertical = 8;
      base.paddingHorizontal = spacing.md;
      base.minHeight = 36;
    } else if (size === 'lg') {
      base.paddingVertical = 16;
      base.paddingHorizontal = spacing.xl;
      base.minHeight = 52;
    } else {
      base.paddingVertical = 12;
    }

    // Variant
    switch (variant) {
      case 'primary':
        base.backgroundColor = colors.primary;
        break;
      case 'secondary':
        base.backgroundColor = colors.secondary;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1;
        base.borderColor = colors.borderHighlight;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'danger':
        base.backgroundColor = colors.danger;
        break;
      case 'success':
        base.backgroundColor = colors.success;
        break;
    }

    if (disabled || loading) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let color = colors.text;
    if (variant === 'outline') color = colors.primaryLight;
    if (variant === 'ghost') color = colors.textMuted;
    if (variant === 'secondary') color = colors.textInverse;

    let fontSize = 14;
    let fontWeight: '600' | '700' = '600';
    if (size === 'sm') fontSize = 12;
    if (size === 'lg') {
      fontSize = 16;
      fontWeight = '700';
    }

    return {
      color,
      fontSize,
      fontWeight,
      textAlign: 'center',
    };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? colors.textInverse : colors.text}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text
            style={[
              getTextStyle(),
              icon && iconPosition === 'left' ? { marginLeft: 8 } : undefined,
              icon && iconPosition === 'right' ? { marginRight: 8 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};
