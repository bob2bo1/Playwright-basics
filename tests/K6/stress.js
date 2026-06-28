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
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 50 }, // Spike to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Spike to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // More lenient for stress tests
    http_req_failed: ['rate<0.3'], // Allow higher error rate
    errors: ['rate<0.3'],
  },
};

export default function () {
  // Test homepage
  const homeRes = http.get(`${BASE_URL}/`, { headers: commonHeaders });
  check(homeRes, {
    'homepage status 200': (r) => r.status === 200,
    'homepage response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  errorRate.add(homeRes.status >= 400);

  randomSleep(0.5, 1.5);

  // Test API health
  const healthRes = http.get(`${API_BASE_URL}/health`, {
    headers: commonHeaders,
  });
  check(healthRes, {
    'health status 200': (r) => r.status === 200,
    'health response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(healthRes.status >= 400);

  randomSleep(0.5, 2);
}
