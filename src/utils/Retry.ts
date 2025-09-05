export async function retry<T>(fn: () => Promise<T>, retries = 3, backoffMs = 500, multiplier = 2): Promise<T> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise(res => setTimeout(res, backoffMs));
      backoffMs *= multiplier;
      attempt++;
    }
  }
  throw lastError;
}


