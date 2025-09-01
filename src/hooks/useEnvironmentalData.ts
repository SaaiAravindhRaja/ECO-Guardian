import { useState, useEffect } from 'react';
import { EnvironmentalDataService } from '@/services/EnvironmentalDataService';
import { EnvironmentalData } from '@/types';

export function useEnvironmentalData() {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const environmentalService = new EnvironmentalDataService();

  useEffect(() => {
    fetchEnvironmentalData();
    
    // Refresh data every 30 minutes
    const interval = setInterval(fetchEnvironmentalData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchEnvironmentalData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const environmentalData = await environmentalService.getCurrentEnvironmentalData();
      setData(environmentalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch environmental data');
      console.error('Error fetching environmental data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEnvironmentalMessage = () => {
    if (!data) return 'Loading environmental data...';
    return environmentalService.getEnvironmentalMessage(data);
  };

  const shouldBoostSpawns = () => {
    if (!data) return false;
    return environmentalService.shouldBoostCreatureSpawns(data);
  };

  return {
    data,
    isLoading,
    error,
    refresh: fetchEnvironmentalData,
    getEnvironmentalMessage,
    shouldBoostSpawns,
  };
}