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
    { duration: '1m', target: 30 }, // Quick ramp up
    { duration: '10m', target: 30 }, // Sustained high volume
    { duration: '1m', target: 0 }, // Quick ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // Most lenient for volume tests
    http_req_failed: ['rate<0.2'], // Moderate error rate
    errors: ['rate<0.2'],
  },
};

export default function () {
  // Test homepage
  const homeRes = http.get(`${BASE_URL}/`, { headers: commonHeaders });
  check(homeRes, {
    'homepage status 200': (r) => r.status === 200,
    'homepage response time < 1500ms': (r) => r.timings.duration < 1500,
  });
  errorRate.add(homeRes.status >= 400);

  randomSleep(0.5, 1);

  // Test API health
  const healthRes = http.get(`${API_BASE_URL}/health`, {
    headers: commonHeaders,
  });
  check(healthRes, {
    'health status 200': (r) => r.status === 200,
    'health response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(healthRes.status >= 400);

  randomSleep(0.5, 1.5);
}
