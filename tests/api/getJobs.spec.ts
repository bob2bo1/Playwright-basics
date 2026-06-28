import { test, expect } from '@playwright/test';
import { cleanApiResponse } from '../../utils/apiCleaner';

test('get jobs - list all jobs - 200 OK', async ({ request }) => {
  const response = await request.get('/api/jobs');
  expect(response.status()).toBe(200);
});

test('get jobs - list all jobs', { tag: '@smoke' }, async ({ request }) => {
  const response = await request.get('/api/jobs');
  expect(response.status()).toBe(200);
  const cleanedResponse = await cleanApiResponse(response);
  const data = JSON.parse(cleanedResponse);
  //console.log(data);
  expect(data.success).toBe(true);
  expect(data.data).toBeDefined();
  expect(Array.isArray(data.data)).toBe(true);

  //   if (Array.isArray(data.data)) {
  //     data.data.forEach((job: any) => {
  //       expect(job).toHaveProperty('id');
  //       expect(job).toHaveProperty('title');
  //       expect(job).toHaveProperty('company');
  //       expect(job).toHaveProperty('location');
  //       expect(job).toHaveProperty('salary');
  //       expect(job).toHaveProperty('description');
  //       expect(job).toHaveProperty('requirements');
  //       expect(job).toHaveProperty('postedAt');
  //     });
  //   }

  // if (data.data.length > 0) {
  //   const firstJob = data.data[0];
  //   expect(firstJob).toHaveProperty('id');
  //   expect(firstJob).toHaveProperty('title');
  //   expect(firstJob).toHaveProperty('company');
  //   expect(firstJob).toHaveProperty('location');
  //   expect(firstJob).toHaveProperty('salary');
  //   expect(firstJob).toHaveProperty('description');
  //   expect(firstJob).toHaveProperty('requirements');
  //   expect(firstJob).toHaveProperty('postedAt');
  // }

  if (data.data.length > 0) {
    const firstJob = data.data[0];

    expect(firstJob.id).toBeDefined();

    expect(firstJob.title).toBeDefined();

    expect(firstJob.description).toBeDefined();

    expect(firstJob.salary).toBeDefined();

    expect(firstJob.location).toBeDefined();

    expect(firstJob.schedule).toBeDefined();
  }
});
