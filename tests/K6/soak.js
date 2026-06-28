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
    { duration: '5m', target: 5 }, // Ramp up to 5 users
    { duration: '1h', target: 5 }, // Stay at 5 users for 1 hour
    { duration: '5m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // Slightly more lenient
    http_req_failed: ['rate<0.05'], // Very low error rate
    errors: ['rate<0.05'],
  },
};

export default function () {
  // Test homepage
  const homeRes = http.get(`${BASE_URL}/`, { headers: commonHeaders });
  check(homeRes, {
    'homepage status 200': (r) => r.status === 200,
    'homepage response time < 800ms': (r) => r.timings.duration < 800,
  });
  errorRate.add(homeRes.status >= 400);

  randomSleep(2, 4);

  // Test API health
  const healthRes = http.get(`${API_BASE_URL}/health`, {
    headers: commonHeaders,
  });
  check(healthRes, {
    'health status 200': (r) => r.status === 200,
    'health response time < 300ms': (r) => r.timings.duration < 300,
  });
  errorRate.add(healthRes.status >= 400);

  randomSleep(2, 5);
}
