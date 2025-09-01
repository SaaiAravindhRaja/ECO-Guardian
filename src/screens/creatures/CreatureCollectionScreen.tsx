import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { CreatureService } from '@/services/CreatureService';
import { addToCollection } from '@/store/slices/creatureSlice';
import { Creature, RarityLevel } from '@/types';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;

export function CreatureCollectionScreen() {
  const dispatch = useDispatch();
  const { collection } = useSelector((state: RootState) => state.creatures);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [filter, setFilter] = useState<'all' | RarityLevel>('all');

  const creatureService = new CreatureService();

  useEffect(() => {
    loadUserCreatures();
  }, [user]);

  const loadUserCreatures = async () => {
    if (!user) return;

    try {
      const creatures = await creatureService.getUserCreatures(user.uid);
      creatures.forEach(creature => {
        dispatch(addToCollection(creature));
      });
    } catch (error) {
      console.error('Error loading creatures:', error);
    }
  };

  const filteredCreatures = collection.filter(creature => 
    filter === 'all' || creature.rarity === filter
  );

  const getRarityColor = (rarity: RarityLevel): string => {
    switch (rarity) {
      case RarityLevel.COMMON: return '#95A5A6';
      case RarityLevel.UNCOMMON: return '#27AE60';
      case RarityLevel.RARE: return '#3498DB';
      case RarityLevel.EPIC: return '#9B59B6';
      case RarityLevel.LEGENDARY: return '#F39C12';
      default: return '#95A5A6';
    }
  };

  const renderCreatureCard = ({ item }: { item: Creature }) => (
    <TouchableOpacity
      style={[styles.creatureCard, { borderColor: getRarityColor(item.rarity) }]}
      onPress={() => setSelectedCreature(item)}
    >
      <View style={styles.creatureImageContainer}>
        <Text style={styles.creatureEmoji}>
          {item.type === 'greenie' ? '🌱' : 
           item.type === 'sparkie' ? '⚡' :
           item.type === 'binities' ? '♻️' : '💧'}
        </Text>
      </View>
      
      <Text style={styles.creatureName} numberOfLines={1}>
        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
      </Text>
      
      <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
        <Text style={styles.rarityText}>{item.rarity}</Text>
      </View>
      
      <Text style={styles.levelText}>Lv. {item.evolutionLevel}</Text>
    </TouchableOpacity>
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

      {/* Creature Detail Modal would go here */}
      {selectedCreature && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedCreature.type.charAt(0).toUpperCase() + selectedCreature.type.slice(1)}
            </Text>
            <Text style={styles.modalBackstory}>
              {selectedCreature.backstory}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCreature(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7ED321',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#A8D5BA',
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
    backgroundColor: '#2D5A27',
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  filterButtonActive: {
    backgroundColor: '#7ED321',
    borderColor: '#7ED321',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#A8D5BA',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#1B4332',
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  creatureCard: {
    width: itemWidth,
    backgroundColor: '#2D5A27',
    borderRadius: 12,
    padding: 16,
    marginRight: 20,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  creatureImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#4A7C59',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatureEmoji: {
    fontSize: 32,
  },
  creatureName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  levelText: {
    fontSize: 12,
    color: '#A8D5BA',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#A8D5BA',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B8E6B',
    textAlign: 'center',
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2D5A27',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7ED321',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalBackstory: {
    fontSize: 16,
    color: '#A8D5BA',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#7ED321',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
});