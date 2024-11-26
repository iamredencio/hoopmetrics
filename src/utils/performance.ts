import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  LCP: { good: 2500, poor: 4000 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
};

function getRating(name: string, value: number): Metric['rating'] {
  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export function measureWebVitals(onMetric?: (metric: Metric) => void) {
  function handleMetric({ name, value, delta }: { name: string; value: number; delta: number }) {
    const metric: Metric = {
      name,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      rating: getRating(name, value)
    };

    if (onMetric) {
      onMetric(metric);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`${metric.name}:`, {
        value: metric.value,
        rating: metric.rating
      });
    }
  }

  getCLS(handleMetric);
  getFID(handleMetric);
  getLCP(handleMetric);
  getFCP(handleMetric);
  getTTFB(handleMetric);
}