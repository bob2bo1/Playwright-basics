/**
 * navigate to the homepage stage.keiclean.co.uk
 * click on register link
 * locate the firstname input field
 * fill firstname
 * locate the lastname input field
 * fill lastname
 * locate email input field
 * fill email
 * locate password input field
 * fill password
 * locate confirm password input field
 * fill confirm password
 * locate register button
 * click register button
 * assert success message or redirect to login page
 */

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.skip('Register test with valid data', async ({ page }) => { // skip this test to avoid duplicate registrations
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByLabel('First Name').fill('Jonathan');
    await page.getByLabel('Last Name').fill('Bailey');
    await page.getByLabel('Email').fill('jonathan.bailey@example.com');

    // await page.getByLabel('Password').fill('password123');
    await page.getByRole('textbox', { name: /^Password$/ }).fill('password123'); // the regex pattern ^Password$ matches the exact text "Password"
    await page.getByLabel('Confirm Password').fill('password123');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
});

test('register with invalid data', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    const firstname = await page.getByLabel('First Name');
    await firstname.fill('');
    await page.getByLabel('Last Name').fill('Bailey');
    await page.getByLabel('Email').fill('jonathan.bailey@example.com');
    await page.getByRole('textbox', { name: /^Password$/ }).fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    const validationMessage = await firstname.evaluate(el => (el as HTMLInputElement).validationMessage);
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(validationMessage).toBe('Please fill in this field.');
});

test('Register test with valid data using date timestamp', async ({ page }) => { 
    // Generate dynamic test data
    const timestamp = Date.now();
    const firstName = `User${timestamp}`;
    const lastName = `Test${timestamp}`;
    const email = `user${timestamp}@example.com`;
    const password = `Pass${timestamp}!`;

    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByLabel('First Name').fill(firstName);
    await page.getByLabel('Last Name').fill(lastName);
    await page.getByLabel('Email').fill(email);

    await page.getByRole('textbox', { name: /^Password$/ }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
});

test('Register test with valid data using faker library dynamically', async ({ page }) => {
    // Generate realistic test data using faker
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = faker.internet.password({ length: 12, memorable: true });

    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByLabel('First Name').fill(firstName);
    await page.getByLabel('Last Name').fill(lastName);
    await page.getByLabel('Email').fill(email);

    await page.getByRole('textbox', { name: /^Password$/ }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
});