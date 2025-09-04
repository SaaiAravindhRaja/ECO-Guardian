export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-SG').format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}


