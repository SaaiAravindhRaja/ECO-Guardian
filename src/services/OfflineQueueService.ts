type Task = () => Promise<void>;

export class OfflineQueueService {
  private queue: Task[] = [];
  private isProcessing = false;

  enqueue(task: Task) {
    this.queue.push(task);
    void this.process();
  }

  async process() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      while (this.queue.length > 0) {
        const task = this.queue[0];
        try {
          await task();
          this.queue.shift();
        } catch (_error) {
          // exponential backoff simple wait
          await this.delay(2000);
          // retry same task
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


