import { ARCompatibilityService } from '@/services/ARCompatibilityService';

describe('ARCompatibilityService', () => {
  it('returns a boolean for support', async () => {
    const svc = new ARCompatibilityService();
    const supported = await svc.isARSupported();
    expect(typeof supported).toBe('boolean');
  });
});
