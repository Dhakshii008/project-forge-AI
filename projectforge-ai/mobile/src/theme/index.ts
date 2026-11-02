// ProjectForge AI — Mobile Design System & Theme Tokens

export const colors = {
  background: '#020617', // slate-950
  surface: '#0f172a',    // slate-900
  surfaceLight: '#1e293b', // slate-800
  surfaceHighlight: '#334155', // slate-700
  
  primary: '#6366f1',    // indigo-500
  primaryDark: '#4f46e5', // indigo-600
  primaryLight: '#818cf8', // indigo-400
  primaryGhost: 'rgba(99, 102, 241, 0.12)',

  secondary: '#06b6d4',  // cyan-500
  secondaryLight: '#22d3ee', // cyan-400
  secondaryGhost: 'rgba(6, 182, 212, 0.12)',

  success: '#10b981',    // emerald-500
  successGhost: 'rgba(16, 185, 129, 0.12)',

  warning: '#f59e0b',    // amber-500
  warningGhost: 'rgba(245, 158, 11, 0.12)',

  danger: '#f43f5e',     // rose-500
  dangerGhost: 'rgba(244, 63, 94, 0.12)',

  text: '#f8fafc',       // slate-50
  textMuted: '#94a3b8',  // slate-400
  textSubtle: '#64748b', // slate-500
  textInverse: '#020617',

  border: '#1e293b',
  borderHighlight: '#334155',
  borderFocus: '#6366f1',

  tabBar: '#0b1120',
  tabBarBorder: '#1e293b',
  card: '#0f172a',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32, color: colors.text },
  h2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26, color: colors.text },
  h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22, color: colors.text },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: colors.text },
  bodyBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20, color: colors.text },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16, color: colors.textMuted },
  captionBold: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, color: colors.textMuted },
  tiny: { fontSize: 10, fontWeight: '600' as const, lineHeight: 14, color: colors.textSubtle },
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
};

export const touchTarget = {
  minHeight: 44,
  minWidth: 44,
};
