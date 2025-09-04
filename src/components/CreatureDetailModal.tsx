import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Creature } from '@/types';
import { COLORS, CREATURE_EMOJIS, RARITY_COLORS, GREEN_PLAN_ICONS } from '@/utils/constants';
import { GreenPlanService } from '@/services/GreenPlanService';
import { SocialSharingService } from '@/services/SocialSharingService';

const { width } = Dimensions.get('window');

interface CreatureDetailModalProps {
  creature: Creature | null;
  visible: boolean;
  onClose: () => void;
  onEvolve?: (creature: Creature) => void;
}

export function CreatureDetailModal({ 
  creature, 
  visible, 
  onClose, 
  onEvolve 
}: CreatureDetailModalProps) {
  if (!creature) return null;

  const rarityColor = RARITY_COLORS[creature.rarity] || RARITY_COLORS.common;
  const creatureEmoji = CREATURE_EMOJIS[creature.type as keyof typeof CREATURE_EMOJIS] || '🐾';
  const greenPlanIcon = GREEN_PLAN_ICONS[creature.greenPlanTarget] || '🌱';
  const greenPlanService = new GreenPlanService();
  const sharing = new SocialSharingService();

  const canEvolve = creature.experiencePoints >= 1000 && creature.evolutionLevel < 5;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Creature Display */}
          <View style={[styles.creatureDisplay, { borderColor: rarityColor }]}>
            <Text style={styles.creatureEmoji}>{creatureEmoji}</Text>
            <Text style={styles.creatureName}>
              {creature.type.charAt(0).toUpperCase() + creature.type.slice(1)}
            </Text>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
              <Text style={styles.rarityText}>{creature.rarity.toUpperCase()}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Level</Text>
                <Text style={styles.statValue}>{creature.evolutionLevel}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Experience</Text>
                <Text style={styles.statValue}>{creature.experiencePoints} XP</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Evolution Progress</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min((creature.experiencePoints / 1000) * 100, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {creature.experiencePoints}/1000 XP to next evolution
              </Text>
            </View>
          </View>

          {/* Backstory */}
          <View style={styles.backstoryContainer}>
            <Text style={styles.sectionTitle}>Backstory</Text>
            <Text style={styles.backstoryText}>{creature.backstory}</Text>
          </View>

          {/* Green Plan Connection */}
          <View style={styles.greenPlanContainer}>
            <Text style={styles.sectionTitle}>Green Plan 2030 Connection</Text>
            <View style={styles.greenPlanInfo}>
              <Text style={styles.greenPlanIcon}>{greenPlanIcon}</Text>
              <Text style={styles.greenPlanText}>
                {creature.greenPlanTarget.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.greenPlanDescription}>
              {greenPlanService.mapTargetToEducation(creature.greenPlanTarget)}
            </Text>
          </View>

          {/* Collection Info */}
          <View style={styles.collectionContainer}>
            <Text style={styles.sectionTitle}>Collection Details</Text>
            <Text style={styles.collectionText}>
              Collected: {creature.collectedAt.toLocaleDateString()}
            </Text>
            <Text style={styles.collectionText}>
              Location: {creature.spawnLocation.latitude.toFixed(4)}, {creature.spawnLocation.longitude.toFixed(4)}
            </Text>
          </View>

          {/* Evolution Button */}
          {canEvolve && onEvolve && (
            <TouchableOpacity 
              style={styles.evolveButton}
              onPress={() => onEvolve(creature)}
            >
              <Text style={styles.evolveButtonText}>🌟 Evolve Creature</Text>
            </TouchableOpacity>
          )}

          {/* Share Button */}
          <TouchableOpacity 
            style={styles.evolveButton}
            onPress={async () => {
              try {
                await sharing.sharePhoto({
                  id: `share_${creature.id}`,
                  imageData: creature.visualAssets.thumbnailUrl,
                  creature,
                  location: creature.spawnLocation,
                  timestamp: new Date(),
                  metadata: { deviceInfo: 'mobile', cameraSettings: 'n/a' },
                } as any);
              } catch (_err) {}
            }}
          >
            <Text style={styles.evolveButtonText}>📤 Share</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  creatureDisplay: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    borderWidth: 3,
  },
  creatureEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  creatureName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  rarityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rarityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  backstoryContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  backstoryText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  greenPlanContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  greenPlanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenPlanIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  greenPlanText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  greenPlanDescription: {
    marginTop: 8,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  collectionContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  collectionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  evolveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  evolveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});