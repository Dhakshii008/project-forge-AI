import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

interface CardProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  onPress?: () => void;
  highlighted?: boolean;
  style?: StyleProp<ViewStyle>;
}


export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerRight,
  children,
  onPress,
  highlighted = false,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.card,
        highlighted && styles.cardHighlighted,
        style,
      ]}
    >
      {(title || subtitle || headerRight) && (
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHighlighted: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
});
