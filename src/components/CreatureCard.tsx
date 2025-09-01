import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Creature, RarityLevel } from '@/types';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;

interface CreatureCardProps {
  creature: Creature;
  onPress: (creature: Creature) => void;
}

export function CreatureCard({ creature, onPress }: CreatureCardProps) {
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

  const getCreatureEmoji = (type: string): string => {
    switch (type) {
      case 'greenie': return '🌱';
      case 'sparkie': return '⚡';
      case 'binities': return '♻️';
      case 'drippies': return '💧';
      default: return '🐾';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: getRarityColor(creature.rarity) }]}
      onPress={() => onPress(creature)}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{getCreatureEmoji(creature.type)}</Text>
      </View>
      
      <Text style={styles.name} numberOfLines={1}>
        {creature.type.charAt(0).toUpperCase() + creature.type.slice(1)}
      </Text>
      
      <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(creature.rarity) }]}>
        <Text style={styles.rarityText}>{creature.rarity}</Text>
      </View>
      
      <Text style={styles.levelText}>Lv. {creature.evolutionLevel}</Text>
      
      {creature.experiencePoints > 0 && (
        <Text style={styles.expText}>{creature.experiencePoints} XP</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    backgroundColor: '#2D5A27',
    borderRadius: 12,
    padding: 16,
    marginRight: 20,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#4A7C59',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
  },
  name: {
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
  expText: {
    fontSize: 10,
    color: '#7ED321',
    fontWeight: '500',
    marginTop: 4,
  },
});