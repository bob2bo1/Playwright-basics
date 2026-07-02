import { faker } from '@faker-js/faker';

export function fakerUsers() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12, memorable: true }),
  };
}

// Hardcoded valid users for data driven testing. This is a good practice for testing with known values
export function validUsers() {
  return [
    {
      email: 'test@example.com',
      password: 'password123',
    },
    {
      email: 'abi@aol.com',
      password: 'password123',
    },
  ];
}

export function invalidUsers() {
  return [
    {
      email: 'invalid@email.com',
      password: 'wrongpassword',
    },
  ];
}
