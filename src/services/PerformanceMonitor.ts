export class PerformanceMonitor {
  private marks = new Map<string, number>();

  mark(name: string) {
    this.marks.set(name, performance.now ? performance.now() : Date.now());
  }

  measure(start: string, end: string): number | null {
    const s = this.marks.get(start);
    const e = this.marks.get(end) || (performance.now ? performance.now() : Date.now());
    if (s == null) return null;
    return e - s;
  }
}


