import { OfflineQueueService } from '@/services/OfflineQueueService';

jest.useFakeTimers();

describe('OfflineQueueService', () => {
  it('retries failing tasks and eventually succeeds', async () => {
    const queue = new OfflineQueueService();
    let attempts = 0;
    const task = jest.fn(async () => {
      attempts++;
      if (attempts < 2) {
        throw new Error('fail once');
      }
    });

    queue.enqueue(task);

    // Fast-forward timers to allow retry delay
    await Promise.resolve();
    jest.advanceTimersByTime(2500);

    // Allow promise microtasks to flush
    await Promise.resolve();

    expect(attempts).toBeGreaterThanOrEqual(2);
  });
});


