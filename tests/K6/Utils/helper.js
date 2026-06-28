/* eslint-env node, es6 */
/* global __ENV */
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import http from 'k6/http';

// Custom metrics
export const errorRate = new Rate('errors');

// Configuration
export const BASE_URL = __ENV.BASE_URL || 'http://192.168.0.160:8000';
export const API_BASE_URL =
  __ENV.API_BASE_URL || 'http://192.168.0.160:8000/api';

// Common headers
export const commonHeaders = {
  'Content-Type': 'application/json',
  'User-Agent': 'KeiClean-K6-Performance-Test/1.0',
};

// Auth helper
export function getAuthHeaders(token) {
  return {
    ...commonHeaders,
    Authorization: `Bearer ${token}`,
  };
}

// Common checks
export const commonChecks = {
  'status is 200': (r) => r.status === 200,
  'status is 201': (r) => r.status === 201,
  'status is 400': (r) => r.status === 400,
  'status is 401': (r) => r.status === 401,
  'status is 404': (r) => r.status === 404,
  'status is 500': (r) => r.status === 500,
  'response time < 500ms': (r) => r.timings.duration < 500,
  'response time < 1000ms': (r) => r.timings.duration < 1000,
  'response time < 2000ms': (r) => r.timings.duration < 2000,
  'response body is not empty': (r) => r.body && r.body.length > 0,
};

// Random data generators
export function generateRandomEmail() {
  return `test${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateRandomPhone() {
  return `+447${Math.floor(Math.random() * 900000000) + 100000000}`;
}

export function generateRandomPostcode() {
  const postcodes = [
    'SW1A 1AA',
    'EC1A 1BB',
    'W1A 0AX',
    'M1 1AE',
    'B1 1AA',
    'E1 6AN',
  ];
  return postcodes[Math.floor(Math.random() * postcodes.length)];
}

export function generateRandomBookingData() {
  return {
    service_type: ['regular_clean', 'deep_clean', 'end_of_tenancy'][
      Math.floor(Math.random() * 3)
    ],
    property_type: ['flat', 'house', 'studio'][Math.floor(Math.random() * 3)],
    bedrooms: Math.floor(Math.random() * 4) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    address: {
      street: `${Math.floor(Math.random() * 999)} Test Street`,
      city: 'London',
      postcode: generateRandomPostcode(),
    },
    contact: {
      name: `Test User ${Math.random().toString(36).substring(7)}`,
      email: generateRandomEmail(),
      phone: generateRandomPhone(),
    },
    preferred_date: new Date(
      Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0],
    preferred_time: ['morning', 'afternoon', 'evening'][
      Math.floor(Math.random() * 3)
    ],
    special_requirements:
      Math.random() > 0.5 ? 'Test special requirements' : null,
  };
}

// Request wrapper with error handling
export function makeRequest(method, url, body = null, headers = null) {
  const requestHeaders = headers
    ? { ...commonHeaders, ...headers }
    : commonHeaders;

  let response;
  if (method === 'GET') {
    response = http.get(url, { headers: requestHeaders });
  } else if (method === 'POST') {
    response = http.post(url, JSON.stringify(body), {
      headers: requestHeaders,
    });
  } else if (method === 'PUT') {
    response = http.put(url, JSON.stringify(body), { headers: requestHeaders });
  } else if (method === 'DELETE') {
    response = http.del(url, { headers: requestHeaders });
  } else if (method === 'PATCH') {
    response = http.patch(url, JSON.stringify(body), {
      headers: requestHeaders,
    });
  }

  // Track error rate
  if (response) {
    errorRate.add(response.status >= 400);
  }

  return response;
}

// Sleep helper
export function randomSleep(min = 1, max = 3) {
  sleep(Math.random() * (max - min) + min);
}

// Test data management
export const testUsers = [
  {
    email: 'testuser1@example.com',
    password: 'TestPassword123!',
    token: null,
  },
  {
    email: 'testuser2@example.com',
    password: 'TestPassword123!',
    token: null,
  },
  {
    email: 'testuser3@example.com',
    password: 'TestPassword123!',
    token: null,
  },
];

// Authentication flow
export function authenticateUser(user) {
  const loginData = {
    email: user.email,
    password: user.password,
  };

  const response = makeRequest('POST', `${API_BASE_URL}/auth/login`, loginData);

  const success = check(response, {
    'login successful': (r) => r && r.status === 200,
    'token received': (r) => r && r.json('token') !== undefined,
  });

  if (success && response) {
    user.token = response.json('token');
  }

  return { response, success };
}

// Cleanup helper
export function cleanupTestData() {
  console.log('Cleaning up test data...');
}
