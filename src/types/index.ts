// Core Types for ECO-Guardian App

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: Date;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export enum CreatureType {
  GREENIE = 'greenie',
  SPARKIE = 'sparkie',
  BINITIES = 'binities',
  DRIPPIES = 'drippies'
}

export enum RarityLevel {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum GreenPlanTarget {
  CITY_IN_NATURE = 'city_in_nature',
  ENERGY_RESET = 'energy_reset',
  SUSTAINABLE_LIVING = 'sustainable_living',
  GREEN_ECONOMY = 'green_economy',
  RESILIENT_FUTURE = 'resilient_future'
}

export interface Creature {
  id: string;
  type: CreatureType;
  rarity: RarityLevel;
  spawnLocation: Location;
  greenPlanTarget: GreenPlanTarget;
  evolutionLevel: number;
  backstory: string;
  visualAssets: ARAssets;
  collectedAt: Date;
  experiencePoints: number;
  collectionSnapshot?: EnvironmentalSnapshot;
  tileIdP7?: string;
  tileIdP8?: string;
}

export interface ARAssets {
  modelUrl: string;
  textureUrl: string;
  animationUrls: string[];
  thumbnailUrl: string;
}

export enum EcoLocationType {
  NATURE_PARK = 'nature_park',
  COMMUNITY_GARDEN = 'community_garden',
  EV_CHARGING_STATION = 'ev_charging_station',
  RECYCLING_CENTER = 'recycling_center',
  ABC_WATERS_SITE = 'abc_waters_site',
  RECYCLING_BIN = 'recycling_bin'
}

export interface EcoLocation {
  id: string;
  name: string;
  type: EcoLocationType;
  coordinates: Coordinates;
  greenPlanCategory: GreenPlanTarget;
  verificationRadius: number;
  description?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
  level: number;
  totalPoints: number;
  creatureCollection: CreatureCollection;
  achievements: Achievement[];
  sustainabilityStats: SustainabilityStats;
  preferences: UserPreferences;
}

export interface CreatureCollection {
  creatures: Map<string, Creature>;
  totalCollected: number;
  rarityBreakdown: Map<RarityLevel, number>;
  evolutionMaterials: EvolutionMaterial[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: Date;
  category: AchievementCategory;
}

export enum AchievementCategory {
  COLLECTION = 'collection',
  EVOLUTION = 'evolution',
  SOCIAL = 'social',
  SUSTAINABILITY = 'sustainability',
  EXPLORATION = 'exploration'
}

export interface SustainabilityStats {
  totalEcoActions: number;
  sustainabilityStreak: number;
  locationVisits: LocationVisit[];
  challengesCompleted: number;
  co2Saved: number;
  waterSaved: number;
  wasteRecycled: number;
}

export interface LocationVisit {
  ecoLocationId: string;
  visitedAt: Date;
  creatureSpawned?: string;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  locationSharingEnabled: boolean;
  socialFeaturesEnabled: boolean;
  arEffectsEnabled: boolean;
  soundEnabled: boolean;
}

export enum ChallengeType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  COMMUNITY = 'community',
  SPECIAL_EVENT = 'special_event'
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  greenPlanTarget: GreenPlanTarget;
  requirements: ChallengeRequirement[];
  rewards: Reward[];
  duration: Duration;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface ChallengeRequirement {
  type: 'location_visit' | 'creature_collect' | 'streak_maintain' | 'social_share';
  target: number;
  description: string;
}

export interface Reward {
  type: 'points' | 'creature' | 'evolution_material' | 'achievement';
  value: number | string;
  description: string;
}

export interface Duration {
  days: number;
  hours?: number;
  minutes?: number;
}

export interface EvolutionMaterial {
  id: string;
  name: string;
  type: string;
  quantity: number;
  iconUrl: string;
}

export interface CollectionResult {
  success: boolean;
  creature: Creature;
  duplicateConverted?: boolean;
  materialsGranted?: EvolutionMaterial[];
}

export interface ARPhoto {
  id: string;
  imageData: string;
  creature: Creature;
  location: Location;
  timestamp: Date;
  metadata: PhotoMetadata;
}

export interface PhotoMetadata {
  deviceInfo: string;
  cameraSettings: string;
  environmentalData?: EnvironmentalData;
}

export interface EnvironmentalData {
  airQuality: number;
  temperature: number;
  humidity: number;
  uvIndex: number;
  timestamp: Date;
}

// Environmental snapshot captured at spawn/collect time
export interface EnvironmentalSnapshot extends EnvironmentalData {
  source: 'nea_api' | 'mock' | 'cache';
}

// AR session configuration and state
export type ARPlatform = 'arcore' | 'arkit';

export interface ARSessionConfig {
  platform: ARPlatform;
  enablePlaneDetection: boolean;
  enableLightEstimation: boolean;
  enablePeopleOcclusion?: boolean;
  worldAlignment?: 'gravity' | 'gravityAndHeading' | 'camera';
  modelCacheLimit?: number;
}

export type ARTrackingState =
  | 'not_available'
  | 'limited_initializing'
  | 'limited_excessive_motion'
  | 'limited_insufficient_features'
  | 'normal';

// Spawn conditions and configurations
export interface SpawnCondition {
  minDistanceMeters?: number;
  cooldownSeconds?: number;
  allowedTargets?: GreenPlanTarget[];
  requiredEnvironmental?: Partial<EnvironmentalData>;
  maxConcurrentSpawns?: number;
}

export interface SpawnConfig {
  baseRarityWeights: Record<RarityLevel, number>;
  environmentalBoostFactor?: number; // 0..1, scales rarity boost under favorable conditions
  duplicateConversion?: {
    enabled: boolean;
    materialId: string;
    quantityPerDuplicate: number;
  };
}

// Error models and retry policy
export type ErrorCategory =
  | 'network'
  | 'permission'
  | 'ar_tracking'
  | 'location'
  | 'data_integrity'
  | 'unknown';

export interface RetryPolicy {
  retries: number;
  backoffMs: number;
  backoffMultiplier?: number; // exponential if >1
}

export interface ARError {
  category: ErrorCategory;
  code: string;
  message: string;
  retryPolicy?: RetryPolicy;
}

export enum SocialPlatform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
  TWITTER = 'twitter'
}

export interface ShareResult {
  success: boolean;
  platform: SocialPlatform;
  error?: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  rank: number;
  avatar?: string;
}

export enum LeaderboardCategory {
  TOTAL_POINTS = 'total_points',
  CREATURES_COLLECTED = 'creatures_collected',
  SUSTAINABILITY_STREAK = 'sustainability_streak',
  CHALLENGES_COMPLETED = 'challenges_completed'
}