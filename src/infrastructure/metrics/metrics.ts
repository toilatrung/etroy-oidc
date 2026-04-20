export interface CounterMetric {
  name: string;
  value: number;
}

export interface TimerMetric {
  name: string;
  count: number;
  totalMs: number;
  minMs: number;
  maxMs: number;
  averageMs: number;
}

const counterStore = new Map<string, number>();
const timerStore = new Map<
  string,
  { count: number; totalMs: number; minMs: number; maxMs: number }
>();

const normalizeMetricName = (name: string): string => {
  const normalized = name.trim();
  if (normalized.length === 0) {
    throw new Error('Metric name must be a non-empty string.');
  }
  return normalized;
};

export const incrementCounter = (name: string, incrementBy = 1): number => {
  if (!Number.isFinite(incrementBy)) {
    throw new Error('Counter increment must be a finite number.');
  }

  const metricName = normalizeMetricName(name);
  const nextValue = (counterStore.get(metricName) ?? 0) + incrementBy;
  counterStore.set(metricName, nextValue);
  return nextValue;
};

export const getCounter = (name: string): CounterMetric => {
  const metricName = normalizeMetricName(name);
  return {
    name: metricName,
    value: counterStore.get(metricName) ?? 0,
  };
};

export const recordTiming = (name: string, durationMs: number): TimerMetric => {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    throw new Error('Timer duration must be a finite number greater than or equal to 0.');
  }

  const metricName = normalizeMetricName(name);
  const previous = timerStore.get(metricName) ?? {
    count: 0,
    totalMs: 0,
    minMs: Number.POSITIVE_INFINITY,
    maxMs: 0,
  };

  const next = {
    count: previous.count + 1,
    totalMs: previous.totalMs + durationMs,
    minMs: Math.min(previous.minMs, durationMs),
    maxMs: Math.max(previous.maxMs, durationMs),
  };

  timerStore.set(metricName, next);

  return {
    name: metricName,
    count: next.count,
    totalMs: next.totalMs,
    minMs: Number.isFinite(next.minMs) ? next.minMs : 0,
    maxMs: next.maxMs,
    averageMs: next.count === 0 ? 0 : next.totalMs / next.count,
  };
};

export const startTimer = (name: string): (() => TimerMetric) => {
  const metricName = normalizeMetricName(name);
  const startAt = performance.now();

  return () => recordTiming(metricName, performance.now() - startAt);
};

export const getTimer = (name: string): TimerMetric => {
  const metricName = normalizeMetricName(name);
  const current = timerStore.get(metricName);

  if (!current) {
    return {
      name: metricName,
      count: 0,
      totalMs: 0,
      minMs: 0,
      maxMs: 0,
      averageMs: 0,
    };
  }

  return {
    name: metricName,
    count: current.count,
    totalMs: current.totalMs,
    minMs: Number.isFinite(current.minMs) ? current.minMs : 0,
    maxMs: current.maxMs,
    averageMs: current.count === 0 ? 0 : current.totalMs / current.count,
  };
};

export const resetMetricsForTest = (): void => {
  counterStore.clear();
  timerStore.clear();
};
