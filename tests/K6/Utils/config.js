/* eslint-env node, es6 */
import { BASE_URL, API_BASE_URL } from './helper.js';

// Test configurations for different test types
export const testConfigs = {
  // Load testing - normal expected load
  load: {
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
  },

  // Stress testing - push beyond normal limits
  stress: {
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
  },

  // Soak testing - sustained load over time
  soak: {
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
  },

  // Volume testing - large amount of data
  volume: {
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
  },
};

// API endpoints for testing
export const endpoints = {
  // Public endpoints
  home: `${BASE_URL}/`,
  services: `${BASE_URL}/services`,
  pricing: `${BASE_URL}/pricing`,
  contact: `${BASE_URL}/contact`,
  about: `${BASE_URL}/about`,
  documentation: `${API_BASE_URL}/documentation`,

  // API endpoints - Keiclean Jobs API
  apiHealth: `${API_BASE_URL}/health`,
  apiAuth: `${API_BASE_URL}/auth`,
  apiRegister: `${API_BASE_URL}/auth/register`,
  apiLogin: `${API_BASE_URL}/auth/login`,
  apiLogout: `${API_BASE_URL}/auth/logout`,
  apiMe: `${API_BASE_URL}/auth/me`,
  apiKeys: `${API_BASE_URL}/api-keys`,
  apiKeysDelete: (id) => `${API_BASE_URL}/api-keys/${id}`,
  apiJobs: `${API_BASE_URL}/jobs`,
  apiJob: (id) => `${API_BASE_URL}/jobs/${id}`,

  // Legacy endpoints (for backward compatibility)
  apiServices: `${API_BASE_URL}/services`,
  apiPricing: `${API_BASE_URL}/pricing`,
  apiBooking: `${API_BASE_URL}/booking`,
  apiProfile: `${API_BASE_URL}/profile`,
  apiBookings: `${API_BASE_URL}/bookings`,
};

// Test scenarios configuration
export const scenarios = {
  // Browse-only scenario (anonymous users)
  browseOnly: {
    weight: 40, // 40% of traffic
    endpoints: [
      { url: endpoints.home, weight: 30 },
      { url: endpoints.services, weight: 25 },
      { url: endpoints.pricing, weight: 20 },
      { url: endpoints.contact, weight: 15 },
      { url: endpoints.about, weight: 10 },
    ],
  },

  // Authenticated user scenario
  authenticatedUser: {
    weight: 35, // 35% of traffic
    requiresAuth: true,
    endpoints: [
      { url: endpoints.apiProfile, weight: 20 },
      { url: endpoints.apiBookings, weight: 30 },
      { url: endpoints.apiServices, weight: 25 },
      { url: endpoints.apiPricing, weight: 15 },
      { url: endpoints.home, weight: 10 },
    ],
  },

  // Booking-focused scenario
  bookingFocused: {
    weight: 20, // 20% of traffic
    requiresAuth: true,
    endpoints: [
      { url: endpoints.apiBooking, weight: 40, method: 'POST' },
      { url: endpoints.apiServices, weight: 20 },
      { url: endpoints.apiPricing, weight: 20 },
      { url: endpoints.apiBookings, weight: 20 },
    ],
  },

  // API health check scenario
  healthCheck: {
    weight: 5, // 5% of traffic
    endpoints: [{ url: endpoints.apiHealth, weight: 100 }],
  },
};

// Environment-specific configurations
export const environments = {
  development: {
    BASE_URL: 'http://localhost:3000',
    API_BASE_URL: 'http://localhost:3001',
  },
  local: {
    BASE_URL: 'http://192.168.0.160:8000',
    API_BASE_URL: 'http://192.168.0.160:8000/api',
  },
  staging: {
    BASE_URL: 'https://staging.clean.keiclean.co.uk',
    API_BASE_URL: 'https://api-staging.clean.keiclean.co.uk',
  },
  production: {
    BASE_URL: 'https://clean.keiclean.co.uk',
    API_BASE_URL: 'https://api.clean.keiclean.co.uk',
  },
};

// Custom thresholds for different endpoints
export const endpointThresholds = {
  [endpoints.home]: {
    http_req_duration: ['p(95)<300'],
  },
  [endpoints.apiHealth]: {
    http_req_duration: ['p(95)<100'],
  },
  [endpoints.apiBooking]: {
    http_req_duration: ['p(95)<2000'],
  },
  [endpoints.apiLogin]: {
    http_req_duration: ['p(95)<800'],
  },
};
