import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { CreatureService } from '@/services/CreatureService';
import { addToCollection } from '@/store/slices/creatureSlice';
import { CreatureCard } from '@/components/CreatureCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CreatureDetailModal } from '@/components/CreatureDetailModal';
import { AchievementToast } from '@/components/AchievementToast';
import { useAchievements } from '@/hooks/useAchievements';
import { AnalyticsService } from '@/services/AnalyticsService';
import { Creature, RarityLevel } from '@/types';
import { COLORS } from '@/utils/constants';

const { width } = Dimensions.get('window');

export function CreatureCollectionScreen() {
  const dispatch = useDispatch();
  const { collection } = useSelector((state: RootState) => state.creatures);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [filter, setFilter] = useState<'all' | RarityLevel>('all');
  const [isLoading, setIsLoading] = useState(false);

  const creatureService = new CreatureService();
  const analytics = AnalyticsService.getInstance();
  const { newAchievement, hideAchievementToast } = useAchievements();

  useEffect(() => {
    loadUserCreatures();
    analytics.trackScreenView('creature_collection');
  }, [user]);

  const loadUserCreatures = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const creatures = await creatureService.getUserCreatures(user.uid);
      creatures.forEach(creature => {
        dispatch(addToCollection(creature));
      });
    } catch (error) {
      console.error('Error loading creatures:', error);
      analytics.trackError(error as Error, 'creature_collection_load');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCreatures = collection.filter(creature => 
    filter === 'all' || creature.rarity === filter
  );

  const getRarityColor = (rarity: RarityLevel): string => {
    const { RARITY_COLORS } = require('@/utils/constants');
    return RARITY_COLORS[rarity] || RARITY_COLORS.common;
  };

  const renderCreatureCard = ({ item }: { item: Creature }) => (
    <CreatureCard 
      creature={item} 
      onPress={setSelectedCreature}
    />
  );

  const renderFilterButton = (filterValue: 'all' | RarityLevel, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterValue && styles.filterButtonActive
      ]}
      onPress={() => setFilter(filterValue)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === filterValue && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && collection.length === 0) {
    return <LoadingSpinner message="Loading your creatures..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Collection</Text>
        <Text style={styles.subtitle}>
          {collection.length} creatures collected
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton(RarityLevel.COMMON, 'Common')}
        {renderFilterButton(RarityLevel.UNCOMMON, 'Uncommon')}
        {renderFilterButton(RarityLevel.RARE, 'Rare')}
        {renderFilterButton(RarityLevel.EPIC, 'Epic')}
        {renderFilterButton(RarityLevel.LEGENDARY, 'Legendary')}
      </View>

      {/* Creature Grid */}
      <FlatList
        data={filteredCreatures}
        renderItem={renderCreatureCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No creatures found</Text>
            <Text style={styles.emptySubtext}>
              Visit eco-locations to discover new creatures!
            </Text>
          </View>
        }
      />

      {/* Loading Overlay */}
      {isLoading && collection.length > 0 && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Loading your creatures..." />
        </View>
      )}

      {/* Creature Detail Modal */}
      <CreatureDetailModal
        creature={selectedCreature}
        visible={!!selectedCreature}
        onClose={() => setSelectedCreature(null)}
        onEvolve={(creature) => {
          analytics.trackCreatureEvolved(creature.type, creature.evolutionLevel, creature.evolutionLevel + 1);
          setSelectedCreature(null);
        }}
      />

      {/* Achievement Toast */}
      <AchievementToast
        achievement={newAchievement}
        visible={!!newAchievement}
        onHide={hideAchievementToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.background,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 67, 50, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});