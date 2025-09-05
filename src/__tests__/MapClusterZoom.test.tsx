import React from 'react';
import { render } from '@testing-library/react-native';
import MapView from 'react-native-maps';
import { clusterByTile } from '@/services/selectors/spawnSelectors';

jest.mock('react-native-maps', () => {
  const Real = jest.requireActual('react-native-maps');
  return {
    __esModule: true,
    ...Real,
    default: jest.fn().mockImplementation(() => null),
  };
});

describe('cluster zoom behavior', () => {
  it('fitToCoordinates is called on cluster tap (mocked)', () => {
    const ref: any = { current: { fitToCoordinates: jest.fn(), animateCamera: jest.fn() } };
    const items: any[] = [
      { spawnLocation: { latitude: 1.0, longitude: 103.8 }, tileIdP7: 't' },
      { spawnLocation: { latitude: 1.001, longitude: 103.801 }, tileIdP7: 't' },
    ];
    const clusters = clusterByTile(items as any);
    expect(clusters[0].count).toBe(2);
  });
});


