import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics for RoastRush Flash Sale & Catalog endpoints
const errorRate = new Rate('roastrush_errors');
const flashSaleLatency = new Trend('roastrush_flashsale_latency_ms');

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:4173';
const PEAK_VUS = Number(__ENV.PEAK_VUS || 30);

export const options = {
  stages: [
    { duration: '10s', target: Math.max(5, Math.floor(PEAK_VUS / 2)) }, // Ramp-up
    { duration: '20s', target: PEAK_VUS },                              // Peak Flash Sale Rush
    { duration: '10s', target: 0 },                                     // Ramp-down
  ],
  thresholds: {
    // SLA 1: 95% of requests must complete below 500ms
    http_req_duration: ['p(95)<500'],
    // SLA 2: Error rate must be strictly less than 1%
    http_req_failed: ['rate<0.01'],
    roastrush_errors: ['rate<0.01'],
  },
};

export default function () {
  group('RoastRush Storefront & Flash Sale Rush Simulation', () => {
    const res = http.get(BASE_URL, {
      headers: {
        Accept: 'text/html,application/json',
        'X-Client': 'k6-roastrush-loadtest',
      },
    });

    flashSaleLatency.add(res.timings.duration);

    const passed = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });

    errorRate.add(!passed);
  });

  sleep(0.5);
}

/**
 * Tự động xuất báo cáo kết quả ra file report.json để đẩy lên GitHub Actions Artifacts
 */
export function handleSummary(data) {
  return {
    'report.json': JSON.stringify(data, null, 2),
  };
}

