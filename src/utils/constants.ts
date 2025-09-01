// App Constants
export const APP_NAME = 'ECO-Guardian';
export const APP_VERSION = '1.0.0';

// Colors
export const COLORS = {
  primary: '#7ED321',
  primaryDark: '#5BA91A',
  secondary: '#1B4332',
  secondaryLight: '#2D5A27',
  accent: '#A8D5BA',
  background: '#1B4332',
  surface: '#2D5A27',
  border: '#4A7C59',
  text: '#FFFFFF',
  textSecondary: '#A8D5BA',
  textMuted: '#6B8E6B',
  error: '#E74C3C',
  warning: '#F39C12',
  success: '#27AE60',
  info: '#3498DB',
};

// Creature Types
export const CREATURE_EMOJIS = {
  greenie: '🌱',
  sparkie: '⚡',
  binities: '♻️',
  drippies: '💧',
};

// Rarity Colors
export const RARITY_COLORS = {
  common: '#95A5A6',
  uncommon: '#27AE60',
  rare: '#3498DB',
  epic: '#9B59B6',
  legendary: '#F39C12',
};

// Green Plan Targets
export const GREEN_PLAN_ICONS = {
  city_in_nature: '🌳',
  energy_reset: '⚡',
  sustainable_living: '♻️',
  green_economy: '💚',
  resilient_future: '🌍',
};

// API Endpoints
export const API_ENDPOINTS = {
  NEA_BASE: 'https://api.data.gov.sg/v1/environment',
  ONEMAP_BASE: 'https://developers.onemap.sg/restapi',
};

// Storage Keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  USER_PROGRESS: 'user_progress',
  CACHED_CREATURES: 'cached_creatures',
  CACHED_LOCATIONS: 'cached_locations',
  SETTINGS: 'app_settings',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  CREATURE_SPAWN: 'creature_spawn',
  DAILY_CHALLENGE: 'daily_challenge',
  STREAK_REMINDER: 'streak_reminder',
  ENVIRONMENTAL_ALERT: 'environmental_alert',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
};

// Challenge Types
export const CHALLENGE_ICONS = {
  daily: '📅',
  weekly: '📊',
  monthly: '🗓️',
  community: '👥',
  special_event: '🎉',
};

// Location Types
export const LOCATION_ICONS = {
  nature_park: '🌳',
  community_garden: '🌱',
  ev_charging_station: '⚡',
  recycling_center: '♻️',
  recycling_bin: '🗂️',
  abc_waters_site: '💧',
};

// Social Platforms
export const SOCIAL_PLATFORMS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  twitter: 'Twitter',
};

// Default Values
export const DEFAULTS = {
  SPAWN_RADIUS: 100, // meters
  LOCATION_ACCURACY: 50, // meters
  MAX_DAILY_SPAWNS: 10,
  BASE_EXPERIENCE: 100,
  LEVEL_MULTIPLIER: 1.5,
};