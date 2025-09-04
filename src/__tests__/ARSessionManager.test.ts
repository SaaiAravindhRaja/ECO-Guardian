import { ARSessionManager } from '@/services/ARSessionManager';

describe('ARSessionManager', () => {
  it('initializes with defaults and updates tracking', () => {
    const mgr = new ARSessionManager();
    expect(mgr.isInitialized()).toBe(false);
    mgr.init();
    expect(mgr.isInitialized()).toBe(true);
    mgr.setTrackingState('normal');
    expect(mgr.getTrackingState()).toBe('normal');
  });
});
