import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import {
  BASE_URL,
  API_BASE_URL,
  commonHeaders,
  randomSleep,
} from './Utils/helper.js';

// Custom metrics
export const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'], // Error rate under 10%
    errors: ['rate<0.1'], // Custom error rate under 10%
  },
};

export default function () {
  // Test homepage
  const homeRes = http.get(`${BASE_URL}/`, { headers: commonHeaders });
  check(homeRes, {
    'homepage status 200': (r) => r.status === 200,
    'homepage response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(homeRes.status >= 400);

  randomSleep(1, 2);

  // Test API health
  const healthRes = http.get(`${API_BASE_URL}/health`, {
    headers: commonHeaders,
  });
  check(healthRes, {
    'health status 200': (r) => r.status === 200,
    'health response time < 200ms': (r) => r.timings.duration < 200,
  });
  errorRate.add(healthRes.status >= 400);

  randomSleep(1, 3);
}
