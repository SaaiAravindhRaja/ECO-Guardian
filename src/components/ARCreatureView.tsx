import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Platform, View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import type { Creature } from '@/types';
import { ARSessionManager } from '@/services/ARSessionManager';
import { AnalyticsService } from '@/services/AnalyticsService';
import { useDispatch } from 'react-redux';
import { setTracking } from '@/store/slices/arSlice';
import { ARModelLoader } from '@/services/ARModelLoader';

type ARCreatureViewProps = {
  creatures: Creature[];
  onCreatureTap: (creatureId: string) => void;
};

// Lightweight AR wrapper: uses platform-appropriate AR view if available,
// otherwise falls back to a transparent overlay container for camera.
export function ARCreatureView({ creatures, onCreatureTap }: ARCreatureViewProps) {
  const arRef = useRef<any>(null);
  const session = useRef(new ARSessionManager());
  const analytics = useRef(AnalyticsService.getInstance());
  const modelLoader = useRef(new ARModelLoader());
  const dispatch = useDispatch();
  const [tracking, setTracking] = useState('not_available');
  const [tappedId, setTappedId] = useState<string | null>(null);
  const { width, height } = Dimensions.get('window');

  const positions = useMemo(() => {
    // Deterministic pseudo-random positions based on creature id
    const hash = (s: string) => s.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
    return creatures.map(c => {
      const h = Math.abs(hash(c.id));
      const x = 0.15 + (h % 70) / 100; // 15% to 85%
      const y = 0.15 + ((Math.floor(h / 7)) % 70) / 100;
      return { id: c.id, left: width * x - 28, top: height * y - 28 };
    });
  }, [creatures, width, height]);

  useEffect(() => {
    if (!session.current.isInitialized()) {
      session.current.init();
    }
  }, []);

  useEffect(() => {
    // In a full implementation, we would load 3D assets (GLB) into the AR scene
    // and position them at anchors/planes. Here we prepare the structure.
    // Hint model preloading to reduce hitches
    creatures.slice(0, 3).forEach(c => {
      void modelLoader.current.loadModel(c.visualAssets.modelUrl).catch(() => {});
    });
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
        onPlaneDetected={() => {
          session.current.setTrackingState('normal');
          analytics.current.trackARSession('plane_detected');
          setTracking('normal');
          dispatch(setTracking('normal' as any));
        }}
        onTap={(event: any) => {
          // Basic hit: map any tap to nearest creature for now
          const nearest = creatures[0];
          if (nearest) onCreatureTap(nearest.id);
        }}
        onTrackingStateUpdate={() => {
          session.current.setTrackingState('limited_initializing');
          analytics.current.trackARSession('tracking_limited');
          setTracking('limited_initializing');
          dispatch(setTracking('limited_initializing' as any));
        }}
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
        onPlaneDetected={() => {
          session.current.setTrackingState('normal');
          analytics.current.trackARSession('plane_detected');
          setTracking('normal');
          dispatch(setTracking('normal' as any));
        }}
        onTap={() => {
          const nearest = creatures[0];
          if (nearest) onCreatureTap(nearest.id);
        }}
      />
    );
  }

  // Fallback: render nothing but keep layout stable (camera sits underneath)
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none" accessible={false}>
      {/* Spatial touch targets overlay as fallback and for accessibility */}
      {positions.map(p => (
        <TouchableOpacity
          key={p.id}
          accessibilityRole="button"
          accessibilityLabel={`Collect creature ${p.id}`}
          style={[styles.touchTarget, { left: p.left, top: p.top }]}
          onPress={() => {
            setTappedId(p.id);
            onCreatureTap(p.id);
            setTimeout(() => setTappedId(null), 400);
          }}
        >
          <View style={[styles.pulse, tappedId === p.id && styles.pulseActive]} />
        </TouchableOpacity>
      ))}
      {/* Tracking lost UI */}
      {tracking !== 'normal' && (
        <View style={styles.trackingBanner}>
          <Text style={styles.trackingBannerText}>Tracking lost. Re-center your device.</Text>
        </View>
      )}
    </View>
  );
}

function safeRequire(moduleName: string): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(moduleName);
  } catch (_) {
    return null;
  }
}

const styles = StyleSheet.create({
  touchTarget: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(126,211,33,0.6)',
  },
  pulseActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(126,211,33,0.9)',
  },
  trackingBanner: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  trackingBannerText: {
    color: '#fff',
    fontSize: 12,
  },
});


