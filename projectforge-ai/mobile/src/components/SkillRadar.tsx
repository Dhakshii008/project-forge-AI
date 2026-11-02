import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors, spacing, typography } from '../theme';

interface SkillItem {
  name: string;
  score: number; // 0 - 100
}

interface SkillRadarProps {
  skills: SkillItem[];
  size?: number;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ skills, size }) => {
  const screenWidth = Dimensions.get('window').width;
  const radarSize = size || Math.min(screenWidth - 48, 300);
  const center = radarSize / 2;
  const radius = center - 36; // leave room for labels

  if (!skills || skills.length < 3) {
    return (
      <View style={[styles.fallbackContainer, { width: radarSize, height: radarSize }]}>
        <Text style={styles.fallbackText}>Need at least 3 skills to render radar</Text>
      </View>
    );
  }

  const numAxes = skills.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1];

  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const x = center + radius * value * Math.cos(angle);
    const y = center + radius * value * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points for a given level
  const getGridPoints = (level: number) => {
    return skills
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Generate polygon points for actual data
  const dataPoints = skills
    .map((skill, i) => {
      const normalizedScore = Math.max(0, Math.min(100, skill.score)) / 100;
      const { x, y } = getCoordinates(i, normalizedScore);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={radarSize} height={radarSize}>
        {/* Background Grid Polygons */}
        {levels.map((lvl, idx) => (
          <Polygon
            key={`grid-${idx}`}
            points={getGridPoints(lvl)}
            stroke={colors.borderHighlight}
            strokeWidth="1"
            fill="none"
            opacity={0.6}
          />
        ))}

        {/* Axis lines from center to outer ring */}
        {skills.map((_, i) => {
          const { x, y } = getCoordinates(i, 1);
          return (
            <Line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={colors.border}
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon Fill */}
        <Polygon
          points={dataPoints}
          fill="rgba(99, 102, 241, 0.35)"
          stroke={colors.primary}
          strokeWidth="2"
        />

        {/* Data points (dots) */}
        {skills.map((skill, i) => {
          const normalizedScore = Math.max(0, Math.min(100, skill.score)) / 100;
          const { x, y } = getCoordinates(i, normalizedScore);
          return (
            <Circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill={colors.secondary}
              stroke={colors.background}
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {skills.map((skill, i) => {
          const { x, y } = getCoordinates(i, 1.2);
          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y + 4}
              fontSize="10"
              fontWeight="600"
              fill={colors.textMuted}
              textAnchor="middle"
            >
              {skill.name.length > 9 ? `${skill.name.slice(0, 8)}.` : skill.name}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  fallbackText: {
    ...typography.caption,
    color: colors.textSubtle,
  },
});
