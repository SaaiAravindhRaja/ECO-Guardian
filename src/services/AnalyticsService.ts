// Analytics service for tracking user engagement and app performance
export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: Array<{ name: string; properties: any; timestamp: Date }> = [];

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track user actions
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        platform: 'mobile',
      },
      timestamp: new Date(),
    };

    this.events.push(event);
    console.log('Analytics Event:', event);

    // In production, send to analytics service (Firebase Analytics, Mixpanel, etc.)
    this.sendToAnalyticsService(event);
  }

  // Creature-related events
  trackCreatureSpawn(creatureType: string, location: any, rarity: string) {
    this.trackEvent('creature_spawned', {
      creature_type: creatureType,
      rarity,
      location_type: location.type,
      latitude: location.coordinates?.lat,
      longitude: location.coordinates?.lng,
    });
  }

  trackCreatureCollected(creatureType: string, rarity: string, timeToCollect: number) {
    this.trackEvent('creature_collected', {
      creature_type: creatureType,
      rarity,
      time_to_collect_seconds: timeToCollect,
    });
  }

  trackCreatureEvolved(creatureType: string, fromLevel: number, toLevel: number) {
    this.trackEvent('creature_evolved', {
      creature_type: creatureType,
      from_level: fromLevel,
      to_level: toLevel,
    });
  }

  // Challenge-related events
  trackChallengeStarted(challengeId: string, challengeType: string) {
    this.trackEvent('challenge_started', {
      challenge_id: challengeId,
      challenge_type: challengeType,
    });
  }

  trackChallengeCompleted(challengeId: string, challengeType: string, completionTime: number) {
    this.trackEvent('challenge_completed', {
      challenge_id: challengeId,
      challenge_type: challengeType,
      completion_time_minutes: completionTime,
    });
  }

  trackARSession(state: string) {
    this.trackEvent('ar_session', { state });
  }

  trackCreatureSpawn(type: string, rarity: string) {
    this.trackEvent('creature_spawn', { type, rarity });
  }

  trackCreatureCollect(type: string, rarity: string) {
    this.trackEvent('creature_collect', { type, rarity });
  }

  // Location-related events
  trackLocationVisit(locationType: string, locationName: string) {
    this.trackEvent('location_visited', {
      location_type: locationType,
      location_name: locationName,
    });
  }

  trackCheckIn(locationType: string, success: boolean) {
    this.trackEvent('check_in_attempted', {
      location_type: locationType,
      success,
    });
  }

  // Social features
  trackPhotoShared(platform: string, creatureType: string) {
    this.trackEvent('photo_shared', {
      platform,
      creature_type: creatureType,
    });
  }

  trackAchievementUnlocked(achievementId: string, achievementType: string) {
    this.trackEvent('achievement_unlocked', {
      achievement_id: achievementId,
      achievement_type: achievementType,
    });
  }

  // App usage
  trackScreenView(screenName: string) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
    });
  }

  trackAppLaunch() {
    this.trackEvent('app_launched', {
      launch_time: new Date().toISOString(),
    });
  }

  trackSessionDuration(durationMinutes: number) {
    this.trackEvent('session_ended', {
      duration_minutes: durationMinutes,
    });
  }

  // Error tracking
  trackError(error: Error, context: string) {
    this.trackEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      context,
    });
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string) {
    this.trackEvent('performance_metric', {
      metric,
      value,
      unit,
    });
  }

  // Environmental impact
  trackEnvironmentalImpact(co2Saved: number, waterSaved: number, wasteRecycled: number) {
    this.trackEvent('environmental_impact', {
      co2_saved_kg: co2Saved,
      water_saved_liters: waterSaved,
      waste_recycled_kg: wasteRecycled,
    });
  }

  // Get analytics summary
  getEventsSummary(): { totalEvents: number; eventTypes: Record<string, number> } {
    const eventTypes: Record<string, number> = {};
    
    this.events.forEach(event => {
      eventTypes[event.name] = (eventTypes[event.name] || 0) + 1;
    });

    return {
      totalEvents: this.events.length,
      eventTypes,
    };
  }

  // Clear events (for privacy/storage management)
  clearEvents() {
    this.events = [];
  }

  private async sendToAnalyticsService(event: any) {
    // In production, implement actual analytics service integration
    // Examples: Firebase Analytics, Mixpanel, Amplitude, etc.
    
    try {
      // Mock implementation
      if (__DEV__) {
        console.log('📊 Analytics Event:', event.name, event.properties);
      }
      
      // Example Firebase Analytics integration:
      // await analytics().logEvent(event.name, event.properties);
      
      // Example custom API integration:
      // await fetch('https://your-analytics-api.com/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });
      
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
}