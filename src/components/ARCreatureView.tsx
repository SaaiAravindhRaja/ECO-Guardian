import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import type { Creature } from '@/types';

type ARCreatureViewProps = {
  creatures: Creature[];
  onCreatureTap: (creatureId: string) => void;
};

// Lightweight AR wrapper: uses platform-appropriate AR view if available,
// otherwise falls back to a transparent overlay container for camera.
export function ARCreatureView({ creatures, onCreatureTap }: ARCreatureViewProps) {
  const arRef = useRef<any>(null);

  useEffect(() => {
    // In a full implementation, we would load 3D assets (GLB) into the AR scene
    // and position them at anchors/planes. Here we prepare the structure.
  }, [creatures]);

  // Lazy require to avoid metro resolution issues on platforms
  const AndroidAR = Platform.OS === 'android' ? safeRequire('react-native-arcore') : null;
  const IOSAR = Platform.OS === 'ios' ? safeRequire('react-native-arkit') : null;

  if (Platform.OS === 'android' && AndroidAR?.ARCoreView) {
    const { ARCoreView } = AndroidAR;
    return (
      <ARCoreView
        ref={arRef}
        style={StyleSheet.absoluteFill}
        onPlaneDetected={() => {}}
        onTap={(event: any) => {
          // Basic hit: map any tap to nearest creature for now
          const nearest = creatures[0];
          if (nearest) onCreatureTap(nearest.id);
        }}
        onTrackingStateUpdate={() => {}}
      />
    );
  }

  if (Platform.OS === 'ios' && IOSAR?.default) {
    const ARKit = IOSAR.default;
    return (
      <ARKit.ARKit
        ref={arRef}
        style={StyleSheet.absoluteFill}
        planeDetection={ARKit.ARKit.ARPlaneDetection.Horizontal}
        onPlaneDetected={() => {}}
        onTap={() => {
          const nearest = creatures[0];
          if (nearest) onCreatureTap(nearest.id);
        }}
      />
    );
  }

  // Fallback: render nothing but keep layout stable (camera sits underneath)
  return <View style={StyleSheet.absoluteFill} pointerEvents="none" />;
}

function safeRequire(moduleName: string): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(moduleName);
  } catch (_) {
    return null;
  }
}


