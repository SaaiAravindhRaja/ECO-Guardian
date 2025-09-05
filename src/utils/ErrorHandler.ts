export type ErrorContext = {
  area: string;
  action: string;
  metadata?: Record<string, unknown>;
};

export class ErrorHandler {
  static handle(error: unknown, ctx?: ErrorContext) {
    // eslint-disable-next-line no-console
    console.error('[Error]', ctx?.area || 'unknown', ctx?.action || 'unknown', error, ctx?.metadata);
  }
}


