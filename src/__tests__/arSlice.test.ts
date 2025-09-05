import { arSlice, setTracking, setSessionConfig } from '@/store/slices/arSlice';

describe('arSlice', () => {
  it('sets tracking state', () => {
    const state = arSlice.getInitialState();
    const next = arSlice.reducer(state, setTracking('normal'));
    expect(next.tracking).toBe('normal');
  });

  it('sets session config', () => {
    const state = arSlice.getInitialState();
    const cfg: any = { platform: 'arcore', enablePlaneDetection: true, enableLightEstimation: true };
    const next = arSlice.reducer(state, setSessionConfig(cfg));
    expect(next.sessionConfig).toEqual(cfg);
  });
});
