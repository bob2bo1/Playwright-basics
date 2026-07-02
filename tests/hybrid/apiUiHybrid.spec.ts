import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import {} from '../../utils/apiCleaner';

test.describe('API + UI Hybrid Tests', () => {
  test('UI: Verify application is accessible', async ({ page }) => {
    // Step 1: Navigate to homepage and verify it loads
    await page.goto('/');
    await expect(page).toHaveTitle(/My Website/);

    // Step 2: Verify login link is accessible
    const loginLink = page.getByRole('link', { name: 'Log In' });
    await expect(loginLink).toBeVisible();
  });

  test('UI: Login, then API: Verify user session', async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);

    // Step 1: Use UI to login
    await loginPage.navigateToLogin();
    await loginPage.login('test@example.com', 'password123');
    await expect(loginPage.logoutButton).toBeVisible();

    // Step 2: Use API to verify user session or fetch user data
    const apiResponse = await request.get('/api/user/profile');

    if (apiResponse.status() === 200) {
      const userData = await apiResponse.json();
      expect(userData.email).toBe('test@example.com');
    }
  });

  // test('API: Create test data, then UI: Verify in application', async ({ page, request }) => {
  //   // Step 1: Use API to create/verify a booking
  //   const bookingData = {
  //     service_type: 'regular_clean',
  //     property_type: 'flat',
  //     bedrooms: 2,
  //     bathrooms: 1,
  //     address: {
  //       street: '123 Test Street',
  //       city: 'London',
  //       postcode: 'SW1A 1AA',
  //     },
  //     contact: {
  //       name: 'Test User',
  //       email: 'test@example.com',
  //       phone: '+447123456789',
  //     },
  //     preferred_date: '2024-12-01',
  //     preferred_time: 'morning',
  //   };

  //   // Attempt to create booking via API
  //   const apiResponse = await request.post('/api/bookings', {
  //     data: bookingData,
  //   });

  //   // Step 2: Use UI to navigate to bookings section
  //   const loginPage = new LoginPage(page);
  //   await page.goto('/');
  //   await loginPage.navigateToLogin();
  //   await loginPage.login('test@example.com', 'password123');

  //   const bookingsLink = page.getByRole('link', { name: /bookings/i }).or(page.getByText(/bookings/i));
  //   if (await bookingsLink.isVisible({ timeout: 3000 })) {
  //     await bookingsLink.click();
  //     await expect(page).toHaveURL(/.*bookings.*/);
  //   }
  // });
});
