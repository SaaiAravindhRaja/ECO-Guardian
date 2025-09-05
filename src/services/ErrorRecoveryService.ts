import { ARError, ErrorCategory, RetryPolicy } from '@/types';
import { retry } from '@/utils/Retry';

export class ErrorRecoveryService {
  async withRecovery<T>(operation: () => Promise<T>, errorContext: ARError): Promise<T> {
    const policy = this.policyFor(errorContext.category);
    return retry(operation, policy.retries, policy.backoffMs, policy.backoffMultiplier || 2);
  }

  policyFor(category: ErrorCategory): RetryPolicy {
    switch (category) {
      case 'network':
        return { retries: 3, backoffMs: 800, backoffMultiplier: 2 };
      case 'ar_tracking':
        return { retries: 2, backoffMs: 500, backoffMultiplier: 2 };
      case 'location':
        return { retries: 2, backoffMs: 700, backoffMultiplier: 2 };
      case 'permission':
        return { retries: 0, backoffMs: 0 } as RetryPolicy;
      default:
        return { retries: 1, backoffMs: 500 } as RetryPolicy;
    }
  }
}


