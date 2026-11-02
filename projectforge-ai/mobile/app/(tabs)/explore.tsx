import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Filter, Clock, ChevronRight, Sparkles } from 'lucide-react-native';
import { projectService } from '../../src/services/projectService';
import { Project } from '../../src/types';
import { Input, Card, Badge, EmptyState, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'Full Stack', 'AI & ML', 'Mobile', 'DevOps', 'Blockchain'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchProjects = async () => {
    try {
      const res = await projectService.getProjects({
        search: searchQuery.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      });

      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      // Standalone fallback automatically handles this
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedDifficulty]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const handleSearchSubmit = () => {
    fetchProjects();
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.techStack?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Project Discovery</Text>
        <Text style={styles.headerSubtitle}>
          Explore industry-aligned software architectures
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Input
          placeholder="Search by title, tech stack, or problem..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          leftIcon={<Search size={18} color={colors.textMuted} />}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Category Pills (Horizontal Scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.pill,
              selectedCategory === cat && styles.pillSelected,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedCategory === cat && styles.pillTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Difficulty Filter Chips */}
      <View style={styles.difficultyRow}>
        <Text style={styles.diffLabel}>DIFFICULTY:</Text>
        {difficulties.map((diff) => (
          <TouchableOpacity
            key={diff}
            onPress={() => setSelectedDifficulty(diff)}
            style={[
              styles.diffChip,
              selectedDifficulty === diff && styles.diffChipSelected,
            ]}
          >
            <Text
              style={[
                styles.diffChipText,
                selectedDifficulty === diff && styles.diffChipTextSelected,
              ]}
            >
              {diff}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Projects List */}
      {loading ? (
        <LoadingSpinner message="Loading project marketplace..." />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={40} color={colors.primaryLight} />}
          title="No projects found"
          message="Try searching for another keyword or change your filters."
          actionTitle="Generate Custom Project"
          onAction={() => router.push('/(tabs)/create')}
        />
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 80 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primaryLight}
            />
          }
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subtitle={item.category}
              headerRight={
                <Badge
                  label={item.difficulty || 'Intermediate'}
                  variant={
                    item.difficulty === 'Beginner'
                      ? 'success'
                      : item.difficulty === 'Advanced'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                />
              }
              onPress={() => router.push(`/project/${item._id}` as any)}
            >
              <Text style={styles.projectDesc} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.timeMeta}>
                  <Clock size={13} color={colors.textSubtle} />
                  <Text style={styles.timeText}>
                    {item.estimatedWeeks || 4} Weeks
                  </Text>
                </View>
                <View style={styles.matchMeta}>
                  <Text style={styles.matchText}>95% Match</Text>
                </View>
              </View>

              <View style={styles.techTagsRow}>
                {item.techStack?.slice(0, 4).map((tech) => (
                  <View key={tech} style={styles.techTag}>
                    <Text style={styles.techTagText}>{tech}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.openRow}>
                <Text style={styles.openText}>View Project Blueprint</Text>
                <ChevronRight size={16} color={colors.primaryLight} />
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  pillsScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  pillText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  pillTextSelected: {
    color: colors.text,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    gap: 6,
  },
  diffLabel: {
    ...typography.tiny,
    color: colors.textSubtle,
    marginRight: 4,
  },
  diffChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  diffChipSelected: {
    backgroundColor: colors.surfaceHighlight,
  },
  diffChipText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  diffChipTextSelected: {
    color: colors.text,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  projectDesc: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    marginVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  timeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    ...typography.tiny,
    color: colors.textSubtle,
  },
  matchMeta: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  matchText: {
    ...typography.tiny,
    color: colors.success,
    fontWeight: '700',
  },
  techTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  techTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  techTagText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  openText: {
    ...typography.captionBold,
    color: colors.primaryLight,
    marginRight: 4,
  },
});
