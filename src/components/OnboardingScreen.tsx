import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingData = [
  {
    title: 'Welcome to ECO-Guardian! 🌱',
    description: 'Collect Singapore-themed AR creatures by completing sustainable actions aligned with Green Plan 2030.',
    emoji: '🌍',
  },
  {
    title: 'Discover Creatures 🐾',
    description: 'Visit eco-friendly locations like nature parks, EV stations, and recycling centers to spawn unique creatures.',
    emoji: '📍',
  },
  {
    title: 'Complete Challenges 🏆',
    description: 'Take on daily and weekly sustainability challenges to earn rewards and evolve your creatures.',
    emoji: '⚡',
  },
  {
    title: 'Make an Impact 💚',
    description: 'Track your environmental impact and contribute to Singapore\'s sustainable future while having fun!',
    emoji: '🌟',
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const page = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentPage(page);
        }}
      >
        {onboardingData.map((item, index) => (
          <View key={index} style={styles.page}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.indicators}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentPage === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  page: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7ED321',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#A8D5BA',
    textAlign: 'center',
    lineHeight: 24,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A7C59',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#7ED321',
    width: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#A8D5BA',
  },
  nextButton: {
    backgroundColor: '#7ED321',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
});