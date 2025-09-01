// Utility functions for formatting data display

export class FormatService {
  static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  static formatDistance(meters: number): string {
    if (meters >= 1000) {
      return (meters / 1000).toFixed(1) + ' km';
    }
    return Math.round(meters) + ' m';
  }

  static formatDate(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString();
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  static formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = Math.round((value / total) * 100);
    return `${percentage}%`;
  }

  static formatCurrency(amount: number, currency: string = 'SGD'): string {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  static formatCoordinates(lat: number, lng: number): string {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  static formatRarity(rarity: string): string {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
  }

  static formatCreatureType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  static formatGreenPlanTarget(target: string): string {
    return target
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  static formatEnvironmentalData(value: number, unit: string): string {
    return `${value.toFixed(1)} ${unit}`;
  }

  static formatStreakDays(days: number): string {
    if (days === 0) return 'No streak';
    if (days === 1) return '1 day';
    return `${days} days`;
  }

  static formatImpactValue(value: number, type: 'co2' | 'water' | 'waste'): string {
    const units = {
      co2: 'kg CO₂',
      water: 'L',
      waste: 'kg'
    };

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k ${units[type]}`;
    }

    return `${value.toFixed(1)} ${units[type]}`;
  }
}